//api/call/after/route.js
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { sendFollowUpEmail, sendDiscountEmail } from "@/lib/resend";
import {
  addOrUpdateContact,
  logHubSpotCall,
  logHubSpotEmail,
} from "@/lib/hubspot";
import { createCheckoutSession, createPaymentLink } from "@/lib/stripe";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_DEV_URL;

export async function POST(req) {
  // Method validation
  if (req.method !== "POST") {
    return NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const data = await req.json();
    const uuid = data.metadata?.uuid;

    const {
      budget = "Not specified",
      timeline = "Not specified",
      city = "Not specified",
      propertyType = "Not specified",
      numberOfCameras = "Not specified",
      specialFeatures = "None",
      didSomeonePickup: callAnswered = false,
      depositOfferAccepted = false,
      bookZoom = false,
      rescheduledCall = false,
    } = data.analysis || {};
    const recordingUrl = data.recording_url;
    const callSummary = data.summary;

    if (!uuid) {
      return NextResponse.json(
        { success: false, message: "Missing call identifier" },
        { status: 400 }
      );
    }

    console.log("Call completion data received:", data.analysis);

    const redisKey = `callRequest:${uuid}`;
    const existingCall = await redis.json.get(redisKey);

    // Get current attempt count (this represents completed attempts)
    const currentAttempts = existingCall.attempts || 0;
    const completedAttempts = currentAttempts + 1;

    console.log("This was attempt number:", completedAttempts);

    // Successful call flow
    if (callAnswered) {
      const contactData = {
        ...existingCall,
        budget,
        timeline,
        city,
        propertyType,
        numberOfCameras,
        specialFeatures,
        callSummary,
        recordingUrl,
      };
      console.log("contactData:", contactData);

      // 2. Create/update contact and get HubSpot ID
      const contact = await addOrUpdateContact(contactData);

      // 3. Log call with contact association
      await logHubSpotCall({
        ...contactData,
        contactId: contact.id,
        callDuration: data.analysis?.callDuration,
        recordingUrl: recordingUrl,
        depositAccepted: depositOfferAccepted,
        callSummary: callSummary,
      });

      // 4. Handle deposit acceptance
      if (depositOfferAccepted) {
        const checkoutSession = await createCheckoutSession({
          uuid,
          email: contactData.email,
          redirectUrl: baseUrl,
        });

        // Checkout sessions return the URL directly
        const paymentUrl = checkoutSession.url;

        await sendDiscountEmail({
          ...contactData,
          uuid,
          paymentLink: paymentUrl,
        });

        await logHubSpotEmail({
          contactId: contact.id,
          subject: "Deposit Offer Sent",
          message: `Deposit offer sent follow up needed to confirm onsite visit and quote details.`,
        });
      }

      // Delete the key since call was successful
      await redis.del(redisKey);
      return NextResponse.json({
        success: true,
        message: "Call completed",
        callId: uuid,
      });
    }

    // Unanswered call flow
    console.log(`Call attempt ${completedAttempts} was not answered`);

    // If we've completed 2 attempts, send follow-up email and delete key
    if (completedAttempts >= 2) {
      try {
        console.log("Maximum attempts reached, sending follow-up email");

        // Send follow-up email
        await sendFollowUpEmail({
          ...existingCall,
          baseUrl,
        });

        // Delete the key since we're done with retries
        await redis.del(redisKey);

        return NextResponse.json({
          success: true,
          message: "Follow-up email sent after maximum attempts",
          totalAttempts: completedAttempts,
        });
      } catch (error) {
        console.error("Failed to process final unanswered call flow:", error);
        // Still delete the key even if email fails
        await redis.del(redisKey);
        return NextResponse.json(
          { success: false, message: "Failed to send follow-up" },
          { status: 500 }
        );
      }
    }

    // Schedule retry (only if we haven't reached 2 attempts yet)
    // Schedule retry (only if we haven't reached 2 attempts yet)
    const callbackTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    callbackTime.setSeconds(0, 0); // Set seconds and milliseconds to 0

    try {
      console.log(
        `Scheduling retry attempt ${
          completedAttempts + 1
        } for ${callbackTime.toISOString()}`
      );

      // Update Redis with the completed attempt count and schedule next call
      await redis
        .multi()
        .json.set(redisKey, ".status", "scheduled")
        .json.set(redisKey, ".attempts", completedAttempts) // Store completed attempts
        .json.set(redisKey, ".callTime", `${callbackTime.toISOString()}`)
        .expire(redisKey, 86400) // 24h expiry
        .exec();

      console.log(
        `Call ${redisKey} scheduled for retry at ${callbackTime.toISOString()}`
      );

      return NextResponse.json({
        success: true,
        message: "Call scheduled for retry",
        nextAttempt: callbackTime,
        completedAttempts: completedAttempts,
        attemptsRemaining: 2 - completedAttempts,
      });
    } catch (error) {
      console.error("Failed to schedule retry:", error);
      throw error;
    }
  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json(
      { success: false, message: "Processing failed" },
      { status: 500 }
    );
  }
}

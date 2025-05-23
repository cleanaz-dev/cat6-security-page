//api/call/after/route.js
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { sendFollowUpEmail, sendDiscountEmail } from "@/lib/resend";
import { addOrUpdateContact, logHubSpotCall, logHubSpotEmail } from "@/lib/hubspot";

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
    const redisId = data.metadata?.redisId;
    const callAnswered = data.analysis?.didSomeonePickup;
    const depositOfferAccepted = data.analysis?.depositOfferAccepted;
    const recordingUrl = data.recording_url;
    const callSummary = data.summary;

    if (!redisId) {
      return NextResponse.json(
        { success: false, message: "Missing call identifier" },
        { status: 400 }
      );
    }

    console.log("Call completion data received:", data);

    const redisKey = `redisId:${redisId}`;
    const existingCall = JSON.parse((await redis.get(redisKey)) || "{}");
    const attempts = (existingCall.attempts || 0) + 1;

   


    console.log("existingCall:", existingCall);

    // Successful call flow
    if (callAnswered) {
      const contactData = ({...existingCall.formData.contact, ...existingCall.formData.project})
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
        await sendDiscountEmail({
          ...contactData,
          baseUrl,
          redisId
        });
        await logHubSpotEmail({
          contactId: contact.id,
          subject: "Deposit Offer Sent",
          message: `Deposit offer sent follow up needed to confirm onsite visit and quote details.`,
        })
      }

      await redis.del(redisKey);
      return NextResponse.json({
        success: true,
        message: "Call completed",
        callId: redisId,
      });
    }

    // Unanswered call flow
    if (attempts >= 3) {
      await sendFollowUpEmail({
        ...existingCall.formData,
        baseUrl,
      });

      // Extend expiry for potential re-engagement
      await redis.set(
        redisKey,
        JSON.stringify({
          ...existingCall,
          status: "follow-up-sent",
          lastAttempt: new Date().toISOString(),
        }),
        "EX",
        86400
      ); // 24h expiry

      return NextResponse.json({
        success: true,
        message: "Follow-up sent",
      });
    }

    // Schedule retry
    const callbackTime = new Date(Date.now() + 5 * 60 * 1000);
    await redis.set(
      redisKey,
      JSON.stringify({
        ...existingCall,
        status: "call-back",
        attempts,
        callTime: callbackTime.toISOString(),
      }),
      "EX",
      86400
    );

    return NextResponse.json({
      success: true,
      nextAttempt: callbackTime,
      attemptsRemaining: 3 - attempts,
    });
  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json(
      { success: false, message: "Processing failed" },
      { status: 500 }
    );
  }
}

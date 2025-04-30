//api/call/after/route.js
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { sendFollowUpEmail, sendDiscountEmail } from "@/lib/resend";
import { randomUUID } from "crypto";
import { addOrUpdateContact, logHubSpotCall } from "@/lib/hubspot";

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

       // Log the call to HubSpot only if answered
       await logHubSpotCall({
        hs_call_title: 'AI Call - Answered',
        hs_call_body: `AI call successfully completed with ${depositOfferAccepted ? 'accepted' : 'declined'} deposit offer`,
        hs_timestamp: new Date().toISOString(),
        hs_call_duration: callDuration?.toString() || '0',
        hs_call_status: 'COMPLETED',
        hs_call_direction: 'OUTBOUND',
        hs_call_outcome: 'CONNECTED',
        hs_call_recording_url: callRecordingUrl,
        ...(depositOfferAccepted && { 
          hs_call_disposition: 'DEPOSIT_OFFER_ACCEPTED' 
        }),
        contactId: existingCall.formData?.contact?.id // Pass contact ID if available
      });
      if (depositOfferAccepted) {
        const contactData = [...data.formData, depositOfferAccepted];
        const redisId = randomUUID();

        await addOrUpdateContact({
          email: formData.contact.email,
          firstname: formData.contact.name,
          phone: formData.contact.phone,
          projectType: formData.project.type,
          budget: formData.project.budget,
          cctv_features: formData.project.features,
        });

        await sendDiscountEmail({
          ...contactData,
          baseUrl,
          redisId,
        });
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

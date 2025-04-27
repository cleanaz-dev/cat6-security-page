//api/call/after/route.js
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { sendFollowUpEmail } from "@/lib/resend";
import { randomUUID } from 'crypto';

/**
 * Handles post-call processing with:
 * - Call completion cleanup
 * - Call-back scheduling
 * - Follow-up email logic
 */
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
    
    if (!data) {
      return NextResponse.json(
        { success: false, message: "No data received" },
        { status: 400 }
      );
    }

    console.log("Call completion data received:", data);

    const callAnswered = data.analysis?.didSomeonePickup;
    const redisId = data.metadata?.redisId;

    if (!redisId) {
      return NextResponse.json(
        { success: false, message: "Missing call identifier" },
        { status: 400 }
      );
    }

    // Get existing call data
    const existingCallStr = await redis.get(redisId);
    if (!existingCallStr) {
      console.warn(`Call ${redisId} not found in Redis`);
      return NextResponse.json(
        { success: false, message: "Call record not found" },
        { status: 404 }
      );
    }

    const existingCall = JSON.parse(existingCallStr);
    const attempts = (existingCall.attempts || 0) + 1;

    // Handle call outcomes
    if (callAnswered) {
      // Successful call - clean up
      await redis.del(redisId);
      console.log(`Successfully cleaned up completed call: ${redisId}`);

      return NextResponse.json({
        success: true,
        message: "Call completed and cleaned up",
        callId: redisId,
        completedAt: new Date().toISOString()
      });
    } else {
      // Unanswered call - handle retry or follow-up
      if (attempts >= 3) {
        // Max attempts reached - send email

            // Generate and store tokens
    const repToken = randomUUID();
    const zoomToken = randomUUID();
    const baseUrl = "https://raccoon-credible-elephant.ngrok-free.app";
    
    // Store tokens with expiration (24 hours)
    await Promise.all([
      redis.set(`repToken:${repToken}`, JSON.stringify({ formData }), 'EX', 60 * 60 * 24),
      redis.set(`zoomToken:${zoomToken}`, JSON.stringify({ formData }), 'EX', 60 * 60 * 24)
    ]);

        await sendFollowUpEmail({
          to: existingCall.email, 
          name: existingCall.name,
          phone: existingCall.phone,
          repToken,
          zoomToken,
          baseUrl
        });
        
        await redis.del(redisId);
        console.log(`Follow-up email sent for call ${redisId}`);

        return NextResponse.json({
          success: true,
          message: "Max attempts reached - follow-up email sent",
          callId: redisId
        });
      } else {
        // Schedule callback in 5 minutes
        const callbackTime = new Date(Date.now() + 5 * 60 * 1000);
        await redis.set(redisId, JSON.stringify({
          ...existingCall,
          status: 'call-back',
          attempts,
          callTime: callbackTime.toISOString()
        }));

        console.log(`Scheduled callback for ${redisId} at ${callbackTime}`);

        return NextResponse.json({
          success: true,
          message: "Callback scheduled",
        });
      }
    }

  } catch (error) {
    console.error("Call completion processing error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Error processing call completion",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
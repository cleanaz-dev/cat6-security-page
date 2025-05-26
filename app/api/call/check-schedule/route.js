// app/api/call/check-schedule/route.js
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { makeCall } from "@/lib/hooks/useBlandAi";

export async function POST(req) {
  const { key } = await req.json();
  if (key !== process.env.API_SECRET_KEY) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const now = new Date();
    const redisKeys = await redis.keys('callRequest:*');
    console.log("Found Redis keys:", redisKeys);

    let processedCalls = 0;
    let errors = [];

    for (const redisKey of redisKeys) {
      try {
        const callData = await redis.json.get(redisKey);
        if (!callData) {
          console.log(`No data found for key: ${redisKey}`);
          continue;
        }
        
        // Skip if already in progress
        if (callData.status === 'in_progress') {
          console.log(`Call ${redisKey} already in progress, skipping`);
          continue;
        }

        // Only process scheduled calls
        if (callData.status === 'scheduled' && callData.callTime) {
          const scheduledTime = new Date(callData.callTime);
          
          // Check if scheduled time has passed (scheduledTime <= now)
          if (scheduledTime <= now) {
            console.log(`Call ${redisKey} is ready (scheduled: ${scheduledTime})`);
            
            // Update status to in_progress
            await redis.json.set(redisKey, '.status', 'in_progress');
            
            try {
              // Make the call
              await makeCall(callData);
              processedCalls++;
              console.log(`Successfully initiated call for ${redisKey}`);
            } catch (callError) {
              console.error(`Failed to make call for ${redisKey}:`, callError);
              // Reset status back to scheduled if call fails
              await redis.json.set(redisKey, '.status', 'scheduled');
              errors.push({ key: redisKey, error: callError.message });
            }
          }
        }
      } catch (keyError) {
        console.error(`Error processing key ${redisKey}:`, keyError);
        errors.push({ key: redisKey, error: keyError.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Call processing completed",
      processedCalls,
      totalKeys: redisKeys.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("Scheduler Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 }
    );
  }
}
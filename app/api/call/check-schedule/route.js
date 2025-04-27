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
    const keys = await redis.keys('scheduledCall:*');

    for (const key of keys) {
      const callDataStr = await redis.get(key);
      if (!callDataStr) continue;

      const callData = JSON.parse(callDataStr);
      
      // Skip if already in progress
      if (callData.status === 'in_progress') continue;

      // Handle both scheduled and call-back statuses
      if ((callData.status === 'scheduled' || callData.status === 'call-back') && 
          new Date(callData.callTime) <= now) {
        // Update status only
        await redis.set(key, JSON.stringify({
          ...callData,
          status: 'in_progress'
        }));

        await makeCall(callData);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Call processing completed"
    });

  } catch (error) {
    console.error("Scheduler Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 }
    );
  }
}
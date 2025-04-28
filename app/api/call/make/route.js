//api/call/make/route.js
import { NextResponse } from "next/server";
import { makeCall } from "@/lib/hooks/useBlandAi";
import redis from "@/lib/redis";

/**
 * API endpoint to schedule or immediately make phone calls
 */
export async function POST(req) {
  // Validate HTTP method - only POST allowed
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // Validate content type - only JSON accepted
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
  }

  try {
    // Parse and validate request body
    const data = await req.json();
    const { selectedTime = 0 } = data; // Default to immediate call if not specified
    console.log("data:", data);

    // Required field validation
    if (!data?.phone || !data?.name || !data?.redisId) {
      return NextResponse.json({ error: "Phone, name are required" }, { status: 400 });
    }

    
    // Base call data structure that will be stored in Redis
    const callData = {
      ...data,               
      status: 'pending',     // Initial status
    };

    // Handle scheduled calls (selectedTime > 0)
    if (selectedTime > 0) {
      // Update call data for scheduled call
      callData.status = 'scheduled';
      callData.callTime = new Date(Date.now() + selectedTime * 60000); // Calculate future call time
      
      // Store in Redis
      await redis.set(`redisId1${data.redisId}`,JSON.stringify(callData));

      // Return success response with scheduling details
      return NextResponse.json({ 
        success: true,               // Return the call ID for reference
        scheduledMinutes: selectedTime // When the call is scheduled for
      });
    }

    // Handle immediate calls (selectedTime = 0)
    callData.status = 'in_progress';  // Mark as in progress immediately
    
    // Store call data in Redis before initiating
    await redis.set(`redisId1${data.redisId}`,JSON.stringify(callData));

    // Initiate the actual phone call through Bland AI
    const callResponse = await makeCall({ 
      ...data,            
    });

    if (!callResponse) {
      // Handle failed call response
      return NextResponse.json({ success: false, message: "Failed to initiate call" }, { status: 500 });
    }

    // Success response for immediate call
    return NextResponse.json({ 
      success: true,
    });

  } catch (error) {
    // Error handling for any unexpected failures
    console.error("Call error:", error);
    return NextResponse.json(
      { error: error.message || "Call processing failed" },
      { status: 500 }
    );
  }
}
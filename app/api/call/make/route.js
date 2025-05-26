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
    const { timeOption, uuid } = data; // Default to immediate call if not specified
    console.log("call request API data:", data);

    // Required field validation
    if (!data?.phone || !data?.firstname || !uuid) {
      return NextResponse.json({ error: "Phone, name are required" }, { status: 400 });
    }

    
    // Handle scheduled calls (timeOption > 0)
    if (timeOption !== null) {
    
      // Store in Redis
      await redis.json.set(`callRequest:${uuid}`, '.', {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        message: data.message,
        uuid: uuid,
        timeOption: timeOption,
        status: "scheduled", // for scheduled calls
        callTime: timeOption,
        createdAt: new Date().toISOString()
      });

      // Calculate minutes for response (optional, for logging/debugging)
      const minutesFromNow = Math.round((timeOption - Date.now()) / 60000);

      // Return success response with scheduling details
      return NextResponse.json({ 
        success: true,               
        scheduledMinutes: minutesFromNow,
        scheduledTime: timeOption
      });
    }

 
    // Store call data in Redis before initiating Mark as in progress immediately
       await redis.json.set(`callRequest:${uuid}`, '.', {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        message: data.message,
        uuid: uuid,
        timeOption: timeOption,
        status: "in_progress",
        createdAt: new Date().toISOString()
      });


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
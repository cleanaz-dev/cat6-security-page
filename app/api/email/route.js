// api/email.js
import { ContactFormSchema } from "@/lib/schemas";
import { sendContactEmail } from '@/lib/resend';
import { NextResponse } from 'next/server';
import Bottleneck from 'bottleneck';
import { randomUUID } from "crypto";
import redis from "@/lib/redis";
import { logHubSpotEmail } from "@/lib/hubspot";

// Rate limiter configuration
const limiter = new Bottleneck({
  minTime: 60000, // 1 email per minute
  maxConcurrent: 1,
});
const baseUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BASE_URL : process.env.NEXT_PUBLIC_DEV_URL;

export async function POST(req) {

  // Method validation
  if (req.method !== 'POST') {
    return NextResponse.json(
      { success: false, message: 'Method not allowed' },
      { status: 405 }
    );
  }

  // Content type validation
  const contentType = req.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return NextResponse.json(
      { success: false, message: 'Invalid content type' },
      { status: 415 }
    );
  }

  try {
    // Parse and validate request body
    const data = await req.json();
    console.log("data:", data);
    const validationResult = ContactFormSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.flatten() 
        },
        { status: 400 }
      );
    }

    const formData = {
      contact: {
        name: validationResult.data.name,
        email: validationResult.data.email,
        phone: validationResult.data.phone,
      },
      project: {
        type: validationResult.data.projectType,
        cameraCount: validationResult.data.cameraCount,
        timeline: validationResult.data.timeline,
        message: validationResult.data.message,
        features: validationResult.data.features,
        city: validationResult.data.city,
        customCity: validationResult.data.customCity,
        budget: validationResult.data.budget,
      }
    }


    const redisId = randomUUID();
    console.log("baseUrl:", baseUrl);
    
    // Store tokens with expiration (24 hours)
    await redis.set(`redisId:${redisId}`, JSON.stringify({ formData }), 'EX', 60 * 60 * 24)

    // Send email with rate limiting
    const emailResponse = await limiter.schedule(() => 
      sendContactEmail({
        ...validationResult.data,
        redisId,
        baseUrl
      })
    );

    // await logHubSpotEmail()

    // Log success
    console.log('Email sent:', {
      email: data.email,
      emailId: emailResponse?.id,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully', 
        data: { emailId: emailResponse?.id } 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('API Error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
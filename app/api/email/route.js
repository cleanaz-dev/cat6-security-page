// api/email.js
import { ContactFormSchema } from "@/lib/schemas";
import { sendContactEmail } from '@/lib/resend';
import { NextResponse } from 'next/server';
import Bottleneck from 'bottleneck';
import { randomUUID } from "crypto";
import redis from "@/lib/redis";

// Rate limiter configuration
const limiter = new Bottleneck({
  minTime: 60000, // 1 email per minute
  maxConcurrent: 1,
});

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

    // Generate and store tokens
    const repToken = randomUUID();
    const zoomToken = randomUUID();
    const baseUrl = "https://raccoon-credible-elephant.ngrok-free.app";
    console.log("repToken:", repToken, "zoomToken:", zoomToken, "baseUrl:", baseUrl);
    
    // Store tokens with expiration (24 hours)
    await Promise.all([
      redis.set(`repToken:${repToken}`, JSON.stringify({ formData }), 'EX', 60 * 60 * 24),
      redis.set(`zoomToken:${zoomToken}`, JSON.stringify({ formData }), 'EX', 60 * 60 * 24)
    ]);

    // Send email with rate limiting
    const emailResponse = await limiter.schedule(() => 
      sendContactEmail({
        ...validationResult.data,
        repToken,
        zoomToken,
        baseUrl
      })
    );

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
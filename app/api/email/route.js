import { ContactFormSchema } from "@/lib/schemas";
import { sendContactEmail } from '@/lib/resend';
import { NextResponse } from 'next/server';
import Bottleneck from 'bottleneck';

// Configure Bottleneck to allow 1 email per minute
const limiter = new Bottleneck({
  minTime: 60000, // 60,000ms = 1 minute
  maxConcurrent: 1, // Only one email at a time
});

export async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { success: false, message: 'Method not allowed' },
      { status: 405 }
    );
  }

  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json(
      { success: false, message: 'Invalid content type, expected application/json' },
      { status: 415 }
    );
  }

  try {
    let data;
    try {
      data = await req.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    console.log('Received contact form data:', {
      name: data.name,
      email: data.email,
      timestamp: new Date().toISOString(),
    });

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

    // Schedule email sending with Bottleneck
    const emailResponse = await limiter.schedule(() => sendContactEmail(validationResult.data));
    console.log('Email sent successfully:', { 
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
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
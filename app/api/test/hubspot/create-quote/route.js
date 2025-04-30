import { createBasicQuote } from '@/lib/hubspot';
import { NextResponse } from 'next/server';


export async function POST(request) {
  const { contactEmail } = await request.json();
  console.log("contactEmail:", contactEmail);
  const dealId = "49840627652"

  try {
    const quote = await createBasicQuote(contactEmail, dealId);
    return NextResponse.json({
      success: true,
      quoteId: quote.id,

    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        details: error.response?.body || null 
      },
      { status: 500 }
    );
  }
}
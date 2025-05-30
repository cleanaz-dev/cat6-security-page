// app/api/test/stripe/send-quote-to-client/route.js
import { NextResponse } from 'next/server';
import { getOrCreateStripeCustomer, generateStripeQuote } from '@/lib/stripe';
import { findContactByEmail } from '@/lib/hubspot';
import { getQuote, setQuoteStatus } from '@/lib/redis';
import { sendQuoteToClient } from '@/lib/resend';


export async function POST(req) {
  try {
    const { quoteId, contact } = await req.json();
    console.log("quoteId", quoteId);
console.log("contact", contact);
    return

    const quote = await getQuote(quoteId)
    console.log("quote:", quote)

  
    
    
    const emailResponse = await sendQuoteToClient({
      pdfBuffer: stripeQuote.finalizedQuote.pdf_buffer,
      contact,
      items,
      total,
    });
    
    await setQuoteStatus(quoteId, "followUp")

  
    // 5. Get shareable URL
    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
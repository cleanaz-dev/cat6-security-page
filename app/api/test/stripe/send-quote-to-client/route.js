// app/api/test/stripe/send-quote-to-client/route.js
import { NextResponse } from 'next/server';
import { getOrCreateStripeCustomer, generateStripeQuote } from '@/lib/stripe';
import { findContactByEmail } from '@/lib/hubspot';
import { getQuote } from '@/lib/redis';
import { sendQuoteToClient } from '@/lib/resend';

export async function POST(req) {
  try {
    const { quoteId } = await req.json();
    
    // 1. Get from Redis
    const quote = await getQuote(quoteId);

    if (!quote) throw new Error('Quote not found');
 
    // console.log("quote: ", quote);

    // 2. Get HubSpot contact
   const contact = await findContactByEmail(quote.client.email);
  //  console.log("contact: ", contact);

   
    // 3. Create Stripe customer
    const customer = await getOrCreateStripeCustomer({ contact })

    // 4. Generate Stripe quote
    const stripeQuote = await generateStripeQuote(
      customer.id,
      quote.items.map(item => ({
        priceId: item.priceId,
        quantity: item.quantity
      }))
    );

    console.log("stripeQuote",stripeQuote);
    const items = quote.items.length
    const total = quote.total
    
    const emailResponse = await sendQuoteToClient({pdfBuffer: stripeQuote.finalizedQuote.pdf_buffer, contact, items, total});
    console.log("emailResponse: ", emailResponse);


    // 5. Get shareable URL
    return NextResponse.json({
      success: true,
      quoteUrl: stripeQuote.hosted_invoice_url, // Stripe's built-in quote URL
      expiresAt: stripeQuote.expires_at
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
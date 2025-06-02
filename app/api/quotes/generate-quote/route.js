//api/quotes/generate-quote/route.js
import { NextResponse } from 'next/server';
import redis from '@/lib/redis'
import { randomUUID } from 'crypto';
import { createNote, findContactByEmail } from '@/lib/hubspot';
import { generateStripeQuote, getOrCreateStripeCustomer } from '@/lib/stripe';
import { uploadPdfToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const { products, contactData } = await request.json();
    console.log(" contactData: ", contactData)
 
    
    // Validate input
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid or empty products array" },
        { status: 400 }
      );
    }

      // 1. Get HubSpot contact
       const contact = await findContactByEmail(contactData.email);
      console.log("Step 1 Success - Get contact");
    
       
        // 2. Create Stripe customer
        const customer = await getOrCreateStripeCustomer({ contact })
        console.log("Step 2 Success - Get Stripe Cx")
    
        // 3. Generate Stripe quote
        const { finalizedQuote } = await generateStripeQuote(
          customer.id,
          products.map(item => ({
            priceId: item.priceId,
            quantity: item.quantity
          }))
        );
        console.log("Step 3 Success - Get Stripe Quote")
        // 4. Upload quote to Cloudinary
        const { url } = await uploadPdfToCloudinary(finalizedQuote.pdf_buffer);
        console.log("Step 4 Success - Upload PDF")
        // Generate unique invoice ID
        const quoteId = randomUUID();

    // Calculate total
    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);


    // Store invoice data in Redis with expiration
    await redis.json.set(`quoteId:${quoteId}`, '.', {
      id: quoteId,
      url: url,
      client: {
        name: contactData.firstname,
        email: contactData.email,
        hs_object_id: contactData.hs_object_id
      },
      items: products.map(p => ({
        id: p.id,
        name: p.name,
        priceId: p.priceId,
        price: p.price,
        quantity: p.quantity,
        description: p.description
      })),
      stripeId: finalizedQuote.id,
      stripeCustomerId: customer.id,
      total: total,
      status: 'pending',  // Add explicit status
      createdAt: new Date().toISOString(),
    })  

    await createNote({
      contactId: contact.contactId,
      body: `Quote created total: $${total}. View the quote at: View Quote (ID:${quoteId})`
    });
    


    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error("Error creating invoice:", error.stack);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
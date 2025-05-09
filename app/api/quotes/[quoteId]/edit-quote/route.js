import redis, { getQuoteById } from "@/lib/redis";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateStripeQuote } from "@/lib/stripe";
import { uploadPdfToCloudinary } from "@/lib/cloudinary";
import { createNote } from "@/lib/hubspot";

export async function POST(req, { params }) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
     console.log("Step 1 Success - Validate User");
    const { quoteId } = await params;

    const quote = await getQuoteById(quoteId);
    const contactId = quote.client.hs_object_id


    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    console.log("Step 2 Success - Validate Quote");
    // Get items from request body
    const { items } = await req.json();

    //  Update Stripe quote
    const { finalizedQuote } = await updateStripeQuote(
      quote.stripeId,
      quote.stripeCustomerId,
      items.map((item) => ({
        priceId: item.priceId,
        quantity: item.quantity,
      }))
    );
    console.log("Step 3 Success - Get Stripe Quote");

     const total = items.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const { url } = await uploadPdfToCloudinary(finalizedQuote.pdf_buffer);

    console.log("Step 4 Success - Upload PDF");

    // Update Redis 
    await redis.json.set(`quoteId:${quote.id}`, "$", {
      ...quote,
      url,
      stripeId: finalizedQuote.id,
      status: 'updated',
      items,
      total: finalizedQuote.amount_total / 100,
      createdAt: new Date().toLocaleString()
    });

    await createNote({
      contactId: contactId,
      body: `Quote updated total: $${total}. View the quote at: View Quote (ID:${quoteId})`,
    });

    return NextResponse.json({ success: true, data: quote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

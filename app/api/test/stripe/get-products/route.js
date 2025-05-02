import { createCheckoutUrl, getStripeProducts } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Fetch products from Stripe
    const products = await getStripeProducts();

    if (!products.length) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    // // 2. Generate checkout URL for the first product
    // const checkoutUrl = await createCheckoutUrl(
    //   products[4].priceId,                // Product ID
    //   "/payment/success",            // Success redirect path
    //   "/payment/cancel"              // Cancel redirect path
    // );

    // 3. Return both products and the generated URL
    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.error("Stripe API Error:", error);
    return NextResponse.json(
      { error: "Failed to process Stripe request" },
      { status: 500 }
    );
  }
}

// app/api/test/stripe/create-quote/route.js
import { NextResponse } from 'next/server';
import redis from '@/lib/redis'
import { randomUUID } from 'crypto';

export async function POST(request) {
  try {
    const { products, contactData } = await request.json();
    console.log(" products: ", products)
 
    
    // Validate input
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid or empty products array" },
        { status: 400 }
      );
    }


    // Generate unique invoice ID
    const invoiceId = randomUUID();

    // Calculate total
    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);


    const formData = {
      id: invoiceId,
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
      total: total,
      status: 'pending',  // Add explicit status
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 604800 * 1000).toISOString()
    }

    // Store invoice data in Redis with expiration
    await redis.set(`invoice:${invoiceId}`, JSON.stringify(formData), "EX", 604800); // 7 days expiry     


    return NextResponse.json({
      success: true,
      invoiceId,
    });
  } catch (error) {
    console.error("Error creating invoice:", error.stack);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
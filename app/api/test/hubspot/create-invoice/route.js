import { NextResponse } from 'next/server';
import { getBasicProducts } from '@/lib/hubspot';
import { createBasicInvoice } from '@/lib/hubspot';

export async function POST(request) {
  const { contactEmail } = await request.json();
  console.log("contactEmail: ", contactEmail)

  try {
    // Get products with quantities from your constants
    const products = await getBasicProducts();
    console.log("products from create-invoice api: ", products)
    
    // Create invoice
    const invoice = await createBasicInvoice(contactEmail, products);

    return NextResponse.json({
      success: true,
      invoiceId: invoice.id,
      total: invoice.properties.hs_amount
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
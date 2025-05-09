//lib/stripe.js
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const baseUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BASE_URL : process.env.NEXT_PUBLIC_DEV_URL;

/**
 * Fetch all active products with prices from Stripe
 * @returns {Promise<Array>} List of products with prices
 */
// lib/stripe.js
// lib/stripe.js
export async function getStripeProducts() {
  let allProducts = [];
  let hasMore = true;
  let startingAfter = undefined; // Don't pass any value for first request

  while (hasMore) {
    const params = {
      limit: 100,
      active: true,
      expand: ['data.default_price']
    };

    // Only add starting_after if we have a value
    if (startingAfter) {
      params.starting_after = startingAfter;
    }

    const products = await stripe.products.list(params);

    allProducts = [...allProducts, ...products.data];
    hasMore = products.has_more;
    
    // Only update starting_after if we got products
    if (products.data.length > 0) {
      startingAfter = products.data[products.data.length - 1].id;
    } else {
      hasMore = false;
    }
  }

  return allProducts.map(product => ({
    id: product.id,
    priceId: product.default_price.id,
    name: product.name,
    price: product.default_price.unit_amount / 100,
    currency: product.default_price.currency,
    description: product.description
  }));
}

export async function createAnonymousInvoice(products) {
  // 1. Create a Checkout Session instead of Invoice
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: products.map(item => ({
      price: item.priceId,
      quantity: item.quantity
    })),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
  });

  return session.url; // Stripe-hosted payment page URL
}


export const createStripePaymentLink = async (products) => {
  try {
    // Validate input
    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new Error('Products array is required and must contain at least one product');
    }

    // Prepare line items for Stripe
    const lineItems = products.map(product => {
      if (!product.priceId || !product.quantity) {
        throw new Error('Each product must have a priceId and quantity');
      }
      
      return {
        price: product.priceId,
        quantity: product.quantity,
      };
    });

    // Create payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: lineItems,
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you`, // Your thank you page
        },
      },
    });

    return paymentLink.url;
  } catch (error) {
    console.error('Error creating Stripe payment link:', error);
    throw error; // Re-throw to let the caller handle it
  }
};

// lib/stripe.js
export async function getOrCreateStripeCustomer({contact}) {
  try {
    console.log("contact: ", contact);
  
    const { firstname, email, contactId } = contact;
    const lastname = contact.lastname ?? "";
    // Check for existing customer
    const { data: [existingCustomer] } = await stripe.customers.list({
      email,
      limit: 1
    });
    
    if (existingCustomer) return existingCustomer;

    // Create new customer if not found
    return await stripe.customers.create({
      email,
      name: `${firstname} ${lastname}`.trim(),
      metadata: { 
        hubspotId: contactId,
        created_via: 'quote_system' 
      }
    });

  } catch (error) {
    console.error('Stripe customer lookup failed:', error);
    throw new Error('Could not process customer information');
  }
}



export async function generateStripeQuote(customerId, items) {
  try {
    const quote = await stripe.quotes.create({
      customer: customerId,
      line_items: items.map(item => ({
        price: item.priceId,
        quantity: item.quantity
      })),
      expires_at: Math.floor(Date.now() / 1000) + 604800,
      collection_method: 'send_invoice',
      metadata: {
        generated_at: new Date().toISOString()
      },
      invoice_settings: {
        days_until_due: 7
      }
    });

    const finalizedQuote = await stripe.quotes.finalizeQuote(quote.id);

    const pdfStream = await stripe.quotes.pdf(finalizedQuote.id);

    const chunks = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    return {
      finalizedQuote: {
        ...finalizedQuote,
        pdf_buffer: pdfBuffer
      }
    };
  } catch (error) {
    console.error('Stripe quote generation failed:', error);
    throw new Error('Could not generate payment request');
  }
}

export async function updateStripeQuote(originalQuoteId, customerId, updatedItems) {
  try {
    // 1. Retrieve the original quote
    const originalQuote = await stripe.quotes.retrieve(originalQuoteId);
    
    // 2. Create a new revised quote with updated items
    const revisedQuote = await stripe.quotes.create({
      customer: customerId,
      line_items: updatedItems.map(item => ({
        price: item.priceId,
        quantity: item.quantity
      })),
      expires_at: Math.floor(Date.now() / 1000) + 604800, // 7 days from now
      collection_method: 'send_invoice',
      metadata: {
        original_quote_id: originalQuote.id,
        revised_at: new Date().toISOString()
      },
      invoice_settings: {
        days_until_due: 7
      }
    });

    // 3. Finalize the revised quote
    const finalizedQuote = await stripe.quotes.finalizeQuote(revisedQuote.id);

    // 4. Generate PDF for the revised quote
    const pdfStream = await stripe.quotes.pdf(finalizedQuote.id);
    const chunks = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    return {
      finalizedQuote: {
        ...finalizedQuote,
        pdf_buffer: pdfBuffer
      },
      originalQuoteId
    };

  } catch (error) {
    console.error('Stripe quote update failed:', error);
    throw new Error('Could not update payment request');
  }
}
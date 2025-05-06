import { NextResponse } from 'next/server';
import { getQuote, setQuoteStatus } from '@/lib/redis';
import { sendQuoteToClient } from '@/lib/resend';


export async function POST(req) {
  try {
    const { quoteId } = await req.json();
    console.log("quoteId", quoteId);

    

    const quote = await getQuote(quoteId)
    console.log("quote:", quote)

  
  
    
    const emailResponse = await sendQuoteToClient({
      pdfUrl: quote.url,
      contact: quote.client,
      items: quote.items,
      total: quote.total,
    });

    console.log("email response", emailResponse)

  
    
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
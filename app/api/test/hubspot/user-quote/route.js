import { NextResponse } from "next/server";
import { zapierQuote } from "@/lib/hubspot";

export async function POST(req) {
  try {
    // 1. Get data from request
    const { dealId, contactId } = await req.json();

    // 2. Check required fields
    if (!dealId || !contactId) {
      return NextResponse.json(
        { error: "Need both dealId and contactId" },
        { status: 400 }
      );
    }

    // 3. Create the quote
    const quote = await zapierQuote(dealId, contactId);
    console.log("quote:", quote);

    // 4. Return the quote info
    return NextResponse.json({
      success: true,

    });

  } catch (error) {
    // 5. Handle errors simply
    return NextResponse.json(
      { error: "Failed to create quote: " + error.message },
      { status: 500 }
    );
  }
}
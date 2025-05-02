import { getAllQuotes } from "@/lib/hubspot";
import { NextResponse } from "next/server";

export async function GET() {

  try {
    const quotes = await getAllQuotes()
    if (!quotes) {
      return NextResponse.json({ success: false, message: "Failed to retrieve quotes" }, { status: 500 });
    }
    return NextResponse.json({ success: true, quotes });
  } catch (error) {
    console.error("HubSpot API Error:", error);
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
  
}
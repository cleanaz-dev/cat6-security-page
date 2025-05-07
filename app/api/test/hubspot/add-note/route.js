import { createNote } from "@/lib/hubspot";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { contactId, body } = await req.json();

    const response = await createNote({ contactId, body });

    // Assuming createNote worked if it returned without throwing
    return NextResponse.json({ success: true, id: response.id });
  } catch (error) {
    console.error("HubSpot note creation failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
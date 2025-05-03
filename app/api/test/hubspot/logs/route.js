import { getAllActivityForContact } from "@/lib/hubspot";
import { NextResponse } from "next/server";

export async function POST(req) {

  try {
    const { contactEmail } = await req.json();
    const logs = await getAllActivityForContact(contactEmail)
    return NextResponse.json({ logs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get activity logs" }, { status: 500 });
  }

}
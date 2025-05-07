import { NextResponse } from "next/server";
import { addOrUpdateContact } from "@/lib/hubspot"

export async function POST(req) {
  try {
    const data = await req.json()
    // const response = await addOrUpdateContact(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json()
    console.log("data:", data)
    return NextResponse.json({ success: true})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
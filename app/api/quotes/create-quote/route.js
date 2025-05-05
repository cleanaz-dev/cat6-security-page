import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
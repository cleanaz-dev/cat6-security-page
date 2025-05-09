import redis from "@/lib/redis";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { ticketId } = await params;
    const { sendSurvey } = await req.json();

    if (sendSurvey === null) {
      return NextResponse.json({ message: "Invalid Data"}, {status: 401})
    }

    const ticket = await redis.json.get(`ticket:${ticketId}`)
    if (!ticket) {
      return NextResponse.json({ message: "Ticket does not exist"}, { status: 401})
    }

    await redis.json.set(`ticket:${ticketId}`, '.status', 'closed')
    console.log("data", sendSurvey, ticketId, ticket);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

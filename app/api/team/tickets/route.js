import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { randomUUID } from "crypto";
import { createNote } from "@/lib/hubspot";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    console.log("data:", data);
    const client = data.client;
    const ticketId = randomUUID();
    await redis.json.set(`ticket:${ticketId}`, ".", {
      id: ticketId,
      client: client.name,
      clientId: client.hs_object_id,
      email: client.email,
      phone: client.phone,
      priority: data.priority,
      subject: data.subject,
      status: "open",
      issue: data.issue,
      installId: data.installId,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });

    await createNote({
      contactId: client.hs_object_id,
      body: data.issue,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

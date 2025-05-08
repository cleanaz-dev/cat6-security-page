import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { randomUUID } from "crypto";

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data) {
      return NextResponse.json({ message: "Invalid Data" }, { status: 400 });
    }


    const installId = randomUUID();
    const contact = data.client;

    await redis.json.set(`install:${installId}`, ".", {
      id: installId,
      contactId: contact.hs_object_id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: data.address,
      technician: data.technician,
      notes: data.notes || "",
      status: data.status,
      jobType: data.jobType,
      title: data.title,
      start: data.start,
      end: data.end,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

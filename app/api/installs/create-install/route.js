import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { randomUUID } from "crypto";
import { createNote } from "@/lib/hubspot";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
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

    await createNote({
      contactId: contact.hs_object_id,
      body: `Job ${data.jobType} booked. ${data.title}`
    })

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

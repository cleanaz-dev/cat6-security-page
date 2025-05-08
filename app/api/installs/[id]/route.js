// /app/api/installs/[id]/check-in/route.js or route.ts
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function POST(req, { params }) {
  try {
    const { techId } = await req.json();
    const installId = params.id;

    const key = `install:${installId}`;
    const installData = await redis.json.get(key);

    if (!installData) {
      return NextResponse.json({ error: "Install not found" }, { status: 404 });
    }

    const now = new Date().toISOString();

    // Add new check-in record
    const newCheckIn = {
      techId,
      checkIn: now,
      checkOut: null, // to be updated later
    };

    // Update the install data
    const updatedCheckIns = installData.checkIns || [];
    updatedCheckIns.push(newCheckIn);

    await redis.json.set(key, ".checkIns", updatedCheckIns);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

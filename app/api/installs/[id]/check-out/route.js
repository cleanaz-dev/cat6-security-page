import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function POST(req, { params }) {
  try {
    const { id: installId } = params;
    const { techId } = await req.json();

    if (!techId) {
      return NextResponse.json({ error: "Missing techId" }, { status: 400 });
    }

    const installKey = `install:${installId}`;
    const install = await redis.json.get(installKey);

    if (!install) {
      return NextResponse.json({ error: "Install not found" }, { status: 404 });
    }

    const checkIns = install.checkIns || [];

    // Find the latest check-in for this tech without a checkOut
    const updatedCheckIns = checkIns.map(entry => {
      if (entry.techId === techId && !entry.checkOut) {
        return { ...entry, checkOut: new Date().toISOString() };
      }
      return entry;
    });

    await redis.json.set(installKey, ".checkIns", updatedCheckIns);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Check-out error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

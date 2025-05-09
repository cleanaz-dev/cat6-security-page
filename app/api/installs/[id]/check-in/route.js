//api/installs/[id]/check-in/route.js

import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function POST(req, { params }) {
  try {
    const { id: installId } = await params;
    const { techId } = await req.json();
    return NextResponse.json({ success: true })

    if (!techId) {
      return NextResponse.json({ error: "Missing techId" }, { status: 400 });
    }

    const installKey = `install:${installId}`;
    const install = await redis.json.get(installKey);

    if (!install) {
      return NextResponse.json({ error: "Install not found" }, { status: 404 });
    }

    const checkIns = install.checkIns || [];

    // Prevent multiple open check-ins for the same tech
    const hasOpenCheckIn = checkIns.some(
      (entry) => entry.techId === techId && !entry.checkOut
    );

    if (hasOpenCheckIn) {
      return NextResponse.json({ error: "Tech is already checked in" }, { status: 400 });
    }

    const newEntry = {
      techId,
      checkIn: new Date().toISOString(),
      checkOut: null,
    };

    await redis.json.set(installKey, ".checkIns", [...checkIns, newEntry]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

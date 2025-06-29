import { getAllActivityForContact } from "@/lib/hubspot";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import redis from "@/lib/redis";

export async function POST(req) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const { contactEmail, refresh } = await req.json();
    const cacheKey = `activity:${encodeURIComponent(contactEmail)}`;

    if (!refresh) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached));
      }
    }

    const raw = await getAllActivityForContact(contactEmail);

    const activities = [
      ...(raw.calls || []),
      ...(raw.deals || []),
      ...(raw.emails || []),
      ...(raw.tasks || []),
      ...(raw.notes || [])
    ].sort((a, b) => {
      const dateA = new Date(a.hs_createdate || a.createdate || a.hs_timestamp);
      const dateB = new Date(b.hs_createdate || b.createdate || b.hs_timestamp);
      return dateB - dateA;
    });

    const payload = {
      updatedAt: new Date().toISOString(),
      activities,
    };

    // console.log("first time activity fetch:", payload);

    await redis.set(cacheKey, JSON.stringify(payload), { ex: 60 * 60 });
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching contact activity:", error);
    return NextResponse.json({ error: "Failed to get activity logs" }, { status: 500 });
  }
}

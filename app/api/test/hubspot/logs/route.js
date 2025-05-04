import { getAllActivityForContact } from "@/lib/hubspot";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const {userId} = await auth()

  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const { contactEmail } = await req.json();
    const raw = await getAllActivityForContact(contactEmail);

    // Flatten and sort activities
    const activities = [
      ...(raw.calls || []),
      ...(raw.deals || []),
      ...(raw.emails || []),
      ...(raw.tasks || [])
    ].sort((a, b) => {
      const dateA = new Date(a.hs_createdate || a.createdate || a.hs_timestamp);
      const dateB = new Date(b.hs_createdate || b.createdate || b.hs_timestamp);
      return dateB - dateA; // Newest first
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching contact activity:", error);
    return NextResponse.json({ error: "Failed to get activity logs" }, { status: 500 });
  }
}
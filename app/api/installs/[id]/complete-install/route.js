import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import redis, { getInstallById } from "@/lib/redis";
import { createNote } from "@/lib/hubspot";

export async function POST(req, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { sendSurvey } = req.json()
    const install = await getInstallById(id);

    if (!install) {
      return NextResponse.json({ message: "Install not found" }, { status: 404 });
    }

    // Mark the install as complete
    await redis.json.set(`install:${install.id}`, '.status', "complete");

    // Add a note in HubSpot
    await createNote({
      contactId: install.contactId,
      body: `Job "${install.title}" has been marked as [COMPLETED].`
    });

    if (sendSurvey) {
      // Send email with survey logic here
      console.log("Send email iwth survey")
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing install:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

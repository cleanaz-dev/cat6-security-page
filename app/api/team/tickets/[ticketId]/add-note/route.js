import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import redis from "@/lib/redis"; // make sure your redis instance is properly imported
import { randomUUID } from "crypto";

export async function POST(req, { params }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ticketId } = await params;

    if (!ticketId) {
      return NextResponse.json({ error: "Missing ticket ID" }, { status: 400 });
    }

    const data = await req.json();
    const { text } = data;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Note text is required" }, { status: 400 });
    }

    // Create the new note object
    const newNote = {
      id: randomUUID(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      authorId: userId,
    };

    console.log("New note:", newNote);

    // Ensure the notes field is initialized as an array if it doesn't exist
    const ticketExists = await redis.json.get(`ticket:${ticketId}`);
    if (!ticketExists || !ticketExists.notes) {
      // Initialize `notes` as an empty array if it doesn't exist
      await redis.json.set(`ticket:${ticketId}`, '.notes', []);
    }

    // Append the new note into the ticket's notes array in Redis
    await redis.json.arrAppend(`ticket:${ticketId}`, ".notes", newNote);

    return NextResponse.json({ success: true, note: newNote });

  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
import redis from "@/lib/redis";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req, { params }) {
  try {

    const { userId } = await auth()
    if(!userId) {
      return NextResponse.json({ message: "Invalid Request"}, {status: 404 })
    }
    const { id } = await params
    console.log("id",id)

    const install = await redis.json.get(`install:${id}`);
    if (!install) {
      return NextResponse.json(
        { message: "Install data invalid, does not exist" },
        { status: 401 }
      );
    }

    await redis.json.set(`install:${id}`, '$.status', "cancelled");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel install error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function DELETE() {
  try {
    // Get all keys that match the callRequest pattern
    const keys = await redis.keys("callRequest:*");
    
    if (keys.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No callRequest keys found to delete",
        deletedCount: 0
      });
    }

    console.log(`Found ${keys.length} callRequest keys to delete:`, keys);

    // Delete keys one by one in a loop
    let deletedCount = 0;
    const failedKeys = [];

    for (const key of keys) {
      try {
        const result = await redis.del(key);
        if (result === 1) {
          deletedCount++;
          console.log(`Deleted key: ${key}`);
        } else {
          failedKeys.push(key);
          console.log(`Failed to delete key: ${key}`);
        }
      } catch (error) {
        failedKeys.push(key);
        console.error(`Error deleting key ${key}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} out of ${keys.length} callRequest keys`,
      deletedCount: deletedCount,
      totalFound: keys.length,
      failedKeys: failedKeys,
      deletedKeys: keys.filter(key => !failedKeys.includes(key))
    });
    
  } catch (error) {
    console.error("Error deleting callRequest keys:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to delete callRequest keys",
        error: error.message 
      },
      { status: 500 }
    );
  }
}
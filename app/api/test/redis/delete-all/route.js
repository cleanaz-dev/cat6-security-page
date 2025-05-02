// app/api/redis/flush/route.js
import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(req) {
  try {
    // Safety check - only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Flushing Redis is only allowed in development environment' },
        { status: 403 }
      );
    }

    // Get all keys
    const keys = await redis.keys('*');
    
    // Delete all keys (if any exist)
    if (keys.length > 0) {
      await redis.del(keys);
    }

    return NextResponse.json({ 
      success: true,
      deletedCount: keys.length
    });

  } catch (error) {
    console.error('Redis flush error:', error);
    return NextResponse.json(
      { error: 'Failed to flush Redis', details: error.message },
      { status: 500 }
    );
  }
}

// Prevent accidental GET requests
export function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Use POST to flush Redis.' },
    { status: 405 }
  );
}
import { NextResponse } from 'next/server';
import { getAllDeals } from '@/lib/hubspot';

export async function GET() {
  try {
    const deals = await getAllDeals();
    return NextResponse.json({ deals });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
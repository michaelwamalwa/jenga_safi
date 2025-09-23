import { NextResponse } from 'next/server';
import { LocationCollection } from '@/lib/auth/dbc/locations';

export async function GET() {
  try {
    const stats = await LocationCollection.getLocationStats();

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Stats aggregation failed:', error);
    return NextResponse.json(
      { error: 'Failed to compute location stats' },
      { status: 500 }
    );
  }
}

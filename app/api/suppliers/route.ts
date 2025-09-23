import { NextRequest, NextResponse } from 'next/server';
import { Supplier } from '@/types';

export async function GET() {
  try {
    // Connect to your database
    const suppliers: Supplier[] = [];
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate and save to database
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    );
  }
}
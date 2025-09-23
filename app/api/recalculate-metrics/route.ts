// app/api/recalculate-metrics/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  console.log('♻️ Recalculating metrics...');
  // Add logic to actually recalculate metrics if needed
  return NextResponse.json({ message: 'Recalculation complete' });
}

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This would make server-side calls to 2050 Materials API
    // Using environment variables for API keys
    const apiKey = process.env.MATERIALS_2050_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ materials: [] });
    }

    const response = await fetch('https://api.2050-materials.com/materials', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('2050 Materials API failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('2050 Materials API error:', error);
    return NextResponse.json({ materials: [] });
  }
}
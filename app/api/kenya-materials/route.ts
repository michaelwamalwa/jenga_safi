import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Connect to Kenya Green Building Society database
    // Or local sustainable material suppliers
    const kenyaSuppliers = [
      {
        id: "1",
        name: "Bamboo Kenya Ltd",
        material: "Bamboo Panels",
        category: "wood",
        carbonFootprint: 25,
        price: 120,
        unit: "m²",
        location: "Nairobi"
      },
      // Add real Kenyan sustainable material suppliers
    ];

    return NextResponse.json(kenyaSuppliers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Kenya materials" }, { status: 500 });
  }
}
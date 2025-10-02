// app/api/materials/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SustainableMaterial from "@/app/models/sustainableMaterial";

export async function GET() {
  try {
    await connectDB();
    const materials = await SustainableMaterial.find().populate('supplier');
    return NextResponse.json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const material = await SustainableMaterial.create(body);
    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("Error creating material:", error);
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
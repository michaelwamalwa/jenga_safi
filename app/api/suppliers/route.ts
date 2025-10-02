// app/api/suppliers/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Supplier from "@/app/models/supplier";

export async function GET() {
  try {
    await connectDB();
    const suppliers = await Supplier.find();
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}
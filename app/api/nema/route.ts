import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

const nemaSchema = new mongoose.Schema({
  status: String,
  score: Number,
  nextReport: Date,
  violations: Number,
});

const NEMA = mongoose.models.NEMA || mongoose.model("NEMA", nemaSchema);

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const nema = await NEMA.findOne({}).sort({ _id: -1 });
    return NextResponse.json(nema || { status: "compliant", score: 100, nextReport: null, violations: 0 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch NEMA data" }, { status: 500 });
  }
}

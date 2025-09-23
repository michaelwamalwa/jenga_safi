import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  site: String,
  type: String,
  message: String,
  value: Number,
  threshold: Number,
  timestamp: Date,
  acknowledged: Boolean,
});

const Alert = mongoose.models.Alert || mongoose.model("Alert", alertSchema);

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const alerts = await Alert.find({ acknowledged: false }).sort({ timestamp: -1 });
    return NextResponse.json(alerts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

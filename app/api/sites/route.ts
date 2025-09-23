import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

const siteSchema = new mongoose.Schema({
  name: String,
  status: String,
  sensors: Number,
  location: String,
  alerts: Number,
});

const Site = mongoose.models.Site || mongoose.model("Site", siteSchema);

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const sites = await Site.find({});
    return NextResponse.json(sites);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 });
  }
}

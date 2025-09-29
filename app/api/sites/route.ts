import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose, { Schema, models, model } from "mongoose";

// Site Schema
const siteSchema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: String, default: "active" },
    sensors: { type: Number, default: 0 },
    location: { type: String, required: true },
    alerts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Site = models.Site || model("Site", siteSchema);

// GET all sites
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const sites = await Site.find({}, { __v: 0 }).lean(); // strip __v

    return NextResponse.json(sites);
  } catch (err) {
    console.error("Error fetching sites:", err);
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}

// Optional: POST route for creating a new site
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const newSite = new Site(body);
    const savedSite = await newSite.save();

    return NextResponse.json(savedSite, { status: 201 });
  } catch (err) {
    console.error("Error creating site:", err);
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 }
    );
  }
}

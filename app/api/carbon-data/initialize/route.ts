// app/api/carbon-data/initialize/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CarbonData from "@/app/models/carbon-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();
  
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    if (!body.siteId || !body.profileId) {
      return NextResponse.json(
        { error: "Site ID and Profile ID are required" }, 
        { status: 400 }
      );
    }

    // Check if carbon data already exists for this site
    const existingData = await CarbonData.findOne({ siteId: body.siteId });
    if (existingData) {
      return NextResponse.json(existingData);
    }

    const carbonData = await CarbonData.create({
      siteId: body.siteId,
      profileId: body.profileId,
      userId: session.user.email,
      reductionTarget: body.reductionTarget || 25,
      focusAreas: body.focusAreas || [],
      baselineEmissions: 0,
      currentEmissions: 0,
      targetEmissions: 0,
      reductionProgress: 0,
      progressPercentage: 0,
      emissionsByCategory: {
        materials: 0,
        energy: 0,
        transportation: 0,
        waste: 0,
        water: 0,
        other: 0
      },
      monthlyData: [],
      status: 'active'
    });

    return NextResponse.json(carbonData);
  } catch (err: any) {
    console.error("Error initializing carbon data:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
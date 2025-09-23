// app/api/carbon-data/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import EnvironmentalData from "@/app/models/environment";
import EcoTask from "@/app/models/ecotask";
import mongoose from "mongoose";

interface UserStats {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  completedTasks: { taskId: string; points: number }[];
  ecoPoints: number;
  carbonSaved: number;
  waterSaved: number;
}

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId") || "all";
  const timeRange = searchParams.get("timeRange") || "month";

  try {
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }

    const envQuery: any = { timestamp: { $gte: startDate } };
    if (siteId !== "all") envQuery.siteId = siteId;

    const environmentalData = await EnvironmentalData.find(envQuery).sort({
      timestamp: 1,
    });

    const totalEmissions = environmentalData.reduce(
      (sum, d) => sum + (d.carbonEmissions || 0),
      0
    );

    const taskQuery: any = {
      status: "completed",
      updatedAt: { $gte: startDate },
    };
    if (siteId !== "all") taskQuery.siteId = siteId;

    const completedTasks = await EcoTask.find(taskQuery);
    const totalSavings = completedTasks.reduce(
      (sum, t) => sum + (t.actualCarbonSavings || 0),
      0
    );

    // Compliance logic: if emissions > savings, flag warning
    const complianceStatus =
      totalEmissions > totalSavings + 100 ? "non-compliant" : "compliant";

    return NextResponse.json({
      success: true,
      totalEmissions,
      totalSavings,
      timeRange,
      complianceStatus,
      trend: environmentalData.map((d) => ({
        time: d.timestamp,
        emissions: d.carbonEmissions,
      })),
      recordCount: {
        environmental: environmentalData.length,
        tasks: completedTasks.length,
      },
    });
  } catch (err: any) {
    console.error("Error fetching carbon data:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  // Save into both collections
  const env = await EnvironmentalData.create({
    siteId: body.siteId,
    timestamp: new Date(),
    carbonEmissions: body.carbonEmissions,
  });

  const task = await EcoTask.create({
    siteId: body.siteId,
    status: "completed",
    actualCarbonSavings: body.carbonSavings,
    updatedAt: new Date(),
  });

  return NextResponse.json({ success: true, env, task });
}

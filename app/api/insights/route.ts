import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import CarbonActivity from "@/app/models/CarbonActivity";
import { fetchEmissionFactors } from "@/lib/emissions";
import { CarbonActivityType } from "@/types/CarbonActivity";
/**
 * /api/insights
 * Returns AI-style insights & recommendations from carbon activity data.
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId") || "default";

    // Fetch all activities for this site
    const activities = await CarbonActivity.find({ 
      userId: session.user.email,
      siteId 
    }).sort({
      createdAt: -1,
    });

    if (!activities.length) {
      return NextResponse.json({
        insights: ["No activity data found yet. Start logging emissions/savings!"],
      });
    }

    const factors = await fetchEmissionFactors();

    let totalEnergy = 0;
    let renewableEnergy = 0;
    let transportFuel = 0;
    let wasteGenerated = 0;
    let waterUse = 0;

    for (const act of activities) {
      if (act.type === CarbonActivityType.ENERGY) {
        totalEnergy += act.value;
      } else if (act.type === CarbonActivityType.RENEWABLE) {
        renewableEnergy += act.value;
      } else if (act.type === CarbonActivityType.TRANSPORT) {
        transportFuel += act.value;
      } else if (act.type === CarbonActivityType.WASTE) {
        wasteGenerated += act.value;
      } else if (act.type === CarbonActivityType.WATER) {
        waterUse += act.value;
      }
    }

    // Build insights
    const insights: string[] = [];

    // Renewable penetration
    const renewablePct =
      totalEnergy > 0 ? (renewableEnergy / totalEnergy) * 100 : 0;
    if (renewablePct < 20) {
      insights.push(
        `Only ${renewablePct.toFixed(
          1
        )}% of your energy comes from renewables. Consider solar or PPAs with Kenya Power’s green tariff.`
      );
    } else {
      insights.push(
        `Great work — ${renewablePct.toFixed(
          1
        )}% of your energy is renewable, above the local industry baseline.`
      );
    }

    // Transport
    if (transportFuel > 1000) {
      insights.push(
        `Transport fuel usage is high. Explore EV fleets or optimize logistics to cut emissions.`
      );
    }

    // Waste
    if (wasteGenerated > 500) {
      insights.push(
        `Waste generation is above average. Implement recycling or composting to offset landfill emissions.`
      );
    }

    // Water
    if (waterUse > 200) {
      insights.push(
        `Your water usage is significant. Water reuse/recycling could save ~${(
          waterUse * factors.water
        ).toFixed(1)} kgCO₂.`
      );
    }

    // General AI-style nudge
    if (insights.length === 0) {
      insights.push("Your site is performing well. Keep monitoring for improvements!");
    }

    return NextResponse.json({ insights });
  } catch (err) {
    console.error("❌ Error in /api/insights:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

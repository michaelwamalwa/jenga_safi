import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import CarbonActivity from "@/app/models/CarbonActivity";
import { fetchEmissionFactors } from "@/lib/emissions";
import { generateForecast } from "@/lib/forecast";
import { CarbonActivityType } from "@/types/CarbonActivity";

const clean = (n: any) => (typeof n === "number" && isFinite(n) ? n : 0);

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // All activities tied to the logged-in user
    const activities = await CarbonActivity.find({
      userId: session.user.email,
    }).sort({ createdAt: 1 });

    const factors = await fetchEmissionFactors();

    let totalEmissions = 0;
    let totalSavings = 0;
    const trend: any[] = [];

    activities.forEach((act) => {
      let emissions = 0;
      let savings = 0;

      // Savings activities
      if (
        [
          CarbonActivityType.RENEWABLE,
          CarbonActivityType.MATERIAL,
          CarbonActivityType.RECYCLING,
          CarbonActivityType.WATER_REUSE,
        ].includes(act.type as CarbonActivityType)
      ) {
        if (act.type === CarbonActivityType.RENEWABLE) {
          savings = clean(act.value) * clean(factors.energyGrid);
        } else if (act.type === CarbonActivityType.MATERIAL) {
          savings =
            clean(act.value) *
            (clean(act.standardEF) - clean(act.sustainableEF));
        } else if (act.type === CarbonActivityType.RECYCLING) {
          savings = clean(act.value) * clean(factors.wasteLandfill);
        } else if (act.type === CarbonActivityType.WATER_REUSE) {
          savings = clean(act.value) * clean(factors.water);
        }
      } else {
        // Emissions activities
        if (act.type === CarbonActivityType.ENERGY) {
          emissions =
            act.fuelType === "diesel"
              ? clean(act.value) * clean(factors.energyDiesel)
              : clean(act.value) * clean(factors.energyGrid);
        } else if (act.type === CarbonActivityType.TRANSPORT) {
          emissions = clean(act.value) * clean(factors.transport);
        } else if (act.type === CarbonActivityType.MACHINERY) {
          emissions = clean(act.value) * clean(factors.fuelDiesel);
        } else if (act.type === CarbonActivityType.WASTE) {
          emissions = clean(act.value) * clean(factors.wasteLandfill);
        } else if (act.type === CarbonActivityType.WATER) {
          emissions = clean(act.value) * clean(factors.water);
        }
      }

      totalEmissions += emissions;
      totalSavings += savings;

      trend.push({
        time: act.createdAt,
        emissions: clean(emissions),
        savings: clean(savings),
        net: clean(emissions - savings),
      });
    });

    const forecast = generateForecast(trend);

    return NextResponse.json({
      activities,
      totalEmissions: clean(totalEmissions),
      totalSavings: clean(totalSavings),
      netEmissions: clean(totalEmissions - totalSavings),
      trend,
      forecast,
    });
  } catch (err) {
    console.error("❌ Error in /api/carbon-trends:", err);
    return NextResponse.json(
      {
        activities: [],
        totalEmissions: 0,
        totalSavings: 0,
        netEmissions: 0,
        trend: [],
        forecast: [],
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CarbonActivity from "@/app/models/CarbonActivity";
import { CarbonActivityType } from "@/types/CarbonActivity";
/**
 * /api/gamification
 * Returns gamified metrics: points, badges, streaks, leaderboard rank.
 */
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId") || "default";

    // Fetch activities
    const activities = await CarbonActivity.find({ siteId }).sort({
      createdAt: 1,
    });

    if (!activities.length) {
      return NextResponse.json({
        points: 0,
        badges: [],
        streak: 0,
        rank: null,
        message: "Start logging activities to earn points and climb the leaderboard!",
      });
    }

    // --- Calculate gamification metrics ---
    let points = 0;
    const badges: string[] = [];
    let streak = 0;

    // Award points by type
    for (const act of activities) {
      if (act.type === CarbonActivityType.RENEWABLE) points += act.value * 10;
      if (act.type === CarbonActivityType.RECYCLING) points += act.value * 5;
      if (act.type === CarbonActivityType.MATERIAL) points += act.value * 8;
      if (act.type === CarbonActivityType.WATER_REUSE) points += act.value * 6;
      if (act.type === CarbonActivityType.ENERGY) points += act.value * 2;
      if (act.type === CarbonActivityType.TRANSPORT) points += act.value * 1;
      if (act.type === CarbonActivityType.WASTE) points -= act.value * 2; // penalty
    }

    // Assign badges
    if (points >= 1000) badges.push("🌍 Climate Hero");
    if (points >= 500) badges.push("⚡ Energy Saver");
    if (points >= 200) badges.push("♻️ Recycler");
    if (points >= 100) badges.push("💧 Water Guardian");

    // Calculate streak (consecutive days of activity)
    const uniqueDates = new Set(
      activities.map((a) => new Date(a.createdAt).toDateString())
    );
    const today = new Date();
    let currentStreak = 0;

    for (let i = 0; ; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      if (uniqueDates.has(d.toDateString())) {
        currentStreak++;
      } else {
        break;
      }
    }
    streak = currentStreak;

    // Leaderboard rank (example: compare with all sites)
    const allSites = await CarbonActivity.aggregate([
      { $group: { _id: "$siteId", total: { $sum: "$value" } } },
      { $sort: { total: -1 } },
    ]);

    const rank =
      allSites.findIndex((s) => String(s._id) === siteId) + 1 || null;

    return NextResponse.json({
      points,
      badges,
      streak,
      rank,
      message:
        streak > 0
          ? `🔥 You’re on a ${streak}-day streak! Keep it up.`
          : "Start a new streak today by logging an activity.",
    });
  } catch (err) {
    console.error("❌ Error in /api/gamification:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

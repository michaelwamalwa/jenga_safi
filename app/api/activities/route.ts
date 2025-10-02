import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import CarbonActivity from "@/app/models/CarbonActivity";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch all activities for this logged-in user
    const activities = await CarbonActivity.find({
      userId: session.user.email,
    }).sort({ createdAt: -1 }); // newest first

    return NextResponse.json(activities);
  } catch (error) {
    console.error("❌ Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

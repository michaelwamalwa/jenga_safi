import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import CarbonActivity from "@/app/models/CarbonActivity";

export async function POST(req: Request) {
  try {

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();

    const activity = await CarbonActivity.create({
      ...body,
      userId: session.user.email,
      createdAt: new Date(),
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (err) {
    console.error("❌ Error adding activity:", err);
    return NextResponse.json({ error: "Failed to add activity" }, { status: 500 });
  }
}

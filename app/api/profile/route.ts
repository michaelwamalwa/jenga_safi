// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SustainabilityProfile from "@/app/models/profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find profile by user email
    const profile = await SustainabilityProfile.findOne({ 
      email: session.user.email 
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (err: any) {
    console.error("Error fetching profile:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update or create profile
    const profile = await SustainabilityProfile.findOneAndUpdate(
      { email: session.user.email },
      { ...body, userId: session.user.email },
      { new: true, upsert: true }
    );

    return NextResponse.json(profile);
  } catch (err: any) {
    console.error("Error saving profile:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
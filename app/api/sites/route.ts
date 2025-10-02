// app/api/sites/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Site from "@/app/models/site";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sites = await Site.find({ userId: session.user.email })
      .sort({ createdAt: -1 });

    return NextResponse.json(sites);
  } catch (err: any) {
    console.error("Error fetching sites:", err);
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

    // Validate required fields
    if (!body.name || !body.location) {
      return NextResponse.json(
        { error: "Site name and location are required" }, 
        { status: 400 }
      );
    }

    const siteData = {
      userId: session.user.email,
      profileId: body.profileId || undefined,
      name: body.name,
      location: body.location,
      projectType: body.projectType || 'residential',
      size: body.size || "",
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      budget: body.budget || "",
      status: 'planned'
    };

    const site = await Site.create(siteData);

    return NextResponse.json(site);
  } catch (err: any) {
    console.error("Error saving site:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
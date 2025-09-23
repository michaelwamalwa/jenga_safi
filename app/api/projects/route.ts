// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Project from "@/app/models/project";

// GET all projects for user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const projects = await Project.find({ userId: session.user?.email });

  return NextResponse.json(projects);
}

// POST create new project
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const data = await req.json();
  
  // Calculate total emissions
  const emissions = {
    energy: data.emissions?.energy || 0,
    paper: data.emissions?.paper || 0,
    travel: data.emissions?.travel || 0,
    total: (data.emissions?.energy || 0) * 0.85 + // 0.85 kg CO₂ per kWh
           (data.emissions?.paper || 0) * 2.5 +  // 2.5 kg CO₂ per ream
           (data.emissions?.travel || 0) * 0.21  // 0.21 kg CO₂ per km (average)
  };

  const project = await Project.create({
    ...data,
    userId: session.user?.email,
    emissions
  });

  return NextResponse.json(project);
}
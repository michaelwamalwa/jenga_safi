import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import LogisticsProject from "@/app/models/logistics";

// Fetch all projects
export async function GET() {
  try {
    await connectDB();
    const projects = await LogisticsProject.find().sort({ lastUpdated: -1 });
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Error fetching logistics data:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch logistics data" },
      { status: 500 }
    );
  }
}

// Create new project
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const project = await LogisticsProject.create(body);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("Error creating logistics project:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}

// Update existing project
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body._id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const { _id, ...updates } = body;

    const project = await LogisticsProject.findByIdAndUpdate(
      _id,
      { ...updates, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Error updating logistics project:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

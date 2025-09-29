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

  const project = await Project.create({
    ...data,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    userId: session.user?.email,
  });

  return NextResponse.json(project);
}

// app/api/ecotasks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import EcoTask from "@/app/models/ecotask";

// GET all eco-tasks for user with filtering
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const ecoImpact = searchParams.get('ecoImpact');
  const projectId = searchParams.get('projectId');

  const filter: any = { userId: session.user?.email };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (ecoImpact) filter.ecoImpact = ecoImpact;
  if (projectId) filter.projectId = projectId;

  const tasks = await EcoTask.find(filter);

  return NextResponse.json(tasks);
}

// POST create new eco-task
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const data = await req.json();

  const task = await EcoTask.create({
    ...data,
    userId: session.user?.email
  });

  return NextResponse.json(task);
}
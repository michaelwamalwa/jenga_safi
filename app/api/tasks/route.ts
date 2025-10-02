// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/app/models/task";

// GET - Fetch all tasks with optional filtering
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const query: any = {};
    
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST - Create a new task
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    
    // Validate required fields
    if (!body.title || !body.projectId) {
      return NextResponse.json(
        { error: "Title and projectId are required" },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title: body.title,
      description: body.description || "",
      priority: body.priority || "medium",
      impact: body.impact || "medium",
      status: body.status || "todo",
      projectId: body.projectId,
      estimatedCarbonReduction: body.estimatedCarbonReduction,
      dueDate: body.dueDate,
      assignedTo: body.assignedTo,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
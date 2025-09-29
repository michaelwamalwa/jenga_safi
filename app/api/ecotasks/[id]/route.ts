import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import EcoTask from "@/app/models/ecotask";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const updates = await req.json();
  const task = await EcoTask.findByIdAndUpdate(params.id, updates, { new: true });
  return NextResponse.json(task);
}

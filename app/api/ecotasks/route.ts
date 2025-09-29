import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import EcoTask from "@/app/models/ecotask";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const tasks = await EcoTask.find({ userId: session?.user?.email });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const data = await req.json();
  const task = await EcoTask.create({ ...data, userId: session?.user?.email });
  return NextResponse.json(task);
}

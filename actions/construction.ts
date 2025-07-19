'use server';

import { connectDB } from '@/lib/db';
import ConstructionTask, { IConstructionTask } from '@/app/models/constructionTask';
import { revalidatePath } from 'next/cache';

export async function getTasks(): Promise<IConstructionTask[]> {
  await connectDB();
  const tasks = await ConstructionTask.find().lean();
  return JSON.parse(JSON.stringify(tasks));
}

export async function addTask(data: {
  title: string;
  ecoImpact: string;
  site?: string;
  priority?: 'low' | 'medium' | 'high';
}): Promise<IConstructionTask> {
  await connectDB();
  const created = await ConstructionTask.create({
    title: data.title,
    ecoImpact: data.ecoImpact,
    site: data.site,
    priority: data.priority,
    status: 'pending',
  });
  revalidatePath('/dashboard/construction');
  return JSON.parse(JSON.stringify(created));
}

export async function updateTaskStatus(id: string, status: 'pending' | 'in-progress' | 'completed') {
  await connectDB();
  const updated = await ConstructionTask.findByIdAndUpdate(id, { status }, { new: true });
  revalidatePath('/dashboard/construction');
  return JSON.parse(JSON.stringify(updated));
}

export async function deleteTask(id: string) {
  await connectDB();
  await ConstructionTask.findByIdAndDelete(id);
  revalidatePath('/dashboard/construction');
  return { success: true };
}

'use server';

import { connectDB } from "@/lib/db";
import projectsite from "@/app/models/projectsite";

export async function getProjectSites() {
  await connectDB();
  const sites = await projectsite.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(sites));
}

export async function addProjectSite(data: {
  name: string;
  location: string;
  manager: string;
}) {
  await connectDB();
  const newSite = await projectsite.create({
    ...data,
    phase: 'Phase 1',
    status: 'pending',
    ecoRating: 3,
    archived: false,
    startDate: new Date().toISOString().split('T')[0],
    progress: 0,
    coordinates: { lat: 0, lng: 0 },
  });

  return JSON.parse(JSON.stringify(newSite));
}

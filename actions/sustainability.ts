'use server';

import { connectDB } from "@/lib/db";
import { ConstructionItem } from "@/app/models/constructionItem";

// SUGGESTIONS
export async function getSuggestions() {
  await connectDB();
  const suggestions = await ConstructionItem.find({ type: 'suggestion' }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(suggestions));
}

// LEADERBOARD
export async function getLeaderboard() {
  await connectDB();
  const leaderboard = await ConstructionItem.find({ type: 'leaderboard' }).sort({ points: -1 }).lean();
  return JSON.parse(JSON.stringify(leaderboard));
}

// IMPACT METRICS
export async function getImpactMetrics() {
  await connectDB();
  const impact = await ConstructionItem.find({ type: 'impact' }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(impact));
}

// ADD SUGGESTION
export async function addSuggestion(data: {
  text: string;
  ecoPoints: number;
  activeSince: string;
}) {
  await connectDB();
  const suggestion = await ConstructionItem.create({
    type: 'suggestion',
    text: data.text,
    ecoPoints: data.ecoPoints,
    activeSince: data.activeSince,
    applied: false,
  });

  return JSON.parse(JSON.stringify(suggestion));
}

// ADD LEADERBOARD ENTRY
export async function addLeaderboardEntry(data: {
  name: string;
  points: number;
  progress: number;
}) {
  await connectDB();
  const entry = await ConstructionItem.create({
    type: 'leaderboard',
    ...data,
  });

  return JSON.parse(JSON.stringify(entry));
}

// ADD IMPACT METRIC
export async function addImpactMetric(data: {
  label: string;
  value: string;
  icon: string;
}) {
  await connectDB();
  const metric = await ConstructionItem.create({
    type: 'impact',
    ...data,
  });

  return JSON.parse(JSON.stringify(metric));
}

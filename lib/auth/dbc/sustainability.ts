'use server';

import { connectDB } from '../../db';

export async function getDashboardData(organizationId: string) {
  const { db } = await connectDB();

  const [metrics, suggestions, leaderboard] = await Promise.all([
    db.collection('construction_sustainability')
      .findOne({ organizationId }, {
        projection: { metrics: 1, updatedAt: 1 }
      }),

    db.collection('sustainability_suggestions')
      .find({ organizationId })
      .sort({ impactScore: -1 })
      .limit(10)
      .toArray(),

    db.collection('project_leaderboard')
      .find({ organizationId })
      .sort({ sustainabilityScore: -1 })
      .limit(5)
      .toArray()
  ]);

  return {
    metrics: metrics?.metrics || null,
    suggestions: suggestions || [],
    leaderboard: leaderboard || []
  };
}

export async function recordSuggestionAdoption(projectId: string, suggestionId: string) {
  const { db } = await connectDB();

  await db.collection('project_leaderboard').updateOne(
    { projectId },
    { $addToSet: { implementedSuggestions: suggestionId } },
    { upsert: true }
  );

  await db.collection('sustainability_suggestions').updateOne(
    { _id: suggestionId },
    { $inc: { activeProjects: 1 } }
  );
}

export async function refreshSustainabilityMetrics(organizationId: string) {
  const { db } = await connectDB();

  const metrics = await db.collection('sensor_readings').aggregate([
    { $match: { orgId: organizationId } },
    {
      $group: {
        _id: null,
        carbonFootprint: { $sum: '$metrics.carbonFootprint' },
        energyConsumption: { $sum: '$metrics.energyUsage' },
        wasteRecycled: { $avg: '$metrics.wasteProduced' }, // adjust this if it's actually a % recycled
        waterSaved: { $sum: '$metrics.waterUsage' }
      }
    }
  ]).toArray();
  

  if (metrics.length > 0) {
    await db.collection('construction_sustainability').updateOne(
      { organizationId },
      { $set: { metrics: metrics[0], updatedAt: new Date() } },
      { upsert: true }
    );
  }
}

import { connectDB } from '../../db';

export const LocationCollection = {
  async addLocation(location: any) {
    const { db } = await connectDB();
    const result = await db.collection('locations').insertOne(location);
    return result;
  },

  async getLocationsWithinRadius(center: [number, number], radius: number) {
    if (!center || !radius) return [];

    const { db } = await connectDB();
    return db.collection('locations').find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: center
          },
          $maxDistance: radius
        }
      }
    }).toArray();
  },

  async getLocationsByType(type: string) {
    const { db } = await connectDB();
    return db.collection('locations')
      .find({ type })
      .sort({ lastUpdated: -1 })
      .toArray();
  },

  async getHighImpactLocations(threshold: number = 100) {
    const { db } = await connectDB();
    return db.collection('locations')
      .find({ 
        'sustainabilityMetrics.carbonImpact': { $gt: threshold } 
      })
      .sort({ 'sustainabilityMetrics.carbonImpact': -1 })
      .toArray();
  },

  async getLocationStats() {
    const { db } = await connectDB();
    return db.collection('locations').aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgCarbon: { $avg: '$sustainabilityMetrics.carbonImpact' },
          totalEnergy: { $sum: '$sustainabilityMetrics.energyUsage' },
          activeProjects: { $sum: '$activeProjects' }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
  },

  async updateLocationMetrics(locationId: string, metrics: object) {
    const { db } = await connectDB();
    return db.collection('locations').updateOne(
      { _id: locationId },
      { 
        $set: { 
          'sustainabilityMetrics': metrics,
          lastUpdated: new Date() 
        } 
      }
    );
  }
};

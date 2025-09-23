// mongodb-atlas/triggers/hourlyMetricsUpdate.js
exports = async function() {
    const db = context.services.get("mongodb-atlas").db("construction");
    
    // 1. Aggregate sensor data
    const metrics = await db.collection('sensor_readings').aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(Date.now() - 3600000) }
        }
      },
      {
        $group: {
          _id: "$projectId",
          carbonSum: { $sum: "$metrics.carbonFootprint" },
          energyAvg: { $avg: "$metrics.energyUsage" },
          waterSum: { $sum: "$metrics.waterUsage" },
          wasteSum: { $sum: "$metrics.wasteProduced" }
        }
      }
    ]).toArray();
  
    // 2. Update projects collection
    const bulkOps = metrics.map(metric => ({
      updateOne: {
        filter: { _id: metric._id },
        update: {
          $set: {
            'sustainability.hourlyCarbon': metric.carbonSum,
            'sustainability.hourlyEnergy': metric.energyAvg,
            'sustainability.hourlyWater': metric.waterSum,
            'sustainability.hourlyWaste': metric.wasteSum,
            lastUpdated: new Date()
          }
        }
      }
    }));
  
    await db.collection('projects').bulkWrite(bulkOps);
  };
// pages/api/environmental-data.js
import dbConnect from '../../lib/dbConnect';
import EnvironmentalData from '../../models/EnvironmentalData';
import ConstructionSite from '../../models/ConstructionSite';

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;
  const { siteId, timeRange = '1hour', limit = 100 } = query;

  try {
    switch (method) {
      case 'GET':
        // Calculate time range
        let startTime;
        const now = new Date();
        
        switch (timeRange) {
          case '1hour':
            startTime = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case '6hours':
            startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
            break;
          case '24hours':
            startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7days':
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          default:
            startTime = new Date(now.getTime() - 60 * 60 * 1000);
        }

        // Build query
        const dataQuery = {
          timestamp: { $gte: startTime }
        };

        if (siteId && siteId !== 'all') {
          dataQuery.siteId = siteId;
        }

        const environmentalData = await EnvironmentalData.find(dataQuery)
          .populate('siteId', 'name location')
          .sort({ timestamp: -1 })
          .limit(parseInt(limit));

        res.status(200).json({ success: true, data: environmentalData });
        break;

      default:
        res.status(400).json({ success: false });
        break;
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
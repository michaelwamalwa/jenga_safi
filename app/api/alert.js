// pages/api/alerts.js
import dbConnect from '../../lib/dbConnect';
import Alert from '../../models/Alert';

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;
  const { acknowledged } = query;

  try {
    switch (method) {
      case 'GET':
        const alertQuery = {};
        if (acknowledged !== undefined) {
          alertQuery.acknowledged = acknowledged === 'true';
        }

        const alerts = await Alert.find(alertQuery)
          .populate('siteId', 'name location')
          .sort({ timestamp: -1 })
          .limit(50);

        res.status(200).json({ success: true, data: alerts });
        break;

      case 'PUT':
        const { alertId } = req.body;
        const alert = await Alert.findByIdAndUpdate(
          alertId,
          { acknowledged: true },
          { new: true }
        ).populate('siteId', 'name location');

        res.status(200).json({ success: true, data: alert });
        break;

      default:
        res.status(400).json({ success: false });
        break;
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
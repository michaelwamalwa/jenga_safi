// pages/api/sites.js
import dbConnect from '../../lib/dbConnect';
import ConstructionSite from '../../models/ConstructionSite';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const sites = await ConstructionSite.find({});
        res.status(200).json({ success: true, data: sites });
        break;

      case 'POST':
        const site = await ConstructionSite.create(req.body);
        res.status(201).json({ success: true, data: site });
        break;

      default:
        res.status(400).json({ success: false });
        break;
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
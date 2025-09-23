// utils/addOrgIdToSensors.js
import { connectDB } from '../lib/db';

async function addOrgIdToSensors() {
  const { db } = await connectDB();
  await db.collection('sensor_readings').updateMany(
    {},
    { $set: { orgId: 'org-001' } }
  );
  console.log('✅ Added orgId to all sensor readings');
}

addOrgIdToSensors();

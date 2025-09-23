// utils/sensorIngestion.js
require('dotenv').config(); // Load .env

const { MongoClient } = require('mongodb');
const axios = require('axios');

const MONGODB_URI = process.env.MONGODB_URI;
const SENSOR_API_URL = 'https://68813bca66a7eb81224a70d5.mockapi.io/sensors';

async function ingestSensorData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🚀 Starting sensor data ingestion...');

    // 1. Fetch real-time sensor data
    console.log('🌐 Fetching sensor data from MockAPI...');
    const response = await axios.get(SENSOR_API_URL);

    console.log(`✅ Fetched ${response.data.length} sensor records`);

    // 2. Transform for MongoDB
    const payload = response.data.map(sensor => ({
      projectId: sensor.site_id,
      timeStamp: new Date(sensor.timeStamp * 1000),
      metrics: {
        carbonFootprint: sensor.carbon_kg,
        energyUsage: sensor.energy_kwh,
        waterUsage: sensor.water_liters,
        wasteProduced: sensor.waste_kg
      },
      deviceId: sensor.device_id
    }));
    console.log('📦 Transformed data for MongoDB');

    // 3. Insert into MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    const db = client.db('construction');
    console.log('✅ Connected to MongoDB');

    console.log('📝 Inserting data into sensor_readings...');
    const result = await db.collection('sensor_readings').insertMany(payload);
    console.log(`✅ Inserted ${result.insertedCount} sensor records`);

    // 4. Trigger metrics recalculation
    console.log('♻️ Triggering metrics recalculation...');
    await axios.post('http://localhost:3000/api/recalculate-metrics');
    console.log('✅ Metrics recalculation triggered');

  } catch (err) {
    console.error('❌ Error during ingestion:', err.message);
  } finally {
    await client.close();
    console.log('🔒 MongoDB connection closed');
  }
}

// Run every 15 minutes
setInterval(ingestSensorData, 900000);

// Kick off immediately
ingestSensorData();

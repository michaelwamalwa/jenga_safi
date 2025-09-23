// /scripts/seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });  // 👈 force load .env.local

import { connectDB } from "../lib/db";

// --- Schemas ---
const siteSchema = new mongoose.Schema({
  name: String,
  status: String,
  sensors: Number,
  location: String,
  alerts: Number,
});
const kpiSchema = new mongoose.Schema({
  title: String,
  value: Number,
  unit: String,
  status: String,
  trend: Number,
  icon: String,
  threshold: Number,
  lastUpdate: Date,
});
const alertSchema = new mongoose.Schema({
  site: String,
  type: String,
  message: String,
  value: Number,
  threshold: Number,
  timestamp: Date,
  acknowledged: Boolean,
});
const carbonSchema = new mongoose.Schema({
  carbonEmitted: Number,
  carbonSaved: Number,
  trend: [{ time: Date, emissions: Number }],
});
const nemaSchema = new mongoose.Schema({
  status: String,
  score: Number,
  nextReport: Date,
  violations: Number,
});

// --- Models ---
const Site = mongoose.models.Site || mongoose.model("Site", siteSchema);
const KPI = mongoose.models.KPI || mongoose.model("KPI", kpiSchema);
const Alert = mongoose.models.Alert || mongoose.model("Alert", alertSchema);
const Carbon = mongoose.models.Carbon || mongoose.model("Carbon", carbonSchema);
const NEMA = mongoose.models.NEMA || mongoose.model("NEMA", nemaSchema);

// --- Helpers ---
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function kpiStatus(value: number, threshold: number) {
  if (value > threshold) return "warning";
  if (value > threshold * 0.9) return "watch";
  return "good";
}

async function seed() {
  await connectDB();

  // Clear existing data
  await Promise.all([
    Site.deleteMany({}),
    KPI.deleteMany({}),
    Alert.deleteMany({}),
    Carbon.deleteMany({}),
    NEMA.deleteMany({}),
  ]);

  // Insert sample Sites
  const sites = await Site.insertMany([
    { name: "Westlands Tower", status: "active", sensors: randomInt(8, 15), location: "Nairobi", alerts: randomInt(0, 3) },
    { name: "Kilimani Mall", status: "active", sensors: randomInt(5, 12), location: "Nairobi", alerts: randomInt(0, 2) },
    { name: "Thika Highway Bypass", status: "under review", sensors: randomInt(4, 10), location: "Thika", alerts: randomInt(0, 1) },
  ]);

  // Insert sample KPIs
  const now = new Date();
  const kpis = [
    { title: "Water Usage", unit: "L", icon: "droplet", threshold: 2000 },
    { title: "Energy Consumption", unit: "kWh", icon: "zap", threshold: 500 },
    { title: "Air Quality Index", unit: "AQI", icon: "wind", threshold: 100 },
    { title: "Waste Recycled", unit: "%", icon: "recycle", threshold: 80 },
  ].map(kpi => {
    const value = randomInt(kpi.threshold * 0.5, kpi.threshold * 1.2);
    return {
      ...kpi,
      value,
      status: kpiStatus(value, kpi.threshold),
      trend: randomInt(-10, 15),
      lastUpdate: now,
    };
  });
  await KPI.insertMany(kpis);

  // Insert sample Alerts
  await Alert.insertMany([
    { site: sites[0].name, type: "air", message: "High PM2.5 levels", value: 78, threshold: 50, timestamp: now, acknowledged: false },
    { site: sites[1].name, type: "noise", message: "Noise exceeds threshold", value: 95, threshold: 70, timestamp: now, acknowledged: true },
    { site: sites[2].name, type: "energy", message: "High energy consumption detected", value: 520, threshold: 500, timestamp: now, acknowledged: false },
  ]);

  // Insert Carbon Data (time-series trend)
  const start = new Date("2025-09-01");
  const carbonTrend = Array.from({ length: 10 }).map((_, i) => ({
    time: new Date(start.getTime() + i * 86400000), // +1 day
    emissions: randomInt(40, 100),
  }));

  await Carbon.create({
    carbonEmitted: carbonTrend.reduce((sum, t) => sum + t.emissions, 0),
    carbonSaved: randomInt(100, 300),
    trend: carbonTrend,
  });

  // Insert NEMA Compliance Data
  await NEMA.create({
    status: "compliant",
    score: randomInt(75, 95),
    nextReport: new Date("2025-12-15"),
    violations: randomInt(0, 3),
  });

  console.log("✅ Database seeded with realistic sample data!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

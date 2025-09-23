import mongoose from 'mongoose';

const EnvironmentalDataSchema = new mongoose.Schema({
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConstructionSite',
    required: true
  },
  timestamp: { type: Date, default: Date.now, required: true },
  carbonEmissions: { type: Number, required: true }, // kg CO₂
  airQuality: { type: Number, required: true },      // AQI
  noiseLevel: { type: Number, required: true },      // dB
  waterUsage: { type: Number, required: true },      // liters
  wasteGeneration: { type: Number, required: true }, // kg
  energyConsumption: { type: Number, required: true }, // kWh
  paperUsage: { type: Number, required: true },        // reams
  travelDistance: { type: Number, required: true }     // km
}, { timestamps: true });

EnvironmentalDataSchema.index({ siteId: 1, timestamp: -1 });

// Prevent OverwriteModelError in Next.js
const EnvironmentalData =
  mongoose.models.EnvironmentalData ||
  mongoose.model('EnvironmentalData', EnvironmentalDataSchema);

export default EnvironmentalData;

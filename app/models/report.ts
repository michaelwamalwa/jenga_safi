import mongoose, { Schema, model, models } from 'mongoose';

const ReportSchema = new Schema({
  month: { type: String, required: true },
  energy: { type: Number, required: true },
  energyReduction: { type: Number},
  co2: { type: Number, required: true },
  co2Reduction: { type: Number },
  waste: { type: Number, required: true },
  wasteReduction: { type: Number },
  waterUsage: { type: Number, required: true },
  recyclingRate: { type: Number },
  ecoScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Report = models.Report || model('Report', ReportSchema);

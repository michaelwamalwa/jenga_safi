// app/models/profile.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISustainabilityProfile extends Document {
  userId: string;
  name: string;
  email: string;
  company: string;
  role: string;
  sustainabilityGoals: string;
  reductionTarget: number;
  focusAreas: string[];
  setupCompleted: boolean;
}

const SustainabilityProfileSchema = new Schema<ISustainabilityProfile>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    sustainabilityGoals: { type: String, default: "" },
    reductionTarget: { type: Number, default: 25 },
    focusAreas: [{ type: String }],
    setupCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.SustainabilityProfile ||
  mongoose.model<ISustainabilityProfile>("SustainabilityProfile", SustainabilityProfileSchema);
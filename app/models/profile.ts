import mongoose, { Schema, Document } from "mongoose";

export interface ISustainabilityProfile extends Document {
  userId: string; // linked to NextAuth user
  name: string;
  email: string;
  businessType: string;
  teamSize: string;
  objectives: string[];
  paperUsage: number;
  energyUsage: number;
  travelFrequency: "low" | "medium" | "high";
  carbonSaved: number;
  carbonEmitted: number; // ✅ just a number in TS
}

const SustainabilityProfileSchema = new Schema<ISustainabilityProfile>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    businessType: { type: String, required: true },
    teamSize: { type: String, required: true },
    objectives: [{ type: String }],
    paperUsage: { type: Number, default: 0 },
    energyUsage: { type: Number, default: 0 },
    travelFrequency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    carbonSaved: { type: Number, default: 0 },
    carbonEmitted: { type: Number, default: 0 }, // ✅ schema definition
  },
  { timestamps: true }
);

export default
  mongoose.models.SustainabilityProfile ||
  mongoose.model<ISustainabilityProfile>(
    "SustainabilityProfile",
    SustainabilityProfileSchema
  );

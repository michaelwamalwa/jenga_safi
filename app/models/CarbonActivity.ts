import mongoose, { Schema, Document, models } from "mongoose";
import { CarbonActivityType } from "@/types/CarbonActivity";

export interface ICarbonActivity extends Document {
  userId: string;
  siteId: string;
  type: CarbonActivityType;
  value: number;
  description?: string;
  sustainableEF?: number;
  standardEF?: number;
  fuelType?: "diesel" | "grid" | "petrol" | "hybrid" | "electric";
  createdAt: Date;
}

const CarbonActivitySchema = new Schema<ICarbonActivity>(
  {
    userId: { type: String, required: true },
    siteId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(CarbonActivityType),
    },
    value: { type: Number, required: true },
    description: { type: String },
    sustainableEF: { type: Number },
    standardEF: { type: Number },
    fuelType: {
      type: String,
      enum: ["diesel", "grid", "petrol", "hybrid", "electric"],
    },
  },
  { timestamps: true }
);

export default models.CarbonActivity ||
  mongoose.model<ICarbonActivity>("CarbonActivity", CarbonActivitySchema);

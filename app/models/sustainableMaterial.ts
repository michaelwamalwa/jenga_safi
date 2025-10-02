// models/SustainableMaterial.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISustainableMaterial extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  availability: "high" | "medium" | "low";
  ecoImpact: {
    carbonFootprint: number;
    waterUsage: number;
    recyclability: number;
    renewable: boolean;
    local: boolean;
  };
  supplier: {
    name: string;
    location: string;
    rating: number;
    certification: string[];
  }
}

const SustainableMaterialSchema = new Schema<ISustainableMaterial>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  availability: { type: String, enum: ["high", "medium", "low"], default: "medium" },
  ecoImpact: {
    carbonFootprint: { type: Number, required: true },
    waterUsage: { type: Number, required: true },
    recyclability: { type: Number, required: true },
    renewable: { type: Boolean, default: false },
    local: { type: Boolean, default: false }
  },
  supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true }
}, { timestamps: true });

export default mongoose.models.SustainableMaterial || 
  mongoose.model<ISustainableMaterial>("SustainableMaterial", SustainableMaterialSchema);
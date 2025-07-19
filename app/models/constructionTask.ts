import mongoose, { Document, Schema } from "mongoose";

export interface IConstructionTask extends Document {
  title: string;
  status: "completed" | "in-progress" | "pending";
  ecoImpact: string;
  site?: string;
  priority?: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

const ConstructionTaskSchema = new Schema<IConstructionTask>(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "in-progress", "pending"],
      default: "pending",
    },
    ecoImpact: { type: String, required: true },
    site: { type: String },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ConstructionTask ||
  mongoose.model<IConstructionTask>("ConstructionTask", ConstructionTaskSchema);

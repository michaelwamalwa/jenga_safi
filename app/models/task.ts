// models/Task.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  projectId: string;
  estimatedCarbonReduction?: number; // kg CO₂
  actualCarbonReduction?: number; // kg CO₂
  dueDate?: Date;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    impact: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    projectId: { type: String, required: true },
    estimatedCarbonReduction: { type: Number },
    actualCarbonReduction: { type: Number },
    dueDate: { type: Date },
    assignedTo: { type: String },
  },
  { timestamps: true }
);

export default models.Task || mongoose.model<ITask>("Task", TaskSchema);
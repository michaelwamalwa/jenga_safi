import mongoose, { Schema, model, models } from "mongoose";

const ecoTaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    site: { type: String, required: true },
    materials: [String],
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    ecoImpact: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    assignedTo: { type: String, required: true },
    estimatedCarbonSavings: { type: Number, default: 0 },
    actualCarbonSavings: { type: Number, default: 0 },

    // 🔑 Link to Project
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },

    // Optional: track user
    userId: { type: String }
  },
  { timestamps: true }
);

const EcoTask = models.EcoTask || model("EcoTask", ecoTaskSchema);
export default EcoTask;

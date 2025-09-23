// models/Project.ts
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ConstructionSite",
    required: true,
  },
  description: String,
  startDate: Date,
  endDate: Date,
  emissions: {
    energy: { type: Number, default: 0 },
    paper: { type: Number, default: 0 },
    travel: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  sustainabilityGoals: [String],
  status: {
    type: String,
    enum: ["planning", "active", "completed", "on-hold"],
    default: "planning",
  },
}, { timestamps: true });

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;

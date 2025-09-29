import mongoose, { Schema, models, model } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    location: String,
    startDate: Date,
    endDate: Date,
    userId: { type: String, required: true },

    // 🔑 Must match your Site model _id type
    siteId: { type: Schema.Types.ObjectId, ref: "Site", required: true },
  },
  { timestamps: true }
);

const Project = models.Project || model("Project", projectSchema);

export default Project;

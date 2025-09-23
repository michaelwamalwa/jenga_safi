// models/Alert.js
import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConstructionSite",
      required: true,
    },
    type: {
      type: String,
      enum: ["critical", "warning", "info", "offline"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    value: Number,
    threshold: Number,
    metric: String,
    acknowledged: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ use existing model if already compiled (avoids OverwriteModelError in Next.js hot reload)
export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);

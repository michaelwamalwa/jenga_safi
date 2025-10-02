// app/models/site.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISite extends Document {
  userId: string;
  profileId?: mongoose.Types.ObjectId;
  name: string;
  location: string;
  projectType: string;
  size: string;
  startDate: Date;
  endDate?: Date;
  budget?: string;
  status: 'planned' | 'active' | 'completed' | 'on-hold';
  createdAt: Date;
  updatedAt: Date;
}

const SiteSchema = new Schema<ISite>(
  {
    userId: { type: String, required: true },
    profileId: { 
      type: Schema.Types.ObjectId, 
      ref: 'SustainabilityProfile',
      required: false
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    projectType: { 
      type: String, 
      required: true,
      enum: ['residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other'],
      default: 'residential'
    },
    size: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    budget: { type: String, default: "" },
    status: {
      type: String,
      enum: ['planned', 'active', 'completed', 'on-hold'],
      default: 'planned'
    }
  },
  { timestamps: true }
);

// Index for better query performance
SiteSchema.index({ userId: 1, createdAt: -1 });
SiteSchema.index({ profileId: 1 });

export default mongoose.models.Site ||
  mongoose.model<ISite>("Site", SiteSchema);
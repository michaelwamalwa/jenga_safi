import mongoose, { Document, Schema } from 'mongoose';

export interface IContractor extends Document {
  name: string;
  specialization: string;
  projects: string[];
  rating: number;
  status: 'active' | 'on-hold' | 'archived';
  certifications: string[];
  projectsCompleted: number;
  sustainabilityScore: number;
  contact: string;
  lastProject?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contractorSchema = new Schema<IContractor>(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    projects: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    status: { type: String, enum: ['active', 'on-hold', 'archived'], default: 'active' },
    certifications: { type: [String], default: [] },
    projectsCompleted: { type: Number, default: 0 },
    sustainabilityScore: { type: Number, min: 0, max: 100, default: 0 },
    contact: { type: String, required: true, trim: true },
    lastProject: { type: Date },
  },
  { timestamps: true }
);

const Contractor =
  mongoose.models.contractors || mongoose.model<IContractor>('contractors', contractorSchema);

export default Contractor;

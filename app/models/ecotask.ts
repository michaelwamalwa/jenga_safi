import mongoose, { Schema, Document, Model } from 'mongoose';

interface IEcoTask extends Document {
  title: string;
  description?: string;
  siteId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  materials?: string[];
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  ecoImpact: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  estimatedCarbonSavings: number;
  actualCarbonSavings: number;
}

const EcoTaskSchema: Schema<IEcoTask> = new Schema({
  title: { type: String, required: true },
  description: String,
  siteId: { type: Schema.Types.ObjectId, ref: 'ConstructionSite', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  materials: [String],
  deadline: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  ecoImpact: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  assignedTo: String,
  estimatedCarbonSavings: { type: Number, default: 0 },
  actualCarbonSavings: { type: Number, default: 0 },
}, { timestamps: true });

// Prevent OverwriteModelError
const EcoTask: Model<IEcoTask> = mongoose.models.EcoTask || mongoose.model<IEcoTask>('EcoTask', EcoTaskSchema);

export default EcoTask;

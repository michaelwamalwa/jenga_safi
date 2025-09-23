import mongoose, { Schema, Document } from 'mongoose';

export interface ILogisticsData extends Document {
  projectName: string;
  location: string;
  materials: {
    name: string;
    quantity: number;
    carbonPerUnit: number;
    isRecycled: boolean;
    supplierLocation: string;
    lat?: number;
    lng?: number;
  }[];
  vehicles: {
    type: string;
    count: number;
    fuelEfficiency: number;
    distance: number;
  }[];
  wasteManagement: {
    recyclingRate: number;
    hazardousWaste: number;
  };
  lastUpdated: Date;
}

const LogisticsSchema: Schema = new Schema({
  projectName: { type: String, required: true },
  location: { type: String, required: true },
  materials: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    carbonPerUnit: { type: Number, required: true },
    isRecycled: { type: Boolean, default: true },
    supplierLocation: { type: String, required: true },
    lat: { type: Number, required: false },
    lng: { type: Number, required: false }
  }],
  vehicles: [{
    type: String,
    count: Number,
    fuelEfficiency: Number,
    distance: Number
  }],
  wasteManagement: {
    recyclingRate: { type: Number, default: 0 },
    hazardousWaste: { type: Number, default: 0 }
  },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.models.LogisticsProject || mongoose.model<ILogisticsData>('LogisticsProject', LogisticsSchema);
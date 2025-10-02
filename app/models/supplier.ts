// models/Supplier.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISupplier extends Document {
  name: string;
  location: string;
  contact: string;
  rating: number;
  certification: string[];
  specialties: string[];
}

const SupplierSchema = new Schema<ISupplier>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  certification: [{ type: String }],
  specialties: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Supplier || 
  mongoose.model<ISupplier>("Supplier", SupplierSchema);
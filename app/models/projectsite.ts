import mongoose, { Document, Schema } from "mongoose";

export interface IProjectSite extends Document {
    name: string;
    location: string;
    manager: string;
    phase: string;
    startDate: Date;
    progress: number;
    ecoRating: number;
    status: "ongoing" | "completed" | "pending";
    archived: boolean;
    coordinates: { lat: number; lng: number };
    createdAt: Date;
    updatedAt: Date;
}
 const ProjectSiteSchema = new Schema<IProjectSite> (
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        manager: { type: String, required: true },
        phase: { type: String, required: true },
        startDate: { type: Date, required: true },
        progress: { type: Number, required: true },
        ecoRating: { type: Number, required: true },
        status: { 
            type: String, 
            enum: ["ongoing", "completed", "pending"],
            default: "ongoing",
            required: true 
        },
        archived: { type: Boolean, required: true },
        coordinates: { 
            lat: { type: Number, required: true }, 
            lng: { type: Number, required: true } 
        },
    },
    { timestamps: true }
 );

export default mongoose.models.ProjectSite ||
    mongoose.model<IProjectSite>("ProjectSite", ProjectSiteSchema);
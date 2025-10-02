// app/models/carbon-data.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICarbonData extends Document {
  siteId: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
  userId: string;
  reductionTarget: number;
  focusAreas: string[];
  
  // Emissions data (in kg CO2e)
  baselineEmissions: number;
  currentEmissions: number;
  targetEmissions: number;
  
  // Progress tracking
  reductionProgress: number;
  progressPercentage: number;
  
  // Category-wise emissions
  emissionsByCategory: {
    materials: number;
    energy: number;
    transportation: number;
    waste: number;
    water: number;
    other: number;
  };
  
  // Timeline data
  monthlyData: Array<{
    month: Date;
    emissions: number;
    materials: number;
    energy: number;
    transportation: number;
    waste: number;
    water: number;
    other: number;
  }>;
  
  status: 'active' | 'completed' | 'archived';
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CarbonDataSchema = new Schema<ICarbonData>(
  {
    siteId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Site',
      required: true 
    },
    profileId: { 
      type: Schema.Types.ObjectId, 
      ref: 'SustainabilityProfile',
      required: true 
    },
    userId: { type: String, required: true },
    reductionTarget: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100,
      default: 25
    },
    focusAreas: [{ 
      type: String,
      enum: ['energy', 'materials', 'waste', 'water', 'transport', 'biodiversity']
    }],
    
    // Emissions data
    baselineEmissions: { 
      type: Number, 
      default: 0,
      min: 0
    },
    currentEmissions: { 
      type: Number, 
      default: 0,
      min: 0
    },
    targetEmissions: { 
      type: Number, 
      default: 0,
      min: 0
    },
    
    // Progress tracking
    reductionProgress: { 
      type: Number, 
      default: 0 
    },
    progressPercentage: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 100
    },
    
    // Category-wise emissions
    emissionsByCategory: {
      materials: { type: Number, default: 0 },
      energy: { type: Number, default: 0 },
      transportation: { type: Number, default: 0 },
      waste: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    
    // Monthly timeline data
    monthlyData: [{
      month: { type: Date, required: true },
      emissions: { type: Number, default: 0 },
      materials: { type: Number, default: 0 },
      energy: { type: Number, default: 0 },
      transportation: { type: Number, default: 0 },
      waste: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }],
    
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active'
    },
    lastUpdated: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
CarbonDataSchema.index({ siteId: 1 });
CarbonDataSchema.index({ profileId: 1 });
CarbonDataSchema.index({ userId: 1 });
CarbonDataSchema.index({ status: 1 });

// Pre-save middleware to calculate derived fields
CarbonDataSchema.pre('save', function(next) {
  // Calculate target emissions based on reduction target
  if (this.baselineEmissions > 0) {
    this.targetEmissions = this.baselineEmissions * (1 - this.reductionTarget / 100);
  }
  
  // Calculate reduction progress and percentage
  if (this.baselineEmissions > 0 && this.currentEmissions >= 0) {
    const reduction = this.baselineEmissions - this.currentEmissions;
    this.reductionProgress = Math.max(0, reduction);
    this.progressPercentage = Math.min(100, (reduction / (this.baselineEmissions - this.targetEmissions)) * 100);
  }
  
  this.lastUpdated = new Date();
  next();
});

export default mongoose.models.CarbonData ||
  mongoose.model<ICarbonData>("CarbonData", CarbonDataSchema);
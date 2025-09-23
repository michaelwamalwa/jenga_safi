import mongoose from 'mongoose';

const PointSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['Point'], 
    required: true,
    default: 'Point'
  },
  coordinates: { 
    type: [Number],  // [longitude, latitude]
    required: true,
    validate: {
      validator: (coords) => {
        return coords.length === 2 && 
               coords[0] >= -180 && coords[0] <= 180 &&
               coords[1] >= -90 && coords[1] <= 90;
      },
      message: 'Invalid coordinates'
    }
  }
});

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, index: 'text' },
  type: { 
    type: String,
    enum: ['construction-site', 'warehouse', 'office', 'supplier', 'disposal'],
    required: true
  },
  coordinates: {
    type: PointSchema,
    required: true,
    index: '2dsphere'
  },
  activeProjects: { type: Number, default: 0 },
  sustainabilityMetrics: {
    carbonImpact: Number,  // kg CO2/day
    energyUsage: Number,   // kWh/day
    wasteProduced: Number, // kg/day
    waterUsage: Number     // liters/day
  },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index for geospatial queries
LocationSchema.index({ 
  coordinates: '2dsphere',
  type: 1,
  activeProjects: -1
});

export default mongoose.models.Location || 
       mongoose.model('Location', LocationSchema);
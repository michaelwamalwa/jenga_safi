import mongoose from 'mongoose';

const SuggestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { 
    type: String,
    enum: ['material', 'energy', 'waste', 'water', 'logistics'],
    required: true
  },
  impactScore: { type: Number, min: 1, max: 10, required: true },
  carbonReduction: { type: Number }, // kg CO2/day
  implementationCost: { type: String, enum: ['low', 'medium', 'high'] },
  activeProjects: { type: Number, default: 0 }
}, { timestamps: true });

const ProjectLeaderboardSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  name: { type: String, required: true },
  sustainabilityScore: { type: Number, min: 0, max: 100 },
  implementedSuggestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Suggestion' }],
  lastUpdated: { type: Date, default: Date.now }
});

const ConstructionSustainabilitySchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  metrics: {
    carbonFootprint: { type: Number }, // tons/month
    energyConsumption: { type: Number }, // kWh/month
    wasteRecycled: { type: Number }, // percentage
    waterSaved: { type: Number } // liters/month
  },
  suggestions: [SuggestionSchema],
  leaderboard: [ProjectLeaderboardSchema],
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for fast queries
ConstructionSustainabilitySchema.index({ organizationId: 1 });
ConstructionSustainabilitySchema.index({ 'metrics.carbonFootprint': 1 });
ConstructionSustainabilitySchema.index({ updatedAt: -1 });

export default mongoose.models.ConstructionSustainability || 
       mongoose.model('ConstructionSustainability', ConstructionSustainabilitySchema);
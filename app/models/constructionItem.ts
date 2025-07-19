import mongoose, { Schema, model, models } from 'mongoose';

const ConstructionItemSchema = new Schema({
  type: {
    type: String,
    enum: ['suggestion', 'leaderboard', 'impact'],
    required: true,
  },
  // Shared fields
  createdAt: { type: Date, default: Date.now },

  // For type = 'suggestion'
  text: String,
  ecoPoints: Number,
  activeSince: String,
  applied: Boolean,

  // For type = 'leaderboard'
  name: String,
  points: Number,
  progress: Number,

  // For type = 'impact'
  label: String,
  value: String,
  icon: String, // e.g. 'Recycle', 'Factory'
});

export const ConstructionItem =
  models.ConstructionItem || model('ConstructionItem', ConstructionItemSchema);

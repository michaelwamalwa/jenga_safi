import mongoose, { Schema, models, model } from 'mongoose';

const SuggestionSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g. "energy", "waste"
  impact: { type: String, required: true },   // e.g. "Reduce emissions by 35%"
  time: { type: String, required: true },     // e.g. "Planning phase"
  createdAt: { type: Date, default: Date.now }
});

export const Suggestion = models.Suggestion || model('Suggestion', SuggestionSchema);

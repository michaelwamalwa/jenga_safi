// models/ConstructionSite.js
import mongoose from 'mongoose';

const ConstructionSiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'warning'],
    default: 'online'
  },
  sensorCount: {
    type: Number,
    default: 0
  },
  nemaCompliance: {
    score: Number,
    status: {
      type: String,
      enum: ['compliant', 'warning', 'non-compliant'],
      default: 'compliant'
    },
    lastInspection: Date,
    nextInspection: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ConstructionSite', ConstructionSiteSchema);
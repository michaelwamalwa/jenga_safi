// models/Alert.js
const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConstructionSite',
    required: true
  },
  type: {
    type: String,
    enum: ['critical', 'warning', 'info', 'offline'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  value: Number,
  threshold: Number,
  metric: String,
  acknowledged: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', AlertSchema);
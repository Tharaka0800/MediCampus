const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  reportedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  type:        { type: String, enum: ['medical','injury','mental-health','other'], required: true },
  severity:    { type: String, enum: ['low','medium','high','critical'], required: true },
  location: {
    lat:         { type: Number },
    lng:         { type: Number },
    description: { type: String }
  },
  description: { type: String, required: true },
  status:      { type: String, enum: ['reported','dispatched','resolved'], default: 'reported' },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  responseTime: { type: Number }, // minutes
  resolvedAt:  { type: Date },
  notes:       { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Emergency', EmergencySchema);

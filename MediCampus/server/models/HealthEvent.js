const mongoose = require('mongoose');
const crypto = require('crypto');

const RegistrationSchema = new mongoose.Schema({
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  registeredAt: { type: Date, default: Date.now },
  attended:     { type: Boolean, default: false },
  qrToken:      { type: String }
});

const HealthEventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  type:        { type: String, enum: ['blood-drive','health-camp','vaccination','workshop'], required: true },
  date:        { type: Date, required: true },
  endDate:     { type: Date },
  location:    { type: String, required: true },
  description: { type: String },
  eligibilityCriteria: {
    minAge:       { type: Number },
    bloodTypes:   [{ type: String }],
    noConditions: [{ type: String }]   // Students with these conditions cannot participate
  },
  maxParticipants: { type: Number, default: 100 },
  registrations:   [RegistrationSchema],
  organizer:       { type: String },
  status:          { type: String, enum: ['upcoming','active','completed','cancelled'], default: 'upcoming' },
  analytics: {
    registered:  { type: Number, default: 0 },
    attended:    { type: Number, default: 0 },
    turnoutRate: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Generate unique QR token for each registration
HealthEventSchema.methods.generateRegistrationQR = function(studentId) {
  return 'EVT-' + crypto.randomBytes(6).toString('hex').toUpperCase() + '-' + studentId.toString().slice(-4);
};

module.exports = mongoose.model('HealthEvent', HealthEventSchema);

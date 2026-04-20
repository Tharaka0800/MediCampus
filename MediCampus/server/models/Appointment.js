const mongoose = require('mongoose');
const crypto = require('crypto');

const AppointmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  doctorId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date:      { type: Date, required: true },
  timeSlot:  { type: String, required: true }, // e.g. "09:00-09:30"
  status:    { type: String, enum: ['booked','confirmed','cancelled','completed'], default: 'booked' },
  qrCode:    { type: String, unique: true },
  queueNumber:   { type: Number },
  arrivalStatus: { type: String, enum: ['not-arrived','arrived','late','served'], default: 'not-arrived' },
  isEmergency:   { type: Boolean, default: false },
  reason:    { type: String },
  notes:     { type: String }
}, { timestamps: true });

// Auto-generate unique QR code token before save
AppointmentSchema.pre('save', function() {
  if (!this.qrCode) {
    this.qrCode = 'APT-' + crypto.randomBytes(8).toString('hex').toUpperCase();
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);

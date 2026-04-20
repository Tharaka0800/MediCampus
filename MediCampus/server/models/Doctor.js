const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  specialization: { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  room:           { type: String },
  availableSlots: [{
    day:       { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] },
    startTime: { type: String },
    endTime:   { type: String }
  }],
  maxPatientsPerSlot: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);

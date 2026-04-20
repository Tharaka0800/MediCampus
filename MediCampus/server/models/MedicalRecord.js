const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  doctorId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  diagnosis: {
    symptoms:  [{ type: String }],
    condition: { type: String, required: true },
    severity:  { type: String, enum: ['mild','moderate','severe','critical'], default: 'mild' },
    notes:     { type: String }
  },
  prescription: [{
    medication: { type: String, required: true },
    dosage:     { type: String },
    frequency:  { type: String },
    duration:   { type: String }
  }],
  isLocked: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);

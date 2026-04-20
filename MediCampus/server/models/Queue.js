const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  tokenNumber:   { type: Number, required: true },
  status:        { type: String, enum: ['waiting','in-consultation','completed','skipped'], default: 'waiting' },
  priority:      { type: String, enum: ['normal','emergency'], default: 'normal' },
  checkInTime:   { type: Date },
  estimatedWaitMinutes: { type: Number, default: 0 },
  date:          { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Queue', QueueSchema);

import mongoose from 'mongoose';

const medicalSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  examName: {
    type: String,
    required: true,
  },
  examDate: {
    type: Date,
    required: true,
  },
  illness: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  diagnosis: {
    type: String,
  },
  validFrom: {
    type: Date,
  },
  validTo: {
    type: Date,
  },
  certificateId: {
    type: String,
    unique: true,
    sparse: true,
  },
  qrCode: {
    type: String, // Stores base64 data URI of the QR code image
  },
}, { timestamps: true });

export default mongoose.model('Medical', medicalSchema);

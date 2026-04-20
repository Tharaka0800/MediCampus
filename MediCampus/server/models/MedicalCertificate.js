const mongoose = require('mongoose');
const crypto = require('crypto');

const MedicalCertificateSchema = new mongoose.Schema({
  studentId:       { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  doctorId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  recordId:        { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' },
  certificateType: { type: String, enum: ['medical-leave','exam-medical'], required: true },
  verificationHash:{ type: String, unique: true },
  qrCodeData:      { type: String },
  validFrom:       { type: Date, required: true },
  validTo:         { type: Date, required: true },
  reason:          { type: String, required: true },
  isVerified:      { type: Boolean, default: true }
}, { timestamps: true });

// Auto-generate verification hash before save
MedicalCertificateSchema.pre('save', function() {
  if (!this.verificationHash) {
    const data = `${this.studentId}-${this.doctorId}-${this.validFrom}-${Date.now()}`;
    this.verificationHash = crypto.createHash('sha256').update(data).digest('hex').substring(0, 16).toUpperCase();
    this.qrCodeData = `https://medicampus.edu/verify/${this.verificationHash}`;
  }
});

module.exports = mongoose.model('MedicalCertificate', MedicalCertificateSchema);

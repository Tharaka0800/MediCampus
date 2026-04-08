const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
    // Personal Details (as per SLIIT ID)
    studentName: {
        type: String,
        required: true 
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true 
    },
    faculty: {
        type: String
    },
    year: {
        type: String
    },
    bloodType: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    personalPhone: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String
    },

    // Health Awareness Data
    allergies: {
        type: String,
        default: "None" 
    },
    chronicIllnesses: {
        type: String,
        default: "None" 
    },
    ongoingTreatments: {
        type: String,
        default: "None"
    },

    // Mandatory Emergency Contact (Business Rule)
    emergencyContact: {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phoneNumber: { type: String, required: true }
    },

    // Integration with Doctor's Module
    medicalHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord' // Links to the records created by the doctor
    }],

    // Logic Control
    isProfileComplete: {
        type: Boolean,
        default: false 
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
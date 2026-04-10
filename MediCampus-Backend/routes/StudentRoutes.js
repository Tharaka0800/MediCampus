const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');

// ========================
// Existing / Legacy Routes
// ========================

// POST: Create or Update Student Profile (Legacy/Upsert)
router.post('/update-profile', async (req, res) => {
    try {
        const { 
            studentName, 
            registrationNumber, 
            faculty, 
            year, 
            bloodType, 
            dateOfBirth, 
            personalPhone, 
            allergies, 
            chronicIllnesses, 
            emergencyContact 
        } = req.body;

        // Business Rule: Check if mandatory emergency contact is provided
        if (!emergencyContact || !emergencyContact.phoneNumber || !emergencyContact.name) {
            return res.status(400).json({ message: "Emergency contact details are mandatory." });
        }

        // Find existing profile or create a new one
        let profile = await StudentProfile.findOneAndUpdate(
            { registrationNumber },
            { 
                studentName,
                faculty,
                year,
                bloodType,
                dateOfBirth,
                personalPhone,
                allergies, 
                chronicIllnesses, 
                emergencyContact,
                isProfileComplete: true // Marks profile as complete
            },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "Profile updated successfully!", profile });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// POST: Student Login
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        
        if (!identifier || !password) {
            return res.status(400).json({ message: "Student ID/Email and password are required." });
        }

        // Find student by email or registrationNumber
        const student = await StudentProfile.findOne({
            $or: [{ email: identifier }, { registrationNumber: identifier }]
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Direct password comparison for simplicity (should use bcrypt in production)
        if (student.password !== password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        res.status(200).json({ message: "Login successful", studentId: student._id });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ========================
// Standard CRUD Routes
// ========================

// CREATE: POST /api/student
router.post('/', async (req, res) => {
    try {
        const profileData = req.body;

        // Basic validation
        if (!profileData.registrationNumber || !profileData.studentName) {
            return res.status(400).json({ message: "Student name and registration number are required." });
        }

        // Check if student already exists
        const existingStudent = await StudentProfile.findOne({ registrationNumber: profileData.registrationNumber });
        if (existingStudent) {
            return res.status(400).json({ message: "Student profile with this registration number already exists." });
        }

        const newProfile = new StudentProfile(profileData);
        await newProfile.save();

        res.status(201).json({ message: "Student profile created successfully", profile: newProfile });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// READ: GET /api/student/:identifier
router.get('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        const student = await StudentProfile.findOne({
            $or: [
                { email: identifier }, 
                { registrationNumber: identifier }, 
                ...(isObjectId ? [{ _id: identifier }] : [])
            ]
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json({ profile: student });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// UPDATE: PUT /api/student/:identifier
router.put('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        const updateData = req.body;
        
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        const student = await StudentProfile.findOneAndUpdate(
            { 
                $or: [
                    { email: identifier }, 
                    { registrationNumber: identifier }, 
                    ...(isObjectId ? [{ _id: identifier }] : [])
                ] 
            },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json({ message: "Profile updated successfully", profile: student });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// DELETE: DELETE /api/student/:identifier
router.delete('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        const student = await StudentProfile.findOneAndDelete({
            $or: [
                { email: identifier }, 
                { registrationNumber: identifier }, 
                ...(isObjectId ? [{ _id: identifier }] : [])
            ]
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json({ message: "Student profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
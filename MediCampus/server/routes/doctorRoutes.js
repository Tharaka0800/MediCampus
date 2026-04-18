const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// POST: Doctor Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

        const doctor = await Doctor.findOne({ email });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });
        if (doctor.password !== password) return res.status(401).json({ message: 'Invalid credentials.' });

        res.status(200).json({ message: 'Login successful', doctor: { _id: doctor._id, name: doctor.name, specialization: doctor.specialization, room: doctor.room } });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// POST: Create Doctor
router.post('/', async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json({ message: 'Doctor created', doctor });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: All Doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find({ isActive: true }).select('-password');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Single Doctor
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select('-password');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT: Update Availability
router.put('/:id/availability', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { availableSlots: req.body.availableSlots, maxPatientsPerSlot: req.body.maxPatientsPerSlot },
            { new: true }
        );
        if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });
        res.status(200).json({ message: 'Availability updated', doctor });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;

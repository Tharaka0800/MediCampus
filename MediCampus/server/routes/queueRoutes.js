const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const Appointment = require('../models/Appointment');

// GET: Live queue for a doctor
router.get('/live/:doctorId', async (req, res) => {
    try {
        const today = new Date(); today.setHours(0,0,0,0);
        const queue = await Queue.find({
            doctorId: req.params.doctorId,
            date: { $gte: today },
            status: { $in: ['waiting', 'in-consultation'] }
        })
        .populate('studentId', 'studentName registrationNumber')
        .sort({ priority: -1, tokenNumber: 1 }); // Emergency first

        res.status(200).json(queue);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Public queue display (all doctors)
router.get('/public', async (req, res) => {
    try {
        const Doctor = require('../models/Doctor');
        const doctors = await Doctor.find({ isActive: true });
        
        const today = new Date(); today.setHours(0,0,0,0);
        const queue = await Queue.find({
            date: { $gte: today },
            status: { $in: ['waiting', 'in-consultation'] }
        })
        .populate('doctorId', 'name specialization room')
        .populate('studentId', 'studentName')
        .sort({ doctorId: 1, priority: -1, tokenNumber: 1 });

        // Group by doctor
        const grouped = {};
        
        // Initialize all active doctors so they always show on the board
        doctors.forEach(d => {
            grouped[d._id.toString()] = {
                doctor: {
                    _id: d._id,
                    name: d.name,
                    specialization: d.specialization,
                    room: d.room
                },
                currentToken: null,
                waitingCount: 0,
                queue: []
            };
        });

        queue.forEach(q => {
            const dId = q.doctorId?._id?.toString();
            if (grouped[dId]) {
                if (q.status === 'in-consultation') grouped[dId].currentToken = q.tokenNumber;
                if (q.status === 'waiting') grouped[dId].waitingCount++;
                grouped[dId].queue.push(q);
            }
        });

        res.status(200).json(Object.values(grouped));
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT: Move to next patient (complete current, start next)
router.put('/:id/next', async (req, res) => {
    try {
        // Complete current
        const current = await Queue.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
        if (!current) return res.status(404).json({ message: 'Queue entry not found.' });

        // Complete appointment too
        await Appointment.findByIdAndUpdate(current.appointmentId, { status: 'completed', arrivalStatus: 'served' });

        // Find next waiting patient for same doctor
        const today = new Date(); today.setHours(0,0,0,0);
        const next = await Queue.findOneAndUpdate(
            { doctorId: current.doctorId, date: { $gte: today }, status: 'waiting' },
            { status: 'in-consultation' },
            { new: true, sort: { priority: -1, tokenNumber: 1 } }
        ).populate('studentId', 'studentName registrationNumber');

        res.status(200).json({ message: 'Patient served', completed: current, next: next || null });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT: Emergency Override — push to front
router.put('/:id/emergency-override', async (req, res) => {
    try {
        const entry = await Queue.findByIdAndUpdate(req.params.id, { priority: 'emergency' }, { new: true });
        if (!entry) return res.status(404).json({ message: 'Queue entry not found.' });

        // Also flag the appointment
        await Appointment.findByIdAndUpdate(entry.appointmentId, { isEmergency: true });

        res.status(200).json({ message: 'Emergency override applied', entry });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT: Skip late arrival
router.put('/:id/skip', async (req, res) => {
    try {
        const entry = await Queue.findByIdAndUpdate(req.params.id, { status: 'skipped' }, { new: true });
        if (!entry) return res.status(404).json({ message: 'Queue entry not found.' });
        res.status(200).json({ message: 'Patient skipped', entry });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Search queue by student name/ID
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: 'Search query required.' });

        const today = new Date(); today.setHours(0,0,0,0);
        const results = await Queue.find({ date: { $gte: today } })
            .populate('studentId', 'studentName registrationNumber')
            .populate('doctorId', 'name room');

        const filtered = results.filter(q => {
            const name = q.studentId?.studentName?.toLowerCase() || '';
            const regNum = q.studentId?.registrationNumber?.toLowerCase() || '';
            return name.includes(query.toLowerCase()) || regNum.includes(query.toLowerCase());
        });

        res.status(200).json(filtered);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;

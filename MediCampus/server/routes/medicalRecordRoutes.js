const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const StudentProfile = require('../models/StudentProfile');

// POST: Create Medical Record (Doctor only — auto-locks)
router.post('/', async (req, res) => {
    try {
        const { studentId, doctorId, appointmentId, diagnosis, prescription } = req.body;

        const record = new MedicalRecord({
            studentId, doctorId, appointmentId,
            diagnosis, prescription,
            isLocked: true // Locked on creation
        });
        await record.save();

        // Link to student's medical history
        await StudentProfile.findByIdAndUpdate(studentId, {
            $push: { medicalHistory: record._id }
        });

        res.status(201).json({ message: 'Medical record created', record });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Student's Records (read-only for students)
router.get('/student/:studentId', async (req, res) => {
    try {
        const records = await MedicalRecord.find({ studentId: req.params.studentId })
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Doctor's Records
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const records = await MedicalRecord.find({ doctorId: req.params.doctorId })
            .populate('studentId', 'studentName registrationNumber')
            .sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Single Record
router.get('/:id', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id)
            .populate('doctorId', 'name specialization')
            .populate('studentId', 'studentName registrationNumber bloodType allergies');
        if (!record) return res.status(404).json({ message: 'Record not found.' });
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Search records (by date, diagnosis, symptom)
router.get('/search/query', async (req, res) => {
    try {
        const { q, doctorId, studentId } = req.query;
        const filter = {};
        if (doctorId) filter.doctorId = doctorId;
        if (studentId) filter.studentId = studentId;

        let records = await MedicalRecord.find(filter)
            .populate('doctorId', 'name specialization')
            .populate('studentId', 'studentName registrationNumber')
            .sort({ createdAt: -1 });

        if (q) {
            const query = q.toLowerCase();
            records = records.filter(r => {
                const condition = (r.diagnosis?.condition || '').toLowerCase();
                const symptoms = (r.diagnosis?.symptoms || []).join(' ').toLowerCase();
                const date = r.createdAt?.toISOString()?.split('T')[0] || '';
                return condition.includes(query) || symptoms.includes(query) || date.includes(query);
            });
        }

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;

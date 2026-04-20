const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');

// POST: One-click Emergency Alert
router.post('/', async (req, res) => {
    try {
        const { reportedBy, type, severity, location, description } = req.body;
        const emergency = new Emergency({ reportedBy, type, severity: severity || 'high', location, description });
        await emergency.save();
        res.status(201).json({ message: 'Emergency alert sent! Help is on the way.', emergency });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Active Incidents
router.get('/active', async (req, res) => {
    try {
        const incidents = await Emergency.find({ status: { $in: ['reported', 'dispatched'] } })
            .populate('reportedBy', 'studentName registrationNumber bloodType allergies')
            .populate('assignedTo', 'name specialization')
            .sort({ severity: -1, createdAt: -1 });
        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT: Dispatch Doctor
router.put('/:id/dispatch', async (req, res) => {
    try {
        const { doctorId } = req.body;
        const emergency = await Emergency.findByIdAndUpdate(req.params.id, {
            status: 'dispatched',
            assignedTo: doctorId
        }, { new: true }).populate('assignedTo', 'name');

        if (!emergency) return res.status(404).json({ message: 'Emergency not found.' });
        res.status(200).json({ message: 'Doctor dispatched', emergency });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT: Resolve Incident
router.put('/:id/resolve', async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id);
        if (!emergency) return res.status(404).json({ message: 'Emergency not found.' });

        const responseTime = Math.round((Date.now() - emergency.createdAt.getTime()) / 60000);
        emergency.status = 'resolved';
        emergency.resolvedAt = new Date();
        emergency.responseTime = responseTime;
        emergency.notes = req.body.notes || '';
        await emergency.save();

        res.status(200).json({ message: 'Emergency resolved', emergency });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Search Past Incidents
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        let incidents = await Emergency.find()
            .populate('reportedBy', 'studentName registrationNumber')
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 });

        if (query) {
            const q = query.toLowerCase();
            incidents = incidents.filter(i => {
                return (i.type || '').toLowerCase().includes(q) ||
                       (i.description || '').toLowerCase().includes(q) ||
                       (i.reportedBy?.studentName || '').toLowerCase().includes(q) ||
                       (i.status || '').toLowerCase().includes(q);
            });
        }

        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: All incidents (for analytics)
router.get('/', async (req, res) => {
    try {
        const incidents = await Emergency.find()
            .populate('reportedBy', 'studentName')
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;

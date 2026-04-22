const express = require('express');
const router = express.Router();
const HealthEvent = require('../models/HealthEvent');
const StudentProfile = require('../models/StudentProfile');

// POST: Create Event
router.post('/', async (req, res) => {
    try {
        const event = new HealthEvent(req.body);
        await event.save();
        res.status(201).json({ message: 'Event created', event });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: List Events
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const events = await HealthEvent.find(filter).sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Student's registered events (MUST be before /:id to avoid Express matching "student" as an id)
router.get('/student/:studentId', async (req, res) => {
    try {
        const events = await HealthEvent.find({ 'registrations.studentId': req.params.studentId }).sort({ date: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Single Event
router.get('/:id', async (req, res) => {
    try {
        const event = await HealthEvent.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found.' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT: Update Event
router.put('/:id', async (req, res) => {
    try {
        const event = await HealthEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found.' });
        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// DELETE: Delete Event
router.delete('/:id', async (req, res) => {
    try {
        const event = await HealthEvent.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found.' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// POST: Register for Event
router.post('/:id/register', async (req, res) => {
    try {
        const { studentId } = req.body;
        const event = await HealthEvent.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found.' });

        // Business Rule: Prevent duplicate registration
        const alreadyRegistered = event.registrations.find(r => r.studentId.toString() === studentId);
        if (alreadyRegistered) return res.status(400).json({ message: 'Already registered for this event.' });

        // Business Rule: Check max participants
        if (event.registrations.length >= event.maxParticipants) {
            return res.status(400).json({ message: 'Event is full.' });
        }

        // Business Rule: Check eligibility
        const student = await StudentProfile.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found.' });

        if (event.eligibilityCriteria) {
            const { noConditions, bloodTypes } = event.eligibilityCriteria;
            if (noConditions && noConditions.length > 0) {
                const studentConditions = (student.chronicIllnesses || '').toLowerCase();
                for (const cond of noConditions) {
                    if (studentConditions.includes(cond.toLowerCase())) {
                        return res.status(400).json({ message: `Not eligible: ${cond} is a disqualifying condition for this event.` });
                    }
                }
            }
            if (bloodTypes && bloodTypes.length > 0 && !bloodTypes.includes(student.bloodType)) {
                return res.status(400).json({ message: `Not eligible: Blood type ${student.bloodType} is not accepted for this event.` });
            }
        }

        const qrToken = event.generateRegistrationQR(studentId);
        event.registrations.push({ studentId, qrToken });
        event.analytics.registered = event.registrations.length;
        await event.save();

        res.status(200).json({ message: 'Registration successful', qrToken });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// POST: QR Check-in at Event
router.post('/:id/checkin', async (req, res) => {
    try {
        const { qrToken } = req.body;
        const event = await HealthEvent.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found.' });

        const reg = event.registrations.find(r => r.qrToken === qrToken);
        if (!reg) return res.status(404).json({ message: 'Invalid QR token.' });
        if (reg.attended) return res.status(400).json({ message: 'Already checked in.' });

        reg.attended = true;
        event.analytics.attended = event.registrations.filter(r => r.attended).length;
        event.analytics.turnoutRate = Math.round((event.analytics.attended / event.analytics.registered) * 100);
        await event.save();

        res.status(200).json({ message: 'Check-in successful', analytics: event.analytics });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Event Analytics
router.get('/:id/analytics', async (req, res) => {
    try {
        const event = await HealthEvent.findById(req.params.id).select('title analytics registrations');
        if (!event) return res.status(404).json({ message: 'Event not found.' });
        res.status(200).json({
            title: event.title,
            analytics: event.analytics,
            totalRegistrations: event.registrations.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;

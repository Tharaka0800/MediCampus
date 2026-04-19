const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Queue = require('../models/Queue');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');

// Helper: safely create notifications without crashing the booking
const tryCreateNotifications = async (studentId, timeSlot, date) => {
    try {
        const apptDate = new Date(date);
        const reminder24h = new Date(apptDate.getTime() - 24 * 60 * 60 * 1000);
        const reminder1h  = new Date(apptDate.getTime() - 60 * 60 * 1000);

        await Notification.create([
            {
                studentId,
                message: `Reminder: You have an appointment tomorrow at ${timeSlot}.`,
                type: 'Reminder',
                scheduledFor: reminder24h
            },
            {
                studentId,
                message: `Reminder: Your appointment is in 1 hour at ${timeSlot}.`,
                type: 'Reminder',
                scheduledFor: reminder1h
            }
        ]);
    } catch (err) {
        // Log but don't crash — notifications are non-critical
        console.warn('Notification creation skipped:', err.message);
    }
};

// Helper: auto-add to queue after booking
const tryAddToQueue = async (appointment) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayCount = await Queue.countDocuments({
            doctorId: appointment.doctorId,
            date: { $gte: todayStart }
        });

        // Only add to queue if appointment is today
        const apptDateStr = new Date(appointment.date).toDateString();
        const todayStr = new Date().toDateString();
        if (apptDateStr !== todayStr) return; // Future appointments — skip queue

        const queueEntry = new Queue({
            appointmentId: appointment._id,
            doctorId: appointment.doctorId,
            studentId: appointment.studentId,
            tokenNumber: todayCount + 1,
            priority: appointment.isEmergency ? 'emergency' : 'normal',
            checkInTime: new Date(),
            estimatedWaitMinutes: todayCount * 15,
            date: new Date()
        });
        await queueEntry.save();
        console.log('Auto-added to queue: token', queueEntry.tokenNumber);
    } catch (err) {
        console.warn('Auto queue add skipped:', err.message);
    }
};

// POST: Book Appointment
router.post('/', async (req, res) => {
    try {
        const { studentId, doctorId, date, timeSlot, reason, isEmergency } = req.body;

        if (!studentId || !doctorId || !date || !timeSlot) {
            return res.status(400).json({ message: 'studentId, doctorId, date, and timeSlot are required.' });
        }

        // Check profile completion
        const student = await StudentProfile.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found.' });
        if (!student.isProfileComplete) {
            return res.status(400).json({ message: 'Please complete your health profile before booking.' });
        }

        // Check max patients per slot
        const existingCount = await Appointment.countDocuments({
            doctorId,
            date: new Date(date),
            timeSlot,
            status: { $nin: ['cancelled'] }
        });
        if (existingCount >= 10) {
            return res.status(400).json({ message: 'This time slot is full. Please choose another.' });
        }

        // Prevent duplicate booking same doctor same day
        const duplicate = await Appointment.findOne({
            studentId,
            doctorId,
            date: new Date(date),
            status: { $nin: ['cancelled'] }
        });
        if (duplicate) {
            return res.status(400).json({ message: 'You already have an appointment with this doctor on this date.' });
        }

        // Create appointment
        const appointment = new Appointment({
            studentId,
            doctorId,
            date: new Date(date),
            timeSlot,
            reason: reason || '',
            isEmergency: isEmergency || false
        });
        await appointment.save();

        // Non-critical side effects (won't crash booking if they fail)
        await tryCreateNotifications(studentId, timeSlot, date);
        await tryAddToQueue(appointment);

        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Student's Appointments
router.get('/student/:studentId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ studentId: req.params.studentId })
            .populate('doctorId', 'name specialization room')
            .sort({ date: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Doctor's Appointments (no date filter by default)
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const { date } = req.query;
        const query = { doctorId: req.params.doctorId };
        if (date) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            const next = new Date(d);
            next.setDate(next.getDate() + 1);
            query.date = { $gte: d, $lt: next };
        }
        const appointments = await Appointment.find(query)
            .populate('studentId', 'studentName registrationNumber bloodType allergies chronicIllnesses')
            .sort({ date: 1, timeSlot: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT: Cancel Appointment
router.put('/:id/cancel', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );
        if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
        res.status(200).json({ message: 'Appointment cancelled', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT: Reschedule Appointment
router.put('/:id/reschedule', async (req, res) => {
    try {
        const { date, timeSlot } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { date: new Date(date), timeSlot, status: 'booked' },
            { new: true }
        );
        if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
        res.status(200).json({ message: 'Appointment rescheduled', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// POST: QR Check-in by appointment ID
router.post('/:id/checkin', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
        if (appointment.arrivalStatus !== 'not-arrived') {
            return res.status(400).json({ message: 'Already checked in.' });
        }

        // Late arrival check
        const now = new Date();
        const [slotStart] = appointment.timeSlot.split('-');
        const [h, m] = slotStart.split(':').map(Number);
        const slotTime = new Date(appointment.date);
        slotTime.setHours(h, m, 0, 0);
        const isLate = now > new Date(slotTime.getTime() + 15 * 60 * 1000);

        appointment.arrivalStatus = isLate ? 'late' : 'arrived';
        appointment.status = 'confirmed';
        await appointment.save();

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayCount = await Queue.countDocuments({
            doctorId: appointment.doctorId,
            date: { $gte: todayStart }
        });

        const queueEntry = new Queue({
            appointmentId: appointment._id,
            doctorId: appointment.doctorId,
            studentId: appointment.studentId,
            tokenNumber: todayCount + 1,
            priority: appointment.isEmergency ? 'emergency' : 'normal',
            checkInTime: now,
            estimatedWaitMinutes: todayCount * 15,
            date: new Date()
        });
        await queueEntry.save();

        res.status(200).json({
            message: isLate ? 'Checked in (Late — moved to end of queue)' : 'Checked in successfully',
            appointment,
            queueEntry
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// POST: Check-in by QR Code string
router.post('/checkin-qr', async (req, res) => {
    try {
        const { qrCode } = req.body;
        const appointment = await Appointment.findOne({ qrCode });
        if (!appointment) return res.status(404).json({ message: 'Invalid QR code.' });
        if (appointment.arrivalStatus !== 'not-arrived') {
            return res.status(400).json({ message: 'Already checked in.' });
        }

        appointment.arrivalStatus = 'arrived';
        appointment.status = 'confirmed';
        await appointment.save();

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayCount = await Queue.countDocuments({
            doctorId: appointment.doctorId,
            date: { $gte: todayStart }
        });

        const queueEntry = new Queue({
            appointmentId: appointment._id,
            doctorId: appointment.doctorId,
            studentId: appointment.studentId,
            tokenNumber: todayCount + 1,
            priority: appointment.isEmergency ? 'emergency' : 'normal',
            checkInTime: new Date(),
            estimatedWaitMinutes: todayCount * 15,
            date: new Date()
        });
        await queueEntry.save();

        res.status(200).json({ message: 'QR Check-in successful', appointment, queueEntry });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
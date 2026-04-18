const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// POST: Create a new notification for a student
router.post('/send', async (req, res) => {
    try {
        const { studentId, message, type, category, scheduledFor, metadata } = req.body;

        const newNotification = new Notification({
            studentId,
            message,
            type,       // Can be 'Reminder', 'Alert', or 'Emergency'
            category,   // appointment-reminder, medication-refill, health-alert, event, emergency, general
            scheduledFor,
            metadata
        });

        await newNotification.save();
        res.status(201).json({ message: "Notification sent successfully!", newNotification });
    } catch (error) {
        res.status(500).json({ message: "Error sending notification", error: error.message });
    }
});

// GET: Fetch all notifications for a specific student
router.get('/:studentId', async (req, res) => {
    try {
        const notifications = await Notification.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
});

// GET: Search notifications
router.get('/:studentId/search', async (req, res) => {
    try {
        const { query, category } = req.query;
        const filter = { studentId: req.params.studentId };
        if (category) filter.category = category;

        let notifications = await Notification.find(filter).sort({ createdAt: -1 });

        if (query) {
            const q = query.toLowerCase();
            notifications = notifications.filter(n => n.message.toLowerCase().includes(q));
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error searching notifications", error: error.message });
    }
});

// PUT: Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!notification) return res.status(404).json({ message: 'Notification not found.' });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error: error.message });
    }
});

// POST: Schedule timed reminders
router.post('/schedule', async (req, res) => {
    try {
        const { studentId, message, type, scheduledFor } = req.body;
        const notification = new Notification({
            studentId, message, type: type || 'Reminder',
            category: 'appointment-reminder',
            scheduledFor: new Date(scheduledFor)
        });
        await notification.save();
        res.status(201).json({ message: 'Reminder scheduled', notification });
    } catch (error) {
        res.status(500).json({ message: "Error scheduling reminder", error: error.message });
    }
});

module.exports = router;
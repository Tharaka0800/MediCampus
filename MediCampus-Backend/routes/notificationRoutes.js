const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// POST: Create a new notification for a student
router.post('/send', async (req, res) => {
    try {
        const { studentId, message, type } = req.body;

        const newNotification = new Notification({
            studentId,
            message,
            type // Can be 'Reminder', 'Alert', or 'Emergency'
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

module.exports = router;
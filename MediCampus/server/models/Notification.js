const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    studentId: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['Reminder', 'Alert', 'Emergency'], 
        default: 'Reminder' 
    },
    category: {
        type: String,
        enum: ['appointment-reminder', 'medication-refill', 'health-alert', 'event', 'emergency', 'general'],
        default: 'general'
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
    scheduledFor: {
        type: Date  // For timed reminders (24h / 1h before appointment)
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed // Flexible JSON for linked resources
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);
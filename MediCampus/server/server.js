require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Route Imports
const StudentRoutes       = require('./routes/StudentRoutes');
const notificationRoutes  = require('./routes/notificationRoutes');
const adminRoutes         = require('./routes/adminRoutes');
const doctorRoutes        = require('./routes/doctorRoutes');
const appointmentRoutes   = require('./routes/appointmentRoutes');
const queueRoutes         = require('./routes/queueRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const certificateRoutes   = require('./routes/certificateRoutes');
const eventRoutes         = require('./routes/eventRoutes');
const emergencyRoutes     = require('./routes/emergencyRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/student',       StudentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/doctors',       doctorRoutes);
app.use('/api/appointments',  appointmentRoutes);
app.use('/api/queue',         queueRoutes);
app.use('/api/records',       medicalRecordRoutes);
app.use('/api/certificates',  certificateRoutes);
app.use('/api/events',        eventRoutes);
app.use('/api/emergency',     emergencyRoutes);

// Catch-all route to serve the frontend login page
// Use regex to avoid path-to-regexp named parameter conflict with '*' patterns.
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

//  connect Database  (non-blocking)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ Connection Error: ", err));
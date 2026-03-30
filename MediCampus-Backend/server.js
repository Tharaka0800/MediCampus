require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const StudentRoutes = require('./routes/StudentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/student', StudentRoutes);

// Catch-all route to serve the frontend login page
// Use regex to avoid path-to-regexp named parameter conflict with '*' patterns.
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// Database එකට සම්බන්ධ වීම (non-blocking)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ Connection Error: ", err));
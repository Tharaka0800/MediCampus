const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// POST: Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: 'Admin not found.' });
        if (admin.password !== password) return res.status(401).json({ message: 'Invalid credentials.' });

        res.status(200).json({ message: 'Login successful', admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// POST: Create Admin
router.post('/', async (req, res) => {
    try {
        const admin = new Admin(req.body);
        await admin.save();
        res.status(201).json({ message: 'Admin created', admin });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: All Admins
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;

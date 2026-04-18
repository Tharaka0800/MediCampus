const express = require('express');
const router = express.Router();
const MedicalCertificate = require('../models/MedicalCertificate');

// POST: Generate Medical Certificate
router.post('/', async (req, res) => {
    try {
        const { studentId, doctorId, recordId, certificateType, validFrom, validTo, reason } = req.body;

        const certificate = new MedicalCertificate({
            studentId, doctorId, recordId,
            certificateType, validFrom: new Date(validFrom), validTo: new Date(validTo), reason
        });
        await certificate.save();

        res.status(201).json({ message: 'Certificate generated', certificate });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Student's Certificates
router.get('/student/:studentId', async (req, res) => {
    try {
        const certs = await MedicalCertificate.find({ studentId: req.params.studentId })
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 });
        res.status(200).json(certs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Public Verification
router.get('/verify/:hash', async (req, res) => {
    try {
        const cert = await MedicalCertificate.findOne({ verificationHash: req.params.hash })
            .populate('studentId', 'studentName registrationNumber faculty')
            .populate('doctorId', 'name specialization');

        if (!cert) return res.status(404).json({ message: 'Certificate not found. Invalid verification code.', verified: false });

        res.status(200).json({
            verified: true,
            certificate: {
                studentName: cert.studentId?.studentName,
                registrationNumber: cert.studentId?.registrationNumber,
                faculty: cert.studentId?.faculty,
                doctorName: cert.doctorId?.name,
                specialization: cert.doctorId?.specialization,
                certificateType: cert.certificateType,
                reason: cert.reason,
                validFrom: cert.validFrom,
                validTo: cert.validTo,
                issuedOn: cert.createdAt,
                verificationHash: cert.verificationHash
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET: Single Certificate (for download data)
router.get('/:id', async (req, res) => {
    try {
        const cert = await MedicalCertificate.findById(req.params.id)
            .populate('studentId', 'studentName registrationNumber faculty')
            .populate('doctorId', 'name specialization');
        if (!cert) return res.status(404).json({ message: 'Certificate not found.' });
        res.status(200).json(cert);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;

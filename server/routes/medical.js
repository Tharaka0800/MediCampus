import express from 'express';
import {
  applyMedical,
  getStudentApplications,
  getDoctorPending,
  approveApplication,
  rejectApplication,
  verifyCertificate,
  downloadCertificate
} from '../controllers/medical.js';

const router = express.Router();

// Student endpoints
router.post('/apply', applyMedical);
router.get('/student/:studentId', getStudentApplications);
router.get('/download/:id', downloadCertificate);

// Doctor endpoints
router.get('/doctor/:doctorId', getDoctorPending);
router.put('/approve/:id', approveApplication);
router.put('/reject/:id', rejectApplication);

// Public/Admin endpoints
router.get('/verify/:certificateId', verifyCertificate);

export default router;

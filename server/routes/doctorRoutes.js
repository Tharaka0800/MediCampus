import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAppointments,
  updateDoctorAvailability
} from '../controllers/doctorController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no auth required)
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected routes (admin only)
router.use(authenticateToken);
router.use(requireAdmin);

router.post('/', createDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);
router.get('/:id/appointments', getDoctorAppointments);
router.put('/:id/availability', updateDoctorAvailability);

export default router;
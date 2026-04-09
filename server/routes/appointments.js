import express from 'express';
import { createAppointment, getAppointments, updateAppointment, cancelAppointment, getQueue, getUserPosition } from '../controllers/appointments.js';
import {
  validateAppointmentCreation,
  validateAppointmentUpdate,
  validateAppointmentCancellation,
  validateUserPosition
} from '../middleware/validation.js';

const router = express.Router();

router.post('/appointments', validateAppointmentCreation, createAppointment);
router.get('/appointments', getAppointments);
router.put('/appointments/:id', validateAppointmentUpdate, updateAppointment);
router.delete('/appointments/:id', validateAppointmentCancellation, cancelAppointment);
router.get('/queue', getQueue);
router.get('/queue/user/:studentId', validateUserPosition, getUserPosition);

export default router;

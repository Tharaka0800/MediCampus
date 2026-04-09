import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Queue from '../models/Queue.js';
import { io } from '../server.js';

export const createAppointment = async (req, res) => {
  try {
    const { studentId, doctorId, date, timeSlot, reason } = req.body;

    // Comprehensive validation
    const errors = [];

    // Student ID validation
    if (!studentId || typeof studentId !== 'string') {
      errors.push('Student ID is required and must be a string');
    } else if (!/^S\d{3,}$/.test(studentId.trim())) {
      errors.push('Student ID must be in format S followed by at least 3 digits (e.g., S101)');
    }

    // Doctor ID validation
    if (!doctorId || typeof doctorId !== 'string') {
      errors.push('Doctor ID is required and must be a string');
    } else if (!/^D\d+$/.test(doctorId.trim())) {
      errors.push('Doctor ID must be in format D followed by digits (e.g., D1)');
    }

    // Date validation
    if (!date) {
      errors.push('Date is required');
    } else {
      const appointmentDate = new Date(date);
      if (isNaN(appointmentDate.getTime())) {
        errors.push('Invalid date format');
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(appointmentDate);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          errors.push('Cannot book appointments in the past');
        } else if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
          errors.push('Appointments are only available Monday to Friday');
        } else {
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 30);
          if (selectedDate > maxDate) {
            errors.push('Cannot book appointments more than 30 days in advance');
          }
        }
      }
    }

    // Time slot validation
    const validTimeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    if (!timeSlot) {
      errors.push('Time slot is required');
    } else if (!validTimeSlots.includes(timeSlot)) {
      errors.push('Invalid time slot selected');
    } else {
      // Check if the time slot is in the past for today
      const today = new Date();
      const appointmentDate = new Date(date);
      if (appointmentDate.toDateString() === today.toDateString()) {
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        if (slotTime <= today) {
          errors.push('Cannot book time slots in the past');
        }
      }
    }

    // Reason validation
    if (!reason || typeof reason !== 'string') {
      errors.push('Reason is required and must be a string');
    } else {
      const trimmedReason = reason.trim();
      if (trimmedReason.length < 10) {
        errors.push('Reason must be at least 10 characters long');
      } else if (trimmedReason.length > 500) {
        errors.push('Reason cannot exceed 500 characters');
      } else if (!/^[a-zA-Z0-9\s.,!?-]+$/.test(trimmedReason)) {
        errors.push('Reason contains invalid characters. Only letters, numbers, spaces, and basic punctuation allowed');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors
      });
    }

    const appointmentDateMidnight = new Date(date);
    appointmentDateMidnight.setHours(0, 0, 0, 0);

    // Check if slot is available (max 10 patients per slot)
    const existingAppointments = await Appointment.countDocuments({
      doctorId: doctorId.trim(),
      date: appointmentDateMidnight,
      timeSlot,
      status: { $in: ['booked', 'rescheduled'] }
    });

    if (existingAppointments >= 10) {
      return res.status(400).json({
        message: 'Time slot is fully booked',
        errors: ['Maximum 10 appointments allowed per time slot']
      });
    }

    // Check for time conflicts for the student
    const studentConflict = await Appointment.findOne({
      studentId: studentId.trim(),
      date: appointmentDateMidnight,
      timeSlot,
      status: { $in: ['booked', 'rescheduled'] }
    });

    if (studentConflict) {
      return res.status(400).json({
        message: 'Time conflict detected',
        errors: ['You already have an appointment at this time']
      });
    }

    // Check if student has too many appointments in a day (max 2 per day)
    const dailyAppointments = await Appointment.countDocuments({
      studentId: studentId.trim(),
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      },
      status: { $in: ['booked', 'rescheduled'] }
    });

    if (dailyAppointments >= 2) {
      return res.status(400).json({
        message: 'Daily limit exceeded',
        errors: ['Maximum 2 appointments allowed per day per student']
      });
    }

    const appointment = new Appointment({
      studentId: studentId.trim(),
      doctorId: doctorId.trim(),
      date: appointmentDateMidnight,
      timeSlot,
      reason: reason.trim(),
    });

    await appointment.save();

    // Add to queue
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const queuesToday = await Queue.countDocuments({
      createdAt: { $gte: todayMidnight }
    });

    const waitingQueues = await Queue.countDocuments({ status: 'waiting' });

    const queue = new Queue({
      appointmentId: appointment._id,
      queueNumber: queuesToday + 1,
      estimatedTime: (waitingQueues + 1) * 15, // 15 min per currently waiting patient
    });

    await queue.save();

    // Update appointment with queue number
    appointment.queueNumber = queue.queueNumber;
    await appointment.save();

    // Emit real-time update
    io.emit('queueUpdate', { type: 'new', queue });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
      queue
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      message: 'Internal server error',
      errors: ['An unexpected error occurred. Please try again.']
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { studentId } : {};
    const appointments = await Appointment.find(filter).sort({ date: 1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate update fields
    const allowedFields = ['date', 'timeSlot', 'reason', 'status'];
    const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: 'Invalid fields in update request',
        errors: [`Invalid fields: ${invalidFields.join(', ')}`]
      });
    }

    // Validate date if provided
    if (updates.date) {
      const newDate = new Date(updates.date);
      if (isNaN(newDate.getTime())) {
        return res.status(400).json({
          message: 'Invalid date format',
          errors: ['Date must be a valid date']
        });
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (newDate < today) {
        return res.status(400).json({
          message: 'Cannot reschedule to past dates',
          errors: ['Cannot reschedule appointments to past dates']
        });
      }
    }

    // Validate time slot if provided
    if (updates.timeSlot) {
      const validTimeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      if (!validTimeSlots.includes(updates.timeSlot)) {
        return res.status(400).json({
          message: 'Invalid time slot',
          errors: ['Time slot must be one of the available slots']
        });
      }
    }

    // Validate reason if provided
    if (updates.reason) {
      const trimmedReason = updates.reason.trim();
      if (trimmedReason.length < 10 || trimmedReason.length > 500) {
        return res.status(400).json({
          message: 'Invalid reason length',
          errors: ['Reason must be between 10 and 500 characters']
        });
      }
    }

    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) {
      return res.status(404).json({
        message: 'Appointment not found',
        errors: ['No appointment found with the provided ID']
      });
    }

    if (updates.date || updates.timeSlot) {
      const checkDate = updates.date ? new Date(updates.date) : new Date(existingAppointment.date);
      checkDate.setHours(0, 0, 0, 0);
      const checkTimeSlot = updates.timeSlot || existingAppointment.timeSlot;

      // Ensure slot is not full
      const existingApptsCount = await Appointment.countDocuments({
        _id: { $ne: id },
        doctorId: existingAppointment.doctorId,
        date: checkDate,
        timeSlot: checkTimeSlot,
        status: { $in: ['booked', 'rescheduled'] }
      });
      if (existingApptsCount >= 10) {
        return res.status(400).json({
          message: 'Time slot is fully booked',
          errors: ['Maximum 10 appointments allowed per time slot']
        });
      }

      // Check for time conflicts for the student
      const studentConflict = await Appointment.findOne({
        _id: { $ne: id },
        studentId: existingAppointment.studentId,
        date: checkDate,
        timeSlot: checkTimeSlot,
        status: { $in: ['booked', 'rescheduled'] }
      });
      if (studentConflict) {
        return res.status(400).json({
          message: 'Time conflict detected',
          errors: ['You already have an appointment at this time']
        });
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      message: 'Internal server error',
      errors: ['An unexpected error occurred while updating the appointment']
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if appointment exists and can be cancelled
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found',
        errors: ['No appointment found with the provided ID']
      });
    }

    // Check if appointment is in the past (can't cancel past appointments)
    const appointmentDateTime = new Date(appointment.date);
    const [hours, minutes] = appointment.timeSlot.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({
        message: 'Cannot cancel past appointments',
        errors: ['Appointments in the past cannot be cancelled']
      });
    }

    // Check if appointment is already cancelled or completed
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        message: 'Appointment already cancelled',
        errors: ['This appointment has already been cancelled']
      });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({
        message: 'Cannot cancel completed appointments',
        errors: ['Completed appointments cannot be cancelled']
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({
        message: 'Appointment not found',
        errors: ['Failed to update appointment status']
      });
    }

    // Remove from queue
    await Queue.findOneAndDelete({ appointmentId: id });

    // Emit real-time update
    io.emit('queueUpdate', { type: 'cancelled', appointmentId: id });

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      message: 'Internal server error',
      errors: ['An unexpected error occurred while cancelling the appointment']
    });
  }
};

export const getQueue = async (req, res) => {
  try {
    const queue = await Queue.find().populate('appointmentId').sort({ queueNumber: 1 });
    res.status(200).json(queue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPosition = async (req, res) => {
  try {
    const { studentId } = req.params;
    const appointment = await Appointment.findOne({ studentId, status: { $in: ['booked', 'rescheduled'] } });
    if (!appointment) {
      return res.status(404).json({ message: 'No active appointment found' });
    }

    const queue = await Queue.findOne({ appointmentId: appointment._id });
    if (!queue) {
      return res.status(404).json({ message: 'Queue entry not found' });
    }

    const ahead = await Queue.countDocuments({ queueNumber: { $lt: queue.queueNumber }, status: 'waiting' });
    res.status(200).json({ position: ahead + 1, queue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
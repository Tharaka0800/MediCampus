import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { bookAppointment } from '../services/api';

const AppointmentForm = ({ doctors, selectedDoctor, setSelectedDoctor, selectedDate, setSelectedDate, onAppointmentBooked }) => {
  const [studentId, setStudentId] = useState('');
  const [reason, setReason] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Student ID validation
    if (!studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!/^S\d{3,}$/.test(studentId.trim())) {
      newErrors.studentId = 'Student ID must be in format S followed by at least 3 digits (e.g., S101)';
    }

    // Doctor validation
    if (!selectedDoctor) {
      newErrors.doctor = 'Please select a doctor';
    }

    // Date validation
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      if (selected < today) {
        newErrors.date = 'Cannot book appointments in the past';
      } else if (selected.getDay() === 0 || selected.getDay() === 6) {
        newErrors.date = 'Appointments are only available Monday to Friday';
      } else {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30); // Max 30 days ahead
        if (selected > maxDate) {
          newErrors.date = 'Cannot book appointments more than 30 days in advance';
        }
      }
    }

    // Time slot validation
    if (!timeSlot) {
      newErrors.timeSlot = 'Please select a time slot';
    } else {
      const now = new Date();
      const selectedDateTime = new Date(selectedDate);
      const [hours, minutes] = timeSlot.split(':').map(Number);
      selectedDateTime.setHours(hours, minutes, 0, 0);

      if (selectedDateTime <= now) {
        newErrors.timeSlot = 'Cannot book appointments in the past';
      }
    }

    // Reason validation
    if (!reason.trim()) {
      newErrors.reason = 'Please provide a reason for the appointment';
    } else if (reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters long';
    } else if (reason.trim().length > 500) {
      newErrors.reason = 'Reason cannot exceed 500 characters';
    } else if (!/^[a-zA-Z0-9\s.,!?-]+$/.test(reason.trim())) {
      newErrors.reason = 'Reason contains invalid characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await bookAppointment({
        studentId: studentId.trim(),
        doctorId: selectedDoctor,
        date: selectedDate.toISOString(),
        timeSlot,
        reason: reason.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Reset form
        setStudentId('');
        setReason('');
        setTimeSlot('');
        setSelectedDoctor('');
        setSelectedDate(new Date());
        setErrors({});
      }, 3000);
      onAppointmentBooked();
    } catch (error) {
      console.error('Error booking appointment:', error);
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Display the first specific error from the backend
        setErrors({ submit: error.response.data.errors[0] });
      } else if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else if (error.message) {
        setErrors({ submit: `Booking failed: ${error.message}` });
      } else {
        setErrors({ submit: 'Failed to book appointment. Please check your connection and try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return studentId.trim() && selectedDoctor && selectedDate && timeSlot && reason.trim().length >= 10;
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Book Appointment</h2>

      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Booking Failed
              </h3>
              <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                {errors.submit}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Student ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="e.g., S101"
          className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.studentId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        />
        {errors.studentId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Doctor <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.doctor ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        >
          <option value="">Choose a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
        {errors.doctor && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.doctor}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          min={new Date().toISOString().split('T')[0]}
          className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Time Slot <span className="text-red-500">*</span>
        </label>
        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.timeSlot ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        >
          <option value="">Choose a time slot</option>
          <option value="09:00">9:00 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="14:00">2:00 PM</option>
          <option value="15:00">3:00 PM</option>
          <option value="16:00">4:00 PM</option>
        </select>
        {errors.timeSlot && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.timeSlot}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Reason for Visit <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe your symptoms or reason for appointment (minimum 10 characters)"
          className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            errors.reason ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          rows={3}
          maxLength={500}
          required
        />
        <div className="flex justify-between mt-1">
          {errors.reason && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.reason}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {reason.length}/500 characters
          </p>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading || !isFormValid()}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={isFormValid() ? { scale: 1.02 } : {}}
        whileTap={isFormValid() ? { scale: 0.98 } : {}}
      >
        {loading ? 'Booking...' : 'Book Appointment'}
      </motion.button>

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-green-600 dark:text-green-400 font-medium"
        >
          ✅ Appointment booked successfully!
        </motion.div>
      )}

      {/* Help text for common issues */}
      <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
        <strong>💡 Common booking issues:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Time slots fill up quickly - try different times</li>
          <li>• Maximum 10 appointments per time slot</li>
          <li>• Maximum 2 appointments per day per student</li>
          <li>• Cannot book same time slot twice</li>
        </ul>
      </div>
    </motion.form>
  );
};

export default AppointmentForm;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StudentLayout from '../components/StudentLayout';
import AppointmentForm from '../components/AppointmentForm';
import TimeSlotPicker from '../components/TimeSlotPicker';
import { getAppointments, cancelAppointment } from '../services/api';

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // Get student ID from localStorage or prompt user
      const studentId = localStorage.getItem('studentId') || prompt('Please enter your Student ID (format: S101):');
      if (studentId) {
        localStorage.setItem('studentId', studentId);
        const response = await getAppointments(studentId);
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleReschedule = (appointment) => {
    // For simplicity, just cancel and let user book new
    handleCancel(appointment._id);
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      fetchAppointments();
    } catch (error) {
      console.error('Error canceling appointment:', error);
      let errorMessage = 'Failed to cancel appointment.';
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage += ' ' + error.response.data.errors[0];
      } else if (error.response?.data?.message) {
        errorMessage += ' ' + error.response.data.message;
      } else if (error.message) {
        errorMessage += ' ' + error.message;
      }
      alert(errorMessage);
    }
  };

  const doctors = [
    { id: 'D1', name: 'Dr. Smith' },
    { id: 'D2', name: 'Dr. Johnson' },
  ];

  return (
    <StudentLayout title="Appointments" subtitle="Manage your upcoming medical visits">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
          >
            <AppointmentForm
              doctors={doctors}
              selectedDoctor={selectedDoctor}
              setSelectedDoctor={setSelectedDoctor}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onAppointmentBooked={fetchAppointments}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
          >
            <TimeSlotPicker
              doctorId={selectedDoctor}
              date={selectedDate}
              availableSlots={availableSlots}
              setAvailableSlots={setAvailableSlots}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Your Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No appointments booked yet.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium">{apt.doctorId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status: {apt.status}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReschedule(apt)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(apt._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </StudentLayout>
  );
};

export default AppointmentPage;
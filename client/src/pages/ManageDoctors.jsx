import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import { getAllDoctors, createDoctor, updateDoctor, deleteDoctor } from '../services/api';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    licenseNumber: '',
    phone: '',
    availableSlots: []
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors();
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await updateDoctor(editingDoctor._id, formData);
      } else {
        await createDoctor(formData);
      }
      fetchDoctors();
      setShowForm(false);
      setEditingDoctor(null);
      resetForm();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      phone: doctor.phone,
      availableSlots: doctor.availableSlots || []
    });
    setShowForm(true);
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(doctorId);
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      specialization: '',
      licenseNumber: '',
      phone: '',
      availableSlots: []
    });
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      availableSlots: [
        ...formData.availableSlots,
        { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true }
      ]
    });
  };

  const updateTimeSlot = (index, field, value) => {
    const updatedSlots = [...formData.availableSlots];
    updatedSlots[index][field] = value;
    setFormData({
      ...formData,
      availableSlots: updatedSlots
    });
  };

  const removeTimeSlot = (index) => {
    const updatedSlots = formData.availableSlots.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      availableSlots: updatedSlots
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading doctors...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Doctors</h1>
            <p className="text-gray-400">Add, edit, and manage healthcare professionals</p>
          </div>
          <motion.button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-500 hover:to-fuchsia-400 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ Add Doctor
          </motion.button>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {doctor.name.charAt(0)}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleEdit(doctor)}
                    className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✏️
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(doctor._id)}
                    className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    🗑️
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
                <p className="text-indigo-400 font-medium">{doctor.specialization}</p>
                <p className="text-gray-400 text-sm">{doctor.email}</p>
                <p className="text-gray-400 text-sm">{doctor.phone}</p>
                <p className="text-gray-500 text-xs">License: {doctor.licenseNumber}</p>

                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Available Slots:</p>
                  <div className="space-y-1">
                    {doctor.availableSlots?.slice(0, 2).map((slot, idx) => (
                      <div key={idx} className="text-xs text-gray-300 bg-gray-700/30 rounded px-2 py-1">
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                    {doctor.availableSlots?.length > 2 && (
                      <p className="text-xs text-gray-500">+{doctor.availableSlots.length - 2} more slots</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Doctor Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingDoctor(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Dr. John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="doctor@medicampus.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Cardiology, General Medicine, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      License Number *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="MD123456"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>

                {/* Available Time Slots */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Available Time Slots
                    </label>
                    <button
                      type="button"
                      onClick={addTimeSlot}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-500 transition-colors"
                    >
                      ➕ Add Slot
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.availableSlots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <select
                          value={slot.day}
                          onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
                          className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>

                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                          className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />

                        <span className="text-gray-400">to</span>

                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                          className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />

                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <motion.button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-500 hover:to-fuchsia-400 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingDoctor(null);
                      resetForm();
                    }}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageDoctors;
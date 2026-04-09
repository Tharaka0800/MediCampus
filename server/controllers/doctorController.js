import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({ name: 1 });
    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor',
      error: error.message
    });
  }
};

// Create new doctor
export const createDoctor = async (req, res) => {
  try {
    const { name, email, specialization, licenseNumber, phone, availableSlots } = req.body;

    // Check if doctor with this email or license already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { licenseNumber }]
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email or license number already exists'
      });
    }

    const doctor = new Doctor({
      name,
      email,
      specialization,
      licenseNumber,
      phone,
      availableSlots: availableSlots || []
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor',
      error: error.message
    });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor',
      error: error.message
    });
  }
};

// Delete doctor (soft delete)
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if doctor has upcoming appointments
    const upcomingAppointments = await Appointment.find({
      doctorId: id,
      date: { $gte: new Date() },
      status: { $in: ['booked', 'confirmed'] }
    });

    if (upcomingAppointments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete doctor with upcoming appointments. Please reschedule or cancel appointments first.'
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor deactivated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete doctor',
      error: error.message
    });
  }
};

// Get doctor's appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status } = req.query;

    let query = { doctorId: id };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('studentId', 'name email')
      .sort({ date: 1, timeSlot: 1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor appointments',
      error: error.message
    });
  }
};

// Update doctor's availability slots
export const updateDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availableSlots } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { availableSlots },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor availability updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor availability',
      error: error.message
    });
  }
};
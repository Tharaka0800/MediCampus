import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Queue from '../models/Queue.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's appointments
    const todaysAppointments = await Appointment.find({
      date: { $gte: today, $lt: tomorrow }
    });

    // Get active queue count
    const activeQueue = await Queue.find({
      status: { $in: ['waiting', 'active'] }
    });

    // Get completed consultations today
    const completedToday = await Appointment.find({
      date: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });

    // Get available doctors
    const availableDoctors = await Doctor.find({ isActive: true });

    // Get emergency alerts (appointments with urgent status or emergency queue items)
    const emergencyAlerts = await Queue.find({
      status: 'emergency'
    }).populate('appointmentId');

    // Calculate average waiting time
    const queueItems = await Queue.find({ status: 'completed' }).sort({ updatedAt: -1 }).limit(10);
    let avgWaitingTime = 0;
    if (queueItems.length > 0) {
      const totalTime = queueItems.reduce((acc, item) => {
        if (item.completedAt && item.createdAt) {
          return acc + (item.completedAt - item.createdAt);
        }
        return acc;
      }, 0);
      avgWaitingTime = Math.round(totalTime / queueItems.length / 1000 / 60); // in minutes
    }

    const stats = {
      totalAppointmentsToday: todaysAppointments.length,
      activeQueueCount: activeQueue.length,
      completedConsultations: completedToday.length,
      doctorsAvailable: availableDoctors.length,
      emergencyAlerts: emergencyAlerts.length,
      averageWaitingTime: avgWaitingTime,
      todaysAppointments: todaysAppointments,
      activeQueue: activeQueue,
      emergencyAlerts: emergencyAlerts
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['student', 'doctor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be student, doctor, or admin'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

// Get system analytics
export const getSystemAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Appointments over last 30 days
    const appointmentsLast30Days = await Appointment.find({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Queue performance
    const completedQueues = await Queue.find({
      status: 'completed',
      updatedAt: { $gte: thirtyDaysAgo }
    });

    // Doctor utilization
    const doctors = await Doctor.find({ isActive: true });
    const doctorStats = await Promise.all(
      doctors.map(async (doctor) => {
        const appointments = await Appointment.find({
          doctorId: doctor._id,
          createdAt: { $gte: thirtyDaysAgo }
        });
        return {
          doctor: doctor.name,
          specialization: doctor.specialization,
          appointmentsCount: appointments.length,
          completedCount: appointments.filter(a => a.status === 'completed').length
        };
      })
    );

    const analytics = {
      totalAppointmentsLast30Days: appointmentsLast30Days.length,
      completedAppointmentsLast30Days: appointmentsLast30Days.filter(a => a.status === 'completed').length,
      averageAppointmentsPerDay: Math.round(appointmentsLast30Days.length / 30),
      doctorUtilization: doctorStats,
      queueCompletionRate: completedQueues.length > 0 ?
        Math.round((completedQueues.length / appointmentsLast30Days.length) * 100) : 0
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching system analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system analytics',
      error: error.message
    });
  }
};
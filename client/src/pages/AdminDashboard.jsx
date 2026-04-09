import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import QueueControlPanel from '../components/QueueControlPanel';
import { getDashboardStats } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Monitor and control your healthcare platform</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Today's Appointments"
            value={stats?.totalAppointmentsToday || 0}
            icon="📅"
            color="blue"
          />
          <StatCard
            title="Active Queue"
            value={stats?.activeQueueCount || 0}
            icon="⏱️"
            color="green"
          />
          <StatCard
            title="Completed Today"
            value={stats?.completedConsultations || 0}
            icon="✅"
            color="purple"
          />
          <StatCard
            title="Available Doctors"
            value={stats?.doctorsAvailable || 0}
            icon="👨‍⚕️"
            color="indigo"
          />
        </motion.div>

        {/* Emergency Alerts */}
        {stats?.emergencyAlerts && stats.emergencyAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  🚨
                </div>
                <h2 className="text-xl font-bold text-red-400">Emergency Alerts</h2>
              </div>
              <div className="space-y-3">
                {stats.emergencyAlerts.map((alert, index) => (
                  <div key={index} className="bg-red-900/30 rounded-lg p-4">
                    <p className="text-red-300">
                      Emergency patient in queue - requires immediate attention
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Queue Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QueueControlPanel
            activeQueue={stats?.activeQueue || []}
            onUpdate={fetchDashboardStats}
          />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {stats?.todaysAppointments?.slice(0, 5).map((appointment, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-b-0">
                  <div>
                    <p className="font-medium">{appointment.reason || 'Medical Consultation'}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                    appointment.status === 'cancelled' ? 'bg-red-900/30 text-red-400' :
                    'bg-blue-900/30 text-blue-400'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
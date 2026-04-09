import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminNavbar = ({ onMenuClick }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Mock notifications - in real app, fetch from API
  const notifications = [
    { id: 1, message: 'New appointment booked', time: '2 min ago', type: 'info' },
    { id: 2, message: 'Emergency patient in queue', time: '5 min ago', type: 'urgent' },
    { id: 3, message: 'Doctor schedule updated', time: '10 min ago', type: 'info' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gray-800/95 backdrop-blur-xl border-b border-gray-700/50 z-50 ml-0 lg:ml-64">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Menu button */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onMenuClick}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
          <h1 className="text-lg font-semibold text-white hidden sm:block">Admin Panel</h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 7V3a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2v-4l5 5V2l-5 5z" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-xl z-50"
              >
                <div className="p-4 border-b border-gray-700/50">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-700/30 last:border-b-0 hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'urgent' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-700/50">
                  <button className="w-full text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-500 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <span className="text-white hidden sm:block">Admin</span>
            </motion.button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-xl z-50"
              >
                <div className="p-4 border-b border-gray-700/50">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-400">admin@medicampus.edu</p>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                    Preferences
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors">
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(notificationsOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotificationsOpen(false);
            setProfileOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default AdminNavbar;
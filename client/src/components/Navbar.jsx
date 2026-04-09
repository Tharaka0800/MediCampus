import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Appointments', path: '/appointments', icon: '📅' },
    { name: 'Live Queue', path: '/queue', icon: '⏱️' },
    { name: 'Medical Records', path: '/records', icon: '📋' },
    { name: 'Medical Certificate', path: '/medical', icon: '🩺' },
    { name: 'Emergency', path: '/emergency', icon: '🚨' },
  ];

  const quickActions = [
    { name: 'Book Appointment', action: () => window.location.href = '/appointments', icon: '➕' },
    { name: 'Check Queue Status', action: () => window.location.href = '/queue', icon: '👀' },
    { name: 'Apply Medical', action: () => window.location.href = '/medical/apply', icon: '🩹' },
    { name: 'Emergency Contact', action: () => alert('Emergency: Call 911'), icon: '📞' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] h-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-gray-700 shadow-xl">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white grid place-items-center font-black text-lg tracking-tight">
            M
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none">MediCampus</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400">Smart Health Platform</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700 dark:text-gray-300 tracking-wide">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home</Link>
          <Link to="/appointments" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Appointments</Link>
          <Link to="/queue" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Live Queue</Link>
          <Link to="/medical" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Medical</Link>
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-500 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </motion.button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="lg:hidden p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? '☀️' : '🌙'}
          </motion.button>

          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white font-semibold hover:from-indigo-500 hover:to-fuchsia-400 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={isMenuOpen ? { rotate: 45 } : { rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? '✕' : '☰'}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Modern Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-24 left-6 right-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              {/* Quick Actions */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      onClick={action.action}
                      className="p-4 bg-gradient-to-r from-indigo-50 to-fuchsia-50 dark:from-indigo-900/20 dark:to-fuchsia-900/20 rounded-xl hover:from-indigo-100 hover:to-fuchsia-100 dark:hover:from-indigo-800/30 dark:hover:to-fuchsia-800/30 transition-all text-left group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">{action.icon}</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {action.name}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Navigation</h3>
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* User Profile Section */}
              <div className="border-t border-slate-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white grid place-items-center font-bold">
                      U
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Student User</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">student@medicampus.edu</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ⚙️
                  </motion.button>
                </div>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-2"
                    >
                      <button className="w-full p-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition flex items-center gap-3">
                        <span>👤</span>
                        <span className="text-sm font-medium">Profile Settings</span>
                      </button>
                      <button className="w-full p-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition flex items-center gap-3">
                        <span>🔔</span>
                        <span className="text-sm font-medium">Notifications</span>
                      </button>
                      <button className="w-full p-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition flex items-center gap-3">
                        <span>❓</span>
                        <span className="text-sm font-medium">Help & Support</span>
                      </button>
                      <button className="w-full p-3 text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition flex items-center gap-3">
                        <span>🚪</span>
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: '📊'
    },
    {
      name: 'Queue Management',
      path: '/admin/queue',
      icon: '⏱️'
    },
    {
      name: 'Appointments',
      path: '/admin/appointments',
      icon: '📅'
    },
    {
      name: 'Doctors',
      path: '/admin/doctors',
      icon: '👨‍⚕️'
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: '👥'
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: '📈'
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 h-full w-64 bg-gray-800/95 backdrop-blur-xl border-r border-gray-700/50 z-40"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-500 flex items-center justify-center font-black text-lg">
                M
              </div>
              <div>
                <h1 className="text-lg font-black text-white">MediCampus</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      location.pathname === item.path
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1 h-6 bg-indigo-400 rounded-full ml-auto"
                      />
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="text-xs text-gray-500 text-center">
              MediCampus v2.0
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your appointment is confirmed for tomorrow at 10:00 AM', time: '2 hours ago', read: false },
    { id: 2, message: 'Queue update: You are now position 3', time: '30 min ago', read: false },
    { id: 3, message: 'Reminder: Your turn is coming up', time: '5 min ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="relative">
      <motion.button
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🔔
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Dropdown */}
      <motion.div
        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
                whileHover={{ x: 5 }}
              >
                <p className="text-sm text-gray-800 dark:text-white mb-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.time}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationBell;
import React from 'react';
import { motion } from 'framer-motion';

const QueueCard = ({ title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <motion.div
      className={`bg-gradient-to-r ${colorClasses[color]} text-white p-6 rounded-2xl shadow-lg`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2 opacity-90">{title}</h3>
        <motion.div
          className="text-4xl font-bold mb-1"
          key={value}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {value}
        </motion.div>
        <p className="text-sm opacity-80">{subtitle}</p>
      </div>
    </motion.div>
  );
};

export default QueueCard;
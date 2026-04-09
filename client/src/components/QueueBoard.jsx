import React from 'react';
import { motion } from 'framer-motion';

const QueueBoard = ({ queue }) => {
  const waiting = queue.filter(q => q.status === 'waiting');
  const active = queue.find(q => q.status === 'active');
  const done = queue.filter(q => q.status === 'done');

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Queue Board
      </h2>

      {/* Current Serving */}
      <motion.div
        className="mb-8 text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          Now Serving
        </div>
        <motion.div
          className="text-6xl font-bold text-green-600 dark:text-green-400 mb-2"
          key={active?.queueNumber}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {active ? `Q${active.queueNumber}` : '---'}
        </motion.div>
        <div className="text-lg text-gray-700 dark:text-gray-300">
          {active ? `Patient ${active.appointmentId?.studentId || 'Unknown'}` : 'No one currently'}
        </div>
      </motion.div>

      {/* Waiting Queue */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
          Waiting ({waiting.length})
        </h3>
        <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
          {waiting.slice(0, 20).map((item, index) => (
            <motion.div
              key={item._id}
              className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg text-center font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              Q{item.queueNumber}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completed */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
          Completed Today ({done.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {done.slice(-10).map((item) => (
            <motion.div
              key={item._id}
              className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Q{item.queueNumber}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueueBoard;
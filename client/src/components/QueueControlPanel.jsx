import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { callNextPatient, skipPatient, markAsEmergency, markAsDone } from '../services/api';

const QueueControlPanel = ({ activeQueue, onUpdate }) => {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    if (activeQueue && activeQueue.length > 0) {
      // Find the currently active patient (status: 'active')
      const active = activeQueue.find(item => item.status === 'active');
      setCurrentPatient(active);

      // Get waiting patients
      const waiting = activeQueue.filter(item => item.status === 'waiting' || item.status === 'emergency');
      setWaitingList(waiting);
    } else {
      setCurrentPatient(null);
      setWaitingList([]);
    }
  }, [activeQueue]);

  const handleCallNext = async () => {
    try {
      await callNextPatient();
      onUpdate();
    } catch (error) {
      console.error('Error calling next patient:', error);
    }
  };

  const handleSkip = async (queueId) => {
    try {
      await skipPatient(queueId);
      onUpdate();
    } catch (error) {
      console.error('Error skipping patient:', error);
    }
  };

  const handleEmergency = async (queueId) => {
    try {
      await markAsEmergency(queueId);
      onUpdate();
    } catch (error) {
      console.error('Error marking as emergency:', error);
    }
  };

  const handleDone = async (queueId) => {
    try {
      await markAsDone(queueId);
      onUpdate();
    } catch (error) {
      console.error('Error marking as done:', error);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
          ⏱️
        </div>
        <h2 className="text-xl font-bold text-white">Queue Control Panel</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Patient Display */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            NOW SERVING
          </h3>

          {currentPatient ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-black text-green-400 mb-2">
                  {String(currentPatient.queueNumber).padStart(3, '0')}
                </div>
                <p className="text-gray-300">Queue Number</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Patient ID</p>
                    <p className="text-white font-medium">{currentPatient.appointmentId?.studentId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Doctor</p>
                    <p className="text-white font-medium">{currentPatient.appointmentId?.doctorId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Time Slot</p>
                    <p className="text-white font-medium">{currentPatient.appointmentId?.timeSlot || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Reason</p>
                    <p className="text-white font-medium">{currentPatient.appointmentId?.reason || 'Consultation'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => handleDone(currentPatient._id)}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✅ Mark as Done
                </motion.button>
                <motion.button
                  onClick={() => handleSkip(currentPatient._id)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ⏭️ Skip
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-gray-400 mb-4">No patient currently being served</p>
              <motion.button
                onClick={handleCallNext}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ▶️ Call Next Patient
              </motion.button>
            </div>
          )}
        </div>

        {/* Waiting List */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-4">Waiting List</h3>

          {waitingList.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {waitingList.map((patient, index) => (
                <motion.div
                  key={patient._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    patient.status === 'emergency'
                      ? 'bg-red-900/20 border-red-500/50'
                      : 'bg-gray-800/50 border-gray-600/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-black ${
                        patient.status === 'emergency' ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {String(patient.queueNumber).padStart(3, '0')}
                      </span>
                      {patient.status === 'emergency' && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      #{index + 1} in line
                    </span>
                  </div>

                  <div className="text-sm text-gray-300 mb-3">
                    <p>Patient: {patient.appointmentId?.studentId?.name || 'N/A'}</p>
                    <p>Doctor: {patient.appointmentId?.doctorId?.name || 'N/A'}</p>
                  </div>

                  <div className="flex gap-2">
                    {patient.status !== 'emergency' && (
                      <motion.button
                        onClick={() => handleEmergency(patient._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        🚨 Emergency
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => handleSkip(patient._id)}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-medium rounded transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Skip
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-400">No patients in waiting list</p>
            </div>
          )}

          {waitingList.length > 0 && (
            <motion.button
              onClick={handleCallNext}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ▶️ Call Next Patient
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueControlPanel;
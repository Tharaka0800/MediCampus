import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QueueBoard from '../components/QueueBoard';
import QueueCard from '../components/QueueCard';
import { getQueue, getUserPosition } from '../services/api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const QueuePage = () => {
  const [queue, setQueue] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [currentServing, setCurrentServing] = useState(null);

  useEffect(() => {
    fetchQueue();
    fetchUserPosition();

    socket.on('queueUpdate', (data) => {
      fetchQueue();
      fetchUserPosition();
    });

    return () => {
      socket.off('queueUpdate');
    };
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await getQueue();
      setQueue(response.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const fetchUserPosition = async () => {
    try {
      const studentId = localStorage.getItem('studentId');
      if (studentId) {
        const response = await getUserPosition(studentId);
        setUserPosition(response.data);
      }
    } catch (error) {
      console.error('Error fetching user position:', error);
      setUserPosition(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white"
        >
          Live Queue Status
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <QueueBoard queue={queue} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {userPosition && (
              <QueueCard
                title="Your Position"
                value={userPosition.position}
                subtitle={`Estimated wait: ${userPosition.queue.estimatedTime} min`}
                color="blue"
              />
            )}

            <QueueCard
              title="Total Waiting"
              value={queue.filter(q => q.status === 'waiting').length}
              subtitle="Patients ahead"
              color="yellow"
            />

            <QueueCard
              title="Currently Serving"
              value={queue.find(q => q.status === 'active')?.queueNumber || 'None'}
              subtitle="Queue number"
              color="green"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QueuePage;
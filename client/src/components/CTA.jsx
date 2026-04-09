import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { bookAppointment, getQueue } from '../services/api';

const CTA = () => {
  const [status, setStatus] = useState('Ready');
  const [queueCount, setQueueCount] = useState(null);

  const handleBook = async () => {
    setStatus('Booking...');
    const payload = {
      studentId: 'S101',
      doctorId: 'D201',
      datetime: new Date().toISOString(),
      reason: 'General check-up',
    };

    try {
      await bookAppointment(payload);
      setStatus('Appointment booked successfully!');
    } catch (err) {
      console.error(err);
      setStatus('Failed to book appointment (see console).');
    }
  };

  const handleQueue = async () => {
    setStatus('Fetching queue...');

    try {
      const response = await getQueue();
      const count = response?.data?.length ?? response?.data?.count ?? null;
      setQueueCount(count);
      setStatus('Queue loaded');
    } catch (err) {
      console.error(err);
      setStatus('Failed to fetch queue.');
    }
  };

  return (
    <section className="py-20 px-10 bg-gradient-to-br from-fuchsia-500 via-rose-500 to-orange-400 text-white text-center shadow-2xl shadow-fuchsia-700/40">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Start Your Health Journey Today</h2>
          <p className="text-xl opacity-90 leading-relaxed mb-8">
            Join thousands of students who have transformed their healthcare experience
            with MediCampus. Your health, simplified.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
            <motion.button
              onClick={handleBook}
              className="bg-green-400 hover:bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-400/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Demo Appointment
            </motion.button>
            <motion.button
              onClick={handleQueue}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Queue Status
            </motion.button>
          </div>

          <div className="mt-6 text-left bg-white/10 p-4 rounded-xl mx-auto max-w-md">
            <p className="text-sm text-slate-200 font-medium">Status: {status}</p>
            <p className="text-sm text-slate-200 font-medium">Queue count: {queueCount !== null ? queueCount : 'unknown'}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
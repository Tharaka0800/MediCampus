import React from 'react';
import { motion } from 'framer-motion';
import { CalendarToday, Queue, MedicalServices, Security } from '@mui/icons-material';

const Features = () => {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white">
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-black text-cyan-200 mb-4">Key Features</h2>
        <p className="text-lg text-cyan-100/75 max-w-2xl mx-auto">
          Everything you need for seamless healthcare management
        </p>
      </motion.div>

      {/* Feature 1: Left text, Right visual */}
      <section className="py-20 px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl">
              <CalendarToday />
            </div>
            <h3 className="text-3xl font-bold mb-4">Online Appointment Booking</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Schedule appointments with doctors at your convenience through our intuitive booking system.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-10 rounded-3xl shadow-xl text-center"
          >
            <CalendarToday className="text-white text-6xl mb-4" />
            <p className="text-white text-xl font-semibold">Book in 3 Clicks</p>
            <p className="text-white/80 mt-2">Instant confirmation</p>
          </motion.div>
        </div>
      </section>

      {/* Feature 2: Right text, Left visual */}
      <section className="py-20 px-10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 p-10 rounded-3xl shadow-xl text-center md:order-2"
          >
            <Queue className="text-white text-6xl mb-4" />
            <p className="text-white text-xl font-semibold">Live Queue Status</p>
            <p className="text-white/80 mt-2">Real-time updates</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:order-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl">
              <Queue />
            </div>
            <h3 className="text-3xl font-bold mb-4">Live Queue Tracking</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Monitor your position in the queue in real-time and get notified when it's your turn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature 3: Left text, Right visual */}
      <section className="py-20 px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl">
              <MedicalServices />
            </div>
            <h3 className="text-3xl font-bold mb-4">Digital Medical Records</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Access your complete medical history securely from anywhere, anytime.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 p-10 rounded-3xl shadow-xl text-center"
          >
            <MedicalServices className="text-white text-6xl mb-4" />
            <p className="text-white text-xl font-semibold">Secure Cloud Storage</p>
            <p className="text-white/80 mt-2">HIPAA compliant</p>
          </motion.div>
        </div>
      </section>

      {/* Feature 4: Right text, Left visual */}
      <section className="py-20 px-10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 p-10 rounded-3xl shadow-xl text-center md:order-2"
          >
            <Security className="text-white text-6xl mb-4" />
            <p className="text-white text-xl font-semibold">Blockchain Security</p>
            <p className="text-white/80 mt-2">Tamper-proof certificates</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:order-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl">
              <Security />
            </div>
            <h3 className="text-3xl font-bold mb-4">Secure Certificate System</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Generate and manage medical certificates with blockchain-level security.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;
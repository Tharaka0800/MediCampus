import React from 'react';
import { motion } from 'framer-motion';
import { LocalHospital, Event, Bloodtype } from '@mui/icons-material';

const EmergencyEvents = () => {
  return (
    <section className="py-20 px-10 bg-gradient-to-br from-indigo-900 via-violet-950 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div
          className="bg-white p-12 rounded-xl shadow-xl border border-white/80 backdrop-blur-sm"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-5xl">
              <LocalHospital />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Emergency Handling</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Our system prioritizes emergency cases with instant alerts and
              rapid response protocols to ensure critical care when it matters most.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-red-50 px-6 py-3 rounded-full font-semibold text-red-600">
                <span className="text-red-700 font-bold">24/7</span> Emergency Support
              </div>
              <div className="bg-red-50 px-6 py-3 rounded-full font-semibold text-red-600">
                <span className="text-red-700 font-bold">Priority</span> Queue System
              </div>
              <div className="bg-red-50 px-6 py-3 rounded-full font-semibold text-red-600">
                <span className="text-red-700 font-bold">Instant</span> Notifications
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-12 rounded-xl shadow-xl border border-white/80 backdrop-blur-sm"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-5xl">
              <Event />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Health Events & Programs</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Join our wellness initiatives including blood donation drives,
              health awareness campaigns, and fitness programs designed for students.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-amber-50 px-6 py-3 rounded-full font-semibold text-amber-600 flex items-center gap-2">
                <Bloodtype />
                <span>Blood Donation</span>
              </div>
              <div className="bg-amber-50 px-6 py-3 rounded-full font-semibold text-amber-600 flex items-center gap-2">
                <Event />
                <span>Wellness Programs</span>
              </div>
              <div className="bg-amber-50 px-6 py-3 rounded-full font-semibold text-amber-600 flex items-center gap-2">
                <Event />
                <span>Health Awareness</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EmergencyEvents;
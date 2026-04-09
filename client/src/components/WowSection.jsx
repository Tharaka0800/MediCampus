import React from 'react';
import { motion } from 'framer-motion';

const WowSection = () => {
  return (
    <section className="py-20 bg-black text-white text-center">
      <div className="max-w-7xl mx-auto px-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-10">Real-Time Health Dashboard</h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Experience the power of live healthcare management with our comprehensive dashboard
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/20"
        >
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-white">24</div>
              <div className="text-white/80">Appointments Today</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-white">8</div>
              <div className="text-white/80">Active Queue</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-white">3</div>
              <div className="text-white/80">Doctors Online</div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Current Queue Status</span>
              <span className="text-green-400 font-semibold">LIVE</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="text-sm text-gray-400">65% capacity • Next slot in 12 mins</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WowSection;
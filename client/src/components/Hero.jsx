import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center px-10 bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white overflow-hidden">

      {/* Glow background */}
      <div className="absolute w-[500px] h-[500px] bg-fuchsia-500 rounded-full blur-3xl opacity-35 top-[-120px] left-[-120px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-cyan-500 rounded-full blur-3xl opacity-25 bottom-[-120px] right-[-120px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(255,255,255,0.08),_transparent_55%)]"></div>

      <div className="relative grid md:grid-cols-2 gap-10 items-center w-full max-w-7xl mx-auto">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="inline-block mb-3 text-sm font-semibold tracking-wider text-cyan-300 bg-white/10 px-3 py-1 rounded-full border border-cyan-300/30">Smart Healthcare System</p>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Smart Healthcare <br />
            <span className="text-fuchsia-400">for Smart Students</span>
          </h1>

          <p className="text-gray-300 mb-8 text-lg max-w-xl leading-relaxed">
            Skip queues. Book instantly. Manage your health digitally with a polished product-ready UI and instant queue status.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 shadow-lg hover:shadow-yellow-400/40 transition">Book Appointment</button>
            <button className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition">Live Queue</button>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block"
        >
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,_rgba(255,255,255,0.2),_transparent_45%)] pointer-events-none"></div>
            <p className="text-sm text-slate-300 mb-2 tracking-wide">Live Queue</p>
            <h2 className="text-2xl font-bold mb-4 text-white">Now Serving</h2>
            <div className="text-5xl font-black text-green-400">A102</div>
            <p className="mt-2 text-slate-300">Estimated wait: 5 minutes</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Computer Science Student',
    content: 'MediCampus has revolutionized how I manage my health. No more long waits in queues!',
    avatar: 'SJ'
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Campus Physician',
    content: 'The digital records system makes patient care so much more efficient and accurate.',
    avatar: 'MC'
  },
  {
    name: 'Emma Davis',
    role: 'Nursing Administrator',
    content: 'Streamlined operations and better emergency response. A game-changer for campus healthcare.',
    avatar: 'ED'
  }
];

const stats = [
  { number: '50%', label: 'Reduced Waiting Time' },
  { number: '100%', label: 'Secure Records' },
  { number: '24/7', label: 'Emergency Support' },
  { number: '10k+', label: 'Students Served' }
];

const Testimonials = () => {
  return (
    <section className="py-20 px-10 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-cyan-200 mb-4">Impact & Testimonials</h2>
          <p className="text-lg text-cyan-100/80 max-w-2xl mx-auto">
            See how MediCampus is transforming healthcare on campus
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl text-center shadow-lg border border-white/80 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold text-green-500 mb-2">{stat.number}</div>
              <div className="text-slate-600 font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-slate-800/70 p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.45)] border border-cyan-300/20 backdrop-blur-xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <p className="text-gray-700 italic leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
                  <span className="text-slate-600 text-sm">{testimonial.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
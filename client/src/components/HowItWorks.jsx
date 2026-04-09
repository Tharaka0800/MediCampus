import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    step: 1,
    title: 'Register/Login',
    description: 'Create your account or sign in to access the MediCampus platform.'
  },
  {
    step: 2,
    title: 'Book Appointment',
    description: 'Choose your preferred doctor, date, and time for consultation.'
  },
  {
    step: 3,
    title: 'Track Queue',
    description: 'Monitor your queue position in real-time and get notified updates.'
  },
  {
    step: 4,
    title: 'Get Consultation & Records',
    description: 'Receive medical care and access your digital health records securely.'
  }
];

const HowItWorks = () => {
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
          <h2 className="text-4xl font-bold text-cyan-200 mb-4">How It Works</h2>
          <p className="text-lg text-cyan-100/80 max-w-2xl mx-auto">
            Simple steps to better healthcare
          </p>
        </motion.div>
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-600 transform -translate-x-1/2 hidden md:block"></div>
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-600 md:hidden"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex justify-center mb-12 relative md:justify-start"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className={`flex items-center bg-slate-900/70 p-8 rounded-xl shadow-xl border border-cyan-300/25 backdrop-blur-sm max-w-md relative ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse md:text-right'
              } flex-col text-center md:text-left`}>
                <div className={`w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 md:mb-0 flex-shrink-0 ${
                  index % 2 === 0 ? 'md:mr-6' : 'md:ml-6 md:order-2'
                }`}>
                  {step.step}
                </div>
                <div className={index % 2 === 0 ? '' : 'md:order-1'}>
                  <h3 className="text-xl font-semibold text-cyan-100 mb-2">{step.title}</h3>
                  <p className="text-cyan-100/80 leading-relaxed">{step.description}</p>
                </div>
              </div>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-full w-0.5 h-12 bg-gradient-to-b from-blue-400 to-purple-600 transform -translate-x-1/2 hidden md:block"></div>
              )}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-full w-0.5 h-8 bg-gradient-to-b from-blue-400 to-purple-600 md:hidden"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
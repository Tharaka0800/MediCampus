import React from 'react';
import { motion } from 'framer-motion';
import { School, LocalHospital, AdminPanelSettings, Event } from '@mui/icons-material';

const roles = [
  {
    icon: <School />,
    title: 'Students',
    description: 'Book appointments, track health records, and manage medical certificates with ease.',
    features: ['Appointment booking', 'Queue tracking', 'Digital records', 'Certificate requests']
  },
  {
    icon: <LocalHospital />,
    title: 'Doctors',
    description: 'Manage patient consultations, update records, and provide efficient healthcare services.',
    features: ['Patient management', 'Record updates', 'Consultation scheduling', 'Emergency handling']
  },
  {
    icon: <AdminPanelSettings />,
    title: 'Admin/Nurse',
    description: 'Oversee operations, manage queues, and ensure smooth healthcare delivery.',
    features: ['Queue management', 'System administration', 'Staff coordination', 'Reports & analytics']
  },
  {
    icon: <Event />,
    title: 'Event Organizers',
    description: 'Coordinate health events, blood drives, and wellness programs for the campus community.',
    features: ['Event planning', 'Participant management', 'Health campaigns', 'Community outreach']
  }
];

const Roles = () => {
  return (
    <section className="py-20 px-10 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-cyan-200 mb-4">User Roles</h2>
          <p className="text-lg text-cyan-100/80 max-w-2xl mx-auto">
            Tailored experiences for every member of our healthcare community
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={index}
              className="bg-slate-900/75 p-8 rounded-2xl shadow-[0_20px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_45px_rgba(72,72,255,0.45)] transition-all duration-300 hover:-translate-y-2 border border-cyan-300/35 backdrop-blur-xl text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl">
                {role.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">{role.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{role.description}</p>
              <ul className="text-left space-y-2">
                {role.features.map((feature, idx) => (
                  <li key={idx} className="text-slate-600 pl-6 relative">
                    <span className="absolute left-0 text-green-500 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roles;
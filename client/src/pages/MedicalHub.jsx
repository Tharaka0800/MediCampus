import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';

const cards = [
  {
    icon: '🩹',
    title: 'Apply for Medical Certificate',
    desc: 'Fill out an online medical form and select a doctor for approval. No paperwork needed.',
    link: '/medical/apply',
    color: 'from-indigo-500 to-fuchsia-500',
    bg: 'from-indigo-50 to-fuchsia-50 dark:from-indigo-950 dark:to-fuchsia-950',
    border: 'border-indigo-200 dark:border-indigo-800',
    cta: 'Apply Now →',
  },
  {
    icon: '📋',
    title: 'Track My Application',
    desc: 'Check the status of your medical request, view validity dates, and download your PDF certificate.',
    link: '/medical/status',
    color: 'from-emerald-500 to-teal-500',
    bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950',
    border: 'border-emerald-200 dark:border-emerald-800',
    cta: 'Check Status →',
  },
  {
    icon: '👨‍⚕️',
    title: 'Doctor Approval Panel',
    desc: 'Doctors can review pending applications, add diagnosis notes, and issue verified certificates.',
    link: '/medical/doctor',
    color: 'from-blue-500 to-indigo-500',
    bg: 'from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950',
    border: 'border-blue-200 dark:border-blue-800',
    cta: 'Go to Panel →',
  },
  {
    icon: '🔐',
    title: 'Verify a Certificate',
    desc: 'University staff and admins can instantly verify the authenticity of any medical certificate by ID.',
    link: '/verify',
    color: 'from-fuchsia-500 to-rose-500',
    bg: 'from-fuchsia-50 to-rose-50 dark:from-fuchsia-950 dark:to-rose-950',
    border: 'border-fuchsia-200 dark:border-fuchsia-800',
    cta: 'Verify Certificate →',
  },
];

const steps = [
  { step: '01', icon: '📝', title: 'Student Applies', desc: 'Fill out the online form with exam details and illness description.' },
  { step: '02', icon: '🩺', title: 'Doctor Reviews', desc: 'The assigned doctor reviews and conducts consultation.' },
  { step: '03', icon: '✅', title: 'Certificate Issued', desc: 'Upon approval, a secure digital certificate is auto-generated.' },
  { step: '04', icon: '⬇️', title: 'Student Downloads', desc: 'Student downloads the PDF with embedded QR code.' },
  { step: '05', icon: '🔍', title: 'Admin Verifies', desc: 'University staff verify authenticity via the certificate ID or QR scan.' },
];

const MedicalHub = () => {
  return (
    <StudentLayout title="Medical Hub" subtitle="Secure Digital Medical Certificate System">
      <div className="max-w-6xl mx-auto py-8">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block text-7xl mb-6"
          >
            🏥
          </motion.div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold mb-5">
            ✨ Digital Medical Certificate System
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            Smart Medical Certificates<br />
            <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">for University Exams</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-gray-400 max-w-2xl mx-auto">
            Eliminate fake certificates, reduce manual work, and improve efficiency in university healthcare through secure digital verification.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <Link to={card.link}
                className={`flex flex-col h-full p-8 rounded-3xl bg-gradient-to-br ${card.bg} border ${card.border} shadow-lg hover:shadow-2xl transition-all group`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.color} text-white text-3xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{card.title}</h3>
                <p className="text-slate-500 dark:text-gray-400 text-sm flex-1">{card.desc}</p>
                <div className={`mt-5 text-sm font-black bg-gradient-to-r ${card.color} bg-clip-text text-transparent group-hover:translate-x-1 transition-transform`}>
                  {card.cta}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="relative flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-slate-100 dark:border-gray-700"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white text-xs font-black flex items-center justify-center shadow-lg">
                  {s.step}
                </div>
                <div className="text-4xl mb-3 mt-1">{s.icon}</div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">{s.title}</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: '🔒', label: 'Tamper-Proof ID' },
            { icon: '📱', label: 'QR Verification' },
            { icon: '📄', label: 'PDF Certificate' },
            { icon: '🛡️', label: 'Fraud Prevention' },
            { icon: '⚡', label: 'Instant Verification' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-slate-200 dark:border-gray-700 text-sm font-semibold text-slate-700 dark:text-gray-300">
              <span>{b.icon}</span>{b.label}
            </div>
          ))}
        </motion.div>
      </div>
    </StudentLayout>
  );
};

export default MedicalHub;

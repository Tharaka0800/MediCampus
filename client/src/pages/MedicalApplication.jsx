import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MedicalApplication = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    studentId: '',
    doctorId: '',
    examName: '',
    examDate: '',
    illness: '',
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(() => setDoctors([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.doctorId || !form.examName || !form.examDate || !form.illness) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/medical/apply', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-fuchsia-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 flex items-center justify-center p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 text-center max-w-md w-full"
        >
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Application Submitted!</h2>
          <p className="text-slate-500 dark:text-gray-400 mb-8">Your medical certificate request has been sent to the doctor for review. You'll be notified once it's processed.</p>
          <div className="flex flex-col gap-3">
            <Link to="/medical/status" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition">
              Track My Applications →
            </Link>
            <Link to="/medical/apply" onClick={() => setSubmitted(false)} className="w-full py-3 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition">
              Submit Another
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-fuchsia-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold mb-4">
            🩺 Medical Certificate Request
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">Apply for Medical Leave</h1>
          <p className="text-slate-500 dark:text-gray-400">Submit your request for a medical certificate for exam exemption.</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-slate-100 dark:border-gray-700 p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student ID */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Student / Registration Number *</label>
              <input
                type="text"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                placeholder="e.g. IT21123456"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Select Doctor *</label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="">-- Select a doctor --</option>
                {doctors.length > 0
                  ? doctors.map(d => (
                    <option key={d._id} value={d._id}>{d.name} — {d.specialization}</option>
                  ))
                  : <option value="DR001">Dr. General (Demo)</option>
                }
              </select>
            </div>

            {/* Exam Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Exam / Course Name *</label>
              <input
                type="text"
                name="examName"
                value={form.examName}
                onChange={handleChange}
                placeholder="e.g. Software Engineering - Final Exam"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Exam Date */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Exam Date *</label>
              <input
                type="date"
                name="examDate"
                value={form.examDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Illness Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Illness / Reason Description *</label>
              <textarea
                name="illness"
                value={form.illness}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your symptoms and why you need a medical certificate..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-500 hover:from-indigo-500 hover:to-fuchsia-400 text-white font-black rounded-xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed text-lg"
            >
              {loading ? '⏳ Submitting...' : '📤 Submit Medical Application'}
            </motion.button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-gray-700 flex gap-4 justify-center text-sm">
            <Link to="/medical/status" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Track Status →</Link>
            <Link to="/verify" className="text-fuchsia-600 dark:text-fuchsia-400 hover:underline font-semibold">Verify Certificate →</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MedicalApplication;

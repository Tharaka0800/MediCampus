import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const DoctorMedicalPanel = () => {
  const [doctorId, setDoctorId] = useState('');
  const [searched, setSearched] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeApp, setActiveApp] = useState(null);
  const [approvalForm, setApprovalForm] = useState({ diagnosis: '', validFrom: '', validTo: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchApplications = async () => {
    if (!doctorId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/medical/doctor/${doctorId.trim()}`);
      setApplications(res.data);
      setSearched(doctorId.trim());
    } catch {
      setError('No pending applications found or invalid Doctor ID.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approvalForm.diagnosis || !approvalForm.validFrom || !approvalForm.validTo) {
      alert('Please fill in all approval details.');
      return;
    }
    setActionLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/medical/approve/${activeApp._id}`, approvalForm);
      setSuccessMsg(`✅ Application approved! Certificate generated.`);
      setApplications(prev => prev.filter(a => a._id !== activeApp._id));
      setActiveApp(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this application?')) return;
    setActionLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/medical/reject/${id}`);
      setSuccessMsg('❌ Application rejected.');
      setApplications(prev => prev.filter(a => a._id !== id));
      if (activeApp?._id === id) setActiveApp(null);
    } catch {
      alert('Rejection failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-4">
            👨‍⚕️ Doctor Panel
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">Medical Approval Dashboard</h1>
          <p className="text-slate-500 dark:text-gray-400">Review and approve student medical certificate requests.</p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl font-semibold text-center"
              onAnimationComplete={() => setTimeout(() => setSuccessMsg(''), 3000)}
            >
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Doctor ID Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-slate-100 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={doctorId}
              onChange={e => setDoctorId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchApplications()}
              placeholder="Enter your Doctor ID to view pending applications"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <motion.button onClick={fetchApplications} disabled={loading}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-60"
            >
              {loading ? '...' : '🔍 Load'}
            </motion.button>
          </div>
          {error && <p className="mt-3 text-red-500 text-sm">⚠️ {error}</p>}
        </motion.div>

        {/* Main Content */}
        {searched && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application List */}
            <div className="space-y-4">
              <h2 className="font-black text-slate-900 dark:text-white text-lg">
                Pending Applications ({applications.length})
              </h2>
              {applications.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow border border-slate-100 dark:border-gray-700">
                  <div className="text-5xl mb-4">🎉</div>
                  <p className="text-slate-500 dark:text-gray-400 font-medium">No pending applications!</p>
                </div>
              ) : (
                applications.map((app, i) => (
                  <motion.div key={app._id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    onClick={() => setActiveApp(app)}
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow border p-5 cursor-pointer transition-all hover:shadow-lg ${
                      activeApp?._id === app._id
                        ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-300 dark:ring-blue-700'
                        : 'border-slate-100 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">⏳ PENDING</span>
                      <span className="text-xs text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white">{app.examName}</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Student: <span className="font-semibold">{app.studentId}</span></p>
                    <p className="text-sm text-slate-500 dark:text-gray-400">Exam: <span className="font-semibold">{new Date(app.examDate).toLocaleDateString()}</span></p>
                    <p className="text-sm text-slate-600 dark:text-gray-300 mt-2 line-clamp-2 italic">"{app.illness}"</p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Approval Panel */}
            <div>
              {activeApp ? (
                <motion.div key={activeApp._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-200 dark:border-blue-800 p-6 sticky top-24"
                >
                  <h2 className="font-black text-lg text-slate-900 dark:text-white mb-4">Review Application</h2>

                  <div className="space-y-3 mb-6 p-4 bg-slate-50 dark:bg-gray-900 rounded-xl">
                    <p className="text-sm"><span className="font-bold text-slate-500 dark:text-gray-400">Student:</span> <span className="font-semibold text-slate-800 dark:text-white">{activeApp.studentId}</span></p>
                    <p className="text-sm"><span className="font-bold text-slate-500 dark:text-gray-400">Exam:</span> <span className="font-semibold text-slate-800 dark:text-white">{activeApp.examName}</span></p>
                    <p className="text-sm"><span className="font-bold text-slate-500 dark:text-gray-400">Exam Date:</span> <span className="font-semibold text-slate-800 dark:text-white">{new Date(activeApp.examDate).toLocaleDateString()}</span></p>
                    <p className="text-sm"><span className="font-bold text-slate-500 dark:text-gray-400">Illness:</span> <span className="text-slate-700 dark:text-gray-300 italic">"{activeApp.illness}"</span></p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Diagnosis / Notes *</label>
                      <textarea
                        value={approvalForm.diagnosis}
                        onChange={e => setApprovalForm({ ...approvalForm, diagnosis: e.target.value })}
                        rows={3}
                        placeholder="Enter diagnosis and medical notes..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Valid From *</label>
                        <input type="date" value={approvalForm.validFrom}
                          onChange={e => setApprovalForm({ ...approvalForm, validFrom: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Valid To *</label>
                        <input type="date" value={approvalForm.validTo}
                          onChange={e => setApprovalForm({ ...approvalForm, validTo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <motion.button onClick={handleApprove} disabled={actionLoading}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-black rounded-xl shadow transition disabled:opacity-60"
                    >
                      {actionLoading ? '...' : '✅ Approve & Generate Certificate'}
                    </motion.button>
                    <motion.button onClick={() => handleReject(activeApp._id)} disabled={actionLoading}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="px-5 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-black rounded-xl border border-red-200 dark:border-red-800 transition disabled:opacity-60"
                    >
                      ❌ Reject
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-2xl shadow border border-slate-100 dark:border-gray-700">
                  <div className="text-5xl mb-4">👆</div>
                  <p className="text-slate-500 dark:text-gray-400 font-medium">Select an application to review</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorMedicalPanel;

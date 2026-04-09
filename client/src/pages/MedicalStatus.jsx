import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';

const statusColors = {
  pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', icon: '⏳' },
  approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', icon: '✅' },
  rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: '❌' },
};

const MedicalStatus = () => {
  const [studentId, setStudentId] = useState('');
  const [searched, setSearched] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    if (!studentId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/medical/student/${studentId.trim()}`);
      setApplications(res.data);
      setSearched(studentId.trim());
    } catch (err) {
      setError('Could not fetch applications. Please check your student ID.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, certId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/medical/download/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${certId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download certificate. Please try again.');
    }
  };

  return (
    <StudentLayout title="Medical Status" subtitle="Track your medical applications and download certificates">
      <div className="max-w-4xl mx-auto py-4">
        {/* Search Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-slate-100 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchApplications()}
              placeholder="Enter your Student / Registration Number"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <motion.button
              onClick={fetchApplications}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white font-bold rounded-xl shadow-md hover:from-indigo-500 hover:to-fuchsia-400 transition disabled:opacity-60"
            >
              {loading ? '...' : '🔍 Search'}
            </motion.button>
          </div>
          {error && <p className="mt-3 text-red-500 dark:text-red-400 text-sm">⚠️ {error}</p>}
        </motion.div>

        {/* Applications List */}
        {searched && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl shadow border border-slate-100 dark:border-gray-700"
              >
                <div className="text-5xl mb-4">🗂️</div>
                <p className="text-slate-500 dark:text-gray-400 font-medium">No applications found for <strong className="text-slate-800 dark:text-white">{searched}</strong></p>
                <Link to="/medical/apply" className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition">
                  Apply Now →
                </Link>
              </motion.div>
            ) : (
              applications.map((app, i) => {
                const status = statusColors[app.status] || statusColors.pending;
                return (
                  <motion.div key={app._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-slate-100 dark:border-gray-700 p-6"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                            {status.icon} {app.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">{app.examName}</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                          📅 Exam Date: <span className="font-semibold text-slate-700 dark:text-gray-300">{new Date(app.examDate).toLocaleDateString()}</span>
                        </p>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                          🤒 Illness: <span className="font-semibold text-slate-700 dark:text-gray-300">{app.illness}</span>
                        </p>
                        {app.status === 'approved' && app.validFrom && app.validTo && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-semibold">
                            ✅ Valid: {new Date(app.validFrom).toLocaleDateString()} → {new Date(app.validTo).toLocaleDateString()}
                          </p>
                        )}
                        {app.status === 'approved' && app.certificateId && (
                          <p className="text-xs text-slate-400 dark:text-gray-500 mt-1 font-mono">
                            🆔 Cert ID: {app.certificateId}
                          </p>
                        )}
                        {app.status === 'approved' && app.qrCode && (
                          <div className="mt-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">QR Code</p>
                            <img src={app.qrCode} alt="QR Code" className="w-24 h-24 rounded-lg border border-slate-200 dark:border-gray-600" />
                          </div>
                        )}
                      </div>
                      {app.status === 'approved' && app.certificateId && (
                        <motion.button
                          onClick={() => handleDownload(app._id, app.certificateId)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow hover:from-green-400 hover:to-emerald-400 transition"
                        >
                          ⬇️ Download PDF
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Bottom Links */}
        <div className="mt-8 flex gap-4 justify-center text-sm">
          <Link to="/medical/apply" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">+ New Application</Link>
          <Link to="/verify" className="text-fuchsia-600 dark:text-fuchsia-400 hover:underline font-semibold">🔍 Verify Certificate</Link>
        </div>
      </div>
    </StudentLayout>
  );
};

export default MedicalStatus;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyCertificate = () => {
  const { certificateId: paramId } = useParams(); // Auto-loads when QR is scanned
  const [certId, setCertId] = useState(paramId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Auto-verify when a certificateId is in the URL (QR scan)
  useEffect(() => {
    if (paramId) {
      setCertId(paramId);
      handleVerify(paramId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  const handleVerify = async (id) => {
    const trimmed = (id || certId).trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setResult(null);
    setSearched(false);
    try {
      const res = await axios.get(`http://localhost:5000/api/medical/verify/${trimmed}`);
      setResult(res.data);
      setSearched(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setResult({ valid: false });
      } else {
        setError('Verification failed. Please try again.');
      }
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-fuchsia-50 to-indigo-50 dark:from-gray-900 dark:via-fuchsia-950 dark:to-gray-900 pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300 rounded-full text-sm font-semibold mb-4">
            🔐 Real-time Certificate Verification
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">Verify Medical Certificate</h1>
          <p className="text-slate-500 dark:text-gray-400">Scan QR code to verify instantly — or enter a Certificate ID below.</p>
        </motion.div>

        {/* Search Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-slate-100 dark:border-gray-700 p-8 mb-8"
        >
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={certId}
              onChange={e => { setCertId(e.target.value); setSearched(false); setResult(null); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. MED-A1B2C3D4-7890"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition font-mono text-sm"
            />
            <motion.button onClick={() => handleVerify()} disabled={loading || !certId.trim()}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold rounded-xl shadow-md hover:from-fuchsia-500 hover:to-indigo-500 transition disabled:opacity-60"
            >
              {loading ? '⏳' : '🔍 Verify'}
            </motion.button>
          </div>
          {error && <p className="text-red-500 dark:text-red-400 text-sm">⚠️ {error}</p>}
          <p className="text-xs text-slate-400 dark:text-gray-500 text-center mt-3">
            Format: <span className="font-mono">MED-XXXXXXXX-XXXX</span> · Scan QR Code on any certificate to auto-verify
          </p>
        </motion.div>

        {/* Loader */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-3 border-fuchsia-600 border-t-transparent rounded-full"
                style={{ borderWidth: 3 }}
              />
              <span className="text-slate-600 dark:text-gray-300 font-semibold">Checking database...</span>
            </div>
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {searched && result && !loading && (
            <motion.div
              key={result.valid ? 'valid' : 'invalid'}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {result.valid ? (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-green-400 dark:border-green-600 overflow-hidden">
                  {/* Valid Banner */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white text-center">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                      className="text-6xl mb-2"
                    >✅</motion.div>
                    <h2 className="text-2xl font-black">Certificate Valid</h2>
                    <p className="opacity-80 text-sm mt-1">Authentic & issued by MediCampus</p>
                    {result.expired && (
                      <div className="mt-2 px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold inline-block">
                        ⚠️ Certificate Expired
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {[
                        { label: 'Student ID', value: result.data?.studentId },
                        { label: 'Doctor ID', value: result.data?.doctorId },
                        { label: 'Exam / Course', value: result.data?.examName },
                        { label: 'Exam Date', value: result.data?.examDate ? new Date(result.data.examDate).toLocaleDateString('en-GB') : 'N/A' },
                        { label: 'Valid From', value: result.data?.validFrom ? new Date(result.data.validFrom).toLocaleDateString('en-GB') : 'N/A' },
                        { label: 'Valid To', value: result.data?.validTo ? new Date(result.data.validTo).toLocaleDateString('en-GB') : 'N/A' },
                        { label: 'Issue Date', value: result.data?.issueDate ? new Date(result.data.issueDate).toLocaleDateString('en-GB') : 'N/A' },
                        { label: 'Certificate ID', value: result.data?.certificateId, mono: true },
                      ].map((item, i) => (
                        <div key={i} className="p-3 bg-slate-50 dark:bg-gray-900 rounded-xl">
                          <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">{item.label}</p>
                          <p className={`font-semibold text-slate-800 dark:text-white mt-1 ${item.mono ? 'font-mono text-xs' : ''}`}>{item.value || 'N/A'}</p>
                        </div>
                      ))}
                    </div>

                    {result.data?.diagnosis && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-8">
                        <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase mb-1">Diagnosis / Notes</p>
                        <p className="text-slate-700 dark:text-gray-300 text-sm">{result.data.diagnosis}</p>
                      </div>
                    )}

                    {/* QR Code from DB */}
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide mb-4">QR Verification Code</p>
                      {result.data?.qrCode ? (
                        <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-200">
                          <img src={result.data.qrCode} alt="Certificate QR Code" className="w-40 h-40" />
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-100 dark:bg-gray-900 rounded-2xl text-slate-400 text-sm">QR not available</div>
                      )}
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-3 font-mono">{result.data?.certificateId}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-red-400 dark:border-red-600 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-rose-500 p-8 text-white text-center">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                      className="text-6xl mb-3"
                    >❌</motion.div>
                    <h2 className="text-2xl font-black">Invalid Certificate</h2>
                    <p className="opacity-80 text-sm mt-1">This certificate does not exist or has been revoked.</p>
                  </div>
                  <div className="p-8 text-center">
                    <p className="text-slate-500 dark:text-gray-400 mb-2 text-sm">Certificate ID searched:</p>
                    <p className="font-mono text-slate-800 dark:text-white font-bold text-base">{certId}</p>
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-700 dark:text-red-300 font-semibold">
                        ⚠️ This may be a fraudulent certificate.
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Please report this to the University Administration immediately.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerifyCertificate;

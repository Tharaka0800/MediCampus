import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'http://localhost:5000/api';

export default function CertificateVerify() {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!hash.trim()) { setError('Please enter a verification code.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await axios.get(`${API}/certificates/verify/${hash.trim()}`);
      setResult(res.data);
    } catch(e) {
      setError(e.response?.data?.message || 'Certificate not found or invalid.');
    }
    setLoading(false);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—';

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-teal to-teal-dark rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🔍</div>
          <h1 className="font-serif text-3xl text-mc-text mb-2">Certificate Verification</h1>
          <p className="text-mc-muted text-sm max-w-md mx-auto">
            Enter the verification code from a medical certificate to check its authenticity against the MediCampus database.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white border border-mc-border rounded-2xl p-6 mb-6">
          <label className="block text-xs font-semibold text-mc-text mb-2">Verification Code</label>
          <div className="flex gap-3">
            <input value={hash} onChange={e => setHash(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. A1B2C3D4E5F67890"
              className="flex-1 px-4 py-3.5 bg-gray-50 border border-mc-border rounded-xl text-sm font-mono tracking-wider focus:border-teal focus:ring-2 focus:ring-teal/10 outline-none uppercase" />
            <button onClick={handleVerify} disabled={loading}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-light to-teal-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal/30 transition-all disabled:opacity-50 whitespace-nowrap">
              {loading ? '⏳ Verifying...' : '🔍 Verify'}
            </button>
          </div>
          {error && <p className="text-xs text-mc-error font-medium mt-3 bg-red-50 px-3 py-2 rounded-lg">❌ {error}</p>}
        </div>

        {/* Result */}
        {result && (
          <div className={`rounded-2xl border-2 overflow-hidden animate-fade-in ${result.verified ? 'border-green-300 bg-white' : 'border-red-300 bg-red-50'}`}>
            {/* Status Badge */}
            <div className={`px-6 py-4 flex items-center gap-3 ${result.verified ? 'bg-green-50' : 'bg-red-100'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${result.verified ? 'bg-green-200' : 'bg-red-200'}`}>
                {result.verified ? '✅' : '❌'}
              </div>
              <div>
                <h3 className={`font-serif text-xl ${result.verified ? 'text-green-700' : 'text-red-700'}`}>
                  {result.verified ? 'Certificate Verified' : 'Verification Failed'}
                </h3>
                <p className={`text-xs ${result.verified ? 'text-green-600' : 'text-red-600'}`}>
                  {result.verified ? 'This certificate is authentic and was issued by MediCampus.' : 'This certificate could not be verified.'}
                </p>
              </div>
            </div>

            {result.verified && (
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  {[
                    ['Student Name', result.certificate.studentName],
                    ['Registration No.', result.certificate.registrationNumber],
                    ['Faculty', result.certificate.faculty],
                    ['Issuing Doctor', result.certificate.doctorName],
                    ['Specialization', result.certificate.specialization],
                    ['Certificate Type', result.certificate.certificateType === 'medical-leave' ? 'Medical Leave' : 'Exam Medical'],
                    ['Reason', result.certificate.reason],
                    ['Valid From', formatDate(result.certificate.validFrom)],
                    ['Valid To', formatDate(result.certificate.validTo)],
                    ['Issued On', formatDate(result.certificate.issuedOn)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <label className="text-[10px] font-semibold text-mc-muted uppercase tracking-wider">{label}</label>
                      <p className="text-mc-text font-medium mt-0.5">{value || '—'}</p>
                    </div>
                  ))}
                </div>

                {/* QR Code */}
                <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-mc-muted font-semibold uppercase tracking-wider mb-1">Verification Hash</div>
                    <div className="font-mono text-sm text-teal tracking-wider">{result.certificate.verificationHash}</div>
                  </div>
                  <QRCodeSVG value={`https://medicampus.edu/verify/${result.certificate.verificationHash}`}
                    size={80} fgColor="#0d9488" bgColor="transparent" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-teal-bg border border-green-200 rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-teal-dark mb-2">ℹ️ How to verify</h4>
          <ul className="text-xs text-mc-muted space-y-1.5 leading-relaxed">
            <li>1. Locate the <strong className="text-mc-text">16-character verification code</strong> on the medical certificate</li>
            <li>2. Enter the code in the field above and click Verify</li>
            <li>3. Alternatively, scan the <strong className="text-mc-text">QR code</strong> on the certificate using your phone camera</li>
            <li>4. A valid certificate will display the student and doctor information</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'http://localhost:5000/api';

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API}/doctors/login`, { email, password });
      localStorage.setItem('doctorData', JSON.stringify(res.data.doctor));
      navigate('/doctor/dashboard');
    } catch(e) {
      setError(e.response?.data?.message || 'Login failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header role="doctor" />

      <div className="flex-1 flex">
        {/* Left Panel */}
        <div className="hidden lg:flex w-[48%] bg-gradient-to-br from-teal via-teal-dark to-[#064e3b] flex-col justify-center px-14 relative overflow-hidden">
          <div className="absolute w-80 h-80 bg-[#5eead4]/10 rounded-full blur-[60px] -top-20 -right-20" />
          <div className="absolute w-60 h-60 bg-[#99f6e4]/10 rounded-full blur-[60px] -bottom-16 -left-16" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold text-green-200 tracking-wider uppercase mb-8">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Doctor Portal
            </div>
            <h1 className="font-serif text-[44px] leading-tight text-white mb-5">
              Clinical<br /><em className="text-green-200">Dashboard</em>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-12">
              Access patient records, manage consultations, generate verified medical certificates, and monitor your queue — all from one secure interface.
            </p>
            <div className="space-y-4">
              {[['🩺','View today\'s patient queue'],['📋','Create structured medical records'],['📄','Generate verified certificates'],['🔍','Search patient history']].map(([icon,text]) => (
                <div key={text} className="flex items-center gap-3 text-white/60 text-sm">
                  <div className="w-8 h-8 bg-white/10 border border-white/15 rounded-lg flex items-center justify-center text-base">{icon}</div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="font-serif text-3xl text-mc-text mb-1">Welcome back, Doctor</h2>
              <p className="text-mc-muted text-sm">Sign in to your clinical dashboard</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-mc-text mb-1.5">Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="doctor@medicampus.edu"
                  className="w-full px-4 py-3 bg-white border border-mc-border rounded-xl text-sm focus:border-teal focus:ring-2 focus:ring-teal/10 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-mc-text mb-1.5">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 bg-white border border-mc-border rounded-xl text-sm focus:border-teal focus:ring-2 focus:ring-teal/10 outline-none transition-all" />
              </div>
              {error && <p className="text-xs text-mc-error font-medium bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button onClick={handleLogin} disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-teal-light to-teal-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                {loading ? '⏳ Signing in...' : 'Sign In →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

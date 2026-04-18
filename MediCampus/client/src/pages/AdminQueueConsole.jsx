import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'http://localhost:5000/api';

export default function AdminQueueConsole() {
  const [admin, setAdmin] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [queues, setQueues] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const login = async () => {
    try {
      const res = await axios.post(`${API}/admin/login`, { email, password });
      setAdmin(res.data.admin);
      localStorage.setItem('adminData', JSON.stringify(res.data.admin));
    } catch(e) { setLoginErr(e.response?.data?.message || 'Login failed'); }
  };

  useEffect(() => {
    const saved = localStorage.getItem('adminData');
    if (saved) setAdmin(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!admin) return;
    const load = () => axios.get(`${API}/queue/public`).then(r => setQueues(r.data)).catch(() => {});
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [admin]);

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const res = await axios.get(`${API}/queue/search?query=${search}`);
      setSearchResults(res.data);
    } catch(e) { setSearchResults([]); }
  };

  const handleNext = async (id) => {
    await axios.put(`${API}/queue/${id}/next`).catch(() => {});
    axios.get(`${API}/queue/public`).then(r => setQueues(r.data));
  };

  const handleEmergency = async (id) => {
    await axios.put(`${API}/queue/${id}/emergency-override`).catch(() => {});
    axios.get(`${API}/queue/public`).then(r => setQueues(r.data));
  };

  const handleSkip = async (id) => {
    await axios.put(`${API}/queue/${id}/skip`).catch(() => {});
    axios.get(`${API}/queue/public`).then(r => setQueues(r.data));
  };

  const logout = () => { setAdmin(null); localStorage.removeItem('adminData'); };

  // ── Login Screen ──
  if (!admin) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Header role="admin" />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal to-teal-dark rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🏥</div>
              <h1 className="font-serif text-2xl text-mc-text">Admin Console</h1>
              <p className="text-sm text-mc-muted mt-1">Queue Management System</p>
            </div>
            <div className="bg-white border border-mc-border rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-mc-text mb-1.5">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@medicampus.edu"
                  className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm focus:border-teal focus:ring-2 focus:ring-teal/10 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-mc-text mb-1.5">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm focus:border-teal focus:ring-2 focus:ring-teal/10 outline-none" />
              </div>
              {loginErr && <p className="text-xs text-mc-error font-medium">{loginErr}</p>}
              <button onClick={login} className="w-full py-3 bg-gradient-to-r from-teal-light to-teal-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal/30 transition-all">Sign In</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="admin" userName={admin.name} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-mc-text">Queue Console</h1>
            <p className="text-mc-muted text-sm">Manage patient flow, check-ins & emergencies • Auto-refreshes every 5s</p>
          </div>
          <button onClick={logout} className="px-4 py-2 text-sm text-mc-muted border border-mc-border rounded-xl hover:bg-gray-100 transition-all">Sign Out</button>
        </div>

        {/* Search */}
        <div className="bg-white border border-mc-border rounded-2xl p-5 mb-6">
          <div className="flex gap-3">
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="🔍 Search patient by name or ID..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm focus:border-teal focus:ring-2 focus:ring-teal/10 outline-none" />
            <button onClick={handleSearch} className="px-6 py-3 bg-teal text-white font-semibold text-sm rounded-xl hover:bg-teal-dark transition-all">Search</button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-4 divide-y divide-gray-100">
              {searchResults.map(q => (
                <div key={q._id} className="py-3 flex items-center gap-4">
                  <span className="w-10 h-10 bg-teal-bg rounded-full flex items-center justify-center text-teal font-bold text-sm">{q.tokenNumber}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-mc-text">{q.studentId?.studentName}</div>
                    <div className="text-xs text-mc-muted">{q.studentId?.registrationNumber} • {q.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEmergency(q._id)} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100">🚨 Emergency</button>
                    <button onClick={() => handleSkip(q._id)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200">Skip</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Queue Cards per Doctor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {queues.map((group, gi) => (
            <div key={gi} className="bg-white border border-mc-border rounded-2xl overflow-hidden">
              {/* Doctor Header */}
              <div className="bg-gradient-to-r from-teal to-teal-dark p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-serif text-lg">{group.doctor?.name}</div>
                    <div className="text-xs text-white/70">{group.doctor?.specialization} • {group.doctor?.room}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/60">NOW SERVING</div>
                    <div className="font-serif text-3xl">{group.currentToken || '—'}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-white/80">
                  <span>⏳ Waiting: <strong className="text-white">{group.waitingCount}</strong></span>
                  <span>📊 Est. wait: <strong className="text-white">~{group.waitingCount * 15} min</strong></span>
                </div>
              </div>

              {/* Queue List */}
              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {group.queue.map(q => (
                  <div key={q._id} className={`p-4 flex items-center gap-3 ${q.status === 'in-consultation' ? 'bg-teal-bg' : ''}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                      q.priority === 'emergency' ? 'bg-red-100 text-red-600' :
                      q.status === 'in-consultation' ? 'bg-teal text-white' :
                      'bg-gray-100 text-mc-muted'
                    }`}>{q.tokenNumber}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-mc-text truncate">{q.studentId?.studentName}</div>
                      <div className="text-[11px] text-mc-muted">
                        {q.priority === 'emergency' && <span className="text-red-500 font-semibold mr-2">🚨 EMERGENCY</span>}
                        {q.status === 'in-consultation' ? '🟢 In Consultation' : `⏳ ~${q.estimatedWaitMinutes} min wait`}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {q.status === 'in-consultation' && (
                        <button onClick={() => handleNext(q._id)} className="px-3 py-1.5 bg-mc-green-bg text-mc-green text-xs font-semibold rounded-lg hover:bg-green-100">✓ Done</button>
                      )}
                      {q.status === 'waiting' && (
                        <>
                          <button onClick={() => handleEmergency(q._id)} className="px-2 py-1.5 bg-red-50 text-red-500 text-[11px] font-semibold rounded-lg hover:bg-red-100" title="Emergency Override">🚨</button>
                          <button onClick={() => handleSkip(q._id)} className="px-2 py-1.5 bg-gray-100 text-gray-500 text-[11px] font-semibold rounded-lg hover:bg-gray-200" title="Skip">⏭</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {group.queue.length === 0 && (
                  <div className="p-8 text-center text-mc-muted text-sm">No patients in queue</div>
                )}
              </div>
            </div>
          ))}
          {queues.length === 0 && (
            <div className="col-span-2 bg-white border border-mc-border rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">🏥</div>
              <h3 className="font-serif text-xl text-mc-text mb-2">No Active Queues</h3>
              <p className="text-mc-muted text-sm">Queues will appear here when patients check in</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

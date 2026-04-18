import { useState, useEffect } from 'react';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'http://localhost:5000/api';

export default function EmergencyCenter() {
  const { profile } = useProfile();
  const [view, setView] = useState('sos'); // sos | command
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [emergencyType, setEmergencyType] = useState('medical');
  const [severity, setSeverity] = useState('high');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null, description: '' });

  // Command center state (for admin/medical team)
  const [incidents, setIncidents] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation(l => ({ ...l, lat: pos.coords.latitude, lng: pos.coords.longitude })),
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    if (view === 'command') {
      const load = () => {
        axios.get(`${API}/emergency/active`).then(r => setIncidents(r.data)).catch(() => {});
        axios.get(`${API}/doctors`).then(r => setDoctors(r.data)).catch(() => {});
      };
      load();
      const interval = setInterval(load, 5000);
      return () => clearInterval(interval);
    }
  }, [view]);

  const sendSOS = async () => {
    if (!profile?._id) { alert('Please log in first.'); return; }
    if (!description.trim()) { alert('Please describe the emergency.'); return; }
    setSending(true);
    try {
      await axios.post(`${API}/emergency`, {
        reportedBy: profile._id,
        type: emergencyType,
        severity,
        location,
        description
      });
      setSent(true);
    } catch(e) { alert(e.response?.data?.message || 'Failed to send.'); }
    setSending(false);
  };

  const handleDispatch = async (emergencyId, doctorId) => {
    await axios.put(`${API}/emergency/${emergencyId}/dispatch`, { doctorId }).catch(() => {});
    axios.get(`${API}/emergency/active`).then(r => setIncidents(r.data));
  };

  const handleResolve = async (id) => {
    const notes = window.prompt('Resolution notes:');
    await axios.put(`${API}/emergency/${id}/resolve`, { notes }).catch(() => {});
    axios.get(`${API}/emergency/active`).then(r => setIncidents(r.data));
  };

  const handleSearch = async () => {
    if (!searchQ.trim()) {
      axios.get(`${API}/emergency/active`).then(r => setIncidents(r.data));
      return;
    }
    try {
      const res = await axios.get(`${API}/emergency/search?query=${searchQ}`);
      setIncidents(res.data);
    } catch(e) { setIncidents([]); }
  };

  const severityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700 animate-pulse'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="student" userName={profile?.studentName} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-mc-text mb-1">🚨 Emergency Center</h1>
          <p className="text-mc-muted text-sm">Quick emergency alerts and medical team coordination</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-mc-border rounded-xl p-1 w-fit mb-8">
          <button onClick={() => setView('sos')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${view === 'sos' ? 'bg-red-500 text-white' : 'text-mc-muted hover:bg-gray-50'}`}>
            🆘 Send SOS
          </button>
          <button onClick={() => setView('command')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${view === 'command' ? 'bg-teal text-white' : 'text-mc-muted hover:bg-gray-50'}`}>
            📡 Command Center
          </button>
        </div>

        {/* ══════ SOS ══════ */}
        {view === 'sos' && !sent && (
          <div className="max-w-lg mx-auto">
            {/* Big SOS Button */}
            <div className="text-center mb-8">
              <button onClick={sendSOS} disabled={sending || !description.trim()}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 hover:scale-105 active:scale-95 transition-all mx-auto flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="text-4xl mb-1">🆘</span>
                <span className="font-bold text-lg">{sending ? 'Sending...' : 'SEND SOS'}</span>
              </button>
              <p className="text-mc-muted text-xs mt-4">Press the button to alert the medical team</p>
            </div>

            <div className="bg-white border border-mc-border rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-mc-text mb-2">Emergency Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['medical','🏥 Medical'],['injury','🩹 Injury'],['mental-health','🧠 Mental Health'],['other','❓ Other']].map(([val, label]) => (
                    <button key={val} onClick={() => setEmergencyType(val)}
                      className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                        emergencyType === val ? 'border-red-400 bg-red-50 text-red-700' : 'border-mc-border text-mc-muted hover:border-red-200'
                      }`}>{label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-mc-text mb-2">Severity</label>
                <div className="grid grid-cols-4 gap-2">
                  {['low','medium','high','critical'].map(s => (
                    <button key={s} onClick={() => setSeverity(s)}
                      className={`py-2 rounded-lg text-xs font-semibold border-2 transition-all capitalize ${
                        severity === s ? severityColors[s] + ' border-current' : 'border-mc-border text-mc-muted'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-mc-text mb-2">Description *</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the emergency situation..."
                  className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm resize-none h-24 focus:border-red-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-mc-text mb-2">Location</label>
                <input value={location.description} onChange={e => setLocation(l => ({...l, description: e.target.value}))}
                  placeholder="e.g. Block A, 3rd Floor, Room 312"
                  className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm focus:border-red-400 outline-none" />
                {location.lat && (
                  <p className="text-[10px] text-mc-muted mt-1">📍 GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SOS Sent */}
        {view === 'sos' && sent && (
          <div className="max-w-md mx-auto bg-white border-2 border-green-300 rounded-2xl p-10 text-center animate-bounce-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 animate-pulse">🚑</div>
            <h2 className="font-serif text-2xl text-mc-text mb-2">Help is On the Way!</h2>
            <p className="text-mc-muted text-sm mb-1">Your emergency alert has been sent to the medical team.</p>
            <p className="text-mc-muted text-sm mb-6">Stay calm and wait at your location.</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm">
              <div className="flex justify-between mb-2"><span className="text-mc-muted">Type</span><span className="font-medium text-mc-text capitalize">{emergencyType}</span></div>
              <div className="flex justify-between mb-2"><span className="text-mc-muted">Severity</span><span className={`font-semibold capitalize ${severityColors[severity]?.split(' ')[1]}`}>{severity}</span></div>
              <div className="flex justify-between"><span className="text-mc-muted">Status</span><span className="font-semibold text-mc-green">Reported</span></div>
            </div>
            <button onClick={() => { setSent(false); setDescription(''); }}
              className="px-6 py-2.5 bg-teal text-white font-semibold text-sm rounded-xl hover:bg-teal-dark transition-all">Done</button>
          </div>
        )}

        {/* ══════ COMMAND CENTER ══════ */}
        {view === 'command' && (
          <div>
            <div className="bg-white border border-mc-border rounded-2xl p-5 mb-6">
              <div className="flex gap-3">
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="🔍 Search incidents by type, description, or student..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm focus:border-teal outline-none" />
                <button onClick={handleSearch} className="px-6 py-3 bg-teal text-white text-sm font-semibold rounded-xl">Search</button>
              </div>
            </div>

            <div className="space-y-4">
              {incidents.length === 0 ? (
                <div className="bg-white border border-mc-border rounded-2xl p-12 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-serif text-xl text-mc-text mb-2">All Clear</h3>
                  <p className="text-mc-muted text-sm">No active emergencies. Auto-refreshing every 5s.</p>
                </div>
              ) : incidents.map(inc => (
                <div key={inc._id} className={`bg-white border-2 rounded-2xl overflow-hidden ${
                  inc.severity === 'critical' ? 'border-red-300 shadow-lg shadow-red-100' :
                  inc.severity === 'high' ? 'border-orange-200' : 'border-mc-border'
                }`}>
                  <div className="p-5 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${severityColors[inc.severity]}`}>
                      {inc.type === 'medical' ? '🏥' : inc.type === 'injury' ? '🩹' : inc.type === 'mental-health' ? '🧠' : '❓'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${severityColors[inc.severity]}`}>{inc.severity}</span>
                        <span className="text-[10px] font-semibold uppercase text-mc-muted capitalize">{inc.type.replace('-',' ')}</span>
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          inc.status === 'reported' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>{inc.status}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-mc-text">{inc.reportedBy?.studentName || 'Unknown'}</h4>
                      <p className="text-xs text-mc-muted mt-1">{inc.description}</p>
                      {inc.location?.description && <p className="text-xs text-mc-muted mt-1">📍 {inc.location.description}</p>}
                      <p className="text-[10px] text-mc-muted mt-2">Reported {new Date(inc.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {inc.status === 'reported' && (
                        <select onChange={e => e.target.value && handleDispatch(inc._id, e.target.value)} defaultValue=""
                          className="px-3 py-2 text-xs border border-mc-border rounded-lg bg-white outline-none">
                          <option value="">Dispatch...</option>
                          {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                        </select>
                      )}
                      {inc.status === 'dispatched' && (
                        <>
                          <div className="text-xs text-mc-blue font-semibold">🚑 {inc.assignedTo?.name}</div>
                          <button onClick={() => handleResolve(inc._id)}
                            className="px-3 py-1.5 bg-mc-green-bg text-mc-green text-xs font-semibold rounded-lg hover:bg-green-100">✓ Resolve</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'http://localhost:5000/api';

export default function EventPortal() {
  const { profile } = useProfile();
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('browse'); // browse | my | details
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [regQR, setRegQR] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/events`).then(r => setEvents(r.data)).catch(() => {});
    if (profile?._id) {
      axios.get(`${API}/events/student/${profile._id}`).then(r => setMyEvents(r.data)).catch(() => {});
    }
  }, [profile]);

  const handleRegister = async (eventId) => {
    if (!profile?._id) { setError('Please log in first.'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API}/events/${eventId}/register`, { studentId: profile._id });
      setRegQR(res.data.qrToken);
      axios.get(`${API}/events`).then(r => setEvents(r.data));
      axios.get(`${API}/events/student/${profile._id}`).then(r => setMyEvents(r.data));
    } catch(e) {
      setError(e.response?.data?.message || 'Registration failed.');
    }
    setLoading(false);
  };

  const isRegistered = (event) => event.registrations?.some(r => r.studentId === profile?._id);
  const getEventIcon = (type) => ({ 'blood-drive': '🩸', 'health-camp': '🏥', 'vaccination': '💉', 'workshop': '📚' }[type] || '📋');
  const getEventColor = (type) => ({ 'blood-drive': 'bg-red-50 text-red-600 border-red-200', 'health-camp': 'bg-teal-bg text-teal border-green-200', 'vaccination': 'bg-blue-50 text-blue-600 border-blue-200', 'workshop': 'bg-purple-50 text-purple-600 border-purple-200' }[type] || 'bg-gray-50 text-gray-600');
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="student" userName={profile?.studentName} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-mc-text mb-1">Health Events</h1>
          <p className="text-mc-muted text-sm">Browse campus health events, check eligibility, and register</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-mc-border rounded-xl p-1 w-fit mb-8">
          <button onClick={() => { setView('browse'); setRegQR(null); setError(''); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${view === 'browse' ? 'bg-teal text-white' : 'text-mc-muted hover:bg-gray-50'}`}>
            🎪 Browse Events
          </button>
          <button onClick={() => { setView('my'); setRegQR(null); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${view === 'my' ? 'bg-teal text-white' : 'text-mc-muted hover:bg-gray-50'}`}>
            📋 My Registrations ({myEvents.length})
          </button>
        </div>

        {/* Registration Success QR */}
        {regQR && (
          <div className="bg-white border-2 border-green-300 rounded-2xl p-8 text-center mb-8 animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🎉</div>
            <h3 className="font-serif text-xl text-mc-text mb-2">Registration Successful!</h3>
            <p className="text-mc-muted text-sm mb-5">Show this QR code at the event entrance for check-in</p>
            <div className="bg-gray-50 rounded-2xl p-6 inline-block">
              <QRCodeSVG value={regQR} size={140} fgColor="#0d9488" bgColor="transparent" />
              <div className="mt-3 font-mono text-xs text-mc-muted tracking-wider">{regQR}</div>
            </div>
            <button onClick={() => setRegQR(null)} className="block mx-auto mt-5 text-sm text-teal font-semibold hover:underline">Close</button>
          </div>
        )}

        {error && <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-6">{error}</div>}

        {/* ══════ BROWSE EVENTS ══════ */}
        {view === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {events.map(evt => (
              <div key={evt._id} className="bg-white border border-mc-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-teal/5 transition-all">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${getEventColor(evt.type)}`}>
                      {getEventIcon(evt.type)}
                    </div>
                    <div>
                      <div className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block border ${getEventColor(evt.type)}`}>
                        {(evt.type || 'event').replace('-', ' ')}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg text-mc-text mb-2">{evt.title}</h3>
                  <p className="text-xs text-mc-muted leading-relaxed mb-4 line-clamp-2">{evt.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="bg-gray-50 rounded-lg p-2.5"><span className="text-mc-muted">📅 Date</span><p className="font-semibold text-mc-text mt-0.5">{formatDate(evt.date)}</p></div>
                    <div className="bg-gray-50 rounded-lg p-2.5"><span className="text-mc-muted">📍 Location</span><p className="font-semibold text-mc-text mt-0.5">{evt.location}</p></div>
                    <div className="bg-gray-50 rounded-lg p-2.5"><span className="text-mc-muted">👥 Spots</span><p className="font-semibold text-mc-text mt-0.5">{evt.registrations?.length || 0}/{evt.maxParticipants}</p></div>
                    <div className="bg-gray-50 rounded-lg p-2.5"><span className="text-mc-muted">🏢 Organizer</span><p className="font-semibold text-mc-text mt-0.5">{evt.organizer}</p></div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                    <div className="bg-teal h-1.5 rounded-full transition-all" style={{ width: `${Math.min(((evt.registrations?.length || 0) / evt.maxParticipants) * 100, 100)}%` }} />
                  </div>

                  {isRegistered(evt) ? (
                    <div className="bg-mc-green-bg text-mc-green text-xs font-semibold px-4 py-2.5 rounded-xl text-center">✓ You are registered</div>
                  ) : (
                    <button onClick={() => handleRegister(evt._id)} disabled={loading || (evt.registrations?.length >= evt.maxParticipants)}
                      className="w-full py-2.5 bg-gradient-to-r from-teal-light to-teal-dark text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-teal/30 transition-all disabled:opacity-50">
                      {evt.registrations?.length >= evt.maxParticipants ? 'Event Full' : 'Register Now →'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="col-span-2 bg-white border border-mc-border rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">🎪</div>
                <h3 className="font-serif text-xl text-mc-text mb-2">No Events Yet</h3>
                <p className="text-mc-muted text-sm">Health events will appear here when they're scheduled</p>
              </div>
            )}
          </div>
        )}

        {/* ══════ MY REGISTRATIONS ══════ */}
        {view === 'my' && (
          <div className="bg-white border border-mc-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-serif text-lg text-mc-text">My Registered Events</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {myEvents.length === 0 ? (
                <div className="p-10 text-center text-mc-muted"><div className="text-4xl mb-3">📭</div>No registrations yet</div>
              ) : myEvents.map(evt => {
                const myReg = evt.registrations?.find(r => r.studentId === profile?._id);
                return (
                  <div key={evt._id} className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${getEventColor(evt.type)}`}>
                      {getEventIcon(evt.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-mc-text">{evt.title}</div>
                      <div className="text-xs text-mc-muted mt-0.5">{formatDate(evt.date)} • {evt.location}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {myReg?.attended ? (
                        <span className="text-xs bg-mc-green-bg text-mc-green font-semibold px-3 py-1 rounded-full">✓ Attended</span>
                      ) : (
                        <span className="text-xs bg-mc-warn-bg text-mc-warn font-semibold px-3 py-1 rounded-full">Registered</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'http://localhost:5000/api';

export default function BookAppointment() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [view, setView] = useState('book'); // 'book' | 'my'

  useEffect(() => {
    axios.get(`${API}/doctors`).then(r => setDoctors(r.data)).catch(() => {});
    if (profile?._id) {
      axios.get(`${API}/appointments/student/${profile._id}`).then(r => setAppointments(r.data)).catch(() => {});
    }
  }, [profile]);

  const timeSlots = [
    '09:00-09:30','09:30-10:00','10:00-10:30','10:30-11:00',
    '11:00-11:30','11:30-12:00','14:00-14:30','14:30-15:00',
    '15:00-15:30','15:30-16:00','16:00-16:30','16:30-17:00'
  ];

  const handleBook = async () => {
    if (!selectedDoctor || !date || !timeSlot) {
      setError('Please select a doctor, date, and time slot.');
      return;
    }
    if (!profile?.isProfileComplete) {
      setError('Please complete your health profile first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/appointments`, {
        studentId: profile._id, doctorId: selectedDoctor._id,
        date, timeSlot, reason, isEmergency
      });
      setSuccess(res.data.appointment);
      setAppointments(prev => [res.data.appointment, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment.');
    }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await axios.put(`${API}/appointments/${id}/cancel`);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
    } catch(err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });

  if (!profile) {
    return (
      <div className="min-h-screen bg-cream">
        <Header role="student" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center"><p className="text-mc-muted">Please log in to book appointments.</p>
            <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-teal text-white rounded-xl font-semibold hover:bg-teal-dark transition-all">Go to Login</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="student" userName={profile?.studentName} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-mc-text mb-1">Appointments</h1>
          <p className="text-mc-muted text-sm">Book, manage, and track your clinic appointments</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-mc-border rounded-xl p-1 w-fit mb-8">
          <button onClick={() => { setView('book'); setSuccess(null); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${view === 'book' ? 'bg-teal text-white' : 'text-mc-muted hover:bg-gray-50'}`}>
            📅 Book Appointment
          </button>
          <button onClick={() => setView('my')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${view === 'my' ? 'bg-teal text-white' : 'text-mc-muted hover:bg-gray-50'}`}>
            📋 My Appointments ({appointments.filter(a => a.status !== 'cancelled').length})
          </button>
        </div>

        {/* ══════ BOOKING FORM ══════ */}
        {view === 'book' && !success && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Doctor Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-mc-border rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-bg rounded-xl flex items-center justify-center text-lg">👨‍⚕️</div>
                  <div>
                    <h3 className="font-serif text-lg text-mc-text">Select Doctor</h3>
                    <p className="text-xs text-mc-muted">Choose your preferred physician</p>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctors.map(doc => (
                    <button key={doc._id} onClick={() => setSelectedDoctor(doc)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        selectedDoctor?._id === doc._id
                          ? 'border-teal bg-teal-bg shadow-md'
                          : 'border-mc-border hover:border-teal-light bg-white'
                      }`}>
                      <div className="font-semibold text-mc-text text-sm">{doc.name}</div>
                      <div className="text-xs text-mc-muted mt-1">{doc.specialization} • {doc.room}</div>
                      <div className="text-xs text-teal font-medium mt-2">Max {doc.maxPatientsPerSlot} patients/slot</div>
                    </button>
                  ))}
                  {doctors.length === 0 && <p className="text-mc-muted text-sm col-span-2">Loading doctors...</p>}
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-white border border-mc-border rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-mc-blue-bg rounded-xl flex items-center justify-center text-lg">🗓️</div>
                  <div>
                    <h3 className="font-serif text-lg text-mc-text">Date & Time</h3>
                    <p className="text-xs text-mc-muted">Pick your preferred schedule</p>
                  </div>
                </div>
                <div className="p-5">
                  <label className="block text-xs font-semibold text-mc-text mb-2">Appointment Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full sm:w-64 px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm focus:border-teal focus:ring-2 focus:ring-teal/10 outline-none transition-all" />

                  <label className="block text-xs font-semibold text-mc-text mb-2 mt-5">Time Slot</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map(slot => (
                      <button key={slot} onClick={() => setTimeSlot(slot)}
                        className={`py-2.5 rounded-lg text-xs font-medium border transition-all ${
                          timeSlot === slot
                            ? 'border-teal bg-teal text-white'
                            : 'border-mc-border text-mc-muted hover:border-teal-light hover:bg-teal-bg'
                        }`}>
                        {slot.split('-')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-white border border-mc-border rounded-2xl p-5">
                <label className="block text-xs font-semibold text-mc-text mb-2">Reason for Visit (optional)</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit..."
                  className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm resize-none h-20 focus:border-teal focus:ring-2 focus:ring-teal/10 outline-none transition-all" />

                <label className="flex items-center gap-3 mt-4 cursor-pointer">
                  <div onClick={() => setIsEmergency(!isEmergency)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isEmergency ? 'bg-red-500 border-red-500' : 'border-gray-300'}`}>
                    {isEmergency && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm text-mc-text font-medium">🚨 Mark as Emergency (priority queue)</span>
                </label>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-mc-border rounded-2xl p-5 sticky top-20">
                <h3 className="font-serif text-lg text-mc-text mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-mc-muted">Doctor</span>
                    <span className="font-medium text-mc-text">{selectedDoctor?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-mc-muted">Date</span>
                    <span className="font-medium text-mc-text">{date ? formatDate(date) : '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-mc-muted">Time</span>
                    <span className="font-medium text-mc-text">{timeSlot || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-mc-muted">Room</span>
                    <span className="font-medium text-mc-text">{selectedDoctor?.room || '—'}</span>
                  </div>
                  {isEmergency && (
                    <div className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg text-center">🚨 Emergency Priority</div>
                  )}
                </div>

                {error && <div className="mt-4 bg-red-50 text-red-600 text-xs font-medium px-3 py-2 rounded-lg">{error}</div>}

                <button onClick={handleBook} disabled={loading}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-teal-light to-teal-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? '⏳ Booking...' : '✓ Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════ BOOKING SUCCESS ══════ */}
        {view === 'book' && success && (
          <div className="max-w-lg mx-auto bg-white border border-mc-border rounded-2xl p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-300 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">🎉</div>
            <h2 className="font-serif text-2xl text-mc-text mb-2">Appointment Booked!</h2>
            <p className="text-mc-muted text-sm mb-6">Show this QR code at the clinic desk for instant check-in</p>

            <div className="bg-gray-50 rounded-2xl p-6 inline-block mb-6">
              <QRCodeSVG value={success.qrCode} size={160} level="H"
                fgColor="#0d9488" bgColor="transparent"
                imageSettings={{ src: '', width: 0, height: 0 }} />
              <div className="mt-3 font-mono text-sm text-mc-muted tracking-wider">{success.qrCode}</div>
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={() => setSuccess(null)}
                className="px-5 py-2.5 bg-teal-bg text-teal font-semibold text-sm rounded-xl hover:bg-green-100 transition-all">
                Book Another
              </button>
              <button onClick={() => setView('my')}
                className="px-5 py-2.5 bg-teal text-white font-semibold text-sm rounded-xl hover:bg-teal-dark transition-all">
                View My Appointments
              </button>
            </div>
          </div>
        )}

        {/* ══════ MY APPOINTMENTS ══════ */}
        {view === 'my' && (
          <div className="bg-white border border-mc-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-serif text-lg text-mc-text">My Appointments</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {appointments.length === 0 ? (
                <div className="p-10 text-center text-mc-muted">
                  <div className="text-4xl mb-3">📭</div>
                  <p>No appointments yet. Book your first one!</p>
                </div>
              ) : appointments.map(apt => (
                <div key={apt._id} className="p-5 flex items-center gap-4 hover:bg-gray-50/50 transition-all">
                  <div className="w-12 h-14 bg-teal-bg rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <div className="text-lg font-bold text-teal leading-none">{new Date(apt.date).getDate()}</div>
                    <div className="text-[10px] font-semibold text-mc-muted uppercase">{new Date(apt.date).toLocaleDateString('en',{month:'short'})}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-mc-text">{apt.doctorId?.name || 'Doctor'}</div>
                    <div className="text-xs text-mc-muted">{apt.doctorId?.specialization} • {apt.timeSlot} • {apt.doctorId?.room}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      apt.status === 'confirmed' ? 'bg-mc-green-bg text-mc-green' :
                      apt.status === 'cancelled' ? 'bg-mc-red-bg text-mc-red' :
                      apt.status === 'completed' ? 'bg-gray-100 text-gray-500' :
                      'bg-mc-warn-bg text-mc-warn'
                    }`}>
                      {apt.status === 'confirmed' ? '✓ Confirmed' : apt.status === 'cancelled' ? '✗ Cancelled' : apt.status === 'completed' ? '✓ Done' : '⏳ Booked'}
                    </span>
                    {apt.status === 'booked' && (
                      <button onClick={() => handleCancel(apt._id)} className="text-xs text-mc-red font-medium hover:underline">Cancel</button>
                    )}
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

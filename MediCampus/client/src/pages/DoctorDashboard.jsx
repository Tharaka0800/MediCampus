import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'http://localhost:5000/api';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [view, setView] = useState('queue'); // queue | consult | records | certificates | alerts
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [records, setRecords] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // Consultation form
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagForm, setDiagForm] = useState({ symptoms: '', condition: '', severity: 'mild', notes: '' });
  const [prescriptions, setPrescriptions] = useState([{ medication: '', dosage: '', frequency: '', duration: '' }]);
  const [certForm, setCertForm] = useState({ certificateType: 'medical-leave', validFrom: '', validTo: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('doctorData');
    if (saved) setDoctor(JSON.parse(saved));
    else navigate('/doctor/login');
  }, [navigate]);

  useEffect(() => {
    if (!doctor) return;
    const loadData = () => {
      const today = new Date().toISOString().split('T')[0];
      axios.get(`${API}/appointments/doctor/${doctor._id}?date=${today}`).then(r => setAppointments(r.data)).catch(() => {});
      axios.get(`${API}/queue/live/${doctor._id}`).then(r => setQueue(r.data)).catch(() => {});
      axios.get(`${API}/records/doctor/${doctor._id}`).then(r => setRecords(r.data)).catch(() => {});
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [doctor]);

  // Load critical alerts from students with appointments today
  useEffect(() => {
    if (!appointments.length) return;
    const alertsList = appointments
      .filter(a => a.studentId?.allergies && a.studentId.allergies !== 'None')
      .map(a => ({
        name: a.studentId.studentName,
        regNum: a.studentId.registrationNumber,
        allergies: a.studentId.allergies,
        conditions: a.studentId.chronicIllnesses,
        bloodType: a.studentId.bloodType
      }));
    setAlerts(alertsList);
  }, [appointments]);

  const handleSearch = async () => {
    if (!searchQ.trim()) return;
    try {
      const res = await axios.get(`${API}/records/search/query?q=${searchQ}&doctorId=${doctor._id}`);
      setSearchResults(res.data);
    } catch(e) { setSearchResults([]); }
  };

  const handleServeNext = async (queueId) => {
    await axios.put(`${API}/queue/${queueId}/next`).catch(() => {});
    axios.get(`${API}/queue/live/${doctor._id}`).then(r => setQueue(r.data));
  };

  const startConsultation = async (apt, queueId) => {
    setSelectedPatient(apt);
    setView('consult');
    setDiagForm({ symptoms: '', condition: '', severity: 'mild', notes: '' });
    setPrescriptions([{ medication: '', dosage: '', frequency: '', duration: '' }]);
    setCertForm({ certificateType: 'medical-leave', validFrom: '', validTo: '', reason: '' });
    
    if (queueId) {
      await axios.put(`${API}/queue/${queueId}/start`).catch(() => {});
      axios.get(`${API}/queue/live/${doctor._id}`).then(r => setQueue(r.data));
    }
  };

  const addPrescription = () => setPrescriptions(p => [...p, { medication: '', dosage: '', frequency: '', duration: '' }]);
  const updatePrescription = (i, field, val) => {
    setPrescriptions(p => p.map((rx, idx) => idx === i ? { ...rx, [field]: val } : rx));
  };

  const saveRecord = async () => {
    if (!diagForm.condition) { alert('Diagnosis condition is required.'); return; }
    setSaving(true);
    try {
      const recordRes = await axios.post(`${API}/records`, {
        studentId: selectedPatient.studentId._id || selectedPatient.studentId,
        doctorId: doctor._id,
        appointmentId: selectedPatient._id,
        diagnosis: {
          symptoms: diagForm.symptoms.split(',').map(s => s.trim()).filter(Boolean),
          condition: diagForm.condition,
          severity: diagForm.severity,
          notes: diagForm.notes
        },
        prescription: prescriptions.filter(p => p.medication)
      });

      // Generate certificate if dates provided
      if (certForm.validFrom && certForm.validTo && certForm.reason) {
        await axios.post(`${API}/certificates`, {
          studentId: selectedPatient.studentId._id || selectedPatient.studentId,
          doctorId: doctor._id,
          recordId: recordRes.data.record._id,
          certificateType: certForm.certificateType,
          validFrom: certForm.validFrom,
          validTo: certForm.validTo,
          reason: certForm.reason
        });
      }

      alert('Record saved successfully!');
      setSelectedPatient(null);
      setView('queue');
      // Refresh
      axios.get(`${API}/records/doctor/${doctor._id}`).then(r => setRecords(r.data));
    } catch(e) {
      alert(e.response?.data?.message || 'Failed to save.');
    }
    setSaving(false);
  };

  const logout = () => { localStorage.removeItem('doctorData'); navigate('/doctor/login'); };

  if (!doctor) return null;

  const tabs = [
    { id: 'queue', label: 'Today\'s Queue', icon: '📋', count: queue.length },
    { id: 'consult', label: 'Consultation', icon: '🩺' },
    { id: 'records', label: 'Records', icon: '📂', count: records.length },
    { id: 'alerts', label: 'Alerts', icon: '⚠️', count: alerts.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="doctor" userName={doctor.name} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl text-mc-text">Doctor Dashboard</h1>
            <p className="text-mc-muted text-sm">{doctor.name} • {doctor.specialization} • {doctor.room}</p>
          </div>
          <button onClick={logout} className="px-4 py-2 text-sm text-mc-muted border border-mc-border rounded-xl hover:bg-gray-100 transition-all">Sign Out</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-mc-border rounded-xl p-1 w-fit mb-8">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setView(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                view === t.id ? 'bg-teal text-white' : 'text-mc-muted hover:bg-gray-50'
              }`}>
              {t.icon} {t.label}
              {t.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${view === t.id ? 'bg-white/20' : 'bg-teal-bg text-teal'}`}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* ══════ QUEUE ══════ */}
        {view === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-mc-border rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-serif text-lg text-mc-text">Today's Patient Queue</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {queue.length === 0 ? (
                  <div className="p-10 text-center text-mc-muted"><div className="text-4xl mb-3">📭</div>No patients in queue</div>
                ) : queue.map(q => (
                  <div key={q._id} className={`p-4 flex items-center gap-4 ${q.status === 'in-consultation' ? 'bg-teal-bg' : ''}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                      q.priority === 'emergency' ? 'bg-red-100 text-red-600' : q.status === 'in-consultation' ? 'bg-teal text-white' : 'bg-gray-100 text-mc-muted'
                    }`}>{q.tokenNumber}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-mc-text">{q.studentId?.studentName}</div>
                      <div className="text-xs text-mc-muted">{q.studentId?.registrationNumber} {q.priority === 'emergency' && <span className="text-red-500 font-semibold">• 🚨 EMERGENCY</span>}</div>
                    </div>
                    <div className="flex gap-2">
                      {q.status === 'in-consultation' && (
                        <button onClick={() => handleServeNext(q._id)} className="px-3 py-1.5 bg-mc-green-bg text-mc-green text-xs font-semibold rounded-lg hover:bg-green-100">✓ Complete</button>
                      )}
                      <button onClick={() => {
                        const apt = appointments.find(a => a.studentId?._id === q.studentId?._id || a.studentId === q.studentId?._id);
                        if (apt) startConsultation(apt, q._id);
                      }} className="px-3 py-1.5 bg-teal-bg text-teal text-xs font-semibold rounded-lg hover:bg-green-100">🩺 Consult</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-teal to-teal-dark rounded-2xl p-6 text-white">
                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Today</div>
                <div className="font-serif text-4xl mb-2">{appointments.length}</div>
                <div className="text-sm text-white/70">Total Appointments</div>
              </div>
              <div className="bg-white border border-mc-border rounded-2xl p-5">
                <div className="font-serif text-lg text-mc-text mb-3">Quick Stats</div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-mc-muted">In Queue</span><span className="font-semibold text-mc-text">{queue.filter(q=>q.status==='waiting').length}</span></div>
                  <div className="flex justify-between"><span className="text-mc-muted">In Consultation</span><span className="font-semibold text-teal">{queue.filter(q=>q.status==='in-consultation').length}</span></div>
                  <div className="flex justify-between"><span className="text-mc-muted">Completed</span><span className="font-semibold text-mc-green">{appointments.filter(a=>a.status==='completed').length}</span></div>
                  <div className="flex justify-between"><span className="text-mc-muted">Emergency</span><span className="font-semibold text-mc-red">{queue.filter(q=>q.priority==='emergency').length}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════ CONSULTATION ══════ */}
        {view === 'consult' && (
          <div>
            {!selectedPatient ? (
              <div className="bg-white border border-mc-border rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">🩺</div>
                <h3 className="font-serif text-xl text-mc-text mb-2">No Patient Selected</h3>
                <p className="text-mc-muted text-sm mb-4">Select a patient from the queue to begin consultation</p>
                <button onClick={() => setView('queue')} className="px-5 py-2 bg-teal text-white font-semibold text-sm rounded-xl">Go to Queue</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient Info */}
                <div className="bg-white border border-mc-border rounded-2xl p-5">
                  <h3 className="font-serif text-lg text-mc-text mb-4">Patient Info</h3>
                  <div className="space-y-3 text-sm">
                    <div><label className="text-xs text-mc-muted font-semibold uppercase">Name</label><p className="text-mc-text font-medium">{selectedPatient.studentId?.studentName}</p></div>
                    <div><label className="text-xs text-mc-muted font-semibold uppercase">ID</label><p className="text-mc-text">{selectedPatient.studentId?.registrationNumber}</p></div>
                    <div><label className="text-xs text-mc-muted font-semibold uppercase">Blood Type</label><p className="text-mc-text font-bold text-teal">{selectedPatient.studentId?.bloodType || '—'}</p></div>
                    {selectedPatient.studentId?.allergies && selectedPatient.studentId.allergies !== 'None' && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                        <div className="text-xs font-semibold text-red-600 mb-1">⚠️ ALLERGIES</div>
                        <p className="text-sm text-red-700">{selectedPatient.studentId.allergies}</p>
                      </div>
                    )}
                    {selectedPatient.studentId?.chronicIllnesses && selectedPatient.studentId.chronicIllnesses !== 'None' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <div className="text-xs font-semibold text-amber-700 mb-1">⚠️ CHRONIC CONDITIONS</div>
                        <p className="text-sm text-amber-800">{selectedPatient.studentId.chronicIllnesses}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Diagnosis & Prescription */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="bg-white border border-mc-border rounded-2xl p-5">
                    <h3 className="font-serif text-lg text-mc-text mb-4">📋 Diagnosis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-mc-text mb-1.5">Symptoms (comma-separated)</label>
                        <input value={diagForm.symptoms} onChange={e => setDiagForm(d => ({...d, symptoms: e.target.value}))} placeholder="Fever, Headache, Sore throat"
                          className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm focus:border-teal outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-mc-text mb-1.5">Condition *</label>
                        <input value={diagForm.condition} onChange={e => setDiagForm(d => ({...d, condition: e.target.value}))} placeholder="e.g. Acute Pharyngitis"
                          className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm focus:border-teal outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-mc-text mb-1.5">Severity</label>
                        <select value={diagForm.severity} onChange={e => setDiagForm(d => ({...d, severity: e.target.value}))}
                          className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm focus:border-teal outline-none appearance-none">
                          <option value="mild">Mild</option><option value="moderate">Moderate</option><option value="severe">Severe</option><option value="critical">Critical</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-mc-text mb-1.5">Doctor's Notes</label>
                        <textarea value={diagForm.notes} onChange={e => setDiagForm(d => ({...d, notes: e.target.value}))} placeholder="Additional clinical notes..."
                          className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm resize-none h-20 focus:border-teal outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-mc-border rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-lg text-mc-text">💊 Prescription</h3>
                      <button onClick={addPrescription} className="text-xs text-teal font-semibold hover:underline">+ Add Medication</button>
                    </div>
                    <div className="space-y-3">
                      {prescriptions.map((rx, i) => (
                        <div key={i} className="grid grid-cols-4 gap-2">
                          <input value={rx.medication} onChange={e => updatePrescription(i, 'medication', e.target.value)} placeholder="Medication"
                            className="px-3 py-2.5 bg-gray-50 border border-mc-border rounded-lg text-sm focus:border-teal outline-none" />
                          <input value={rx.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)} placeholder="Dosage"
                            className="px-3 py-2.5 bg-gray-50 border border-mc-border rounded-lg text-sm focus:border-teal outline-none" />
                          <input value={rx.frequency} onChange={e => updatePrescription(i, 'frequency', e.target.value)} placeholder="Frequency"
                            className="px-3 py-2.5 bg-gray-50 border border-mc-border rounded-lg text-sm focus:border-teal outline-none" />
                          <input value={rx.duration} onChange={e => updatePrescription(i, 'duration', e.target.value)} placeholder="Duration"
                            className="px-3 py-2.5 bg-gray-50 border border-mc-border rounded-lg text-sm focus:border-teal outline-none" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-mc-border rounded-2xl p-5">
                    <h3 className="font-serif text-lg text-mc-text mb-4">📄 Medical Certificate (Optional)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-mc-text mb-1.5">Type</label>
                        <select value={certForm.certificateType} onChange={e => setCertForm(c => ({...c, certificateType: e.target.value}))}
                          className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm outline-none appearance-none">
                          <option value="medical-leave">Medical Leave</option><option value="exam-medical">Exam Medical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-mc-text mb-1.5">Reason</label>
                        <input value={certForm.reason} onChange={e => setCertForm(c => ({...c, reason: e.target.value}))} placeholder="Reason for certificate"
                          className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-mc-text mb-1.5">Valid From</label>
                        <input type="date" value={certForm.validFrom} onChange={e => setCertForm(c => ({...c, validFrom: e.target.value}))}
                          className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-mc-text mb-1.5">Valid To</label>
                        <input type="date" value={certForm.validTo} onChange={e => setCertForm(c => ({...c, validTo: e.target.value}))}
                          className="w-full px-4 py-3 bg-gray-50 border border-mc-border rounded-xl text-sm outline-none" />
                      </div>
                    </div>
                  </div>

                  <button onClick={saveRecord} disabled={saving}
                    className="w-full py-3.5 bg-gradient-to-r from-teal-light to-teal-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal/30 transition-all disabled:opacity-50">
                    {saving ? '⏳ Saving...' : '✓ Submit Consultation & Lock Record'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════ RECORDS ══════ */}
        {view === 'records' && (
          <div className="bg-white border border-mc-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <div className="flex-1 flex gap-3">
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="🔍 Search by diagnosis, symptom, or date..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-mc-border rounded-xl text-sm focus:border-teal outline-none" />
                <button onClick={handleSearch} className="px-4 py-2.5 bg-teal text-white text-sm font-semibold rounded-xl">Search</button>
                {searchResults && <button onClick={() => setSearchResults(null)} className="px-3 py-2.5 text-xs text-mc-muted border border-mc-border rounded-xl">Clear</button>}
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {(searchResults || records).length === 0 ? (
                <div className="p-10 text-center text-mc-muted"><div className="text-4xl mb-3">📂</div>No records found</div>
              ) : (searchResults || records).map(r => (
                <div key={r._id} className="p-4 hover:bg-gray-50/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-mc-text">{r.studentId?.studentName || 'Patient'} — {r.diagnosis?.condition}</div>
                      <div className="text-xs text-mc-muted mt-1">
                        {new Date(r.createdAt).toLocaleDateString('en', { day:'numeric', month:'short', year:'numeric' })} •
                        Severity: <span className={`font-semibold ${r.diagnosis?.severity === 'severe' || r.diagnosis?.severity === 'critical' ? 'text-mc-red' : 'text-mc-text'}`}>{r.diagnosis?.severity}</span>
                        {r.isLocked && <span className="ml-2 text-mc-muted">🔒 Locked</span>}
                      </div>
                    </div>
                    {r.prescription?.length > 0 && <span className="text-xs bg-mc-blue-bg text-mc-blue font-semibold px-3 py-1 rounded-full">💊 {r.prescription.length} Rx</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════ ALERTS ══════ */}
        {view === 'alerts' && (
          <div className="bg-white border border-mc-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-serif text-lg text-mc-text">⚠️ Critical Patient Alerts</h3>
              <p className="text-xs text-mc-muted mt-1">Students with allergies or chronic conditions scheduled today</p>
            </div>
            <div className="divide-y divide-gray-50">
              {alerts.length === 0 ? (
                <div className="p-10 text-center text-mc-muted"><div className="text-4xl mb-3">✅</div>No critical alerts today</div>
              ) : alerts.map((a, i) => (
                <div key={i} className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-xl">⚠️</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-mc-text">{a.name} <span className="text-mc-muted font-normal">({a.regNum})</span></div>
                      <div className="text-xs text-mc-muted mt-0.5">Blood: <strong className="text-teal">{a.bloodType}</strong></div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {a.allergies && a.allergies !== 'None' && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3"><div className="text-[10px] font-semibold text-red-600 uppercase mb-1">Allergies</div><p className="text-xs text-red-700">{a.allergies}</p></div>
                    )}
                    {a.conditions && a.conditions !== 'None' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3"><div className="text-[10px] font-semibold text-amber-700 uppercase mb-1">Conditions</div><p className="text-xs text-amber-800">{a.conditions}</p></div>
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

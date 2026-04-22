import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'http://localhost:5000/api';

export default function AdminEventsDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '', type: 'health-camp', date: '', location: '', description: '',
    maxParticipants: 100, organizer: '', status: 'upcoming',
    eligibilityCriteria: { minAge: '', bloodTypes: [], noConditions: [] }
  });

  // QR Simulator State
  const [qrToken, setQrToken] = useState('');
  const [checkInMsg, setCheckInMsg] = useState({ type: '', text: '' });
  const [selectedEventId, setSelectedEventId] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/events`);
      setEvents(res.data);
    } catch (err) {
      setError('Failed to fetch events.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title || '',
        type: event.type || 'health-camp',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        description: event.description || '',
        maxParticipants: event.maxParticipants || 100,
        organizer: event.organizer || '',
        status: event.status || 'upcoming',
        eligibilityCriteria: {
          minAge: event.eligibilityCriteria?.minAge || '',
          bloodTypes: event.eligibilityCriteria?.bloodTypes || [],
          noConditions: event.eligibilityCriteria?.noConditions || []
        }
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '', type: 'health-camp', date: '', location: '', description: '',
        maxParticipants: 100, organizer: '', status: 'upcoming',
        eligibilityCriteria: { minAge: '', bloodTypes: [], noConditions: [] }
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('eligibility_')) {
      const field = name.split('_')[1];
      let val = value;
      if (field === 'bloodTypes' || field === 'noConditions') {
        val = value.split(',').map(item => item.trim()).filter(Boolean);
      }
      setFormData(prev => ({
        ...prev,
        eligibilityCriteria: { ...prev.eligibilityCriteria, [field]: val }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await axios.put(`${API}/events/${editingEvent._id}`, formData);
        setActionMsg({ type: 'success', text: 'Event updated successfully!' });
      } else {
        await axios.post(`${API}/events`, formData);
        setActionMsg({ type: 'success', text: 'Event created successfully!' });
      }
      fetchEvents();
      handleCloseModal();
      setTimeout(() => setActionMsg({ type: '', text: '' }), 5000);
    } catch (err) {
      alert('Failed to save event: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API}/events/${id}`);
        setActionMsg({ type: 'success', text: 'Event deleted successfully!' });
        fetchEvents();
        setTimeout(() => setActionMsg({ type: '', text: '' }), 5000);
      } catch (err) {
        alert('Failed to delete event.');
      }
    }
  };

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    setCheckInMsg({ type: '', text: '' });
    if (!selectedEventId || !qrToken) {
      setCheckInMsg({ type: 'error', text: 'Select an event and enter QR token.' });
      return;
    }
    try {
      const res = await axios.post(`${API}/events/${selectedEventId}/checkin`, { qrToken });
      setCheckInMsg({ type: 'success', text: res.data.message });
      setQrToken('');
      fetchEvents(); // Refresh stats
    } catch (err) {
      setCheckInMsg({ type: 'error', text: err.response?.data?.message || 'Check-in failed.' });
    }
  };

  // KPIs
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'active').length;
  const totalRegs = events.reduce((sum, e) => sum + (e.analytics?.registered || 0), 0);
  const avgTurnout = events.filter(e => e.analytics?.registered > 0).reduce((sum, e) => sum + (e.analytics?.turnoutRate || 0), 0) / (events.filter(e => e.analytics?.registered > 0).length || 1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="admin" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="font-serif text-3xl text-mc-text mb-1">Events Management</h1>
            <p className="text-mc-muted text-sm">Create and manage campus health events and registrations.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-gradient-to-r from-teal-light to-teal-dark text-white font-semibold rounded-xl shadow-lg shadow-teal/30 hover:scale-105 transition-all">
            + Create New Event
          </button>
        </div>

        {actionMsg.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-semibold flex justify-between items-center ${actionMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            <span>{actionMsg.text}</span>
            <button onClick={() => setActionMsg({ type: '', text: '' })} className="text-current opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-mc-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl">📋</div>
            <div><p className="text-mc-muted text-xs font-semibold uppercase tracking-wider">Total Events</p><p className="text-2xl font-bold text-mc-text">{totalEvents}</p></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-mc-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-2xl">🟢</div>
            <div><p className="text-mc-muted text-xs font-semibold uppercase tracking-wider">Active Events</p><p className="text-2xl font-bold text-mc-text">{activeEvents}</p></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-mc-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-2xl">👥</div>
            <div><p className="text-mc-muted text-xs font-semibold uppercase tracking-wider">Total Registrations</p><p className="text-2xl font-bold text-mc-text">{totalRegs}</p></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-mc-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-2xl">📈</div>
            <div><p className="text-mc-muted text-xs font-semibold uppercase tracking-wider">Avg Turnout</p><p className="text-2xl font-bold text-mc-text">{Math.round(avgTurnout)}%</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Events Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-mc-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-serif text-lg text-mc-text">All Events</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-mc-muted uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Event</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Registrations</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-8 text-mc-muted">Loading events...</td></tr>
                  ) : events.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-8 text-mc-muted">No events found.</td></tr>
                  ) : (
                    events.map(evt => (
                      <tr key={evt._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-mc-text">{evt.title}</div>
                          <div className="text-xs text-mc-muted mt-1">{new Date(evt.date).toLocaleDateString()} • {evt.type}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${evt.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                              evt.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                evt.status === 'completed' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                                  'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {evt.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-teal" style={{ width: `${Math.min(((evt.analytics?.registered || 0) / evt.maxParticipants) * 100, 100)}%` }} />
                            </div>
                            <span className="text-xs font-medium text-mc-text">{evt.analytics?.registered || 0}/{evt.maxParticipants}</span>
                          </div>
                          <div className="text-[10px] text-mc-muted mt-1">{evt.analytics?.attended || 0} Attended</div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button onClick={() => handleOpenModal(evt)} className="text-teal hover:bg-teal-bg p-1.5 rounded-lg transition-colors mr-1" title="Edit">✏️</button>
                          <button onClick={() => handleDelete(evt._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors" title="Delete">🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Tools */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-mc-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-teal-bg/30">
                <h3 className="font-serif text-lg text-teal-dark flex items-center gap-2">
                  <span>📱</span> Manual QR Check-in
                </h3>
              </div>
              <div className="p-5">
                <form onSubmit={handleManualCheckIn} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-mc-muted uppercase tracking-wider mb-1.5">Select Event</label>
                    <select className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none transition-all"
                      value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} required>
                      <option value="">-- Choose active event --</option>
                      {events.filter(e => e.status === 'active' || e.status === 'upcoming').map(e => (
                        <option key={e._id} value={e._id}>{e.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-mc-muted uppercase tracking-wider mb-1.5">QR Token</label>
                    <input type="text" placeholder="e.g. EVT-A1B2C3-9999" value={qrToken} onChange={e => setQrToken(e.target.value)} required
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-sm font-mono focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none transition-all" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors">
                    Mark as Attended
                  </button>
                  {checkInMsg.text && (
                    <div className={`p-3 rounded-lg text-sm font-medium text-center ${checkInMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {checkInMsg.text}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="font-serif text-2xl text-mc-text">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-mc-text mb-1.5">Event Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleFormChange} required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mc-text mb-1.5">Event Type *</label>
                  <select name="type" value={formData.type} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none">
                    <option value="blood-drive">Blood Drive</option>
                    <option value="health-camp">Health Camp</option>
                    <option value="vaccination">Vaccination Drive</option>
                    <option value="workshop">Health Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mc-text mb-1.5">Date & Time *</label>
                  <input type="datetime-local" name="date" value={formData.date} onChange={handleFormChange} required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mc-text mb-1.5">Location *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleFormChange} required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mc-text mb-1.5">Status</label>
                  <select name="status" value={formData.status} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none">
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mc-text mb-1.5">Organizer</label>
                  <input type="text" name="organizer" value={formData.organizer} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mc-text mb-1.5">Max Participants</label>
                  <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-mc-text mb-1.5">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none"></textarea>
                </div>
              </div>

              <div className="bg-teal-bg/30 rounded-2xl p-5 mb-6 border border-teal/10">
                <h4 className="font-serif text-lg text-teal-dark mb-4">Eligibility Criteria (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-mc-muted mb-1.5">Min Age</label>
                    <input type="number" name="eligibility_minAge" value={formData.eligibilityCriteria.minAge} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-teal/20 outline-none" placeholder="e.g. 18" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-mc-muted mb-1.5">Allowed Blood Types</label>
                    <input type="text" name="eligibility_bloodTypes" value={formData.eligibilityCriteria.bloodTypes.join(', ')} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-teal/20 outline-none" placeholder="O+, A- (comma sep)" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-mc-muted mb-1.5">Disqualifying Conditions</label>
                    <input type="text" name="eligibility_noConditions" value={formData.eligibilityCriteria.noConditions.join(', ')} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-teal/20 outline-none" placeholder="Asthma (comma sep)" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-teal-light to-teal-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

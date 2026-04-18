import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import HealthChatbot from './HealthChatbot';

// ── If using react-router-dom, uncomment:
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  .shd-root *, .shd-root *::before, .shd-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .shd-root {
    --teal: #0d9488;
    --teal-light: #14b8a6;
    --teal-dark: #0f766e;
    --teal-bg: #f0fdfa;
    --cream: #fdf8f3;
    --text: #1c3238;
    --muted: #6b8c90;
    --border: #e2eaeb;
    --white: #ffffff;
    --error: #e53e3e;
    --warn-bg: #fffbeb;
    --warn: #d97706;
    --green-bg: #f0fdf4;
    --green: #16a34a;
    --red-bg: #fef2f2;
    --red: #dc2626;
    --blue-bg: #eff6ff;
    --blue: #2563eb;
    font-family: 'DM Sans', sans-serif;
    background: #f4f7f8;
    min-height: 100vh;
    display: flex;
  }

  /* ── Sidebar ── */
  .shd-sidebar {
    width: 240px;
    background: linear-gradient(180deg, #0f766e 0%, #064e3b 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 28px 0;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .shd-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 24px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 12px;
  }
  .shd-brand-icon {
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.25);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .shd-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    color: #fff;
    letter-spacing: -0.3px;
  }
  .shd-brand-name span { opacity: 0.6; font-style: italic; }

  .shd-nav { flex: 1; padding: 0 12px; }
  .shd-nav-section {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    padding: 16px 12px 8px;
  }
  .shd-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    color: rgba(255,255,255,0.65);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    margin-bottom: 2px;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }
  .shd-nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .shd-nav-item.active { background: rgba(255,255,255,0.15); color: #fff; font-weight: 600; }
  .shd-nav-item .nav-icon { font-size: 17px; width: 22px; text-align: center; }
  .shd-badge {
    margin-left: auto;
    background: #14b8a6;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 20px;
    min-width: 20px;
    text-align: center;
  }

  .shd-user-card {
    margin: 16px 12px 0;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 14px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .shd-avatar {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #5eead4, #0d9488);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    font-size: 15px;
    color: #fff;
    flex-shrink: 0;
  }
  .shd-user-info { flex: 1; min-width: 0; }
  .shd-user-name {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .shd-user-id { font-size: 11px; color: rgba(255,255,255,0.5); }

  /* ── Main ── */
  .shd-main { flex: 1; overflow-x: hidden; }

  .shd-topbar {
    background: #fff;
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .shd-topbar-left h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: var(--text);
  }
  .shd-topbar-left p { font-size: 13px; color: var(--muted); }

  .shd-topbar-right { display: flex; align-items: center; gap: 14px; }
  .shd-icon-btn {
    width: 38px; height: 38px;
    border: 1.5px solid var(--border);
    background: #fff;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
    font-size: 16px;
  }
  .shd-icon-btn:hover { border-color: var(--teal); background: var(--teal-bg); }
  .shd-notif-dot {
    position: absolute;
    top: 6px; right: 6px;
    width: 8px; height: 8px;
    background: #ef4444;
    border-radius: 50%;
    border: 1.5px solid #fff;
  }

  .shd-content { padding: 28px 32px; }

  /* ── Stats Row ── */
  .shd-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  .shd-stat-card {
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    transition: all 0.2s;
  }
  .shd-stat-card:hover { border-color: var(--teal-light); box-shadow: 0 4px 20px rgba(13,148,136,0.08); }
  .shd-stat-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .shd-stat-icon {
    width: 42px; height: 42px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .shd-stat-trend {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 20px;
  }
  .trend-up { background: var(--green-bg); color: var(--green); }
  .trend-neutral { background: var(--teal-bg); color: var(--teal); }
  .trend-warn { background: var(--warn-bg); color: var(--warn); }
  .shd-stat-val {
    font-family: 'DM Serif Display', serif;
    font-size: 30px;
    color: var(--text);
    line-height: 1;
    margin-bottom: 4px;
  }
  .shd-stat-label { font-size: 13px; color: var(--muted); }

  /* ── Two-col layout ── */
  .shd-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .shd-grid3 { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }

  /* ── Cards ── */
  .shd-card {
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  .shd-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px 14px;
    border-bottom: 1px solid #f0f4f5;
  }
  .shd-card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 17px;
    color: var(--text);
  }
  .shd-card-body { padding: 18px 20px; }

  .shd-btn-sm {
    font-size: 12px;
    font-weight: 600;
    color: var(--teal);
    background: var(--teal-bg);
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .shd-btn-sm:hover { background: #ccfbf1; }

  /* ── Appointments ── */
  .shd-appt-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid #f4f7f8;
  }
  .shd-appt-item:last-child { border-bottom: none; padding-bottom: 0; }
  .shd-appt-date {
    width: 46px; height: 50px;
    background: var(--teal-bg);
    border-radius: 12px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .shd-appt-day { font-size: 18px; font-weight: 700; color: var(--teal); line-height: 1; }
  .shd-appt-month { font-size: 10px; font-weight: 600; color: var(--muted); text-transform: uppercase; }
  .shd-appt-info { flex: 1; }
  .shd-appt-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .shd-appt-sub { font-size: 12px; color: var(--muted); }
  .shd-pill {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
  }
  .pill-confirmed { background: var(--green-bg); color: var(--green); }
  .pill-pending   { background: var(--warn-bg);  color: var(--warn); }
  .pill-done      { background: #f1f5f9;         color: #64748b; }
  .pill-queue     { background: var(--blue-bg);  color: var(--blue); }

  /* ── Notifications ── */
  .shd-notif-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f4f7f8;
    cursor: pointer;
    transition: background 0.15s;
  }
  .shd-notif-item:last-child { border-bottom: none; }
  .shd-notif-item.unread .shd-notif-msg { font-weight: 600; color: var(--text); }
  .shd-notif-dot2 {
    width: 8px; height: 8px;
    background: var(--teal);
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
  }
  .shd-notif-dot2.read { background: transparent; border: 1.5px solid #d0dde0; }
  .shd-notif-msg { font-size: 13.5px; color: var(--text); margin-bottom: 3px; line-height: 1.4; }
  .shd-notif-time { font-size: 11px; color: var(--muted); }

  /* ── Health Profile ── */
  .shd-profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .shd-profile-field { }
  .shd-profile-field label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px; }
  .shd-profile-field p { font-size: 14px; color: var(--text); font-weight: 500; }

  .shd-allergy-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .shd-allergy-tag {
    background: var(--red-bg);
    color: var(--red);
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 20px;
  }
  .shd-chronic-tag {
    background: var(--warn-bg);
    color: var(--warn);
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 20px;
  }

  /* ── Visit History ── */
  .shd-timeline { position: relative; padding-left: 20px; }
  .shd-timeline::before {
    content: '';
    position: absolute;
    left: 5px; top: 8px; bottom: 8px;
    width: 2px;
    background: var(--border);
  }
  .shd-tl-item {
    position: relative;
    margin-bottom: 20px;
  }
  .shd-tl-item:last-child { margin-bottom: 0; }
  .shd-tl-dot {
    position: absolute;
    left: -18px; top: 5px;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--teal);
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px var(--teal-light);
  }
  .shd-tl-date { font-size: 11px; color: var(--muted); margin-bottom: 4px; font-weight: 600; }
  .shd-tl-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .shd-tl-sub { font-size: 12px; color: var(--muted); }
  .shd-tl-actions { display: flex; gap: 8px; margin-top: 6px; }
  .shd-tl-btn {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 7px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .tl-btn-teal { background: var(--teal-bg); color: var(--teal); }
  .tl-btn-teal:hover { background: #ccfbf1; }
  .tl-btn-gray { background: #f1f5f9; color: #64748b; }
  .tl-btn-gray:hover { background: #e2e8f0; }

  /* ── Queue Banner ── */
  .shd-queue-banner {
    background: linear-gradient(135deg, #0d9488, #0f766e);
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    color: #fff;
    animation: shdPulse 3s ease-in-out infinite;
  }
  @keyframes shdPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(13,148,136,0.4); }
    50% { box-shadow: 0 0 0 10px rgba(13,148,136,0); }
  }
  .shd-queue-left { display: flex; align-items: center; gap: 16px; }
  .shd-queue-num {
    font-family: 'DM Serif Display', serif;
    font-size: 44px;
    line-height: 1;
    color: #fff;
  }
  .shd-queue-label { font-size: 12px; opacity: 0.7; margin-bottom: 2px; }
  .shd-queue-title { font-size: 15px; font-weight: 600; }
  .shd-queue-sub { font-size: 12px; opacity: 0.75; margin-top: 2px; }
  .shd-queue-btn {
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.3);
    color: #fff;
    padding: 10px 18px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(4px);
  }
  .shd-queue-btn:hover { background: rgba(255,255,255,0.25); }

  /* ── Page tabs ── */
  .shd-page-tabs { display: flex; gap: 4px; margin-bottom: 24px; background: #fff; border: 1.5px solid var(--border); border-radius: 12px; padding: 4px; width: fit-content; }
  .shd-page-tab {
    padding: 8px 18px;
    border-radius: 9px;
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
  }
  .shd-page-tab.active { background: var(--teal); color: #fff; font-weight: 600; }

  /* ── Empty state ── */
  .shd-empty { text-align: center; padding: 32px 20px; color: var(--muted); }
  .shd-empty-icon { font-size: 36px; margin-bottom: 10px; }
  .shd-empty p { font-size: 14px; }

  /* ── Download cert ── */
  .shd-cert-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid #f4f7f8;
  }
  .shd-cert-item:last-child { border-bottom: none; }
  .shd-cert-icon {
    width: 40px; height: 40px;
    background: var(--teal-bg);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .shd-cert-info { flex: 1; }
  .shd-cert-name { font-size: 13.5px; font-weight: 600; color: var(--text); }
  .shd-cert-date { font-size: 12px; color: var(--muted); }
  .shd-dl-btn {
    font-size: 12px;
    font-weight: 600;
    color: var(--teal);
    background: var(--teal-bg);
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .shd-dl-btn:hover { background: #ccfbf1; }

  @media (max-width: 1100px) { .shd-stats { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 900px)  { .shd-grid2, .shd-grid3 { grid-template-columns: 1fr; } .shd-sidebar { display: none; } }
`;

// ── Data ──
const STUDENT = { name: 'Ahmad Faris', id: 'S20240012', program: 'Computer Science', year: '2nd Year', blood: 'B+', dob: '14 Jun 2003', phone: '012-345 6789', emergency: 'Puan Norzila — 011-222 3344' };
const APPOINTMENTS = [
  { day: '24', month: 'Mar', title: 'General Check-up', doc: 'Dr. Syafiqah • Room 3', status: 'confirmed', time: '10:30 AM' },
  { day: '28', month: 'Mar', title: 'Blood Test Follow-up', doc: 'Dr. Rahman • Lab B', status: 'pending', time: '2:00 PM' },
  { day: '02', month: 'Apr', title: 'Dental Screening', doc: 'Dr. Liyana • Dental Wing', status: 'pending', time: '11:00 AM' },
];
const NOTIFICATIONS = [
  { msg: 'Your appointment on 24 Mar is confirmed. Please arrive 10 min early.', time: '2 hours ago', unread: true },
  { msg: 'Reminder: Complete your health profile — emergency contact missing.', time: 'Yesterday', unread: true },
  { msg: 'Medical certificate for 15 Mar visit is ready for download.', time: '3 days ago', unread: false },
  { msg: 'Blood donation drive on 30 Mar — check eligibility & register!', time: '5 days ago', unread: false },
];
const VISITS = [
  { date: '15 Mar 2026', title: 'Fever & Sore Throat', doctor: 'Dr. Syafiqah', diag: 'Acute Pharyngitis', cert: true },
  { date: '02 Feb 2026', title: 'Annual Health Screening', doctor: 'Dr. Rahman', diag: 'Healthy — No issues', cert: false },
  { date: '18 Jan 2026', title: 'Stomach Ache', doctor: 'Dr. Liyana', diag: 'Gastritis', cert: true },
];
const CERTS = [
  { name: 'Medical Certificate — 15 Mar 2026', date: 'Issued 16 Mar 2026' },
  { name: 'Medical Certificate — 18 Jan 2026', date: 'Issued 18 Jan 2026' },
];
const NAV = [
  { icon: '🏠', label: 'Dashboard',    id: 'dashboard' },
  { icon: '🤖', label: 'MediBot AI',   id: 'medibot' },
  { icon: '👤', label: 'Health Profile', id: 'profile' },
  { icon: '🗓️', label: 'Appointments',  id: 'appointments', badge: 2 },
  { icon: '📋', label: 'Medical History', id: 'history' },
  { icon: '📄', label: 'Certificates',   id: 'certificates' },
  { icon: '🔔', label: 'Notifications',  id: 'notifications', badge: 2 },
];

export default function StudentHealthDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const { profile, logout, deleteProfile } = useProfile();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("Are you sure you want to delete your student health profile? This action cannot be undone.")) {
      const res = await deleteProfile();
      if (res) {
        navigate('/');
      } else {
        alert("Failed to delete profile.");
      }
    }
  };

  const markRead = (i) => setNotifs(n => n.map((x, idx) => idx === i ? { ...x, unread: false } : x));

  const pageTitle = NAV.find(n => n.id === activePage);

  return (
    <>
      <style>{styles}</style>
      <div className="shd-root">

        {/* ── Sidebar ── */}
        <div className="shd-sidebar">
          <div className="shd-brand">
            <div className="shd-brand-icon">
              <svg viewBox="0 0 26 26" fill="none" width="22" height="22">
                <path d="M13 3C13 3 7 7 7 13.5C7 17.09 9.69 20 13 20C16.31 20 19 17.09 19 13.5C19 7 13 3 13 3Z" fill="white" fillOpacity="0.9"/>
                <rect x="10" y="10" width="6" height="1.5" rx="0.75" fill="#0d9488"/>
                <rect x="12.25" y="8" width="1.5" height="6" rx="0.75" fill="#0d9488"/>
              </svg>
            </div>
            <div className="shd-brand-name">Medi<span>Campus</span></div>
          </div>

          <nav className="shd-nav">
            <div className="shd-nav-section">Main Menu</div>
            {NAV.map(item => (
              <button key={item.id} className={`shd-nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="shd-badge">{item.badge}</span>}
              </button>
            ))}
            <div className="shd-nav-section" style={{marginTop: 12}}>Account</div>
            <button className="shd-nav-item" onClick={handleDeleteProfile} style={{ color: '#fca5a5' }}>
              <span className="nav-icon">⚠️</span> Delete Profile
            </button>
            <button className="shd-nav-item" onClick={handleLogout}>
              <span className="nav-icon">🚪</span> Sign Out
            </button>
          </nav>

          <div className="shd-user-card">
            <div className="shd-avatar">{(profile?.studentName || 'Student').split(' ').map(w=>w[0]).join('')}</div>
            <div className="shd-user-info">
              <div className="shd-user-name">{profile?.studentName || 'Student'}</div>
              <div className="shd-user-id">{profile?.registrationNumber || 'Unknown ID'}</div>
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="shd-main">

          {/* Topbar */}
          <div className="shd-topbar">
            <div className="shd-topbar-left">
              <h1>{pageTitle?.label ?? 'Dashboard'}</h1>
              <p>MediCampus · Student Health Portal</p>
            </div>
            <div className="shd-topbar-right">
              <button className="shd-icon-btn" onClick={() => setActivePage('notifications')}>
                🔔
                {notifs.some(n => n.unread) && <span className="shd-notif-dot" />}
              </button>
              <button className="shd-icon-btn" onClick={() => setActivePage('profile')}>👤</button>
            </div>
          </div>

          <div className="shd-content">

            {/* ══════════ DASHBOARD ══════════ */}
            {activePage === 'dashboard' && (
              <>
                {/* Queue Banner */}
                <div className="shd-queue-banner">
                  <div className="shd-queue-left">
                    <div>
                      <div className="shd-queue-label">YOUR QUEUE NUMBER</div>
                      <div className="shd-queue-num">47</div>
                    </div>
                    <div>
                      <div className="shd-queue-title">Currently serving: Token 44</div>
                      <div className="shd-queue-sub">📍 Room 3 · Dr. Syafiqah · Est. wait ~15 min</div>
                    </div>
                  </div>
                  <button className="shd-queue-btn" onClick={() => navigate('/queue/public')}>View Live Queue</button>
                </div>

                {/* Stats */}
                <div className="shd-stats">
                  {[
                    { icon: '🗓️', color: '#f0fdfa', val: '3',  label: 'Upcoming Appointments', trend: '2 this week', tclass: 'trend-neutral' },
                    { icon: '📋', color: '#f0fdf4', val: '8',  label: 'Total Visits',            trend: '+1 this month', tclass: 'trend-up' },
                    { icon: '📄', color: '#eff6ff', val: '2',  label: 'Certificates Ready',      trend: 'Available',     tclass: 'trend-neutral' },
                    { icon: '🔔', color: '#fffbeb', val: '2',  label: 'Unread Notifications',    trend: 'New',           tclass: 'trend-warn' },
                  ].map(s => (
                    <div className="shd-stat-card" key={s.label}>
                      <div className="shd-stat-top">
                        <div className="shd-stat-icon" style={{background: s.color}}>{s.icon}</div>
                        <span className={`shd-stat-trend ${s.tclass}`}>{s.trend}</span>
                      </div>
                      <div className="shd-stat-val">{s.val}</div>
                      <div className="shd-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Appointments + Notifications */}
                <div className="shd-grid3">
                  <div className="shd-card">
                    <div className="shd-card-head">
                      <div className="shd-card-title">Upcoming Appointments</div>
                      <button className="shd-btn-sm" onClick={() => setActivePage('appointments')}>View All</button>
                    </div>
                    <div className="shd-card-body">
                      {APPOINTMENTS.map((a, i) => (
                        <div className="shd-appt-item" key={i}>
                          <div className="shd-appt-date">
                            <div className="shd-appt-day">{a.day}</div>
                            <div className="shd-appt-month">{a.month}</div>
                          </div>
                          <div className="shd-appt-info">
                            <div className="shd-appt-title">{a.title}</div>
                            <div className="shd-appt-sub">{a.doc} · {a.time}</div>
                          </div>
                          <span className={`shd-pill ${a.status === 'confirmed' ? 'pill-confirmed' : 'pill-pending'}`}>
                            {a.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="shd-card">
                    <div className="shd-card-head">
                      <div className="shd-card-title">Notifications</div>
                      <button className="shd-btn-sm" onClick={() => setActivePage('notifications')}>See All</button>
                    </div>
                    <div className="shd-card-body">
                      {notifs.slice(0, 3).map((n, i) => (
                        <div className={`shd-notif-item ${n.unread ? 'unread' : ''}`} key={i} onClick={() => markRead(i)}>
                          <div className={`shd-notif-dot2 ${n.unread ? '' : 'read'}`} />
                          <div>
                            <div className="shd-notif-msg">{n.msg}</div>
                            <div className="shd-notif-time">{n.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visit History Preview */}
                <div className="shd-card">
                  <div className="shd-card-head">
                    <div className="shd-card-title">Recent Visits</div>
                    <button className="shd-btn-sm" onClick={() => setActivePage('history')}>Full History</button>
                  </div>
                  <div className="shd-card-body">
                    <div style={{display:'flex', gap:16}}>
                      {VISITS.map((v, i) => (
                        <div key={i} style={{flex:1, background:'#f9fbfb', borderRadius:12, padding:'14px 16px', border:'1.5px solid #edf2f2'}}>
                          <div style={{fontSize:11, color:'var(--muted)', fontWeight:600, marginBottom:6}}>{v.date}</div>
                          <div style={{fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:3}}>{v.title}</div>
                          <div style={{fontSize:12, color:'var(--muted)', marginBottom:8}}>{v.doctor} · {v.diag}</div>
                          {v.cert && <span className="shd-pill pill-confirmed" style={{fontSize:11}}>📄 Cert Available</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ══════════ HEALTH PROFILE ══════════ */}
            {activePage === 'profile' && (
              <div className="shd-grid2">
                <div>
                  <div className="shd-card" style={{marginBottom:20}}>
                    <div className="shd-card-head">
                      <div className="shd-card-title">Personal Information</div>
                      <button className="shd-btn-sm" onClick={() => navigate('/create-profile')}>Edit Profile</button>
                    </div>
                    <div className="shd-card-body">
                      <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20}}>
                        <div className="shd-avatar" style={{width:56,height:56,fontSize:22}}>
                          {(profile?.studentName || 'Student').split(' ').map(w=>w[0]).join('')}
                        </div>
                        <div>
                          <div style={{fontSize:17, fontWeight:700, color:'var(--text)'}}>{profile?.studentName || 'Student'}</div>
                          <div style={{fontSize:13, color:'var(--muted)'}}>{profile?.registrationNumber || '-'} · {profile?.faculty || '-'}</div>
                        </div>
                      </div>
                      <div className="shd-profile-grid">
                        {[
                          ['Year', profile?.year || '-'], ['Blood Type', profile?.bloodType || '-'],
                          ['Date of Birth', profile?.dateOfBirth || '-'], ['Phone', profile?.personalPhone || '-'],
                        ].map(([l, v]) => (
                          <div className="shd-profile-field" key={l}>
                            <label>{l}</label><p>{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shd-card">
                    <div className="shd-card-head">
                      <div className="shd-card-title">Emergency Contact</div>
                      <button className="shd-btn-sm" onClick={() => navigate('/create-profile')}>Edit</button>
                    </div>
                    <div className="shd-card-body">
                      <div className="shd-profile-field">
                        <label>Contact</label><p>{profile?.emergencyContact ? `${profile.emergencyContact.name} — ${profile.emergencyContact.phoneNumber}` : '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="shd-card">
                  <div className="shd-card-head">
                    <div className="shd-card-title">Medical Conditions</div>
                    <button className="shd-btn-sm" onClick={() => navigate('/create-profile')}>Update</button>
                  </div>
                  <div className="shd-card-body">
                    <div style={{marginBottom:16}}>
                      <div style={{fontSize:12, fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8}}>Allergies</div>
                      <div className="shd-allergy-tags">
                        {profile?.allergies && profile.allergies !== "None" ? profile.allergies.split(',').map(a => (
                          <span className="shd-allergy-tag" key={a.trim()}>⚠️ {a.trim()}</span>
                        )) : <span className="shd-allergy-tag" style={{background: '#f1f5f9', color: '#64748b'}}>None reported</span>}
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize:12, fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8}}>Chronic Conditions</div>
                      <div className="shd-allergy-tags">
                        {profile?.chronicIllnesses && profile.chronicIllnesses !== "None" ? profile.chronicIllnesses.split(',').map(c => (
                          <span className="shd-chronic-tag" key={c.trim()}>🫁 {c.trim()}</span>
                        )) : <span className="shd-chronic-tag" style={{background: '#f1f5f9', color: '#64748b'}}>None reported</span>}
                      </div>
                    </div>
                    <div style={{marginTop:20, padding:'12px 14px', background:'#fef9ee', borderRadius:10, border:'1.5px solid #fde68a'}}>
                      <div style={{fontSize:12, fontWeight:600, color:'#92400e', marginBottom:4}}>⚠️ Doctor's Note</div>
                      <div style={{fontSize:13, color:'#78350f', lineHeight:1.5}}>Carry inhaler at all times. Avoid prolonged outdoor activity on hazy days.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ APPOINTMENTS ══════════ */}
            {activePage === 'appointments' && (
              <div className="shd-card">
                <div className="shd-card-head">
                  <div className="shd-card-title">My Appointments</div>
                  <button className="shd-btn-sm" onClick={() => navigate('/book-appointment')}>+ Book New</button>
                </div>
                <div className="shd-card-body">
                  {APPOINTMENTS.map((a, i) => (
                    <div className="shd-appt-item" key={i} style={{padding:'16px 0'}}>
                      <div className="shd-appt-date" style={{width:52, height:56}}>
                        <div className="shd-appt-day" style={{fontSize:22}}>{a.day}</div>
                        <div className="shd-appt-month">{a.month}</div>
                      </div>
                      <div className="shd-appt-info">
                        <div className="shd-appt-title" style={{fontSize:15}}>{a.title}</div>
                        <div className="shd-appt-sub">{a.doc} · {a.time}</div>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:10}}>
                        <span className={`shd-pill ${a.status === 'confirmed' ? 'pill-confirmed' : 'pill-pending'}`}>
                          {a.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                        </span>
                        {a.status === 'confirmed' && (
                          <span className="shd-pill pill-queue">🎫 Get QR</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════ MEDICAL HISTORY ══════════ */}
            {activePage === 'history' && (
              <div className="shd-card">
                <div className="shd-card-head">
                  <div className="shd-card-title">Visit History</div>
                  <span style={{fontSize:13, color:'var(--muted)'}}>Read-only</span>
                </div>
                <div className="shd-card-body">
                  <div className="shd-timeline">
                    {VISITS.map((v, i) => (
                      <div className="shd-tl-item" key={i}>
                        <div className="shd-tl-dot" />
                        <div className="shd-tl-date">{v.date}</div>
                        <div className="shd-tl-title">{v.title}</div>
                        <div className="shd-tl-sub">{v.doctor} · Diagnosis: {v.diag}</div>
                        <div className="shd-tl-actions">
                          <button className="shd-tl-btn tl-btn-teal">View Details</button>
                          {v.cert && <button className="shd-tl-btn tl-btn-gray" onClick={() => setActivePage('certificates')}>📄 Certificate</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ CERTIFICATES ══════════ */}
            {activePage === 'certificates' && (
              <div className="shd-card">
                <div className="shd-card-head">
                  <div className="shd-card-title">Medical Certificates</div>
                  <span style={{fontSize:12, color:'var(--muted)'}}>Only downloadable by you</span>
                </div>
                <div className="shd-card-body">
                  {CERTS.length === 0 ? (
                    <div className="shd-empty"><div className="shd-empty-icon">📄</div><p>No certificates available yet.</p></div>
                  ) : CERTS.map((c, i) => (
                    <div className="shd-cert-item" key={i}>
                      <div className="shd-cert-icon">📄</div>
                      <div className="shd-cert-info">
                        <div className="shd-cert-name">{c.name}</div>
                        <div className="shd-cert-date">{c.date}</div>
                      </div>
                      <button className="shd-dl-btn">⬇ Download PDF</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════ NOTIFICATIONS ══════════ */}
            {activePage === 'notifications' && (
              <div className="shd-card">
                <div className="shd-card-head">
                  <div className="shd-card-title">Notifications</div>
                  <button className="shd-btn-sm" onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}>
                    Mark All Read
                  </button>
                </div>
                <div className="shd-card-body">
                  {notifs.map((n, i) => (
                    <div className={`shd-notif-item ${n.unread ? 'unread' : ''}`} key={i} onClick={() => markRead(i)}
                      style={{padding:'14px 0'}}>
                      <div className={`shd-notif-dot2 ${n.unread ? '' : 'read'}`} />
                      <div>
                        <div className="shd-notif-msg" style={{fontSize:14}}>{n.msg}</div>
                        <div className="shd-notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════ MEDIBOT AI ══════════ */}
            {activePage === 'medibot' && (
              <HealthChatbot profile={profile} />
            )}

          </div>
        </div>
      </div>
    </>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  .mc-root *, .mc-root *::before, .mc-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mc-root {
    --teal: #0d9488;
    --teal-light: #14b8a6;
    --teal-dark: #0f766e;
    --cream: #fdf8f3;
    --text: #1c3238;
    --muted: #6b8c90;
    --error: #e53e3e;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    background: var(--cream);
    overflow: hidden;
  }

  /* ── Left Panel ── */
  .mc-panel-left {
    width: 48%;
    background: linear-gradient(155deg, #0d9488 0%, #0f766e 45%, #064e3b 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 56px;
    position: relative;
    overflow: hidden;
  }
  .mc-panel-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .mc-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.18;
    animation: mcFloat 8s ease-in-out infinite;
    pointer-events: none;
  }
  .mc-orb-1 { width: 360px; height: 360px; background: #5eead4; top: -80px; right: -80px; }
  .mc-orb-2 { width: 280px; height: 280px; background: #99f6e4; bottom: -60px; left: -60px; animation-delay: -4s; }

  @keyframes mcFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.04); }
  }

  .mc-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 60px;
    position: relative;
  }
  .mc-brand-icon {
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.3);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(8px);
  }
  .mc-brand-name {
    color: #fff;
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    letter-spacing: -0.3px;
  }
  .mc-brand-name span { opacity: 0.65; font-style: italic; }

  .mc-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: #a7f3d0;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 28px;
  }
  .mc-hero-tag::before {
    content: '';
    width: 6px; height: 6px;
    background: #34d399;
    border-radius: 50%;
    animation: mcPulse 2s ease-in-out infinite;
  }
  @keyframes mcPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.4); }
  }

  .mc-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 46px;
    line-height: 1.1;
    color: #fff;
    margin-bottom: 20px;
  }
  .mc-hero-title em { font-style: italic; color: #a7f3d0; }

  .mc-hero-desc {
    color: rgba(255,255,255,0.6);
    font-size: 15px;
    line-height: 1.7;
    max-width: 340px;
    margin-bottom: 52px;
  }

  .mc-feature-list { display: flex; flex-direction: column; gap: 16px; }
  .mc-feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
    color: rgba(255,255,255,0.75);
    font-size: 14px;
  }
  .mc-feature-dot {
    width: 34px; height: 34px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 16px;
  }

  /* ── Right Panel ── */
  .mc-panel-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 56px;
    position: relative;
  }
  .mc-panel-right::before {
    content: '';
    position: absolute;
    top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .mc-card {
    width: 100%;
    max-width: 420px;
    animation: mcSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
    opacity: 0;
    transform: translateY(24px);
  }
  @keyframes mcSlideUp {
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── Toggle tabs ── */
  .mc-tabs {
    display: flex;
    background: #f0f5f5;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 32px;
  }
  .mc-tab {
    flex: 1;
    padding: 10px;
    border: none;
    background: transparent;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
  }
  .mc-tab.active {
    background: #fff;
    color: var(--text);
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .mc-card-header { margin-bottom: 28px; }
  .mc-card-header h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 30px;
    color: var(--text);
    line-height: 1.2;
    margin-bottom: 6px;
  }
  .mc-card-header p { color: var(--muted); font-size: 14px; }

  .mc-form-group { margin-bottom: 18px; }

  .mc-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 7px;
    letter-spacing: 0.2px;
  }

  .mc-input-wrap { position: relative; }
  .mc-input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
    display: flex;
  }

  .mc-input {
    width: 100%;
    padding: 13px 14px 13px 42px;
    background: #fff;
    border: 1.5px solid #e2eaeb;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .mc-input:focus {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px rgba(13,148,136,0.12);
  }
  .mc-input.error {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(229,62,62,0.10);
  }

  .mc-pw-toggle {
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    cursor: pointer; color: var(--muted);
    display: flex; padding: 0;
    transition: color 0.2s;
  }
  .mc-pw-toggle:hover { color: var(--teal); }

  .mc-error-msg {
    font-size: 12px;
    color: var(--error);
    margin-top: 5px;
  }

  .mc-row-opts {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: -2px 0 22px;
  }

  .mc-remember {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13.5px;
    color: var(--muted);
    user-select: none;
  }
  .mc-checkbox-box {
    width: 17px; height: 17px;
    border: 1.5px solid #d0dde0;
    border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    background: #fff;
    flex-shrink: 0;
  }
  .mc-checkbox-box.checked {
    background: var(--teal);
    border-color: var(--teal);
  }
  .mc-checkbox-box.checked::after {
    content: '';
    width: 9px; height: 5px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(-45deg) translateY(-1px);
    display: block;
  }

  .mc-forgot {
    font-size: 13.5px;
    color: var(--teal);
    text-decoration: none;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }
  .mc-forgot:hover { color: var(--teal-dark); }

  .mc-btn-primary {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, var(--teal-light), var(--teal-dark));
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.2px;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .mc-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 32px rgba(13,148,136,0.35);
  }
  .mc-btn-primary:active { transform: translateY(0); }
  .mc-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .mc-spin {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: mcSpin 0.7s linear infinite;
  }
  @keyframes mcSpin { to { transform: rotate(360deg); } }

  .mc-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }
  .mc-divider::before, .mc-divider::after {
    content: ''; flex: 1; height: 1px; background: #e6eef0;
  }
  .mc-divider span { font-size: 12px; color: var(--muted); white-space: nowrap; }

  .mc-btn-sso {
    width: 100%;
    padding: 13px;
    background: #fff;
    border: 1.5px solid #e2eaeb;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s;
    margin-bottom: 26px;
  }
  .mc-btn-sso:hover {
    border-color: var(--teal);
    color: var(--teal);
    background: rgba(13,148,136,0.03);
  }

  .mc-footer-text {
    text-align: center;
    font-size: 13.5px;
    color: var(--muted);
  }
  .mc-footer-text button {
    color: var(--teal);
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    padding: 0;
    transition: color 0.2s;
  }
  .mc-footer-text button:hover { color: var(--teal-dark); }

  /* ── Success State ── */
  .mc-success {
    text-align: center;
    padding: 40px 20px;
    animation: mcSlideUp 0.5s ease forwards;
    opacity: 0;
    transform: translateY(24px);
  }
  .mc-success-icon {
    width: 72px; height: 72px;
    background: linear-gradient(135deg, #d1fae5, #6ee7b7);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    font-size: 32px;
  }
  .mc-success h3 {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    color: var(--text);
    margin-bottom: 10px;
  }
  .mc-success p { color: var(--muted); font-size: 14px; line-height: 1.6; }

  @media (max-width: 768px) {
    .mc-root { flex-direction: column; overflow: auto; }
    .mc-panel-left { width: 100%; padding: 40px 32px 48px; }
    .mc-hero-title { font-size: 34px; }
    .mc-panel-right { padding: 40px 24px; }
  }
`;

// ── Icon components ──
const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
  </svg>
);
const IconEye = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ── Main Component ──
export default function Login() {
  const navigate = useNavigate();
  const { fetchProfile, setIdentifier } = useProfile();

  const [isSignUp, setIsSignUp] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [fields, setFields] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setFields(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (isSignUp && !fields.name.trim()) {
      errs.name = 'Please enter your full name.';
    } else if (isSignUp && !/^[a-zA-Z\s.-]+$/.test(fields.name)) {
      errs.name = 'Name can only contain letters, spaces, dots, and hyphens.';
    }
    
    if (!fields.email.trim()) {
      errs.email = 'Please enter your Student ID or Email.';
    } else if (isSignUp && !fields.email.includes('@')) {
      errs.email = 'Email address must contain an "@" symbol.';
    }

    if (!fields.password) {
      errs.password = 'Please enter your password.';
    } else if (isSignUp && fields.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }

    if (isSignUp && !fields.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (isSignUp && fields.password !== fields.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      if (isSignUp) {
        // Create basic profile
        const payload = {
          studentName: fields.name,
          registrationNumber: fields.email, // using email field as identifier
          password: fields.password,
          email: fields.email.includes('@') ? fields.email : undefined, // Only pass as email if it looks like one
          emergencyContact: {
            name: "Pending",
            relationship: "Pending",
            phoneNumber: "Pending"
          }
        };
        const res = await axios.post('http://localhost:5000/api/student', payload);
        const createdId = res.data.profile.registrationNumber;
        setIdentifier(createdId);
        localStorage.setItem('studentIdentifier', createdId);
        // Pre-fetch for Context
        await fetchProfile(createdId);
        
        setLoading(false);
        setSuccess(true);
        setTimeout(() => navigate('/create-profile'), 1600);
      } else {
        // Sign In
        const payload = {
          identifier: fields.email,
          password: fields.password
        };
        const res = await axios.post('http://localhost:5000/api/student/login', payload);
        // Note: backend returns studentId, but we will use the user's input `identifier`
        // Wait, for read route, we can use email or registrationNumber
        const loggedId = fields.email;
        setIdentifier(loggedId);
        localStorage.setItem('studentIdentifier', loggedId);
        await fetchProfile(loggedId);

        setLoading(false);
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1600);
      }
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || err.message || 'Something went wrong.';
      setErrors({ email: errMsg });
    }
  };

  const switchMode = (signup) => {
    setIsSignUp(signup);
    setErrors({});
    setFields({ name: '', email: '', password: '', confirmPassword: '' });
    setSuccess(false);
    setShowPw(false);
    setShowConfirmPw(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="mc-root">

        {/* ── Left Panel ── */}
        <div className="mc-panel-left">
          <div className="mc-orb mc-orb-1" />
          <div className="mc-orb mc-orb-2" />

          <div className="mc-brand">
            <div className="mc-brand-icon">
              <svg viewBox="0 0 26 26" fill="none" width="26" height="26">
                <path d="M13 3C13 3 7 7 7 13.5C7 17.09 9.69 20 13 20C16.31 20 19 17.09 19 13.5C19 7 13 3 13 3Z" fill="white" fillOpacity="0.9"/>
                <rect x="10" y="10" width="6" height="1.5" rx="0.75" fill="#0d9488"/>
                <rect x="12.25" y="8" width="1.5" height="6" rx="0.75" fill="#0d9488"/>
              </svg>
            </div>
            <div className="mc-brand-name">Medi<span>Campus</span></div>
          </div>

          <div>
            <div className="mc-hero-tag">Student Portal</div>
            <h1 className="mc-hero-title">Your Health,<br /><em>Your Control</em></h1>
            <p className="mc-hero-desc">Access your personal health profile, medical history, appointments, and certificates — all in one secure place.</p>

            <div className="mc-feature-list">
              {[
                ['📋', 'View & manage your health profile'],
                ['🗓️', 'Track appointments & queue status'],
                ['📄', 'Download medical certificates'],
                ['🔔', 'Receive real-time health notifications'],
              ].map(([icon, text]) => (
                <div className="mc-feature-item" key={text}>
                  <div className="mc-feature-dot">{icon}</div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="mc-panel-right">
          <div className="mc-card">

            {success ? (
              <div className="mc-success">
                <div className="mc-success-icon">{isSignUp ? '🌱' : '✅'}</div>
                <h3>{isSignUp ? 'Account Created!' : 'Login Successful!'}</h3>
                <p>{isSignUp
                  ? <>Account ready! Let's set up your<br />health profile next…</>
                  : <>Welcome back! Let's update your<br />health profile…</>
                }</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="mc-tabs">
                  <button className={`mc-tab ${!isSignUp ? 'active' : ''}`} onClick={() => switchMode(false)}>Sign In</button>
                  <button className={`mc-tab ${isSignUp ? 'active' : ''}`}  onClick={() => switchMode(true)}>Sign Up</button>
                </div>

                <div className="mc-card-header">
                  <h2>{isSignUp ? 'Create account 🌱' : 'Welcome back 👋'}</h2>
                  <p>{isSignUp ? 'Set up your student health profile' : 'Sign in to your student health account'}</p>
                </div>

                {/* Name (sign up only) */}
                {isSignUp && (
                  <div className="mc-form-group">
                    <label className="mc-label">Full Name</label>
                    <div className="mc-input-wrap">
                      <span className="mc-input-icon"><IconUser /></span>
                      <input className={`mc-input ${errors.name ? 'error' : ''}`} type="text"
                        value={fields.name} onChange={set('name')} placeholder="e.g. Ahmad bin Ali" />
                    </div>
                    {errors.name && <div className="mc-error-msg">{errors.name}</div>}
                  </div>
                )}

                {/* Email / Student ID */}
                <div className="mc-form-group">
                  <label className="mc-label">Student ID / Email</label>
                  <div className="mc-input-wrap">
                    <span className="mc-input-icon"><IconMail /></span>
                    <input className={`mc-input ${errors.email ? 'error' : ''}`} type="text"
                      value={fields.email} onChange={set('email')} placeholder="e.g. S20240012 or you@uni.edu"
                      autoComplete="username" />
                  </div>
                  {errors.email && <div className="mc-error-msg">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="mc-form-group">
                  <label className="mc-label">Password</label>
                  <div className="mc-input-wrap">
                    <span className="mc-input-icon"><IconLock /></span>
                    <input className={`mc-input ${errors.password ? 'error' : ''}`}
                      type={showPw ? 'text' : 'password'}
                      value={fields.password} onChange={set('password')}
                      placeholder="Enter your password" autoComplete={isSignUp ? 'new-password' : 'current-password'} />
                    <button className="mc-pw-toggle" type="button" onClick={() => setShowPw(v => !v)}>
                      <IconEye open={showPw} />
                    </button>
                  </div>
                  {errors.password && <div className="mc-error-msg">{errors.password}</div>}
                </div>

                {/* Confirm Password (sign up only) */}
                {isSignUp && (
                  <div className="mc-form-group">
                    <label className="mc-label">Confirm Password</label>
                    <div className="mc-input-wrap">
                      <span className="mc-input-icon"><IconLock /></span>
                      <input className={`mc-input ${errors.confirmPassword ? 'error' : ''}`}
                        type={showConfirmPw ? 'text' : 'password'}
                        value={fields.confirmPassword} onChange={set('confirmPassword')}
                        placeholder="Re-enter your password" autoComplete="new-password" />
                      <button className="mc-pw-toggle" type="button" onClick={() => setShowConfirmPw(v => !v)}>
                        <IconEye open={showConfirmPw} />
                      </button>
                    </div>
                    {errors.confirmPassword && <div className="mc-error-msg">{errors.confirmPassword}</div>}
                  </div>
                )}

                {/* Remember / Forgot */}
                {!isSignUp && (
                  <div className="mc-row-opts">
                    <label className="mc-remember" onClick={() => setRemember(v => !v)}>
                      <div className={`mc-checkbox-box ${remember ? 'checked' : ''}`} />
                      Remember me
                    </label>
                    <button className="mc-forgot" type="button">Forgot password?</button>
                  </div>
                )}

                {/* Submit */}
                <button className="mc-btn-primary" onClick={handleSubmit} disabled={loading}>
                  {loading
                    ? <div className="mc-spin" />
                    : (isSignUp ? 'Create Account' : 'Sign In')
                  }
                </button>

                {/* SSO */}
                <div className="mc-divider"><span>or sign in with</span></div>
                <button className="mc-btn-sso" type="button">
                  <IconCard /> Matric Card / University SSO
                </button>

                {/* Footer switch */}
                <div className="mc-footer-text">
                  {isSignUp
                    ? <>Already have an account? <button onClick={() => switchMode(false)}>Sign In</button></>
                    : <>New student? <button onClick={() => switchMode(true)}>Create your health profile</button></>
                  }
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
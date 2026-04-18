import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cp-root *, .cp-root *::before, .cp-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cp-root {
    --teal: #0d9488;
    --teal-light: #14b8a6;
    --teal-dark: #0f766e;
    --teal-bg: #f0fdfa;
    --cream: #fdf8f3;
    --text: #1c3238;
    --muted: #6b8c90;
    --border: #e2eaeb;
    --error: #e53e3e;
    --red-bg: #fef2f2;
    --warn-bg: #fffbeb;
    --warn: #d97706;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: var(--cream);
    display: flex;
    flex-direction: column;
  }

  /* ── Topbar ── */
  .cp-topbar {
    background: #fff;
    border-bottom: 1.5px solid var(--border);
    padding: 0 40px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 20;
  }
  .cp-brand { display: flex; align-items: center; gap: 12px; }
  .cp-brand-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #0d9488, #0f766e);
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
  }
  .cp-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 19px;
    color: var(--text);
    letter-spacing: -0.3px;
  }
  .cp-brand-name span { color: var(--teal); font-style: italic; }
  .cp-topbar-tag {
    display: flex;
    align-items: center;
    gap: 7px;
    background: var(--teal-bg);
    border: 1px solid #a7f3d0;
    color: var(--teal-dark);
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 100px;
    letter-spacing: 0.3px;
  }
  .cp-topbar-tag::before {
    content: '';
    width: 7px; height: 7px;
    background: var(--teal);
    border-radius: 50%;
    animation: cpPulse 2s ease-in-out infinite;
  }
  @keyframes cpPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(1.4); }
  }

  /* ── Page layout ── */
  .cp-body {
    flex: 1;
    display: flex;
    gap: 28px;
    padding: 36px 40px 60px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }

  /* ── Left sidebar info panel ── */
  .cp-sidebar {
    width: 260px;
    flex-shrink: 0;
  }
  .cp-sidebar-card {
    background: linear-gradient(155deg, #0d9488 0%, #064e3b 100%);
    border-radius: 20px;
    padding: 28px 24px;
    color: #fff;
    position: sticky;
    top: 88px;
    overflow: hidden;
  }
  .cp-sidebar-card::before {
    content: '';
    position: absolute;
    width: 200px; height: 200px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    top: -60px; right: -60px;
  }
  .cp-sidebar-card::after {
    content: '';
    position: absolute;
    width: 150px; height: 150px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
    bottom: -40px; left: -40px;
  }
  .cp-sidebar-title {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    margin-bottom: 6px;
    position: relative;
  }
  .cp-sidebar-sub {
    font-size: 13px;
    opacity: 0.65;
    line-height: 1.6;
    margin-bottom: 28px;
    position: relative;
  }
  .cp-sidebar-steps { display: flex; flex-direction: column; gap: 0; position: relative; }
  .cp-sidebar-step {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding-bottom: 20px;
    position: relative;
  }
  .cp-sidebar-step:last-child { padding-bottom: 0; }
  .cp-sidebar-step::before {
    content: '';
    position: absolute;
    left: 13px; top: 26px;
    width: 1.5px;
    height: calc(100% - 10px);
    background: rgba(255,255,255,0.2);
  }
  .cp-sidebar-step:last-child::before { display: none; }
  .cp-step-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
    border: 1.5px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    margin-top: 1px;
  }
  .cp-step-dot.active { background: #fff; color: var(--teal-dark); border-color: #fff; }
  .cp-step-dot.done   { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.4); }
  .cp-step-info {}
  .cp-step-name { font-size: 13.5px; font-weight: 600; color: #fff; margin-bottom: 2px; }
  .cp-step-desc { font-size: 12px; opacity: 0.55; line-height: 1.4; }

  .cp-info-note {
    margin-top: 24px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    padding: 14px;
    font-size: 12.5px;
    line-height: 1.6;
    opacity: 0.8;
    position: relative;
  }

  /* ── Main form area ── */
  .cp-main { flex: 1; }

  .cp-section {
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 20px;
    animation: cpFade 0.4s ease forwards;
    opacity: 0;
  }
  .cp-section:nth-child(1) { animation-delay: 0.05s; }
  .cp-section:nth-child(2) { animation-delay: 0.12s; }
  .cp-section:nth-child(3) { animation-delay: 0.19s; }
  .cp-section:nth-child(4) { animation-delay: 0.26s; }
  @keyframes cpFade {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cp-section-head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f4f5;
  }
  .cp-section-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 19px;
    flex-shrink: 0;
  }
  .cp-section-head h3 {
    font-family: 'DM Serif Display', serif;
    font-size: 17px;
    color: var(--text);
    margin-bottom: 1px;
  }
  .cp-section-head p { font-size: 12.5px; color: var(--muted); }

  .cp-section-body { padding: 24px; }

  /* ── Grid ── */
  .cp-grid { display: grid; gap: 18px; }
  .cp-grid.g2 { grid-template-columns: 1fr 1fr; }
  .cp-grid.g3 { grid-template-columns: 1fr 1fr 1fr; }
  .cp-grid.g1 { grid-template-columns: 1fr; }
  .cp-grid + .cp-grid { margin-top: 18px; }

  /* ── Field ── */
  .cp-field {}
  .cp-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 7px;
    letter-spacing: 0.2px;
  }
  .cp-req { color: var(--teal); font-size: 13px; }

  .cp-input-wrap { position: relative; }
  .cp-icon {
    position: absolute;
    left: 13px; top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
    display: flex;
    font-size: 15px;
  }
  .cp-input, .cp-select, .cp-textarea {
    width: 100%;
    padding: 12px 13px 12px 40px;
    background: #fafcfc;
    border: 1.5px solid var(--border);
    border-radius: 11px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .cp-input.no-icon, .cp-select.no-icon { padding-left: 13px; }
  .cp-textarea { padding: 12px 13px; min-height: 88px; resize: vertical; }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
    background: #fff;
  }
  .cp-input.err, .cp-select.err { border-color: var(--error); box-shadow: 0 0 0 3px rgba(229,62,62,0.08); }
  .cp-err { font-size: 11.5px; color: var(--error); margin-top: 5px; display: flex; align-items: center; gap: 4px; }

  .cp-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='11' height='7' viewBox='0 0 11 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5.5 6L10 1' stroke='%236b8c90' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 13px center;
    padding-right: 34px;
    cursor: pointer;
  }

  /* ── Blood type radio ── */
  .cp-blood-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .cp-blood-btn {
    width: 56px; height: 44px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: #fafcfc;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.18s;
    display: flex; align-items: center; justify-content: center;
  }
  .cp-blood-btn:hover { border-color: var(--teal-light); color: var(--teal); background: var(--teal-bg); }
  .cp-blood-btn.sel { border-color: var(--teal); background: var(--teal-bg); color: var(--teal-dark); font-weight: 700; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }

  /* ── Tag input ── */
  .cp-tag-box {
    min-height: 48px;
    padding: 7px 10px;
    background: #fafcfc;
    border: 1.5px solid var(--border);
    border-radius: 11px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    cursor: text;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .cp-tag-box:focus-within {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
    background: #fff;
  }
  .cp-tag {
    display: flex; align-items: center; gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12.5px;
    font-weight: 600;
  }
  .cp-tag.allergy { background: #fef2f2; color: #dc2626; }
  .cp-tag.condition { background: var(--warn-bg); color: var(--warn); }
  .cp-tag-x { background: none; border: none; cursor: pointer; font-size: 14px; line-height: 1; color: inherit; opacity: 0.55; padding: 0; }
  .cp-tag-x:hover { opacity: 1; }
  .cp-tag-input {
    border: none; outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; color: var(--text);
    background: transparent;
    flex: 1; min-width: 140px;
    padding: 2px 4px;
  }
  .cp-tag-hint { font-size: 11.5px; color: var(--muted); margin-top: 5px; }

  /* ── Consent ── */
  .cp-consent {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 16px 18px;
    background: var(--teal-bg);
    border: 1.5px solid #a7f3d0;
    border-radius: 13px;
    cursor: pointer;
    user-select: none;
    margin-top: 4px;
  }
  .cp-checkbox {
    width: 20px; height: 20px;
    border: 1.5px solid #6ee7b7;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    background: #fff;
    flex-shrink: 0;
    margin-top: 1px;
    transition: all 0.2s;
  }
  .cp-checkbox.on { background: var(--teal); border-color: var(--teal); }
  .cp-checkbox.on::after {
    content: '';
    width: 11px; height: 6px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(-45deg) translateY(-1px);
    display: block;
  }
  .cp-consent-text { font-size: 13px; color: var(--text); line-height: 1.55; }
  .cp-consent-text strong { font-weight: 600; }

  /* ── Submit row ── */
  .cp-submit-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 18px;
    padding: 20px 24px;
    animation: cpFade 0.4s 0.3s ease forwards;
    opacity: 0;
  }
  .cp-submit-info { font-size: 13px; color: var(--muted); }
  .cp-submit-info strong { color: var(--text); font-weight: 600; }
  .cp-btn-submit {
    padding: 13px 32px;
    background: linear-gradient(135deg, var(--teal-light), var(--teal-dark));
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 9px;
    transition: all 0.25s;
    letter-spacing: 0.2px;
  }
  .cp-btn-submit:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(13,148,136,0.3); }
  .cp-btn-submit:active { transform: none; }
  .cp-btn-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; box-shadow: none; }
  .cp-spin {
    width: 17px; height: 17px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cpSpin 0.7s linear infinite;
  }
  @keyframes cpSpin { to { transform: rotate(360deg); } }

  /* ── Success overlay ── */
  .cp-success-wrap {
    position: fixed; inset: 0;
    background: rgba(15,38,39,0.55);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
    animation: cpFadeIn 0.3s ease;
  }
  @keyframes cpFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .cp-success-card {
    background: #fff;
    border-radius: 24px;
    padding: 48px 40px;
    text-align: center;
    max-width: 420px;
    width: 90%;
    animation: cpBounce 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes cpBounce {
    from { opacity: 0; transform: scale(0.8) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .cp-success-ring {
    width: 88px; height: 88px;
    background: linear-gradient(135deg, #d1fae5, #6ee7b7);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 22px;
    font-size: 38px;
    box-shadow: 0 0 0 14px rgba(13,148,136,0.08);
  }
  .cp-success-card h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    color: var(--text);
    margin-bottom: 10px;
  }
  .cp-success-card p { font-size: 14px; color: var(--muted); line-height: 1.7; margin-bottom: 28px; }
  .cp-success-go {
    padding: 13px 32px;
    background: linear-gradient(135deg, var(--teal-light), var(--teal-dark));
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
  }
  .cp-success-go:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(13,148,136,0.3); }

  @media (max-width: 860px) {
    .cp-sidebar { display: none; }
    .cp-body { padding: 24px 20px 48px; }
    .cp-grid.g2, .cp-grid.g3 { grid-template-columns: 1fr; }
  }
`;

// ── Tag Input Component ──
function TagInput({ tags, onChange, placeholder, variant }) {
  const [val, setVal] = useState('');
  const add = () => {
    const t = val.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setVal('');
  };
  return (
    <>
      <div className="cp-tag-box" onClick={() => document.getElementById(`ti-${variant}`)?.focus()}>
        {tags.map(t => (
          <span className={`cp-tag ${variant}`} key={t}>
            {t}
            <button className="cp-tag-x" type="button" onClick={(e) => { e.stopPropagation(); onChange(tags.filter(x => x !== t)); }}>×</button>
          </span>
        ))}
        <input id={`ti-${variant}`} className="cp-tag-input" value={val}
          onChange={e => setVal(e.target.value)} placeholder={tags.length ? '' : placeholder}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          onBlur={add} />
      </div>
      <div className="cp-tag-hint">Press Enter or comma after each item</div>
    </>
  );
}

const BLOOD = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

export default function CreateProfile() {
  const navigate = useNavigate();
  const { profile, createOrUpdateProfile } = useProfile();

  const [form, setForm] = useState({
    fullName: '', studentId: '', email: '', phone: '',
    dob: '', gender: '', program: '', year: '',
    bloodType: '', allergies: [], conditions: [],
    currentMeds: '',
    ecName: '', ecRelation: '', ecPhone: '', ecAlt: '',
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      setForm(prev => ({
        ...prev,
        fullName: profile.studentName || prev.fullName,
        studentId: profile.registrationNumber || prev.studentId,
        email: profile.email || prev.email,
        phone: profile.personalPhone || prev.phone,
        dob: profile.dateOfBirth?.split('T')[0] || profile.dateOfBirth || prev.dob,
        gender: profile.gender || prev.gender,
        program: profile.faculty || prev.program,
        year: profile.year || prev.year,
        bloodType: profile.bloodType || prev.bloodType,
        allergies: profile.allergies && profile.allergies !== "None" ? profile.allergies.split(',').map(s=>s.trim()) : prev.allergies,
        conditions: profile.chronicIllnesses && profile.chronicIllnesses !== "None" ? profile.chronicIllnesses.split(',').map(s=>s.trim()) : prev.conditions,
        currentMeds: profile.ongoingTreatments && profile.ongoingTreatments !== "None" ? profile.ongoingTreatments : prev.currentMeds,
        ecName: profile.emergencyContact?.name === "Pending" ? "" : (profile.emergencyContact?.name || prev.ecName),
        ecRelation: profile.emergencyContact?.relationship === "Pending" ? "" : (profile.emergencyContact?.relationship || prev.ecRelation),
        ecPhone: profile.emergencyContact?.phoneNumber === "Pending" ? "" : (profile.emergencyContact?.phoneNumber || prev.ecPhone),
      }));
    }
  }, [profile]);

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); };
  const setVal = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(er => ({ ...er, [k]: '' })); };

  const validate = () => {
    const e = {};
    
    // Full Name
    if (!form.fullName.trim())
      e.fullName = 'Full name is required';
    else if (/\d/.test(form.fullName))
      e.fullName = 'Name cannot contain numbers';
    else if (!/^[a-zA-Z\s]+$/.test(form.fullName))
      e.fullName = 'Name can only contain letters';

    // Student ID
    if (!form.studentId.trim())
      e.studentId = 'Student ID is required';
    else if (!/^it\d{8}$/i.test(form.studentId))
      e.studentId = 'Format: it23693272 (it + 8 digits)';

    // Email
    if (!form.email.trim())
      e.email = 'Email is required';
    else if ((form.email.match(/@/g) || []).length !== 1)
      e.email = 'Email must contain exactly one @ symbol';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.email.toLowerCase().endsWith('@my.sliit.lk'))
      e.email = 'Invalid email format (e.g. name@my.sliit.lk)';

    // Phone
    if (!form.phone.trim())
      e.phone = 'Phone number is required';
    else if (!/^\d+$/.test(form.phone))
      e.phone = 'Phone number can only contain digits';
    else if (form.phone.length !== 10)
      e.phone = 'Phone number must be exactly 10 digits';

    // Date of Birth
    if (!form.dob) {
      e.dob = 'Date of birth is required';
    } else {
      const today = new Date();
      today.setHours(0,0,0,0);
      const birth = new Date(form.dob);
      if (birth >= today) {
        e.dob = 'Date of birth must be before today';
      }
    }

    // Gender
    if (!form.gender)
      e.gender = 'Please select a gender';

    // Emergency Contact
    if (!form.ecName.trim()) {
      e.ecName = 'Emergency contact name is required';
    } else if (!/^[a-zA-Z\s.-]+$/.test(form.ecName)) {
      e.ecName = 'Name can only contain letters, spaces, dots, and hyphens';
    }
    
    if (!form.ecPhone.trim()) {
      e.ecPhone = 'Emergency contact phone is required';
    } else if (!/^\d+$/.test(form.ecPhone)) {
      e.ecPhone = 'Phone number can only contain digits';
    } else if (form.ecPhone.length !== 10) {
      e.ecPhone = 'Phone number must be exactly 10 digits';
    }

    if (!form.ecRelation) e.ecRelation = 'Relationship is required';
    if (!form.consent) e.consent = 'You must agree to continue';
    
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // scroll to first error
      const first = document.querySelector('.cp-input.err, .cp-select.err');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setLoading(true);
    
    const backendPayload = {
      studentName: form.fullName,
      registrationNumber: form.studentId,
      email: form.email,
      personalPhone: form.phone,
      dateOfBirth: form.dob,
      bloodType: form.bloodType,
      faculty: form.program,
      year: form.year,
      allergies: form.allergies.length > 0 ? form.allergies.join(", ") : "None",
      chronicIllnesses: form.conditions.length > 0 ? form.conditions.join(", ") : "None",
      ongoingTreatments: form.currentMeds || "None",
      emergencyContact: {
        name: form.ecName,
        relationship: form.ecRelation,
        phoneNumber: form.ecPhone
      },
      isProfileComplete: true
    };
    
    // Always string for gender, kept extra since backend didn't define it. It will ignored or stored if schema allows strict: false .
    backendPayload.gender = form.gender;

    const successRes = await createOrUpdateProfile(backendPayload);

    setLoading(false);
    if (successRes) {
      setSuccess(true);
    } else {
      setErrors({ fullName: "Failed to save profile. Please try again." });
    }
  };

  const FilledCount = [
    form.fullName, form.studentId, form.email, form.phone,
    form.dob, form.gender, form.ecName, form.ecPhone, form.ecRelation
  ].filter(Boolean).length;
  const total = 9;

  return (
    <>
      <style>{styles}</style>
      <div className="cp-root">

        {/* Success overlay */}
        {success && (
          <div className="cp-success-wrap">
            <div className="cp-success-card">
              <div className="cp-success-ring">🎉</div>
              <h2>Profile Created!</h2>
              <p>Your health profile is all set,<br /><strong>{form.fullName.split(' ')[0]}</strong>! You can now book appointments, view medical records, and download certificates.</p>
              <button className="cp-success-go" onClick={() => navigate('/dashboard')}>
                Go to My Dashboard →
              </button>
            </div>
          </div>
        )}

        {/* Topbar */}
        <div className="cp-topbar">
          <div className="cp-brand">
            <div className="cp-brand-icon">
              <svg viewBox="0 0 26 26" fill="none" width="20" height="20">
                <path d="M13 3C13 3 7 7 7 13.5C7 17.09 9.69 20 13 20C16.31 20 19 17.09 19 13.5C19 7 13 3 13 3Z" fill="white" fillOpacity="0.9"/>
                <rect x="10" y="10" width="6" height="1.5" rx="0.75" fill="#0d9488"/>
                <rect x="12.25" y="8" width="1.5" height="6" rx="0.75" fill="#0d9488"/>
              </svg>
            </div>
            <div className="cp-brand-name">Medi<span>Campus</span></div>
          </div>
          <div className="cp-topbar-tag">Create Health Profile</div>
        </div>

        {/* Body */}
        <div className="cp-body">

          {/* Sidebar */}
          <div className="cp-sidebar">
            <div className="cp-sidebar-card">
              <div className="cp-sidebar-title">Health Profile<br />Setup</div>
              <div className="cp-sidebar-sub">Complete all sections below to activate your student health account.</div>

              <div className="cp-sidebar-steps">
                {[
                  { icon: '👤', name: 'Personal Info', desc: 'Name, ID, DOB, contact' },
                  { icon: '🩸', name: 'Medical Info',  desc: 'Blood type, allergies, conditions' },
                  { icon: '🚨', name: 'Emergency Contact', desc: 'Who to call in emergencies' },
                ].map((s, i) => (
                  <div className="cp-sidebar-step" key={i}>
                    <div className="cp-step-dot active">{i + 1}</div>
                    <div className="cp-step-info">
                      <div className="cp-step-name">{s.icon} {s.name}</div>
                      <div className="cp-step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cp-info-note">
                🔒 Your data is private and only accessible to you and your assigned clinic doctor.
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="cp-main">

            {/* ── Section 1: Personal Info ── */}
            <div className="cp-section">
              <div className="cp-section-head">
                <div className="cp-section-icon" style={{background:'#f0fdfa'}}>👤</div>
                <div>
                  <h3>Personal Information</h3>
                  <p>Your basic student details</p>
                </div>
              </div>
              <div className="cp-section-body">

                <div className="cp-grid g2">
                  <div className="cp-field">
                    <label className="cp-label">Full Name <span className="cp-req">*</span></label>
                    <div className="cp-input-wrap">
                      <span className="cp-icon">👤</span>
                      <input className={`cp-input ${errors.fullName ? 'err' : ''}`}
                        value={form.fullName} onChange={set('fullName')}
                        placeholder="e.g. Ahmad Faris bin Razali" />
                    </div>
                    {errors.fullName && <div className="cp-err">⚠ {errors.fullName}</div>}
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Student ID <span className="cp-req">*</span></label>
                    <div className="cp-input-wrap">
                      <span className="cp-icon">🪪</span>
                      <input className={`cp-input ${errors.studentId ? 'err' : ''}`}
                        value={form.studentId} onChange={set('studentId')}
                        placeholder="e.g. S20240012" />
                    </div>
                    {errors.studentId && <div className="cp-err">⚠ {errors.studentId}</div>}
                  </div>
                </div>

                <div className="cp-grid g2">
                  <div className="cp-field">
                    <label className="cp-label">Email Address <span className="cp-req">*</span></label>
                    <div className="cp-input-wrap">
                      <span className="cp-icon">✉️</span>
                      <input className={`cp-input ${errors.email ? 'err' : ''}`}
                        type="email" value={form.email} onChange={set('email')}
                        placeholder="you@university.edu.my" />
                    </div>
                    {errors.email && <div className="cp-err">⚠ {errors.email}</div>}
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Phone Number <span className="cp-req">*</span></label>
                    <div className="cp-input-wrap">
                      <span className="cp-icon">📱</span>
                      <input className={`cp-input ${errors.phone ? 'err' : ''}`}
                        type="tel" value={form.phone} onChange={set('phone')}
                        placeholder="e.g. 012-345 6789" />
                    </div>
                    {errors.phone && <div className="cp-err">⚠ {errors.phone}</div>}
                  </div>
                </div>

                <div className="cp-grid g3">
                  <div className="cp-field">
                    <label className="cp-label">Date of Birth <span className="cp-req">*</span></label>
                    <div className="cp-input-wrap">
                      <span className="cp-icon">📅</span>
                      <input className={`cp-input ${errors.dob ? 'err' : ''}`}
                        type="date" value={form.dob} onChange={set('dob')} />
                    </div>
                    {errors.dob && <div className="cp-err">⚠ {errors.dob}</div>}
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Gender <span className="cp-req">*</span></label>
                    <select className={`cp-select no-icon ${errors.gender ? 'err' : ''}`}
                      value={form.gender} onChange={set('gender')}>
                      <option value="">Select gender</option>
                      {['Male','Female','Prefer not to say'].map(g => <option key={g}>{g}</option>)}
                    </select>
                    {errors.gender && <div className="cp-err">⚠ {errors.gender}</div>}
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Year of Study</label>
                    <select className="cp-select no-icon" value={form.year} onChange={set('year')}>
                      <option value="">Select year</option>
                      {['1st Year','2nd Year','3rd Year','4th Year','Postgraduate'].map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="cp-grid g1">
                  <div className="cp-field">
                    <label className="cp-label">Programme / Faculty</label>
                    <div className="cp-input-wrap">
                      <span className="cp-icon">🎓</span>
                      <input className="cp-input" value={form.program} onChange={set('program')}
                        placeholder="e.g. Computer Science, Faculty of Engineering" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── Section 2: Medical Info ── */}
            <div className="cp-section">
              <div className="cp-section-head">
                <div className="cp-section-icon" style={{background:'#fef2f2'}}>🩺</div>
                <div>
                  <h3>Medical Information</h3>
                  <p>Helps clinic staff keep you safe during visits</p>
                </div>
              </div>
              <div className="cp-section-body">

                <div className="cp-field" style={{marginBottom: 20}}>
                  <label className="cp-label">Blood Type</label>
                  <div className="cp-blood-grid">
                    {BLOOD.map(b => (
                      <button key={b} type="button"
                        className={`cp-blood-btn ${form.bloodType === b ? 'sel' : ''}`}
                        onClick={() => setVal('bloodType', form.bloodType === b ? '' : b)}>
                        {b}
                      </button>
                    ))}
                    <button type="button"
                      className={`cp-blood-btn ${form.bloodType === 'Unknown' ? 'sel' : ''}`}
                      style={{width: 'auto', padding: '0 14px'}}
                      onClick={() => setVal('bloodType', form.bloodType === 'Unknown' ? '' : 'Unknown')}>
                      Unknown
                    </button>
                  </div>
                </div>

                <div className="cp-grid g2">
                  <div className="cp-field">
                    <label className="cp-label">Known Allergies</label>
                    <TagInput variant="allergy" tags={form.allergies}
                      onChange={v => setVal('allergies', v)}
                      placeholder="e.g. Penicillin, Shellfish…" />
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Chronic Conditions</label>
                    <TagInput variant="condition" tags={form.conditions}
                      onChange={v => setVal('conditions', v)}
                      placeholder="e.g. Asthma, Diabetes…" />
                  </div>
                </div>

                <div className="cp-grid g1" style={{marginTop: 18}}>
                  <div className="cp-field">
                    <label className="cp-label">Current Medications</label>
                    <input className="cp-input no-icon" value={form.currentMeds} onChange={set('currentMeds')}
                      placeholder="e.g. Ventolin inhaler, Vitamin D — or leave blank if none" />
                  </div>
                </div>

              </div>
            </div>

            {/* ── Section 3: Emergency Contact ── */}
            <div className="cp-section">
              <div className="cp-section-head">
                <div className="cp-section-icon" style={{background:'#fffbeb'}}>🚨</div>
                <div>
                  <h3>Emergency Contact</h3>
                  <p>Who should the clinic contact in case of emergency?</p>
                </div>
              </div>
              <div className="cp-section-body">

                <div className="cp-grid g2">
                  <div className="cp-field">
                    <label className="cp-label">Contact Full Name <span className="cp-req">*</span></label>
                    <div className="cp-input-wrap">
                      <span className="cp-icon">👥</span>
                      <input className={`cp-input ${errors.ecName ? 'err' : ''}`}
                        value={form.ecName} onChange={set('ecName')}
                        placeholder="e.g. Puan Norzila binti Ahmad" />
                    </div>
                    {errors.ecName && <div className="cp-err">⚠ {errors.ecName}</div>}
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Relationship <span className="cp-req">*</span></label>
                    <select className={`cp-select no-icon ${errors.ecRelation ? 'err' : ''}`}
                      value={form.ecRelation} onChange={set('ecRelation')}>
                      <option value="">Select relationship</option>
                      {['Parent','Guardian','Sibling','Spouse','Relative','Friend'].map(r => <option key={r}>{r}</option>)}
                    </select>
                    {errors.ecRelation && <div className="cp-err">⚠ {errors.ecRelation}</div>}
                  </div>
                </div>

                <div className="cp-grid g2">
                  <div className="cp-field">
                    <label className="cp-label">Primary Phone <span className="cp-req">*</span></label>
                    <div className="cp-input-wrap">
                      <span className="cp-icon">📞</span>
                      <input className={`cp-input ${errors.ecPhone ? 'err' : ''}`}
                        type="tel" value={form.ecPhone} onChange={set('ecPhone')}
                        placeholder="e.g. 011-222 3344" />
                    </div>
                    {errors.ecPhone && <div className="cp-err">⚠ {errors.ecPhone}</div>}
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Alternative Phone</label>
                    <div className="cp-input-wrap">
                      <span className="cp-icon">📞</span>
                      <input className="cp-input" type="tel" value={form.ecAlt} onChange={set('ecAlt')}
                        placeholder="Optional" />
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="cp-consent" onClick={() => setVal('consent', !form.consent)} style={{marginTop: 20}}>
                  <div className={`cp-checkbox ${form.consent ? 'on' : ''}`} />
                  <div className="cp-consent-text">
                    <strong>I confirm all information provided is accurate.</strong>{' '}
                    I consent to MediCampus storing and using this data to manage my health at the university clinic.
                  </div>
                </div>
                {errors.consent && <div className="cp-err" style={{marginTop: 8}}>⚠ {errors.consent}</div>}

              </div>
            </div>

            {/* ── Submit Row ── */}
            <div className="cp-submit-row">
              <div className="cp-submit-info">
                <strong>{FilledCount}/{total}</strong> required fields completed
              </div>
              <button className="cp-btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading
                  ? <><div className="cp-spin" /> Saving Profile…</>
                  : <>Save & Continue →</>
                }
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}  
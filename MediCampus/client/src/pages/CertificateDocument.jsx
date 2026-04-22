import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* Base Reset */
  .cd-root *, .cd-root *::before, .cd-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  .cd-root {
    background-color: #f4f7f8;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 40px 20px;
    font-family: 'DM Sans', sans-serif;
  }

  /* A4 Document Container */
  .cd-document {
    background: white;
    width: 210mm;
    min-height: 297mm;
    padding: 60px 70px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    position: relative;
    color: #1c3238;
  }

  /* Header */
  .cd-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #0d9488;
    padding-bottom: 20px;
    margin-bottom: 40px;
  }
  
  .cd-brand-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .cd-brand-logo {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #0d9488, #0f766e);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .cd-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 28px;
    color: #0d9488;
  }
  .cd-brand-name span { color: #1c3238; }

  .cd-header-text {
    text-align: right;
  }
  
  .cd-header-title {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #6b8c90;
    margin-bottom: 6px;
  }
  
  .cd-serial {
    font-family: monospace;
    font-size: 13px;
    color: #94a3a6;
  }

  /* Document Body */
  .cd-title {
    font-family: 'DM Serif Display', serif;
    font-size: 32px;
    text-align: center;
    margin-bottom: 40px;
  }

  .cd-content-section {
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 40px;
  }

  .cd-patient-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    background: #f0fdfa;
    border: 1px solid #ccfbf1;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 40px;
  }

  .cd-info-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cd-info-row { display: flex; gap: 8px; }
  .cd-info-label { font-weight: 600; color: #0d9488; width: 100px; }
  .cd-info-value { font-weight: 500; }

  /* Signatures */
  .cd-signatures {
    display: flex;
    justify-content: space-between;
    margin-top: 80px;
    padding-top: 40px;
  }

  .cd-sig-box {
    text-align: center;
    width: 200px;
  }

  .cd-sig-line {
    border-top: 1px solid #1c3238;
    margin-bottom: 8px;
    padding-top: 8px;
  }

  .cd-sig-name { font-weight: 600; font-size: 16px; }
  .cd-sig-role { font-size: 13px; color: #6b8c90; }

  /* Footer */
  .cd-footer {
    position: absolute;
    bottom: 40px;
    left: 70px;
    right: 70px;
    border-top: 1px solid #e2eaeb;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cd-verification-box {
    background: #fffbeb;
    border: 1px solid #fde68a;
    padding: 12px 16px;
    border-radius: 8px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cd-vr-text {
    font-size: 12px;
    color: #92400e;
  }
  .cd-vr-code {
    font-family: monospace;
    font-size: 15px;
    font-weight: bold;
    color: #b45309;
    letter-spacing: 1px;
    background: white;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px dashed #fcd34d;
  }

  /* Actions Banner (Hidden on Print) */
  .cd-actions {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #1c3238;
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 1000;
  }

  .cd-btn {
    background: #0d9488;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
  }
  .cd-btn:hover { background: #0f766e; }

  /* Print Styles */
  @media print {
    body { background: white; }
    .cd-root { background: white; padding: 0; display: block; }
    .cd-document { box-shadow: none; width: 100%; height: auto; min-height: 0; padding: 0; }
    .cd-actions { display: none !important; }
  }
`;

export default function CertificateDocument() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch certificate data
    axios.get(`${API}/certificates/${id}`)
      .then(res => {
        setCert(res.data);
        setLoading(false);
        // Automatically trigger print dialog shortly after load
        setTimeout(() => {
          window.print();
        }, 800);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Document...</div>;
  }

  if (!cert) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Certificate not found.</div>;
  }

  return (
    <>
      <style>{styles}</style>
      
      <div className="cd-actions">
        <span>Ready to save?</span>
        <button className="cd-btn" onClick={() => window.print()}>Save as PDF / Print</button>
      </div>

      <div className="cd-root">
        <div className="cd-document">
          
          <div className="cd-header">
            <div className="cd-brand-container">
              <div className="cd-brand-logo">
                <svg viewBox="0 0 26 26" fill="none" width="28" height="28">
                  <path d="M13 3C13 3 7 7 7 13.5C7 17.09 9.69 20 13 20C16.31 20 19 17.09 19 13.5C19 7 13 3 13 3Z" fill="white" fillOpacity="0.9"/>
                  <rect x="10" y="10" width="6" height="1.5" rx="0.75" fill="white"/>
                  <rect x="12.25" y="8" width="1.5" height="6" rx="0.75" fill="white"/>
                </svg>
              </div>
              <div className="cd-brand-name">Medi<span>Campus</span></div>
            </div>
            <div className="cd-header-text">
              <div className="cd-header-title">Official Document</div>
              <div className="cd-serial">DATE: {new Date(cert.createdAt).toLocaleDateString('en-GB')}</div>
            </div>
          </div>

          <div className="cd-title">
            {cert.certificateType === 'exam-medical' ? 'Examination Medical Certificate' : 'Medical Leave Certificate'}
          </div>

          <div className="cd-patient-info">
            <div className="cd-info-col">
              <div className="cd-info-row">
                <div className="cd-info-label">Patient Name:</div>
                <div className="cd-info-value">{cert.studentId?.studentName}</div>
              </div>
              <div className="cd-info-row">
                <div className="cd-info-label">Student ID:</div>
                <div className="cd-info-value">{cert.studentId?.registrationNumber}</div>
              </div>
            </div>
            <div className="cd-info-col">
              <div className="cd-info-row">
                <div className="cd-info-label">Faculty:</div>
                <div className="cd-info-value">{cert.studentId?.faculty || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="cd-content-section">
            <p style={{ marginBottom: '20px' }}>To Whom It May Concern,</p>
            <p style={{ marginBottom: '20px' }}>
              This is to certify that the above-named student was examined at the MediCampus Health Clinic 
              on <strong>{new Date(cert.createdAt).toLocaleDateString('en-GB')}</strong>.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Based on the clinical assessment, the student is unfit to attend classes or examinations for the period spanning from 
              <strong> {new Date(cert.validFrom).toLocaleDateString('en-GB')}</strong> to <strong>{new Date(cert.validTo).toLocaleDateString('en-GB')}</strong> (inclusive).
            </p>
            <div style={{ padding: '20px', background: '#f8fafc', borderLeft: '4px solid #94a3a6', borderRadius: '4px', fontStyle: 'italic' }}>
              <strong>Stated Reason / Condition:</strong> {cert.reason}
            </div>
          </div>

          <div className="cd-signatures">
            <div className="cd-sig-box">
               <div style={{ height: '60px', opacity: 0.1, backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/4/41/Signature_of_John_Hancock.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}></div>
               <div className="cd-sig-line">
                  <div className="cd-sig-name">{cert.doctorId?.name}</div>
                  <div className="cd-sig-role">{cert.doctorId?.specialization || 'Campus Doctor'}</div>
               </div>
            </div>
          </div>

          <div className="cd-footer">
            <div className="cd-verification-box">
              <div className="cd-vr-text">
                <strong>VERIFICATION INSTRUCTIONS</strong><br />
                To verify the authenticity of this document, visit <strong>medicampus.edu/verify-certificate</strong>
              </div>
              <div className="cd-vr-code">{cert.verificationHash}</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

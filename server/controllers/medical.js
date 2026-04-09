import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import Medical from '../models/Medical.js';

// Student applies for medical
export const applyMedical = async (req, res) => {
  try {
    const { doctorId, examName, examDate, illness } = req.body;
    const studentId = req.body.studentId || (req.user && req.user._id) || req.body.registrationNumber;

    if (!studentId || !doctorId || !examName || !examDate || !illness) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const application = new Medical({ studentId, doctorId, examName, examDate, illness });
    await application.save();
    res.status(201).json({ message: 'Medical application submitted successfully.', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get applications for a student
export const getStudentApplications = async (req, res) => {
  try {
    const { studentId } = req.params;
    const applications = await Medical.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending applications for a doctor
export const getDoctorPending = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const applications = await Medical.find({ doctorId, status: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Doctor approves — generates UUID-based certificate ID + QR code stored in DB
export const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, validFrom, validTo } = req.body;

    const application = await Medical.findById(id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // UUID-based Certificate ID (professional, non-guessable)
    const certificateId = `MED-${uuidv4().toUpperCase().replace(/-/g, '').slice(0, 8)}-${Date.now().toString().slice(-4)}`;

    // Verification URL the QR code will point to
    const verificationURL = `http://localhost:3000/verify/${certificateId}`;

    // Generate QR code as base64 data URI and save in DB
    const qrCode = await QRCode.toDataURL(verificationURL, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: { dark: '#1e293b', light: '#ffffff' },
    });

    application.status = 'approved';
    application.diagnosis = diagnosis;
    application.validFrom = validFrom;
    application.validTo = validTo;
    application.certificateId = certificateId;
    application.qrCode = qrCode; // Stored in DB — no regeneration needed

    await application.save();
    res.status(200).json({ message: 'Application approved. Certificate generated.', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Doctor rejects application
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Medical.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json({ message: 'Application rejected.', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Public verification — returns full data including stored QR code
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const application = await Medical.findOne({ certificateId, status: 'approved' });

    if (!application) {
      return res.status(404).json({ valid: false, message: 'Invalid or missing certificate.' });
    }

    // Auto-check expiry
    const now = new Date();
    const isExpired = application.validTo && new Date(application.validTo) < now;

    res.status(200).json({
      valid: !isExpired,
      expired: isExpired,
      data: {
        studentId: application.studentId,
        doctorId: application.doctorId,
        examName: application.examName,
        examDate: application.examDate,
        illness: application.illness,
        validFrom: application.validFrom,
        validTo: application.validTo,
        diagnosis: application.diagnosis,
        certificateId: application.certificateId,
        qrCode: application.qrCode,    // Return stored QR for display
        issueDate: application.updatedAt || application.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Download Certificate as a professional PDF with embedded QR code
export const downloadCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Medical.findById(id);

    if (!application || application.status !== 'approved' || !application.certificateId) {
      return res.status(404).json({ message: 'Approved certificate not found.' });
    }

    const qrCodeDataUri = application.qrCode;
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=MedCert-${application.certificateId}.pdf`);
    doc.pipe(res);

    // ── Header bar ──────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 80).fill('#1e293b');
    doc.fillColor('#ffffff').fontSize(26).font('Helvetica-Bold')
       .text('MediCampus', 50, 22, { align: 'left' });
    doc.fontSize(10).fillColor('#94a3b8')
       .text('Smart University Health Platform', 50, 52, { align: 'left' });
    doc.fillColor('#6366f1').fontSize(10).font('Helvetica-Bold')
       .text('OFFICIAL MEDICAL CERTIFICATE', 0, 32, { align: 'right', width: doc.page.width - 50 });

    doc.moveDown(3);

    // ── Certificate Title ────────────────────────────────────────────
    doc.fillColor('#0f172a').fontSize(20).font('Helvetica-Bold')
       .text('Medical Certificate for Exam Exemption', { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor('#64748b').fontSize(9).font('Helvetica')
       .text(`Certificate ID: ${application.certificateId}`, { align: 'center' });
    doc.text(`Date of Issue: ${new Date(application.updatedAt || application.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'center' });

    doc.moveDown(1.5);
    doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // ── Body ─────────────────────────────────────────────────────────
    doc.fillColor('#1e293b').fontSize(10).font('Helvetica')
       .text('This is to certify that the student identified below has been examined and is advised medical rest from attending the examination stated, due to valid medical reasons.', { align: 'justify', lineGap: 4 });
    doc.moveDown(1.5);

    // ── Details Table ────────────────────────────────────────────────
    const details = [
      ['Student ID / Reg. No.', application.studentId],
      ['Doctor ID', application.doctorId],
      ['Exam / Course', application.examName],
      ['Exam Date', new Date(application.examDate).toLocaleDateString('en-GB')],
      ['Valid From', application.validFrom ? new Date(application.validFrom).toLocaleDateString('en-GB') : 'N/A'],
      ['Valid To', application.validTo ? new Date(application.validTo).toLocaleDateString('en-GB') : 'N/A'],
      ['Diagnosis / Notes', application.diagnosis || 'N/A'],
    ];

    details.forEach(([label, value], i) => {
      const yPos = doc.y;
      if (i % 2 === 0) doc.rect(50, yPos - 4, 495, 22).fill('#f8fafc');
      doc.fillColor('#64748b').fontSize(9).font('Helvetica-Bold').text(label, 60, yPos, { width: 180 });
      doc.fillColor('#0f172a').fontSize(9).font('Helvetica').text(String(value), 250, yPos, { width: 290 });
      doc.y = yPos + 24;
    });

    doc.moveDown(2);

    // ── QR Code + Signature ──────────────────────────────────────────
    const qrBuffer = Buffer.from(qrCodeDataUri.split(',')[1], 'base64');
    const qrY = doc.y;
    doc.image(qrBuffer, 50, qrY, { width: 110 });
    doc.fillColor('#334155').fontSize(8).font('Helvetica')
       .text('Scan QR to Verify', 50, qrY + 115, { width: 110, align: 'center' });

    doc.strokeColor('#cbd5e1').lineWidth(1)
       .moveTo(350, qrY + 80).lineTo(540, qrY + 80).stroke();
    doc.fillColor('#64748b').fontSize(8).font('Helvetica')
       .text("Doctor's Signature & Stamp", 350, qrY + 88, { width: 190, align: 'center' });

    doc.moveDown(9);

    // ── Footer ───────────────────────────────────────────────────────
    doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fillColor('#94a3b8').fontSize(7).font('Helvetica')
       .text('This certificate is digitally issued by MediCampus. To verify, scan the QR code or visit:', { align: 'center' });
    doc.fillColor('#6366f1').fontSize(7)
       .text(`http://localhost:3000/verify/${application.certificateId}`, { align: 'center', underline: true });

    doc.end();
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error generating PDF', error: error.message });
    }
  }
};

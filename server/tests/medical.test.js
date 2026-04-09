import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import Medical from '../models/Medical.js';
import { setupDB, teardownDB, clearCollections } from './setup.js';

// ─── Lifecycle ─────────────────────────────────────────────────────────────────
beforeAll(() => setupDB());
afterAll(() => teardownDB());
afterEach(() => clearCollections());

// ─── POST /api/medical/apply ───────────────────────────────────────────────────
describe('POST /api/medical/apply', () => {
  const validPayload = {
    studentId: 'IT21123456',
    doctorId: 'DR001',
    examName: 'Software Engineering Final',
    examDate: '2026-05-10',
    illness: 'Acute fever and fatigue',
  };

  it('✅ should create a new medical application (201)', async () => {
    const res = await request(app).post('/api/medical/apply').send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/submitted successfully/i);
    expect(res.body.application).toMatchObject({
      studentId: 'IT21123456',
      doctorId: 'DR001',
      status: 'pending',
    });
  });

  it('❌ should return 400 when a required field is missing', async () => {
    const { illness, ...incomplete } = validPayload;
    const res = await request(app).post('/api/medical/apply').send(incomplete);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it('❌ should return 400 when all fields are empty', async () => {
    const res = await request(app).post('/api/medical/apply').send({});
    expect(res.status).toBe(400);
  });
});

// ─── GET /api/medical/student/:studentId ──────────────────────────────────────
describe('GET /api/medical/student/:studentId', () => {
  it('✅ should return empty array when no applications exist', async () => {
    const res = await request(app).get('/api/medical/student/NOBODY');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('✅ should return a student\'s own applications', async () => {
    await Medical.create({
      studentId: 'IT21999999',
      doctorId: 'DR002',
      examName: 'Networking Exam',
      examDate: new Date('2026-06-01'),
      illness: 'Flu',
    });

    const res = await request(app).get('/api/medical/student/IT21999999');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].studentId).toBe('IT21999999');
  });

  it('✅ should NOT return another student\'s application', async () => {
    await Medical.create({
      studentId: 'IT21111111',
      doctorId: 'DR001',
      examName: 'Algorithms Exam',
      examDate: new Date('2026-06-15'),
      illness: 'Migraine',
    });

    const res = await request(app).get('/api/medical/student/IT21999999');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

// ─── GET /api/medical/doctor/:doctorId ────────────────────────────────────────
describe('GET /api/medical/doctor/:doctorId', () => {
  it('✅ should return only pending applications for a doctor', async () => {
    const doctorId = 'DR_TEST_01';
    await Medical.create([
      {
        studentId: 'S001', doctorId, examName: 'Exam A',
        examDate: new Date('2026-06-01'), illness: 'Back pain', status: 'pending',
      },
      {
        studentId: 'S002', doctorId, examName: 'Exam B',
        examDate: new Date('2026-06-02'), illness: 'Fever', status: 'approved',
      },
    ]);

    const res = await request(app).get(`/api/medical/doctor/${doctorId}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe('pending');
  });
});

// ─── PUT /api/medical/approve/:id ─────────────────────────────────────────────
describe('PUT /api/medical/approve/:id', () => {
  it('✅ should approve an application and generate a certificate ID', async () => {
    const app_doc = await Medical.create({
      studentId: 'IT21777777',
      doctorId: 'DR_APPROVE',
      examName: 'Database Exam',
      examDate: new Date('2026-07-01'),
      illness: 'Viral infection',
    });

    const res = await request(app)
      .put(`/api/medical/approve/${app_doc._id}`)
      .send({
        diagnosis: 'Viral rhinitis — advised rest for 5 days',
        validFrom: '2026-06-25',
        validTo: '2026-07-05',
      });

    expect(res.status).toBe(200);
    expect(res.body.application.status).toBe('approved');
    expect(res.body.application.certificateId).toMatch(/^MED-/);
    expect(res.body.application.qrCode).toMatch(/^data:image\/png;base64,/);
  });

  it('❌ should return 404 for a non-existent application ID', async () => {
    const fakeId = '65f0000000000000000000ab';
    const res = await request(app)
      .put(`/api/medical/approve/${fakeId}`)
      .send({ diagnosis: 'N/A', validFrom: '2026-01-01', validTo: '2026-01-10' });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});

// ─── PUT /api/medical/reject/:id ──────────────────────────────────────────────
describe('PUT /api/medical/reject/:id', () => {
  it('✅ should reject a pending application', async () => {
    const app_doc = await Medical.create({
      studentId: 'IT21666666',
      doctorId: 'DR_REJECT',
      examName: 'OS Exam',
      examDate: new Date('2026-07-10'),
      illness: 'Minor headache',
    });

    const res = await request(app).put(`/api/medical/reject/${app_doc._id}`);
    expect(res.status).toBe(200);
    expect(res.body.application.status).toBe('rejected');
  });

  it('❌ should return 404 for a non-existent ID', async () => {
    const fakeId = '65f0000000000000000000cd';
    const res = await request(app).put(`/api/medical/reject/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

// ─── GET /api/medical/verify/:certificateId ───────────────────────────────────
describe('GET /api/medical/verify/:certificateId', () => {
  it('✅ should verify a valid, non-expired certificate', async () => {
    await Medical.create({
      studentId: 'IT21555555',
      doctorId: 'DR_VERIFY',
      examName: 'Maths Exam',
      examDate: new Date('2026-07-01'),
      illness: 'Dental surgery',
      status: 'approved',
      certificateId: 'MED-TESTCERT-0001',
      validFrom: new Date('2026-06-01'),
      validTo: new Date('2030-12-31'), // far future
      diagnosis: 'Post-surgery recovery',
      qrCode: 'data:image/png;base64,TESTQR',
    });

    const res = await request(app).get('/api/medical/verify/MED-TESTCERT-0001');
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.expired).toBe(false);
    expect(res.body.data.studentId).toBe('IT21555555');
    expect(res.body.data.certificateId).toBe('MED-TESTCERT-0001');
  });

  it('✅ should return expired=true for a past certificate', async () => {
    await Medical.create({
      studentId: 'IT21444444',
      doctorId: 'DR_EXPIRE',
      examName: 'Expired Exam',
      examDate: new Date('2024-01-01'),
      illness: 'Old illness',
      status: 'approved',
      certificateId: 'MED-EXPIRED-0002',
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-01-10'), // already past
      diagnosis: 'Expired cert',
      qrCode: 'data:image/png;base64,EXPIREDQR',
    });

    const res = await request(app).get('/api/medical/verify/MED-EXPIRED-0002');
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.expired).toBe(true);
  });

  it('❌ should return 404 for an unknown certificate ID', async () => {
    const res = await request(app).get('/api/medical/verify/MED-FAKECERT-9999');
    expect(res.status).toBe(404);
    expect(res.body.valid).toBe(false);
  });

  it('❌ should not verify a rejected application\'s ID', async () => {
    await Medical.create({
      studentId: 'IT21333333',
      doctorId: 'DR_NOSHOW',
      examName: 'Physics',
      examDate: new Date('2026-07-01'),
      illness: 'Mild cold',
      status: 'rejected',
      certificateId: 'MED-REJECTED-0003',
      qrCode: 'data:image/png;base64,REJECTEDQR',
    });

    const res = await request(app).get('/api/medical/verify/MED-REJECTED-0003');
    expect(res.status).toBe(404);
  });
});

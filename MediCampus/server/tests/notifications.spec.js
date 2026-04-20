const { test, expect } = require('@playwright/test');

test.describe('Notification System Tests', () => {

  const testStudentId = 'ST999';

  test.beforeAll(async ({ request }) => {
    // Ensure at least one notification exists before tests
    await request.post('/api/notifications/send', {
      data: {
        studentId: testStudentId,
        message: 'Your health check-up is scheduled for tomorrow at 10 AM.',
        type: 'Reminder'
      }
    });
  });

  test('should successfully send a reminder notification', async ({ request }) => {

    const response = await request.post('/api/notifications/send', {
      data: {
        studentId: testStudentId,
        message: 'Your health check-up is scheduled for tomorrow at 10 AM.',
        type: 'Reminder'
      }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.message).toBe('Notification sent successfully!');
    expect(body.newNotification.type).toBe('Reminder');
  });

  test('should fetch notifications for the student', async ({ request }) => {

    const response = await request.get(`/api/notifications/${testStudentId}`);

    expect(response.status()).toBe(200);

    const notifications = await response.json();

    expect(Array.isArray(notifications)).toBe(true);
    expect(notifications.length).toBeGreaterThan(0);

    // Check that at least one notification belongs to this student
    const found = notifications.some(n => n.studentId === testStudentId);
    expect(found).toBeTruthy();
  });

});
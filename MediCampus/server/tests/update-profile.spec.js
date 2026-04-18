const { test, expect } = require('@playwright/test');

test('should successfully update student profile data in the database', async ({ request }) => {

  const response = await request.post('/api/student/update-profile', {
    data: {
      studentName: "Neha Test",
      registrationNumber: "ST999",
      allergies: "None",
      chronicIllnesses: "None",
      emergencyContact: {
        name: "Parent Name",
        phoneNumber: "0712345678",
        relationship: "Parent"
      }
    }
  });

  const body = await response.json();

  console.log('Status Code:', response.status());
  console.log('API Response:', body);

  expect(response.status()).toBe(200);
  expect(body).toHaveProperty('message');
});
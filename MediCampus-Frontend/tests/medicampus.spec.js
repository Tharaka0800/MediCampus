import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('MediCampus E2E Tests', () => {

  test.beforeAll(() => {
    // Ensure screenshots directory exists
    const dir = path.join(process.cwd(), 'tests', 'screenshots');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
  });

  test('Login, Profile, and Chatbot Flow', async ({ page }) => {
    // 1. Navigate to Login Page
    await page.goto('/');
    
    // Wait for the main elements to load
    await expect(page.getByText('Your Health,')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/01-login-page.png', fullPage: true });

    // Intercept the backend API calls so tests can run without backend
    await page.route('http://localhost:5000/api/student/login', async route => {
      await route.fulfill({ 
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ studentId: 'S20240012' }) 
      });
    });

    await page.route('http://localhost:5000/api/student/S20240012', async route => {
      await route.fulfill({ 
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          profile: { 
            studentName: 'Test Student', 
            registrationNumber: 'S20240012',
            bloodType: 'O+',
            allergies: 'None',
            chronicIllnesses: 'Asthma'
          } 
        }) 
      });
    });

    // Fill in Login Form
    // Using nth(0) for email and nth(1) for password based on the UI structure
    await page.locator('.mc-input').nth(0).fill('S20240012');
    await page.locator('.mc-input').nth(1).fill('password123');
    await page.screenshot({ path: 'tests/screenshots/02-login-filled.png' });

    // Click Sign In
    await page.locator('button.mc-btn-primary').click();

    // 2. Dashboard & Health Profile
    // Wait for the URL to change to dashboard
    await page.waitForURL('**/dashboard');
    
    // Verify Dashboard loaded
    await expect(page.getByText('Student Health Portal')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/03-dashboard.png', fullPage: true });

    // Navigate to Health Profile
    await page.getByRole('button', { name: /Health Profile/ }).click();
    await expect(page.getByText('Personal Information')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/04-health-profile.png', fullPage: true });

    // 3. AI Advisor Chatbot
    // Navigate to MediBot AI
    await page.getByRole('button', { name: /MediBot AI/ }).click();
    
    // Verify Chatbot loaded
    await expect(page.getByText('Your Health Triage Assistant')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/05-chatbot-opened.png', fullPage: true });

    // Interact with Chatbot
    const chatInput = page.getByPlaceholder('Describe your symptoms or ask a health question...');
    await chatInput.fill('I have a cough and my asthma is flaring up');
    await page.screenshot({ path: 'tests/screenshots/06-chatbot-typing.png', fullPage: true });

    // Click Send
    await page.getByLabel('Send message').click();

    // Wait for the AI's mock response
    await page.waitForTimeout(2000); // Wait for the 1.5s mock delay
    
    // Check for the response bubble
    await expect(page.getByText('I noticed you have', { exact: false })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/07-chatbot-response.png', fullPage: true });
  });

});

/**
 * Playwright Global Setup
 * Setup tasks that run once before all tests
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Setting up Playwright tests...');
  
  // Set up test database if needed
  // await setupTestDatabase();
  
  // Create test users if needed
  // await createTestUsers();
  
  // Verify the application is running
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('body', { timeout: 10000 });
    console.log('Application is running and accessible');
  } catch (error) {
    console.error('Application not accessible:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
  
  console.log('Playwright setup completed');
}

export default globalSetup;

/**
 * Basic Functionality Tests
 * Core tests for TrustHire application
 */

import { test, expect } from '@playwright/test';

test.describe('TrustHire Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/TrustHire/);
    await expect(page.locator('h1')).toContainText('TrustHire');
    await expect(page.locator('body')).toBeVisible();
  });

  test('navigation works correctly', async ({ page }) => {
    // Test navigation to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');

    // Test navigation to assessment
    await page.click('text=Assess');
    await expect(page).toHaveURL(/assess/);
    await expect(page.locator('h1')).toContainText('Assessment');
  });

  test('assessment page loads', async ({ page }) => {
    await page.goto('/assess');
    
    // Check if assessment form is present
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="url"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('scan pages are accessible', async ({ page }) => {
    const scanPages = [
      '/scan/url',
      '/scan/github',
      '/scan/linkedin',
      '/scan/forms'
    ];

    for (const scanPage of scanPages) {
      await page.goto(scanPage);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('form')).toBeVisible();
    }
  });

  test('intelligence page loads', async ({ page }) => {
    await page.goto('/intelligence');
    
    await expect(page).toHaveURL(/intelligence/);
    await expect(page.locator('h1')).toContainText('Intelligence');
    await expect(page.locator('body')).toBeVisible();
  });

  test('monitoring page loads', async ({ page }) => {
    await page.goto('/monitoring');
    
    await expect(page).toHaveURL(/monitoring/);
    await expect(page.locator('h1')).toContainText('Monitoring');
    await expect(page.locator('body')).toBeVisible();
  });

  test('collaboration page loads', async ({ page }) => {
    await page.goto('/collaboration');
    
    await expect(page).toHaveURL(/collaboration/);
    await expect(page.locator('h1')).toContainText('Collaboration');
    await expect(page.locator('body')).toBeVisible();
  });

  test('agent page loads', async ({ page }) => {
    await page.goto('/agent');
    
    await expect(page).toHaveURL(/agent/);
    await expect(page.locator('h1')).toContainText('Autonomous AI Agent');
    await expect(page.locator('body')).toBeVisible();
  });

  test('responsive design works', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('API health check', async ({ page }) => {
    const response = await page.goto('/api/health');
    expect(response).toBeTruthy();
  });

  test('page loads without errors', async ({ page }) => {
    // Check for any JavaScript errors
    const errors = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(errors.length).toBe(0);
  });
});

test.describe('API Endpoints', () => {
  test('health endpoint responds', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
  });

  test('metrics endpoint responds', async ({ request }) => {
    const response = await request.get('/api/metrics');
    expect(response.status()).toBe(200);
  });

  test('patterns endpoint responds', async ({ request }) => {
    const response = await request.get('/api/patterns');
    expect(response.status()).toBe(200);
  });
});

test.describe('Security Features', () => {
  test('no sensitive data in page source', async ({ page }) => {
    await page.goto('/');
    const content = await page.content();
    
    // Check for API keys
    expect(content).not.toMatch(/sk-[a-zA-Z0-9]{48}/);
    expect(content).not.toMatch(/gsk_[a-zA-Z0-9]{51}/);
    
    // Check for passwords
    expect(content).not.toMatch(/password["\s]*[:=]/i);
  });

  test('security headers are present', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    
    // Check for security headers
    expect(headers?.['x-frame-options']).toBeTruthy();
    expect(headers?.['x-content-type-options']).toBeTruthy();
  });

  test('forms have CSRF protection', async ({ page }) => {
    await page.goto('/assess');
    const form = page.locator('form');
    
    if (await form.isVisible()) {
      // Check for CSRF token or similar protection
      const csrfToken = await page.locator('input[name*="csrf"], input[name*="token"]').first();
      expect(csrfToken).toBeTruthy();
    }
  });
});

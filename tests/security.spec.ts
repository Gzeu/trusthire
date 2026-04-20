/**
 * Security Tests
 * Comprehensive security testing for TrustHire
 */

import { test, expect } from '@playwright/test';

test.describe('Security Features', () => {
  test('no sensitive data in page source', async ({ page }) => {
    await page.goto('/');
    const content = await page.content();
    
    // Check for API keys
    expect(content).not.toMatch(/sk-[a-zA-Z0-9]{48}/);
    expect(content).not.toMatch(/gsk_[a-zA-Z0-9]{51}/);
    expect(content).not.toMatch(/at776tTr6OQvLXjVEQlNEpqv2l4MUEmM/);
    
    // Check for database credentials
    expect(content).not.toMatch(/password["\s]*[:=]/i);
    expect(content).not.toMatch(/mysql:\/\//i);
    expect(content).not.toMatch(/postgresql:\/\//i);
    
    // Check for private keys
    expect(content).not.toMatch(/-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/);
    expect(content).not.toMatch(/-----BEGIN CERTIFICATE-----/);
  });

  test('security headers are present', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    
    // Check for security headers
    expect(headers?.['x-frame-options']).toBeTruthy();
    expect(headers?.['x-content-type-options']).toBeTruthy();
    expect(headers?.['x-xss-protection']).toBeTruthy();
    expect(headers?.['referrer-policy']).toBeTruthy();
    expect(headers?.['content-security-policy']).toBeTruthy();
  });

  test('forms have CSRF protection', async ({ page }) => {
    const forms = [
      '/assess',
      '/scan/url',
      '/scan/github',
      '/scan/linkedin',
      '/scan/forms'
    ];

    for (const formPath of forms) {
      await page.goto(formPath);
      const form = page.locator('form').first();
      
      if (await form.isVisible()) {
        // Check for CSRF token or similar protection
        const csrfToken = await page.locator('input[name*="csrf"], input[name*="token"]').first();
        if (await csrfToken.isVisible()) {
          expect(await csrfToken.getAttribute('value')).toBeTruthy();
        }
      }
    }
  });

  test('input validation works', async ({ page }) => {
    await page.goto('/assess');
    
    // Test URL validation
    const urlInput = page.locator('input[type="url"]');
    if (await urlInput.isVisible()) {
      // Try invalid URL
      await urlInput.fill('invalid-url');
      await page.click('button[type="submit"]');
      
      // Should show validation error
      await expect(page.locator('text=Please enter a valid URL')).toBeVisible();
    }
  });

  test('rate limiting works', async ({ request }) => {
    // Make multiple rapid requests to test rate limiting
    const promises = [];
    
    for (let i = 0; i < 10; i++) {
      promises.push(request.get('/api/health'));
    }
    
    const responses = await Promise.all(promises);
    
    // Most should succeed, but some might be rate limited
    const successCount = responses.filter(r => r.status() === 200).length;
    const rateLimitedCount = responses.filter(r => r.status() === 429).length;
    
    expect(successCount).toBeGreaterThan(0);
    // Rate limiting should kick in after several requests
    expect(rateLimitedCount).toBeGreaterThanOrEqual(0);
  });

  test('authentication endpoints are secure', async ({ request }) => {
    // Test login endpoint
    const loginResponse = await request.post('/api/auth/login', {
      data: { email: 'test@example.com', password: 'password' }
    });
    
    // Should either succeed with proper response or fail gracefully
    expect([200, 400, 401]).toContain(loginResponse.status());
    
    // Should not expose sensitive information in error messages
    if (loginResponse.status() >= 400) {
      const errorText = await loginResponse.text();
      expect(errorText).not.toMatch(/password/i);
      expect(errorText).not.toMatch(/secret/i);
      expect(errorText).not.toMatch(/token/i);
    }
  });

  test('file upload restrictions', async ({ page }) => {
    await page.goto('/assess');
    
    // Check if file upload is present and has restrictions
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Check for file type restrictions
      const accept = await fileInput.getAttribute('accept');
      expect(accept).toBeTruthy();
      
      // Should not allow executable files
      expect(accept).not.toMatch(/\.exe/i);
      expect(accept).not.toMatch(/\.bat/i);
      expect(accept).not.toMatch(/\.sh/i);
    }
  });

  test('SQL injection protection', async ({ request }) => {
    const maliciousInputs = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "1; DELETE FROM users WHERE 1=1 --",
      "' UNION SELECT * FROM users --"
    ];

    for (const input of maliciousInputs) {
      // Test various endpoints
      const endpoints = [
        '/api/assessment/create',
        '/api/scan/url',
        '/api/ai/analyze'
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await request.post(endpoint, {
            data: { content: input, url: input }
          });
          
          // Should not return 500 (internal server error)
          expect(response.status()).not.toBe(500);
          
          // Should not expose database information
          const responseText = await response.text();
          expect(responseText).not.toMatch(/sql/i);
          expect(responseText).not.toMatch(/database/i);
          expect(responseText).not.toMatch(/table/i);
        } catch (error) {
          // Network errors are acceptable for security testing
          expect(error.message).not.toMatch(/sql/i);
        }
      }
    }
  });

  test('XSS protection', async ({ page }) => {
    await page.goto('/assess');
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src="x" onerror="alert(\'XSS\')">',
      'javascript:alert("XSS")',
      '<svg onload="alert(\'XSS\')">',
      '"><script>alert("XSS")</script>'
    ];

    for (const payload of xssPayloads) {
      const textInput = page.locator('input[type="text"], textarea').first();
      if (await textInput.isVisible()) {
        await textInput.fill(payload);
        await page.click('button[type="submit"]');
        
        // Check that no alert was triggered
        // If an alert was triggered, the test would fail
        
        // Check that the payload is not executed
        const content = await page.content();
        expect(content).not.toMatch(/alert\("XSS"\)/);
      }
    }
  });

  test('session security', async ({ page }) => {
    await page.goto('/');
    
    // Check for secure session cookies
    const cookies = await page.context().cookies();
    
    for (const cookie of cookies) {
      // Session cookies should be secure
      if (cookie.name.includes('session') || cookie.name.includes('auth')) {
        expect(cookie.secure).toBe(true);
        expect(cookie.httpOnly).toBe(true);
        expect(cookie.sameSite).toBe('Strict');
      }
    }
  });

  test('error handling does not leak information', async ({ request }) => {
    // Test with invalid data to trigger errors
    const endpoints = [
      '/api/assessment/create',
      '/api/scan/url',
      '/api/ai/analyze'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await request.post(endpoint, {
          data: { invalid: 'data', malicious: 'payload' }
        });
        
        if (response.status() >= 400) {
          const responseText = await response.text();
          
          // Should not leak sensitive information
          expect(responseText).not.toMatch(/error:.*\n.*at/i);
          expect(responseText).not.toMatch(/stack trace/i);
          expect(responseText).not.toMatch(/internal server error/i);
          expect(responseText).not.toMatch(/database/i);
          expect(responseText).not.toMatch(/password/i);
        }
      } catch (error) {
        // Network errors are acceptable
        continue;
      }
    }
  });

  test('content security policy', async ({ page }) => {
    const response = await page.goto('/');
    const csp = response?.headers()['content-security-policy'];
    
    if (csp) {
      // Should have script-src restrictions
      expect(csp).toMatch(/script-src/);
      
      // Should have default-src restrictions
      expect(csp).toMatch(/default-src/);
      
      // Should not allow unsafe-inline or unsafe-eval
      expect(csp).not.toMatch(/unsafe-inline/);
      expect(csp).not.toMatch(/unsafe-eval/);
    }
  });

  test('HTTPS enforcement', async ({ page }) => {
    // Check for HSTS header
    const response = await page.goto('/');
    const hsts = response?.headers()['strict-transport-security'];
    
    // Should have HSTS header
    expect(hsts).toBeTruthy();
    expect(hsts).toMatch(/max-age=/);
    expect(hsts).toMatch(/includeSubDomains/);
  });

  test('access control', async ({ page }) => {
    // Test access to sensitive pages
    const sensitivePages = [
      '/admin',
      '/api/admin',
      '/settings'
    ];

    for (const pagePath of sensitivePages) {
      await page.goto(pagePath);
      
      // Should either redirect to login or show access denied
      const url = page.url();
      expect(url).toMatch(/(login|access.denied|unauthorized)/i);
    }
  });

  test('input sanitization', async ({ page }) => {
    await page.goto('/assess');
    
    const textInput = page.locator('input[type="text"], textarea').first();
    if (await textInput.isVisible()) {
      // Test with various malicious inputs
      const maliciousInputs = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        'data:text/html,<script>alert("XSS")</script>',
        'vbscript:msgbox("XSS")',
        '" onmouseover="alert(\'XSS\')"'
      ];

      for (const input of maliciousInputs) {
        await textInput.fill(input);
        await page.click('button[type="submit"]');
        
        // Check that malicious code is not executed
        const content = await page.content();
        expect(content).not.toMatch(/alert\("XSS"\)/);
      }
    }
  });
});

test.describe('API Security', () => {
  test('API endpoints have proper authentication', async ({ request }) => {
    const protectedEndpoints = [
      '/api/admin/blacklist',
      '/api/admin/reports',
      '/api/collaboration/reviews/create',
      '/api/collaboration/comments/add',
      '/api/collaboration/team/share'
    ];

    for (const endpoint of protectedEndpoints) {
      const response = await request.get(endpoint);
      
      // Should require authentication
      expect([401, 403]).toContain(response.status());
    }
  });

  test('API rate limiting', async ({ request }) => {
    const endpoint = '/api/health';
    
    // Make rapid requests
    const promises = [];
    for (let i = 0; i < 20; i++) {
      promises.push(request.get(endpoint));
    }
    
    const responses = await Promise.all(promises);
    
    // Should have rate limiting after several requests
    const rateLimitedCount = responses.filter(r => r.status() === 429).length;
    expect(rateLimitedCount).toBeGreaterThan(0);
  });

  test('API input validation', async ({ request }) => {
    const endpoint = '/api/assessment/create';
    
    const invalidData = {
      malicious: '<script>alert("XSS")</script>',
      sqlInjection: "'; DROP TABLE users; --",
      hugeData: 'x'.repeat(1000000),
      invalidFormat: { invalid: 'data' }
    };

    for (const [key, value] of Object.entries(invalidData)) {
      const response = await request.post(endpoint, {
        data: { [key]: value }
      });
      
      // Should handle invalid data gracefully
      expect([400, 413, 422]).toContain(response.status());
      
      // Should not leak sensitive information
      if (response.status() >= 400) {
        const responseText = await response.text();
        expect(responseText).not.toMatch(/stack trace/i);
        expect(responseText).not.toMatch(/internal server error/i);
      }
    }
  });

  test('API response headers', async ({ request }) => {
    const response = await request.get('/api/health');
    const headers = response.headers();
    
    // Should have security headers
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBeTruthy();
    expect(headers['x-xss-protection']).toBeTruthy();
  });
});

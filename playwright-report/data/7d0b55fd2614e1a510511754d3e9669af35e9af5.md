# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> Security Features >> rate limiting works
- Location: tests\security.spec.ts:78:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  1   | /**
  2   |  * Security Tests
  3   |  * Comprehensive security testing for TrustHire
  4   |  */
  5   | 
  6   | import { test, expect } from '@playwright/test';
  7   | 
  8   | test.describe('Security Features', () => {
  9   |   test('no sensitive data in page source', async ({ page }) => {
  10  |     await page.goto('/');
  11  |     const content = await page.content();
  12  |     
  13  |     // Check for API keys
  14  |     expect(content).not.toMatch(/sk-[a-zA-Z0-9]{48}/);
  15  |     expect(content).not.toMatch(/gsk_[a-zA-Z0-9]{51}/);
  16  |     expect(content).not.toMatch(/at776tTr6OQvLXjVEQlNEpqv2l4MUEmM/);
  17  |     
  18  |     // Check for database credentials
  19  |     expect(content).not.toMatch(/password["\s]*[:=]/i);
  20  |     expect(content).not.toMatch(/mysql:\/\//i);
  21  |     expect(content).not.toMatch(/postgresql:\/\//i);
  22  |     
  23  |     // Check for private keys
  24  |     expect(content).not.toMatch(/-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/);
  25  |     expect(content).not.toMatch(/-----BEGIN CERTIFICATE-----/);
  26  |   });
  27  | 
  28  |   test('security headers are present', async ({ page }) => {
  29  |     const response = await page.goto('/');
  30  |     const headers = response?.headers();
  31  |     
  32  |     // Check for security headers
  33  |     expect(headers?.['x-frame-options']).toBeTruthy();
  34  |     expect(headers?.['x-content-type-options']).toBeTruthy();
  35  |     expect(headers?.['x-xss-protection']).toBeTruthy();
  36  |     expect(headers?.['referrer-policy']).toBeTruthy();
  37  |     expect(headers?.['content-security-policy']).toBeTruthy();
  38  |   });
  39  | 
  40  |   test('forms have CSRF protection', async ({ page }) => {
  41  |     const forms = [
  42  |       '/assess',
  43  |       '/scan/url',
  44  |       '/scan/github',
  45  |       '/scan/linkedin',
  46  |       '/scan/forms'
  47  |     ];
  48  | 
  49  |     for (const formPath of forms) {
  50  |       await page.goto(formPath);
  51  |       const form = page.locator('form').first();
  52  |       
  53  |       if (await form.isVisible()) {
  54  |         // Check for CSRF token or similar protection
  55  |         const csrfToken = await page.locator('input[name*="csrf"], input[name*="token"]').first();
  56  |         if (await csrfToken.isVisible()) {
  57  |           expect(await csrfToken.getAttribute('value')).toBeTruthy();
  58  |         }
  59  |       }
  60  |     }
  61  |   });
  62  | 
  63  |   test('input validation works', async ({ page }) => {
  64  |     await page.goto('/assess');
  65  |     
  66  |     // Test URL validation
  67  |     const urlInput = page.locator('input[type="url"]');
  68  |     if (await urlInput.isVisible()) {
  69  |       // Try invalid URL
  70  |       await urlInput.fill('invalid-url');
  71  |       await page.click('button[type="submit"]');
  72  |       
  73  |       // Should show validation error
  74  |       await expect(page.locator('text=Please enter a valid URL')).toBeVisible();
  75  |     }
  76  |   });
  77  | 
  78  |   test('rate limiting works', async ({ request }) => {
  79  |     // Make multiple rapid requests to test rate limiting
  80  |     const promises = [];
  81  |     
  82  |     for (let i = 0; i < 10; i++) {
  83  |       promises.push(request.get('/api/health'));
  84  |     }
  85  |     
  86  |     const responses = await Promise.all(promises);
  87  |     
  88  |     // Most should succeed, but some might be rate limited
  89  |     const successCount = responses.filter(r => r.status() === 200).length;
  90  |     const rateLimitedCount = responses.filter(r => r.status() === 429).length;
  91  |     
> 92  |     expect(successCount).toBeGreaterThan(0);
      |                          ^ Error: expect(received).toBeGreaterThan(expected)
  93  |     // Rate limiting should kick in after several requests
  94  |     expect(rateLimitedCount).toBeGreaterThanOrEqual(0);
  95  |   });
  96  | 
  97  |   test('authentication endpoints are secure', async ({ request }) => {
  98  |     // Test login endpoint
  99  |     const loginResponse = await request.post('/api/auth/login', {
  100 |       data: { email: 'test@example.com', password: 'password' }
  101 |     });
  102 |     
  103 |     // Should either succeed with proper response or fail gracefully
  104 |     expect([200, 400, 401]).toContain(loginResponse.status());
  105 |     
  106 |     // Should not expose sensitive information in error messages
  107 |     if (loginResponse.status() >= 400) {
  108 |       const errorText = await loginResponse.text();
  109 |       expect(errorText).not.toMatch(/password/i);
  110 |       expect(errorText).not.toMatch(/secret/i);
  111 |       expect(errorText).not.toMatch(/token/i);
  112 |     }
  113 |   });
  114 | 
  115 |   test('file upload restrictions', async ({ page }) => {
  116 |     await page.goto('/assess');
  117 |     
  118 |     // Check if file upload is present and has restrictions
  119 |     const fileInput = page.locator('input[type="file"]');
  120 |     if (await fileInput.isVisible()) {
  121 |       // Check for file type restrictions
  122 |       const accept = await fileInput.getAttribute('accept');
  123 |       expect(accept).toBeTruthy();
  124 |       
  125 |       // Should not allow executable files
  126 |       expect(accept).not.toMatch(/\.exe/i);
  127 |       expect(accept).not.toMatch(/\.bat/i);
  128 |       expect(accept).not.toMatch(/\.sh/i);
  129 |     }
  130 |   });
  131 | 
  132 |   test('SQL injection protection', async ({ request }) => {
  133 |     const maliciousInputs = [
  134 |       "'; DROP TABLE users; --",
  135 |       "' OR '1'='1",
  136 |       "1; DELETE FROM users WHERE 1=1 --",
  137 |       "' UNION SELECT * FROM users --"
  138 |     ];
  139 | 
  140 |     for (const input of maliciousInputs) {
  141 |       // Test various endpoints
  142 |       const endpoints = [
  143 |         '/api/assessment/create',
  144 |         '/api/scan/url',
  145 |         '/api/ai/analyze'
  146 |       ];
  147 | 
  148 |       for (const endpoint of endpoints) {
  149 |         try {
  150 |           const response = await request.post(endpoint, {
  151 |             data: { content: input, url: input }
  152 |           });
  153 |           
  154 |           // Should not return 500 (internal server error)
  155 |           expect(response.status()).not.toBe(500);
  156 |           
  157 |           // Should not expose database information
  158 |           const responseText = await response.text();
  159 |           expect(responseText).not.toMatch(/sql/i);
  160 |           expect(responseText).not.toMatch(/database/i);
  161 |           expect(responseText).not.toMatch(/table/i);
  162 |         } catch (error) {
  163 |           // Network errors are acceptable for security testing
  164 |           expect(error.message).not.toMatch(/sql/i);
  165 |         }
  166 |       }
  167 |     }
  168 |   });
  169 | 
  170 |   test('XSS protection', async ({ page }) => {
  171 |     await page.goto('/assess');
  172 |     
  173 |     const xssPayloads = [
  174 |       '<script>alert("XSS")</script>',
  175 |       '<img src="x" onerror="alert(\'XSS\')">',
  176 |       'javascript:alert("XSS")',
  177 |       '<svg onload="alert(\'XSS\')">',
  178 |       '"><script>alert("XSS")</script>'
  179 |     ];
  180 | 
  181 |     for (const payload of xssPayloads) {
  182 |       const textInput = page.locator('input[type="text"], textarea').first();
  183 |       if (await textInput.isVisible()) {
  184 |         await textInput.fill(payload);
  185 |         await page.click('button[type="submit"]');
  186 |         
  187 |         // Check that no alert was triggered
  188 |         // If an alert was triggered, the test would fail
  189 |         
  190 |         // Check that the payload is not executed
  191 |         const content = await page.content();
  192 |         expect(content).not.toMatch(/alert\("XSS"\)/);
```
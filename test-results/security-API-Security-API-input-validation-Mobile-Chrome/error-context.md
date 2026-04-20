# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> API Security >> API input validation
- Location: tests\security.spec.ts:349:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 500
Received array: [400, 413, 422]
```

# Test source

```ts
  265 |     
  266 |     // Should have HSTS header
  267 |     expect(hsts).toBeTruthy();
  268 |     expect(hsts).toMatch(/max-age=/);
  269 |     expect(hsts).toMatch(/includeSubDomains/);
  270 |   });
  271 | 
  272 |   test('access control', async ({ page }) => {
  273 |     // Test access to sensitive pages
  274 |     const sensitivePages = [
  275 |       '/admin',
  276 |       '/api/admin',
  277 |       '/settings'
  278 |     ];
  279 | 
  280 |     for (const pagePath of sensitivePages) {
  281 |       await page.goto(pagePath);
  282 |       
  283 |       // Should either redirect to login or show access denied
  284 |       const url = page.url();
  285 |       expect(url).toMatch(/(login|access.denied|unauthorized)/i);
  286 |     }
  287 |   });
  288 | 
  289 |   test('input sanitization', async ({ page }) => {
  290 |     await page.goto('/assess');
  291 |     
  292 |     const textInput = page.locator('input[type="text"], textarea').first();
  293 |     if (await textInput.isVisible()) {
  294 |       // Test with various malicious inputs
  295 |       const maliciousInputs = [
  296 |         '<script>alert("XSS")</script>',
  297 |         'javascript:alert("XSS")',
  298 |         'data:text/html,<script>alert("XSS")</script>',
  299 |         'vbscript:msgbox("XSS")',
  300 |         '" onmouseover="alert(\'XSS\')"'
  301 |       ];
  302 | 
  303 |       for (const input of maliciousInputs) {
  304 |         await textInput.fill(input);
  305 |         await page.click('button[type="submit"]');
  306 |         
  307 |         // Check that malicious code is not executed
  308 |         const content = await page.content();
  309 |         expect(content).not.toMatch(/alert\("XSS"\)/);
  310 |       }
  311 |     }
  312 |   });
  313 | });
  314 | 
  315 | test.describe('API Security', () => {
  316 |   test('API endpoints have proper authentication', async ({ request }) => {
  317 |     const protectedEndpoints = [
  318 |       '/api/admin/blacklist',
  319 |       '/api/admin/reports',
  320 |       '/api/collaboration/reviews/create',
  321 |       '/api/collaboration/comments/add',
  322 |       '/api/collaboration/team/share'
  323 |     ];
  324 | 
  325 |     for (const endpoint of protectedEndpoints) {
  326 |       const response = await request.get(endpoint);
  327 |       
  328 |       // Should require authentication
  329 |       expect([401, 403]).toContain(response.status());
  330 |     }
  331 |   });
  332 | 
  333 |   test('API rate limiting', async ({ request }) => {
  334 |     const endpoint = '/api/health';
  335 |     
  336 |     // Make rapid requests
  337 |     const promises = [];
  338 |     for (let i = 0; i < 20; i++) {
  339 |       promises.push(request.get(endpoint));
  340 |     }
  341 |     
  342 |     const responses = await Promise.all(promises);
  343 |     
  344 |     // Should have rate limiting after several requests
  345 |     const rateLimitedCount = responses.filter(r => r.status() === 429).length;
  346 |     expect(rateLimitedCount).toBeGreaterThan(0);
  347 |   });
  348 | 
  349 |   test('API input validation', async ({ request }) => {
  350 |     const endpoint = '/api/assessment/create';
  351 |     
  352 |     const invalidData = {
  353 |       malicious: '<script>alert("XSS")</script>',
  354 |       sqlInjection: "'; DROP TABLE users; --",
  355 |       hugeData: 'x'.repeat(1000000),
  356 |       invalidFormat: { invalid: 'data' }
  357 |     };
  358 | 
  359 |     for (const [key, value] of Object.entries(invalidData)) {
  360 |       const response = await request.post(endpoint, {
  361 |         data: { [key]: value }
  362 |       });
  363 |       
  364 |       // Should handle invalid data gracefully
> 365 |       expect([400, 413, 422]).toContain(response.status());
      |                               ^ Error: expect(received).toContain(expected) // indexOf
  366 |       
  367 |       // Should not leak sensitive information
  368 |       if (response.status() >= 400) {
  369 |         const responseText = await response.text();
  370 |         expect(responseText).not.toMatch(/stack trace/i);
  371 |         expect(responseText).not.toMatch(/internal server error/i);
  372 |       }
  373 |     }
  374 |   });
  375 | 
  376 |   test('API response headers', async ({ request }) => {
  377 |     const response = await request.get('/api/health');
  378 |     const headers = response.headers();
  379 |     
  380 |     // Should have security headers
  381 |     expect(headers['x-content-type-options']).toBe('nosniff');
  382 |     expect(headers['x-frame-options']).toBeTruthy();
  383 |     expect(headers['x-xss-protection']).toBeTruthy();
  384 |   });
  385 | });
  386 | 
```
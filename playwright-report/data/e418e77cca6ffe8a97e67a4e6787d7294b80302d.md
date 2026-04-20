# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> Security Features >> access control
- Location: tests\security.spec.ts:272:7

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /(login|access.denied|unauthorized)/i
Received string:  "http://localhost:3000/admin"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "TrustHire" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e7]
        - generic [ref=e9]: TrustHire
      - generic [ref=e10]:
        - button "Quick Tools" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
          - generic [ref=e15]: Quick Tools
          - img [ref=e16]
        - link "Dashboard" [ref=e18] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e19]
          - generic [ref=e24]: Dashboard
        - link "Patterns" [ref=e25] [cursor=pointer]:
          - /url: /patterns
          - img [ref=e26]
          - generic [ref=e30]: Patterns
        - link "Sandbox" [ref=e31] [cursor=pointer]:
          - /url: /sandbox
          - img [ref=e32]
          - generic [ref=e34]: Sandbox
        - link "Monitoring" [ref=e35] [cursor=pointer]:
          - /url: /monitoring
          - img [ref=e36]
          - generic [ref=e38]: Monitoring
        - link "Start Assessment" [ref=e39] [cursor=pointer]:
          - /url: /assess
          - img [ref=e40]
          - generic [ref=e42]: Start Assessment
  - generic [ref=e45]:
    - generic [ref=e46]:
      - img [ref=e48]
      - heading "404" [level=1] [ref=e50]
      - paragraph [ref=e51]: Page Not Found
    - generic [ref=e52]:
      - heading "Oops! This page doesn't exist" [level=2] [ref=e53]
      - paragraph [ref=e54]: The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
      - paragraph [ref=e55]: "Error Code: 404 - Resource not found"
    - generic [ref=e56]:
      - link "Go Home" [ref=e57] [cursor=pointer]:
        - /url: /
        - img [ref=e58]
        - text: Go Home
      - link "Try Scanner" [ref=e61] [cursor=pointer]:
        - /url: /scan/github
        - img [ref=e62]
        - text: Try Scanner
      - button "Go Back" [ref=e65] [cursor=pointer]:
        - img [ref=e66]
        - text: Go Back
    - generic [ref=e68]:
      - heading "Looking for something?" [level=3] [ref=e69]
      - generic [ref=e70]:
        - link "GitHub Scanner Analyze repository security" [ref=e71] [cursor=pointer]:
          - /url: /scan/github
          - img [ref=e72]
          - generic [ref=e74]:
            - paragraph [ref=e75]: GitHub Scanner
            - paragraph [ref=e76]: Analyze repository security
        - link "LinkedIn Scanner Verify profile authenticity" [ref=e77] [cursor=pointer]:
          - /url: /scan/linkedin
          - img [ref=e78]
          - generic [ref=e80]:
            - paragraph [ref=e81]: LinkedIn Scanner
            - paragraph [ref=e82]: Verify profile authenticity
        - link "Forms Scanner Check form security" [ref=e83] [cursor=pointer]:
          - /url: /scan/forms
          - img [ref=e84]
          - generic [ref=e86]:
            - paragraph [ref=e87]: Forms Scanner
            - paragraph [ref=e88]: Check form security
        - link "URL Scanner Analyze URL safety" [ref=e89] [cursor=pointer]:
          - /url: /scan/url
          - img [ref=e90]
          - generic [ref=e92]:
            - paragraph [ref=e93]: URL Scanner
            - paragraph [ref=e94]: Analyze URL safety
    - generic [ref=e95]:
      - paragraph [ref=e96]: If you believe this is an error, please contact our support team.
      - paragraph [ref=e97]: TrustHire Security Platform - Protecting Digital Assets
  - alert [ref=e98]
```

# Test source

```ts
  185 |         await page.click('button[type="submit"]');
  186 |         
  187 |         // Check that no alert was triggered
  188 |         // If an alert was triggered, the test would fail
  189 |         
  190 |         // Check that the payload is not executed
  191 |         const content = await page.content();
  192 |         expect(content).not.toMatch(/alert\("XSS"\)/);
  193 |       }
  194 |     }
  195 |   });
  196 | 
  197 |   test('session security', async ({ page }) => {
  198 |     await page.goto('/');
  199 |     
  200 |     // Check for secure session cookies
  201 |     const cookies = await page.context().cookies();
  202 |     
  203 |     for (const cookie of cookies) {
  204 |       // Session cookies should be secure
  205 |       if (cookie.name.includes('session') || cookie.name.includes('auth')) {
  206 |         expect(cookie.secure).toBe(true);
  207 |         expect(cookie.httpOnly).toBe(true);
  208 |         expect(cookie.sameSite).toBe('Strict');
  209 |       }
  210 |     }
  211 |   });
  212 | 
  213 |   test('error handling does not leak information', async ({ request }) => {
  214 |     // Test with invalid data to trigger errors
  215 |     const endpoints = [
  216 |       '/api/assessment/create',
  217 |       '/api/scan/url',
  218 |       '/api/ai/analyze'
  219 |     ];
  220 | 
  221 |     for (const endpoint of endpoints) {
  222 |       try {
  223 |         const response = await request.post(endpoint, {
  224 |           data: { invalid: 'data', malicious: 'payload' }
  225 |         });
  226 |         
  227 |         if (response.status() >= 400) {
  228 |           const responseText = await response.text();
  229 |           
  230 |           // Should not leak sensitive information
  231 |           expect(responseText).not.toMatch(/error:.*\n.*at/i);
  232 |           expect(responseText).not.toMatch(/stack trace/i);
  233 |           expect(responseText).not.toMatch(/internal server error/i);
  234 |           expect(responseText).not.toMatch(/database/i);
  235 |           expect(responseText).not.toMatch(/password/i);
  236 |         }
  237 |       } catch (error) {
  238 |         // Network errors are acceptable
  239 |         continue;
  240 |       }
  241 |     }
  242 |   });
  243 | 
  244 |   test('content security policy', async ({ page }) => {
  245 |     const response = await page.goto('/');
  246 |     const csp = response?.headers()['content-security-policy'];
  247 |     
  248 |     if (csp) {
  249 |       // Should have script-src restrictions
  250 |       expect(csp).toMatch(/script-src/);
  251 |       
  252 |       // Should have default-src restrictions
  253 |       expect(csp).toMatch(/default-src/);
  254 |       
  255 |       // Should not allow unsafe-inline or unsafe-eval
  256 |       expect(csp).not.toMatch(/unsafe-inline/);
  257 |       expect(csp).not.toMatch(/unsafe-eval/);
  258 |     }
  259 |   });
  260 | 
  261 |   test('HTTPS enforcement', async ({ page }) => {
  262 |     // Check for HSTS header
  263 |     const response = await page.goto('/');
  264 |     const hsts = response?.headers()['strict-transport-security'];
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
> 285 |       expect(url).toMatch(/(login|access.denied|unauthorized)/i);
      |                   ^ Error: expect(received).toMatch(expected)
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
  365 |       expect([400, 413, 422]).toContain(response.status());
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
```
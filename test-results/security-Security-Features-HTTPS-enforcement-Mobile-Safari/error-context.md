# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> Security Features >> HTTPS enforcement
- Location: tests\security.spec.ts:261:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: undefined
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "TrustHire" [ref=e5]:
        - /url: /
        - img [ref=e7]
        - generic [ref=e9]: TrustHire
      - button [ref=e10] [cursor=pointer]:
        - img [ref=e11]
  - generic [ref=e12]:
    - generic [ref=e15]:
      - generic [ref=e16]:
        - img [ref=e17]
        - generic [ref=e19]: LIVE PROTECTION
      - heading "Stop Recruitment Scam Attacks" [level=1] [ref=e20]:
        - text: Stop Recruitment
        - generic [ref=e21]: Scam Attacks
      - paragraph [ref=e22]: Web3's most advanced security tool for detecting fake recruiters, malicious repositories, and job scams before they compromise your development environment.
      - generic [ref=e23]:
        - link "Start Free Assessment" [ref=e24]:
          - /url: /assess
          - img [ref=e25]
          - text: Start Free Assessment
          - img [ref=e27]
        - button "How It Works" [ref=e29] [cursor=pointer]:
          - img [ref=e30]
          - text: How It Works
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]: "0"
          - generic [ref=e36]: Assessments Run
        - generic [ref=e37]:
          - generic [ref=e38]: "0"
          - generic [ref=e39]: Threats Blocked
        - generic [ref=e40]:
          - generic [ref=e41]: "0"
          - generic [ref=e42]: Active Users
        - generic [ref=e43]:
          - generic [ref=e44]: 2.3s
          - generic [ref=e45]: Avg Response
    - generic [ref=e48]:
      - generic [ref=e49]:
        - heading "How Recruitment Scams Work" [level=2] [ref=e50]
        - paragraph [ref=e51]: Understanding the attack flow is your first line of defense
      - generic [ref=e52]:
        - generic [ref=e53]:
          - generic [ref=e54]: LinkedIn DM
          - img [ref=e55]
        - generic [ref=e57]:
          - generic [ref=e58]: Job Discussion
          - img [ref=e59]
        - generic [ref=e61]:
          - generic [ref=e62]: "\"Technical Review\" Repo"
          - img [ref=e63]
        - generic [ref=e65]:
          - generic [ref=e66]: npm install
          - img [ref=e67]
        - generic [ref=e69]:
          - generic [ref=e70]: Postinstall Script
          - img [ref=e71]
        - generic [ref=e74]: .env Exfiltrated
      - generic [ref=e75]:
        - generic [ref=e76]:
          - img [ref=e77]
          - text: Critical Risk
        - paragraph [ref=e79]: One malicious npm install can compromise your entire development environment, exposing API keys, wallet credentials, and sensitive data.
    - generic [ref=e81]:
      - generic [ref=e82]:
        - heading "Security Tools at Your Fingertips" [level=2] [ref=e83]
        - paragraph [ref=e84]: Professional-grade security analysis, designed for developers
      - generic [ref=e85]:
        - generic [ref=e87]:
          - img [ref=e89]
          - generic [ref=e92]:
            - heading "GitHub Repository Scan" [level=3] [ref=e93]
            - paragraph [ref=e94]: Instant analysis of any repository for malicious code patterns
            - generic [ref=e95]:
              - generic [ref=e96]: 2.3s avg
              - link "Try Now" [ref=e97]:
                - /url: /scan/github
                - text: Try Now
                - img [ref=e98]
        - generic [ref=e101]:
          - img [ref=e103]
          - generic [ref=e108]:
            - heading "LinkedIn Profile Check" [level=3] [ref=e109]
            - paragraph [ref=e110]: Verify recruiter authenticity and detect fake profiles
            - generic [ref=e111]:
              - generic [ref=e112]: 15+ signals
              - link "Try Now" [ref=e113]:
                - /url: /scan/linkedin
                - text: Try Now
                - img [ref=e114]
        - generic [ref=e117]:
          - img [ref=e119]
          - generic [ref=e122]:
            - heading "Reverse Image Search" [level=3] [ref=e123]
            - paragraph [ref=e124]: Check profile photos against known fakes and stock images
            - generic [ref=e125]:
              - generic [ref=e126]: 100M+ images
              - link "Try Now" [ref=e127]:
                - /url: /scan/image
                - text: Try Now
                - img [ref=e128]
        - generic [ref=e131]:
          - img [ref=e133]
          - generic [ref=e135]:
            - heading "Full Assessment" [level=3] [ref=e136]
            - paragraph [ref=e137]: Comprehensive security evaluation for complete peace of mind
            - generic [ref=e138]:
              - generic [ref=e139]: 5min total
              - link "Try Now" [ref=e140]:
                - /url: /assess
                - text: Try Now
                - img [ref=e141]
    - generic [ref=e144]:
      - generic [ref=e145]:
        - heading "Why Developers Trust TrustHire" [level=2] [ref=e146]
        - paragraph [ref=e147]: Built by security experts, for the Web3 ecosystem
      - generic [ref=e148]:
        - generic [ref=e149]:
          - img [ref=e151]
          - generic [ref=e154]:
            - heading "Static Analysis Only" [level=3] [ref=e155]
            - paragraph [ref=e156]: We never execute code from analyzed repositories. All scans are completely safe.
            - generic [ref=e157]: Zero risk to your system
        - generic [ref=e158]:
          - img [ref=e160]
          - generic [ref=e162]:
            - heading "Lightning Fast" [level=3] [ref=e163]
            - paragraph [ref=e164]: Get comprehensive security assessments in under 2 minutes, not hours.
            - generic [ref=e165]: Save time, stay secure
        - generic [ref=e166]:
          - img [ref=e168]
          - generic [ref=e170]:
            - heading "Risk Scoring" [level=3] [ref=e171]
            - paragraph [ref=e172]: Clear, actionable risk scores with detailed explanations and recommendations.
            - generic [ref=e173]: Make informed decisions
        - generic [ref=e174]:
          - img [ref=e176]
          - generic [ref=e181]:
            - heading "Community Powered" [level=3] [ref=e182]
            - paragraph [ref=e183]: Leverage collective intelligence from thousands of security assessments.
            - generic [ref=e184]: Stronger protection together
    - generic [ref=e187]:
      - heading "Got a Repo Link from a Recruiter?" [level=2] [ref=e188]
      - paragraph [ref=e189]: Run a comprehensive security assessment in under 2 minutes before you clone anything. It could save your entire development environment.
      - generic [ref=e190]:
        - link "Run Free Assessment" [ref=e191]:
          - /url: /assess
          - img [ref=e192]
          - text: Run Free Assessment
          - img [ref=e194]
        - link "View Dashboard" [ref=e196]:
          - /url: /dashboard
          - img [ref=e197]
          - text: View Dashboard
      - paragraph [ref=e199]: TrustHire provides risk signals, not legal verdicts. See disclaimer for details.
  - generic [ref=e201]:
    - button "Tools" [ref=e202] [cursor=pointer]:
      - img [ref=e204]
      - generic [ref=e206]: Tools
    - link "Home" [ref=e207]:
      - /url: /
      - img [ref=e209]
      - generic [ref=e212]: Home
    - link "Patterns" [ref=e213]:
      - /url: /patterns
      - img [ref=e215]
      - generic [ref=e219]: Patterns
    - link "Sandbox" [ref=e220]:
      - /url: /sandbox
      - img [ref=e222]
      - generic [ref=e224]: Sandbox
    - link "Monitor" [ref=e225]:
      - /url: /monitoring
      - img [ref=e227]
      - generic [ref=e229]: Monitor
    - button "More" [ref=e230] [cursor=pointer]:
      - img [ref=e232]
      - generic [ref=e233]: More
  - generic:
    - generic:
      - heading "Quick Tools" [level=3]
      - button:
        - img
    - generic:
      - link "GitHub Quick Scan":
        - /url: /scan/github
        - generic:
          - img
        - generic:
          - generic: GitHub
          - generic: Quick Scan
      - link "LinkedIn Quick Scan":
        - /url: /scan/linkedin
        - generic:
          - img
        - generic:
          - generic: LinkedIn
          - generic: Quick Scan
      - link "Image Quick Scan":
        - /url: /scan/image
        - generic:
          - img
        - generic:
          - generic: Image
          - generic: Quick Scan
      - link "Forms Quick Scan":
        - /url: /scan/forms
        - generic:
          - img
        - generic:
          - generic: Forms
          - generic: Quick Scan
```

# Test source

```ts
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
> 267 |     expect(hsts).toBeTruthy();
      |                  ^ Error: expect(received).toBeTruthy()
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
  365 |       expect([400, 413, 422]).toContain(response.status());
  366 |       
  367 |       // Should not leak sensitive information
```
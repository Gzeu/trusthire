# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-system.spec.ts >> TrustHire Data System - Real Data Testing >> export API provides data download
- Location: tests\data-system.spec.ts:236:7

# Error details

```
Error: expect(received).toHaveProperty(path)

Expected path: "totalRecords"
Received path: []

Received value: {"data": [], "filename": "trusthire_data_undefined_1776700512372.json", "format": "json", "jsonData": "{
  \"exportDate\": \"2026-04-20T15:55:12.372Z\",
  \"total\": 0,
  \"data\": []
}", "success": true, "total": 0}
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
          - img [ref=e146]
          - generic [ref=e156]:
            - heading "AI Agent" [level=3] [ref=e157]
            - paragraph [ref=e158]: Autonomous security agent with personality and learning capabilities
            - generic [ref=e159]:
              - generic [ref=e160]: Always learning
              - link "Try Now" [ref=e161]:
                - /url: /agent
                - text: Try Now
                - img [ref=e162]
    - generic [ref=e165]:
      - generic [ref=e166]:
        - heading "Why Developers Trust TrustHire" [level=2] [ref=e167]
        - paragraph [ref=e168]: Built by security experts, for the Web3 ecosystem
      - generic [ref=e169]:
        - generic [ref=e170]:
          - img [ref=e172]
          - generic [ref=e175]:
            - heading "Static Analysis Only" [level=3] [ref=e176]
            - paragraph [ref=e177]: We never execute code from analyzed repositories. All scans are completely safe.
            - generic [ref=e178]: Zero risk to your system
        - generic [ref=e179]:
          - img [ref=e181]
          - generic [ref=e183]:
            - heading "Lightning Fast" [level=3] [ref=e184]
            - paragraph [ref=e185]: Get comprehensive security assessments in under 2 minutes, not hours.
            - generic [ref=e186]: Save time, stay secure
        - generic [ref=e187]:
          - img [ref=e189]
          - generic [ref=e191]:
            - heading "Risk Scoring" [level=3] [ref=e192]
            - paragraph [ref=e193]: Clear, actionable risk scores with detailed explanations and recommendations.
            - generic [ref=e194]: Make informed decisions
        - generic [ref=e195]:
          - img [ref=e197]
          - generic [ref=e202]:
            - heading "Community Powered" [level=3] [ref=e203]
            - paragraph [ref=e204]: Leverage collective intelligence from thousands of security assessments.
            - generic [ref=e205]: Stronger protection together
    - generic [ref=e208]:
      - heading "Got a Repo Link from a Recruiter?" [level=2] [ref=e209]
      - paragraph [ref=e210]: Run a comprehensive security assessment in under 2 minutes before you clone anything. It could save your entire development environment.
      - generic [ref=e211]:
        - link "Run Free Assessment" [ref=e212]:
          - /url: /assess
          - img [ref=e213]
          - text: Run Free Assessment
          - img [ref=e215]
        - link "View Dashboard" [ref=e217]:
          - /url: /dashboard
          - img [ref=e218]
          - text: View Dashboard
      - paragraph [ref=e220]: TrustHire provides risk signals, not legal verdicts. See disclaimer for details.
  - generic [ref=e222]:
    - button "Tools" [ref=e223] [cursor=pointer]:
      - img [ref=e225]
      - generic [ref=e227]: Tools
    - link "Home" [ref=e228]:
      - /url: /
      - img [ref=e230]
      - generic [ref=e233]: Home
    - link "Patterns" [ref=e234]:
      - /url: /patterns
      - img [ref=e236]
      - generic [ref=e240]: Patterns
    - link "Sandbox" [ref=e241]:
      - /url: /sandbox
      - img [ref=e243]
      - generic [ref=e245]: Sandbox
    - link "Monitor" [ref=e246]:
      - /url: /monitoring
      - img [ref=e248]
      - generic [ref=e250]: Monitor
    - button "More" [ref=e251] [cursor=pointer]:
      - img [ref=e253]
      - generic [ref=e254]: More
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
  176 |           confidence: 0.92,
  177 |           notes: 'Frontend development position'
  178 |         }
  179 |       }
  180 |     });
  181 | 
  182 |     // Test search endpoint
  183 |     const response = await page.request.get('http://localhost:3000/api/data/collect?q=react&type=recruitment&limit=10');
  184 |     
  185 |     expect(response.status()).toBe(200);
  186 |     const result = await response.json();
  187 |     expect(result).toHaveProperty('results');
  188 |     expect(result).toHaveProperty('total');
  189 |     expect(result).toHaveProperty('query');
  190 |     expect(result).toHaveProperty('type');
  191 |     expect(result).toHaveProperty('limit');
  192 |     
  193 |     // Check results structure
  194 |     if (result.results.length > 0) {
  195 |       expect(result.results[0]).toHaveProperty('id');
  196 |       expect(result.results[0]).toHaveProperty('type');
  197 |       expect(result.results[0]).toHaveProperty('searchable');
  198 |     }
  199 |   });
  200 | 
  201 |   test('data cleaning API processes data correctly', async ({ page }) => {
  202 |     // Test data cleaning endpoint
  203 |     const response = await page.request.post('http://localhost:3000/api/data/validate', {
  204 |       headers: { 'Content-Type': 'application/json' },
  205 |       data: {
  206 |         action: 'clean',
  207 |         type: 'recruitment',
  208 |         data: {
  209 |           companyName: '  Test Company  ',
  210 |           position: 'software developer',
  211 |           location: 'bucharest, romania',
  212 |           contactEmail: 'test@company.com',
  213 |           contactPhone: '+40-21-123-4567',
  214 |           website: 'https://test.com',
  215 |           requirements: ['javascript experience'],
  216 |           postedDate: '2024-01-20',
  217 |           deadline: '2024-02-20',
  218 |           status: 'active',
  219 |           source: 'company_website'
  220 |         }
  221 |       }
  222 |     });
  223 | 
  224 |     expect(response.status()).toBe(200);
  225 |     const result = await response.json();
  226 |     expect(result.success).toBe(true);
  227 |     expect(result.action).toBe('clean');
  228 |     expect(result.type).toBe('recruitment');
  229 |     expect(result.result).toHaveProperty('processed');
  230 |     expect(result.result).toHaveProperty('duplicates');
  231 |     expect(result.result).toHaveProperty('standardized');
  232 |     expect(result.result).toHaveProperty('qualityIssues');
  233 |     expect(result.result).toHaveProperty('cleaned');
  234 |   });
  235 | 
  236 |   test('export API provides data download', async ({ page }) => {
  237 |     // Add some data first
  238 |     await page.request.post('http://localhost:3000/api/data/collect', {
  239 |       headers: { 'Content-Type': 'application/json' },
  240 |       data: {
  241 |         type: 'recruitment',
  242 |         data: {
  243 |           companyName: 'Export Test Corp',
  244 |           position: 'Backend Developer',
  245 |           location: 'Timi\u0219oara, Romania',
  246 |           contactEmail: 'backend@export-test.ro',
  247 |           contactPhone: '+40-256-123-456',
  248 |           website: 'https://export-test.ro',
  249 |           requirements: ['Node.js', 'MongoDB'],
  250 |           postedDate: '2024-01-20',
  251 |           deadline: '2024-02-20',
  252 |           status: 'active',
  253 |           source: 'company_website',
  254 |           confidence: 0.91
  255 |         }
  256 |       }
  257 |     });
  258 | 
  259 |     // Test export endpoint
  260 |     const response = await page.request.post('http://localhost:3000/api/data/export', {
  261 |       headers: { 'Content-Type': 'application/json' },
  262 |       data: {
  263 |         format: 'json',
  264 |         filters: {
  265 |           type: 'recruitment',
  266 |           startDate: '2024-01-01',
  267 |           endDate: '2024-12-31'
  268 |         }
  269 |       }
  270 |     });
  271 | 
  272 |     expect(response.status()).toBe(200);
  273 |     const result = await response.json();
  274 |     expect(result.success).toBe(true);
  275 |     expect(result.format).toBe('json');
> 276 |     expect(result).toHaveProperty('totalRecords');
      |                    ^ Error: expect(received).toHaveProperty(path)
  277 |     expect(result).toHaveProperty('exportUrl');
  278 |     expect(result).toHaveProperty('expiresAt');
  279 |   });
  280 | 
  281 |   test('company data collection works', async ({ page }) => {
  282 |     // Test company data collection
  283 |     const response = await page.request.post('http://localhost:3000/api/data/collect', {
  284 |       headers: { 'Content-Type': 'application/json' },
  285 |       data: {
  286 |         type: 'company',
  287 |         data: {
  288 |           companyName: 'DataSoft Romania',
  289 |           industry: 'Software Development',
  290 |           location: 'Cluj-Napoca, Romania',
  291 |           website: 'https://datasoft.ro',
  292 |           email: 'contact@datasoft.ro',
  293 |           phone: '+40-264-123-456',
  294 |           description: 'Leading software development company in Transylvania',
  295 |           foundedYear: 2018,
  296 |           employeeCount: '50-100',
  297 |           revenue: '$2M-$5M'
  298 |         }
  299 |       }
  300 |     });
  301 | 
  302 |     expect(response.status()).toBe(200);
  303 |     const result = await response.json();
  304 |     expect(result.success).toBe(true);
  305 |     expect(result.type).toBe('company');
  306 |     expect(result.id).toMatch(/^company_\d+_[a-z0-9]+$/);
  307 |   });
  308 | 
  309 |   test('candidate data collection works', async ({ page }) => {
  310 |     // Test candidate data collection
  311 |     const response = await page.request.post('http://localhost:3000/api/data/collect', {
  312 |       headers: { 'Content-Type': 'application/json' },
  313 |       data: {
  314 |         type: 'candidate',
  315 |         data: {
  316 |           personalInfo: {
  317 |             firstName: 'Ion',
  318 |             lastName: 'Popescu',
  319 |             email: 'ion.popescu@email.com',
  320 |             phone: '+40-722-123-456',
  321 |             location: 'Ia\u0219i, Romania'
  322 |           },
  323 |           professionalInfo: {
  324 |             currentPosition: 'Software Developer',
  325 |             experience: '3 years',
  326 |             skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  327 |             education: 'Computer Science Degree',
  328 |             currentSalary: '60000 RON'
  329 |           },
  330 |           applicationInfo: {
  331 |             appliedPosition: 'Full Stack Developer',
  332 |             appliedCompany: 'TechCorp Solutions',
  333 |             appliedDate: '2024-01-20',
  334 |             status: 'under_review'
  335 |           }
  336 |         }
  337 |       }
  338 |     });
  339 | 
  340 |     expect(response.status()).toBe(200);
  341 |     const result = await response.json();
  342 |     expect(result.success).toBe(true);
  343 |     expect(result.type).toBe('candidate');
  344 |     expect(result.id).toMatch(/^candidate_\d+_[a-z0-9]+$/);
  345 |   });
  346 | 
  347 |   test('data quality scoring works', async ({ page }) => {
  348 |     // Test with high quality data
  349 |     const highQualityResponse = await page.request.post('http://localhost:3000/api/data/validate', {
  350 |       headers: { 'Content-Type': 'application/json' },
  351 |       data: {
  352 |         action: 'validate',
  353 |         type: 'recruitment',
  354 |         data: {
  355 |           companyName: 'High Quality Corp',
  356 |           position: 'Senior Full Stack Developer',
  357 |           location: 'Bucharest, Romania',
  358 |           contactEmail: 'careers@highquality.ro',
  359 |           contactPhone: '+40-21-555-1234',
  360 |           website: 'https://highquality.ro',
  361 |           requirements: ['5+ years experience', 'React/Node.js expertise', 'English proficiency'],
  362 |           postedDate: '2024-01-20',
  363 |           deadline: '2024-02-20',
  364 |           status: 'active',
  365 |           source: 'company_website',
  366 |           confidence: 0.95,
  367 |           notes: 'Comprehensive job description with all details'
  368 |         }
  369 |       }
  370 |     });
  371 | 
  372 |     expect(highQualityResponse.status()).toBe(200);
  373 |     const highQualityResult = await highQualityResponse.json();
  374 |     expect(highQualityResult.result.qualityScore).toBeGreaterThan(0.8);
  375 |     expect(highQualityResult.result.confidence).toBeGreaterThan(0.8);
  376 | 
```
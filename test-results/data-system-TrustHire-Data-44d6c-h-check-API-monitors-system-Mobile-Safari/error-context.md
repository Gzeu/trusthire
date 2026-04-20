# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-system.spec.ts >> TrustHire Data System - Real Data Testing >> health check API monitors system
- Location: tests\data-system.spec.ts:129:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 503
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
  33  |           postedDate: '2024-01-20',
  34  |           deadline: '2024-02-20',
  35  |           status: 'active',
  36  |           source: 'company_website',
  37  |           confidence: 0.95,
  38  |           notes: 'Urgent position for growing team'
  39  |         }
  40  |       }
  41  |     });
  42  | 
  43  |     expect(response.status()).toBe(200);
  44  |     const result = await response.json();
  45  |     expect(result.success).toBe(true);
  46  |     expect(result.type).toBe('recruitment');
  47  |     expect(result.id).toMatch(/^rec_\d+_[a-z0-9]+$/);
  48  |   });
  49  | 
  50  |   test('data validation API works correctly', async ({ page }) => {
  51  |     // Test data validation endpoint
  52  |     const response = await page.request.post('http://localhost:3000/api/data/validate', {
  53  |       headers: { 'Content-Type': 'application/json' },
  54  |       data: {
  55  |         action: 'validate',
  56  |         type: 'recruitment',
  57  |         data: {
  58  |           companyName: 'Test Company',
  59  |           position: 'Software Developer',
  60  |           location: 'Bucharest, Romania',
  61  |           contactEmail: 'test@company.com',
  62  |           contactPhone: '+40-21-123-4567',
  63  |           website: 'https://test.com',
  64  |           requirements: ['JavaScript experience'],
  65  |           postedDate: '2024-01-20',
  66  |           deadline: '2024-02-20',
  67  |           status: 'active',
  68  |           source: 'company_website'
  69  |         }
  70  |       }
  71  |     });
  72  | 
  73  |     expect(response.status()).toBe(200);
  74  |     const result = await response.json();
  75  |     expect(result.success).toBe(true);
  76  |     expect(result.action).toBe('validate');
  77  |     expect(result.type).toBe('recruitment');
  78  |     expect(result.result).toHaveProperty('isValid');
  79  |     expect(result.result).toHaveProperty('qualityScore');
  80  |     expect(result.result).toHaveProperty('confidence');
  81  |   });
  82  | 
  83  |   test('analytics API provides insights', async ({ page }) => {
  84  |     // First, add some data
  85  |     await page.request.post('http://localhost:3000/api/data/collect', {
  86  |       headers: { 'Content-Type': 'application/json' },
  87  |       data: {
  88  |         type: 'recruitment',
  89  |         data: {
  90  |           companyName: 'Analytics Test Corp',
  91  |           position: 'Data Analyst',
  92  |           location: 'Cluj-Napoca, Romania',
  93  |           contactEmail: 'jobs@analytics-test.ro',
  94  |           contactPhone: '+40-264-123-456',
  95  |           website: 'https://analytics-test.ro',
  96  |           requirements: ['SQL experience', 'Python knowledge'],
  97  |           postedDate: '2024-01-20',
  98  |           deadline: '2024-02-20',
  99  |           status: 'active',
  100 |           source: 'company_website',
  101 |           confidence: 0.88
  102 |         }
  103 |       }
  104 |     });
  105 | 
  106 |     // Test analytics endpoint
  107 |     const response = await page.request.post('http://localhost:3000/api/data/analytics', {
  108 |       headers: { 'Content-Type': 'application/json' },
  109 |       data: {
  110 |         type: 'overview',
  111 |         filters: {
  112 |           type: 'recruitment',
  113 |           startDate: '2024-01-01',
  114 |           endDate: '2024-12-31'
  115 |         }
  116 |       }
  117 |     });
  118 | 
  119 |     expect(response.status()).toBe(200);
  120 |     const result = await response.json();
  121 |     expect(result.success).toBe(true);
  122 |     expect(result.type).toBe('overview');
  123 |     expect(result.totalRecords).toBeGreaterThanOrEqual(1);
  124 |     expect(result.metrics).toHaveProperty('totalRecords');
  125 |     expect(result.metrics).toHaveProperty('averageConfidence');
  126 |     expect(result.metrics).toHaveProperty('qualityScore');
  127 |   });
  128 | 
  129 |   test('health check API monitors system', async ({ page }) => {
  130 |     // Test health check endpoint
  131 |     const response = await page.request.get('http://localhost:3000/api/health/detailed');
  132 |     
> 133 |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  134 |     const result = await response.json();
  135 |     expect(result).toHaveProperty('status');
  136 |     expect(result).toHaveProperty('timestamp');
  137 |     expect(result).toHaveProperty('uptime');
  138 |     expect(result).toHaveProperty('memory');
  139 |     expect(result).toHaveProperty('apis');
  140 |     expect(result).toHaveProperty('database');
  141 |     
  142 |     // Check memory structure
  143 |     expect(result.memory).toHaveProperty('used');
  144 |     expect(result.memory).toHaveProperty('total');
  145 |     expect(result.memory).toHaveProperty('percentage');
  146 |     
  147 |     // Check API status
  148 |     expect(result.apis).toHaveProperty('collect');
  149 |     expect(result.apis).toHaveProperty('validate');
  150 |     expect(result.apis).toHaveProperty('analytics');
  151 |     expect(result.apis).toHaveProperty('export');
  152 |     
  153 |     // Check database status
  154 |     expect(result.database).toHaveProperty('connected');
  155 |     expect(result.database).toHaveProperty('records');
  156 |   });
  157 | 
  158 |   test('search API finds collected data', async ({ page }) => {
  159 |     // First, add searchable data
  160 |     await page.request.post('http://localhost:3000/api/data/collect', {
  161 |       headers: { 'Content-Type': 'application/json' },
  162 |       data: {
  163 |         type: 'recruitment',
  164 |         data: {
  165 |           companyName: 'Search Test Company',
  166 |           position: 'React Developer',
  167 |           location: 'Ia\u0219i, Romania',
  168 |           contactEmail: 'react@search-test.ro',
  169 |           contactPhone: '+40-232-123-456',
  170 |           website: 'https://search-test.ro',
  171 |           requirements: ['React expertise', 'TypeScript knowledge'],
  172 |           postedDate: '2024-01-20',
  173 |           deadline: '2024-02-20',
  174 |           status: 'active',
  175 |           source: 'company_website',
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
```
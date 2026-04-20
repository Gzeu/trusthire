# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: autonomous-agent.spec.ts >> Autonomous Agent >> agent analytics tab works
- Location: tests\autonomous-agent.spec.ts:40:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Performance Metrics')
Expected: visible
Error: strict mode violation: locator('text=Performance Metrics') resolved to 2 elements:
    1) <p class="text-sm text-muted-foreground">Performance metrics and analytics for the autonom…</p> aka getByText('Performance metrics and')
    2) <h4 class="font-medium mb-4">Performance Metrics</h4> aka getByRole('heading', { name: 'Performance Metrics' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Performance Metrics')

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - generic [ref=e36]: Sandbox
        - link "Monitoring" [ref=e37] [cursor=pointer]:
          - /url: /monitoring
          - img [ref=e38]
          - generic [ref=e40]: Monitoring
        - link "Start Assessment" [ref=e41] [cursor=pointer]:
          - /url: /assess
          - img [ref=e42]
          - generic [ref=e46]: Start Assessment
  - generic [ref=e48]:
    - generic [ref=e49]:
      - heading "Autonomous AI Agent" [level=1] [ref=e50]
      - paragraph [ref=e51]: Advanced AI agent with personality, memory, and autonomous security analysis capabilities
    - generic [ref=e52]:
      - generic [ref=e53]:
        - generic [ref=e54]:
          - heading "Autonomous AI Agent" [level=2] [ref=e55]
          - paragraph [ref=e56]: Advanced AI agent with personality, memory, and autonomous capabilities
        - generic [ref=e57]:
          - generic [ref=e58]: idle
          - generic [ref=e59]: TrustHire Sentinel
      - generic [ref=e60]:
        - generic [ref=e61]:
          - heading "Tasks Completed" [level=3] [ref=e63]
          - generic [ref=e64]:
            - generic [ref=e65]: "0"
            - paragraph [ref=e66]: autonomous tasks
        - generic [ref=e67]:
          - heading "Analyses Performed" [level=3] [ref=e69]
          - generic [ref=e70]:
            - generic [ref=e71]: "0"
            - paragraph [ref=e72]: security analyses
        - generic [ref=e73]:
          - heading "Discoveries Made" [level=3] [ref=e75]
          - generic [ref=e76]:
            - generic [ref=e77]: "0"
            - paragraph [ref=e78]: new findings
        - generic [ref=e79]:
          - heading "Uptime" [level=3] [ref=e81]
          - generic [ref=e82]:
            - generic [ref=e83]: 0s
            - paragraph [ref=e84]: active time
      - generic [ref=e85]:
        - tablist [ref=e86]:
          - tab "Control" [ref=e87] [cursor=pointer]
          - tab "Personality" [ref=e88] [cursor=pointer]
          - tab "Memory" [ref=e89] [cursor=pointer]
          - tab "Analytics" [active] [selected] [ref=e90] [cursor=pointer]
        - tabpanel "Analytics" [ref=e91]:
          - generic [ref=e92]:
            - generic [ref=e93]:
              - heading "Agent Analytics" [level=3] [ref=e94]
              - paragraph [ref=e95]: Performance metrics and analytics for the autonomous agent
            - generic [ref=e97]:
              - generic [ref=e98]:
                - generic [ref=e99]:
                  - heading "Performance Metrics" [level=4] [ref=e100]
                  - generic [ref=e101]:
                    - generic [ref=e102]:
                      - generic [ref=e103]: Tasks Completed
                      - generic [ref=e104]: "0"
                    - generic [ref=e105]:
                      - generic [ref=e106]: Success Rate
                      - generic [ref=e107]: 100%
                    - generic [ref=e108]:
                      - generic [ref=e109]: Discovery Rate
                      - generic [ref=e110]: 0%
                    - generic [ref=e111]:
                      - generic [ref=e112]: Learning Events
                      - generic [ref=e113]: "0"
                - generic [ref=e114]:
                  - heading "Activity Timeline" [level=4] [ref=e115]
                  - generic [ref=e116]:
                    - generic [ref=e117]:
                      - img [ref=e118]
                      - generic [ref=e121]: "Uptime: 0s"
                    - generic [ref=e122]:
                      - img [ref=e123]
                      - generic [ref=e125]: "Status: idle"
                    - generic [ref=e126]:
                      - img [ref=e127]
                      - generic [ref=e131]: "Current Task: None"
              - generic [ref=e132]:
                - heading "Capability Utilization" [level=4] [ref=e133]
                - generic [ref=e134]:
                  - generic [ref=e136]:
                    - img [ref=e137]
                    - generic [ref=e147]: autonomous analysis
                  - generic [ref=e149]:
                    - img [ref=e150]
                    - generic [ref=e160]: threat detection
                  - generic [ref=e162]:
                    - img [ref=e163]
                    - generic [ref=e173]: vulnerability scanning
                  - generic [ref=e175]:
                    - img [ref=e176]
                    - generic [ref=e186]: document processing
                  - generic [ref=e188]:
                    - img [ref=e189]
                    - generic [ref=e199]: report generation
                  - generic [ref=e201]:
                    - img [ref=e202]
                    - generic [ref=e212]: continuous learning
                  - generic [ref=e214]:
                    - img [ref=e215]
                    - generic [ref=e225]: pattern recognition
                  - generic [ref=e227]:
                    - img [ref=e228]
                    - generic [ref=e238]: risk assessment
  - alert [ref=e239]
```

# Test source

```ts
  1   | /**
  2   |  * Autonomous Agent Tests
  3   |  * Tests for the autonomous AI agent functionality
  4   |  */
  5   | 
  6   | import { test, expect } from '@playwright/test';
  7   | 
  8   | test.describe('Autonomous Agent', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     await page.goto('/agent');
  11  |   });
  12  | 
  13  |   test('agent page loads correctly', async ({ page }) => {
  14  |     await expect(page).toHaveTitle(/TrustHire/);
  15  |     await expect(page.locator('h1')).toContainText('Autonomous AI Agent');
  16  |     await expect(page.locator('text=Advanced AI agent with personality, memory, and autonomous capabilities')).toBeVisible();
  17  |   });
  18  | 
  19  |   test('agent control panel is visible', async ({ page }) => {
  20  |     await expect(page.locator('text=Agent Control')).toBeVisible();
  21  |     await expect(page.locator('button:has-text("Start Agent")')).toBeVisible();
  22  |     await expect(page.locator('button:has-text("Stop Agent")')).toBeVisible();
  23  |   });
  24  | 
  25  |   test('agent personality tab works', async ({ page }) => {
  26  |     await page.click('text=Personality');
  27  |     await expect(page.locator('text=Agent Personality')).toBeVisible();
  28  |     await expect(page.locator('text=Basic Information')).toBeVisible();
  29  |     await expect(page.locator('text=Personality Traits')).toBeVisible();
  30  |   });
  31  | 
  32  |   test('agent memory tab works', async ({ page }) => {
  33  |     await page.click('text=Memory');
  34  |     await expect(page.locator('text=Agent Memory')).toBeVisible();
  35  |     await expect(page.locator('text=Short-term Memory')).toBeVisible();
  36  |     await expect(page.locator('text=Long-term Memory')).toBeVisible();
  37  |     await expect(page.locator('text=Episodic Memory')).toBeVisible();
  38  |   });
  39  | 
  40  |   test('agent analytics tab works', async ({ page }) => {
  41  |     await page.click('text=Analytics');
  42  |     await expect(page.locator('text=Agent Analytics')).toBeVisible();
> 43  |     await expect(page.locator('text=Performance Metrics')).toBeVisible();
      |                                                            ^ Error: expect(locator).toBeVisible() failed
  44  |     await expect(page.locator('text=Activity Timeline')).toBeVisible();
  45  |   });
  46  | 
  47  |   test('agent status displays correctly', async ({ page }) => {
  48  |     // Check if status badges are visible
  49  |     await expect(page.locator('[data-testid="agent-status"]')).toBeVisible();
  50  |     await expect(page.locator('[data-testid="agent-name"]')).toBeVisible();
  51  |   });
  52  | 
  53  |   test('add task functionality works', async ({ page }) => {
  54  |     await page.click('text=Add Task');
  55  |     
  56  |     // Check if task type dropdown is visible
  57  |     await expect(page.locator('select[name="taskType"]')).toBeVisible();
  58  |     
  59  |     // Check if priority dropdown is visible
  60  |     await expect(page.locator('select[name="priority"]')).toBeVisible();
  61  |     
  62  |     // Check if add button is visible
  63  |     await expect(page.locator('button:has-text("Add Task")')).toBeVisible();
  64  |   });
  65  | 
  66  |   test('custom command input works', async ({ page }) => {
  67  |     await expect(page.locator('input[placeholder*="custom command"]')).toBeVisible();
  68  |     await expect(page.locator('button:has-text("Execute")')).toBeVisible();
  69  |   });
  70  | 
  71  |   test('agent statistics display', async ({ page }) => {
  72  |     await expect(page.locator('text=Tasks Completed')).toBeVisible();
  73  |     await expect(page.locator('text=Analyses Performed')).toBeVisible();
  74  |     await expect(page.locator('text=Discoveries Made')).toBeVisible();
  75  |     await expect(page.locator('text=Uptime')).toBeVisible();
  76  |   });
  77  | 
  78  |   test('agent capabilities are displayed', async ({ page }) => {
  79  |     await page.click('text=Personality');
  80  |     await expect(page.locator('text=Capabilities')).toBeVisible();
  81  |     
  82  |     // Check for specific capabilities
  83  |     await expect(page.locator('text=autonomous_analysis')).toBeVisible();
  84  |     await expect(page.locator('text=threat_detection')).toBeVisible();
  85  |     await expect(page.locator('text=vulnerability_scanning')).toBeVisible();
  86  |   });
  87  | });
  88  | 
  89  | test.describe('Autonomous Agent API', () => {
  90  |   test('agent status endpoint responds', async ({ request }) => {
  91  |     const response = await request.get('/api/ai/agent?view=status');
  92  |     expect(response.status()).toBe(200);
  93  |     
  94  |     const data = await response.json();
  95  |     expect(data.success).toBe(true);
  96  |     expect(data.data.agent).toBeDefined();
  97  |     expect(data.data.memory).toBeDefined();
  98  |   });
  99  | 
  100 |   test('agent personality endpoint responds', async ({ request }) => {
  101 |     const response = await request.get('/api/ai/agent?view=personality');
  102 |     expect(response.status()).toBe(200);
  103 |     
  104 |     const data = await response.json();
  105 |     expect(data.success).toBe(true);
  106 |     expect(data.data.personality).toBeDefined();
  107 |     expect(data.data.soul).toBeDefined();
  108 |     expect(data.data.capabilities).toBeDefined();
  109 |   });
  110 | 
  111 |   test('agent memory endpoint responds', async ({ request }) => {
  112 |     const response = await request.get('/api/ai/agent?view=memory');
  113 |     expect(response.status()).toBe(200);
  114 |     
  115 |     const data = await response.json();
  116 |     expect(data.success).toBe(true);
  117 |     expect(data.data.memory).toBeDefined();
  118 |     expect(data.data.statistics).toBeDefined();
  119 |   });
  120 | 
  121 |   test('agent statistics endpoint responds', async ({ request }) => {
  122 |     const response = await request.get('/api/ai/agent?view=statistics');
  123 |     expect(response.status()).toBe(200);
  124 |     
  125 |     const data = await response.json();
  126 |     expect(data.success).toBe(true);
  127 |     expect(data.data.statistics).toBeDefined();
  128 |     expect(data.data.performance).toBeDefined();
  129 |   });
  130 | 
  131 |   test('agent capabilities endpoint responds', async ({ request }) => {
  132 |     const response = await request.get('/api/ai/agent?view=capabilities');
  133 |     expect(response.status()).toBe(200);
  134 |     
  135 |     const data = await response.json();
  136 |     expect(data.success).toBe(true);
  137 |     expect(data.data.capabilities).toBeDefined();
  138 |     expect(data.data.supportedTaskTypes).toBeDefined();
  139 |   });
  140 | 
  141 |   test('start agent endpoint works', async ({ request }) => {
  142 |     const response = await request.post('/api/ai/agent', {
  143 |       data: { action: 'start' }
```
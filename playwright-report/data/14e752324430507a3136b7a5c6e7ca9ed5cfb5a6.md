# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: autonomous-agent.spec.ts >> Autonomous Agent >> agent personality tab works
- Location: tests\autonomous-agent.spec.ts:25:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Agent Personality')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Agent Personality')

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
  - generic [ref=e44]:
    - generic [ref=e45]:
      - heading "Autonomous AI Agent" [level=1] [ref=e46]
      - paragraph [ref=e47]: Advanced AI agent with personality, memory, and autonomous security analysis capabilities
    - generic [ref=e48]:
      - generic [ref=e49]:
        - generic [ref=e50]:
          - heading "Autonomous AI Agent" [level=2] [ref=e51]
          - paragraph [ref=e52]: Advanced AI agent with personality, memory, and autonomous capabilities
        - generic [ref=e53]:
          - generic [ref=e54]: idle
          - generic [ref=e55]: TrustHire Sentinel
      - generic [ref=e56]:
        - generic [ref=e57]:
          - heading "Tasks Completed" [level=3] [ref=e59]
          - generic [ref=e60]:
            - generic [ref=e61]: "0"
            - paragraph [ref=e62]: autonomous tasks
        - generic [ref=e63]:
          - heading "Analyses Performed" [level=3] [ref=e65]
          - generic [ref=e66]:
            - generic [ref=e67]: "0"
            - paragraph [ref=e68]: security analyses
        - generic [ref=e69]:
          - heading "Discoveries Made" [level=3] [ref=e71]
          - generic [ref=e72]:
            - generic [ref=e73]: "0"
            - paragraph [ref=e74]: new findings
        - generic [ref=e75]:
          - heading "Uptime" [level=3] [ref=e77]
          - generic [ref=e78]:
            - generic [ref=e79]: 1s
            - paragraph [ref=e80]: active time
      - generic [ref=e81]:
        - tablist [ref=e82]:
          - tab "Control" [selected] [ref=e83] [cursor=pointer]
          - tab "Personality" [ref=e84] [cursor=pointer]
          - tab "Memory" [ref=e85] [cursor=pointer]
          - tab "Analytics" [ref=e86] [cursor=pointer]
        - tabpanel "Control" [ref=e87]:
          - generic [ref=e88]:
            - generic [ref=e89]:
              - heading "Agent Control" [level=3] [ref=e90]
              - paragraph [ref=e91]: Start, stop, and control the autonomous agent
            - generic [ref=e92]:
              - generic [ref=e93]:
                - button "Start Agent" [ref=e94] [cursor=pointer]:
                  - img [ref=e95]
                  - text: Start Agent
                - button "Stop Agent" [disabled]:
                  - img
                  - text: Stop Agent
              - generic [ref=e97]:
                - heading "Add Task" [level=4] [ref=e98]
                - generic [ref=e99]:
                  - generic [ref=e100]:
                    - text: Task Type
                    - combobox [ref=e101]:
                      - option "Security Analysis" [selected]
                      - option "Threat Hunting"
                      - option "Documentation"
                      - option "Learning"
                      - option "Reporting"
                  - generic [ref=e102]:
                    - text: Priority
                    - combobox [ref=e103]:
                      - option "Low"
                      - option "Medium" [selected]
                      - option "High"
                  - button "Add Task" [ref=e105] [cursor=pointer]:
                    - img [ref=e106]
                    - text: Add Task
              - generic [ref=e107]:
                - heading "Custom Command" [level=4] [ref=e108]
                - generic [ref=e109]:
                  - textbox "Enter custom command..." [ref=e110]
                  - button "Execute" [disabled]:
                    - img
                    - text: Execute
  - alert [ref=e111]
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
> 27  |     await expect(page.locator('text=Agent Personality')).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
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
  43  |     await expect(page.locator('text=Performance Metrics')).toBeVisible();
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
```
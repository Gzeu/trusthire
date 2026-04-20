# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: autonomous-agent.spec.ts >> Autonomous Agent Performance >> agent handles multiple concurrent tasks
- Location: tests\autonomous-agent.spec.ts:314:7

# Error details

```
TimeoutError: page.selectOption: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('select[name="taskType"]')

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
          - generic [ref=e54]: analyzing
          - generic [ref=e55]: TrustHire Sentinel
      - generic [ref=e56]:
        - generic [ref=e57]:
          - heading "Tasks Completed" [level=3] [ref=e59]
          - generic [ref=e60]:
            - generic [ref=e61]: "2"
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
            - generic [ref=e79]: 4s
            - paragraph [ref=e80]: active time
      - generic [ref=e81]:
        - tablist [ref=e82]:
          - tab "Control" [selected] [ref=e83] [cursor=pointer]
          - tab "Personality" [ref=e84] [cursor=pointer]
          - tab "Memory" [ref=e85] [cursor=pointer]
          - tab "Analytics" [ref=e86] [cursor=pointer]
        - tabpanel "Control" [active] [ref=e87]:
          - generic [ref=e88]:
            - generic [ref=e89]:
              - heading "Agent Control" [level=3] [ref=e90]
              - paragraph [ref=e91]: Start, stop, and control the autonomous agent
            - generic [ref=e92]:
              - generic [ref=e93]:
                - button "Start Agent" [disabled]:
                  - img
                  - text: Start Agent
                - button "Stop Agent" [ref=e94] [cursor=pointer]:
                  - img [ref=e95]
                  - text: Stop Agent
              - generic [ref=e98]:
                - heading "Add Task" [level=4] [ref=e99]
                - generic [ref=e100]:
                  - generic [ref=e101]:
                    - text: Task Type
                    - combobox [ref=e102]:
                      - option "Security Analysis" [selected]
                      - option "Threat Hunting"
                      - option "Documentation"
                      - option "Learning"
                      - option "Reporting"
                  - generic [ref=e103]:
                    - text: Priority
                    - combobox [ref=e104]:
                      - option "Low"
                      - option "Medium" [selected]
                      - option "High"
                  - button "Add Task" [ref=e106] [cursor=pointer]:
                    - img [ref=e107]
                    - text: Add Task
              - generic [ref=e108]:
                - heading "Custom Command" [level=4] [ref=e109]
                - generic [ref=e110]:
                  - textbox "Enter custom command..." [ref=e111]
                  - button "Execute" [disabled]:
                    - img
                    - text: Execute
  - alert [ref=e112]
```

# Test source

```ts
  227 |     await page.click('text=Add Task');
  228 |     await page.selectOption('select[name="taskType"]', 'security_analysis');
  229 |     await page.selectOption('select[name="priority"]', 'high');
  230 |     await page.click('button:has-text("Add Task")');
  231 |     
  232 |     // Wait for task to be processed
  233 |     await page.waitForTimeout(5000);
  234 |     
  235 |     // Check if agent status changed
  236 |     const status = page.locator('[data-testid="agent-status"]');
  237 |     await expect(status).toBeVisible();
  238 |   });
  239 | 
  240 |   test('agent memory systems work', async ({ page }) => {
  241 |     await page.goto('/agent');
  242 |     await page.click('text=Memory');
  243 |     
  244 |     // Check if memory sections are visible
  245 |     await expect(page.locator('text=Short-term Memory')).toBeVisible();
  246 |     await expect(page.locator('text=Long-term Memory')).toBeVisible();
  247 |     await expect(page.locator('text=Episodic Memory')).toBeVisible();
  248 |     
  249 |     // Check if memory statistics are displayed
  250 |     await expect(page.locator('text=Conversations:')).toBeVisible();
  251 |     await expect(page.locator('text=Current Tasks:')).toBeVisible();
  252 |     await expect(page.locator('text=Recent Findings:')).toBeVisible();
  253 |   });
  254 | 
  255 |   test('agent learning functionality works', async ({ page }) => {
  256 |     await page.goto('/agent');
  257 |     
  258 |     // Add a learning task
  259 |     await page.click('text=Add Task');
  260 |     await page.selectOption('select[name="taskType"]', 'learning');
  261 |     await page.selectOption('select[name="priority"]', 'medium');
  262 |     await page.click('button:has-text("Add Task")');
  263 |     
  264 |     // Wait for learning to process
  265 |     await page.waitForTimeout(5000);
  266 |     
  267 |     // Check analytics for learning events
  268 |     await page.click('text=Analytics');
  269 |     await expect(page.locator('text=Learning Events')).toBeVisible();
  270 |   });
  271 | 
  272 |   test('agent error handling works', async ({ page }) => {
  273 |     await page.goto('/agent');
  274 |     
  275 |     // Try to add invalid task
  276 |     await page.click('text=Add Task');
  277 |     await page.click('button:has-text("Add Task")');
  278 |     
  279 |     // Should show validation error
  280 |     await expect(page.locator('text=Task type is required')).toBeVisible();
  281 |   });
  282 | });
  283 | 
  284 | test.describe('Autonomous Agent Performance', () => {
  285 |   test('agent page loads quickly', async ({ page }) => {
  286 |     const startTime = Date.now();
  287 |     await page.goto('/agent');
  288 |     await page.waitForLoadState('networkidle');
  289 |     const loadTime = Date.now() - startTime;
  290 |     
  291 |     // Page should load within 3 seconds
  292 |     expect(loadTime).toBeLessThan(3000);
  293 |   });
  294 | 
  295 |   test('agent status updates in real-time', async ({ page }) => {
  296 |     await page.goto('/agent');
  297 |     
  298 |     // Start monitoring status updates
  299 |     let statusCount = 0;
  300 |     page.on('response', response => {
  301 |       if (response.url().includes('/api/ai/agent')) {
  302 |         statusCount++;
  303 |       }
  304 |     });
  305 |     
  306 |     // Start agent and monitor
  307 |     await page.click('button:has-text("Start Agent")');
  308 |     await page.waitForTimeout(10000);
  309 |     
  310 |     // Should have received status updates
  311 |     expect(statusCount).toBeGreaterThan(0);
  312 |   });
  313 | 
  314 |   test('agent handles multiple concurrent tasks', async ({ page }) => {
  315 |     await page.goto('/agent');
  316 |     
  317 |     // Add multiple tasks
  318 |     const tasks = [
  319 |       { type: 'security_analysis', priority: 'high' },
  320 |       { type: 'threat_hunting', priority: 'medium' },
  321 |       { type: 'documentation', priority: 'low' },
  322 |       { type: 'learning', priority: 'medium' }
  323 |     ];
  324 |     
  325 |     for (const task of tasks) {
  326 |       await page.click('text=Add Task');
> 327 |       await page.selectOption('select[name="taskType"]', task.type);
      |                  ^ TimeoutError: page.selectOption: Timeout 10000ms exceeded.
  328 |       await page.selectOption('select[name="priority"]', task.priority);
  329 |       await page.click('button:has-text("Add Task")');
  330 |       await page.waitForTimeout(1000);
  331 |     }
  332 |     
  333 |     // Check if all tasks are queued
  334 |     await page.waitForTimeout(5000);
  335 |     await expect(page.locator('text=Current Tasks:')).toBeVisible();
  336 |   });
  337 | });
  338 | 
```
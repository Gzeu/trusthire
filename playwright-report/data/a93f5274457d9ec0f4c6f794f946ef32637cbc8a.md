# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: autonomous-agent.spec.ts >> Autonomous Agent Integration >> agent integrates with Mistral AI
- Location: tests\autonomous-agent.spec.ts:217:7

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
      - link "TrustHire" [ref=e5]:
        - /url: /
        - img [ref=e7]
        - generic [ref=e9]: TrustHire
      - generic [ref=e10]:
        - button "Quick Tools" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
          - generic [ref=e15]: Quick Tools
          - img [ref=e16]
        - link "Dashboard" [ref=e18]:
          - /url: /dashboard
          - img [ref=e19]
          - generic [ref=e24]: Dashboard
        - link "Patterns" [ref=e25]:
          - /url: /patterns
          - img [ref=e26]
          - generic [ref=e30]: Patterns
        - link "Sandbox" [ref=e31]:
          - /url: /sandbox
          - img [ref=e32]
          - generic [ref=e34]: Sandbox
        - link "Monitoring" [ref=e35]:
          - /url: /monitoring
          - img [ref=e36]
          - generic [ref=e38]: Monitoring
        - link "Start Assessment" [ref=e39]:
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
          - generic [ref=e54]: thinking
          - generic [ref=e55]: TrustHire Sentinel
      - generic [ref=e56]:
        - generic [ref=e57]:
          - heading "Tasks Completed" [level=3] [ref=e59]
          - generic [ref=e60]:
            - generic [ref=e61]: "1"
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
            - generic [ref=e79]: 2s
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
  144 |     });
  145 |     expect(response.status()).toBe(200);
  146 |     
  147 |     const data = await response.json();
  148 |     expect(data.success).toBe(true);
  149 |     expect(data.data.message).toContain('started successfully');
  150 |   });
  151 | 
  152 |   test('stop agent endpoint works', async ({ request }) => {
  153 |     const response = await request.post('/api/ai/agent', {
  154 |       data: { action: 'stop' }
  155 |     });
  156 |     expect(response.status()).toBe(200);
  157 |     
  158 |     const data = await response.json();
  159 |     expect(data.success).toBe(true);
  160 |     expect(data.data.message).toContain('stopped successfully');
  161 |   });
  162 | 
  163 |   test('add task endpoint works', async ({ request }) => {
  164 |     const response = await request.post('/api/ai/agent', {
  165 |       data: {
  166 |         action: 'add_task',
  167 |         taskType: 'security_analysis',
  168 |         priority: 'medium',
  169 |         data: { timestamp: new Date().toISOString() }
  170 |       }
  171 |     });
  172 |     expect(response.status()).toBe(200);
  173 |     
  174 |     const data = await response.json();
  175 |     expect(data.success).toBe(true);
  176 |     expect(data.data.taskId).toBeDefined();
  177 |     expect(data.data.message).toContain('Task added');
  178 |   });
  179 | 
  180 |   test('custom command endpoint works', async ({ request }) => {
  181 |     const response = await request.post('/api/ai/agent', {
  182 |       data: {
  183 |         action: 'custom_command',
  184 |         data: {
  185 |           command: 'Test command',
  186 |           parameters: {},
  187 |           context: { timestamp: new Date().toISOString() }
  188 |         }
  189 |       }
  190 |     });
  191 |     expect(response.status()).toBe(200);
  192 |     
  193 |     const data = await response.json();
  194 |     expect(data.success).toBe(true);
  195 |     expect(data.data.taskId).toBeDefined();
  196 |     expect(data.data.command).toBe('Test command');
  197 |   });
  198 | 
  199 |   test('update personality endpoint works', async ({ request }) => {
  200 |     const response = await request.post('/api/ai/agent', {
  201 |       data: {
  202 |         action: 'update_personality',
  203 |         personalityUpdates: {
  204 |           traits: { analytical: 0.95, creative: 0.8 }
  205 |         }
  206 |       }
  207 |     });
  208 |     expect(response.status()).toBe(200);
  209 |     
  210 |     const data = await response.json();
  211 |     expect(data.success).toBe(true);
  212 |     expect(data.data.message).toContain('personality updated');
  213 |   });
  214 | });
  215 | 
  216 | test.describe('Autonomous Agent Integration', () => {
  217 |   test('agent integrates with Mistral AI', async ({ page }) => {
  218 |     await page.goto('/agent');
  219 |     
  220 |     // Start the agent
  221 |     await page.click('button:has-text("Start Agent")');
  222 |     
  223 |     // Wait for agent to initialize
  224 |     await page.waitForTimeout(3000);
  225 |     
  226 |     // Add a task that requires AI analysis
  227 |     await page.click('text=Add Task');
> 228 |     await page.selectOption('select[name="taskType"]', 'security_analysis');
      |                ^ TimeoutError: page.selectOption: Timeout 10000ms exceeded.
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
  327 |       await page.selectOption('select[name="taskType"]', task.type);
  328 |       await page.selectOption('select[name="priority"]', task.priority);
```
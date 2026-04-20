/**
 * Autonomous Agent Tests
 * Tests for the autonomous AI agent functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Autonomous Agent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/agent');
  });

  test('agent page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/TrustHire/);
    await expect(page.locator('h1')).toContainText('Autonomous AI Agent');
    await expect(page.locator('text=Advanced AI agent with personality, memory, and autonomous capabilities')).toBeVisible();
  });

  test('agent control panel is visible', async ({ page }) => {
    await expect(page.locator('text=Agent Control')).toBeVisible();
    await expect(page.locator('button:has-text("Start Agent")')).toBeVisible();
    await expect(page.locator('button:has-text("Stop Agent")')).toBeVisible();
  });

  test('agent personality tab works', async ({ page }) => {
    await page.click('text=Personality');
    await expect(page.locator('text=Agent Personality')).toBeVisible();
    await expect(page.locator('text=Basic Information')).toBeVisible();
    await expect(page.locator('text=Personality Traits')).toBeVisible();
  });

  test('agent memory tab works', async ({ page }) => {
    await page.click('text=Memory');
    await expect(page.locator('text=Agent Memory')).toBeVisible();
    await expect(page.locator('text=Short-term Memory')).toBeVisible();
    await expect(page.locator('text=Long-term Memory')).toBeVisible();
    await expect(page.locator('text=Episodic Memory')).toBeVisible();
  });

  test('agent analytics tab works', async ({ page }) => {
    await page.click('text=Analytics');
    await expect(page.locator('text=Agent Analytics')).toBeVisible();
    await expect(page.locator('text=Performance Metrics')).toBeVisible();
    await expect(page.locator('text=Activity Timeline')).toBeVisible();
  });

  test('agent status displays correctly', async ({ page }) => {
    // Check if status badges are visible
    await expect(page.locator('[data-testid="agent-status"]')).toBeVisible();
    await expect(page.locator('[data-testid="agent-name"]')).toBeVisible();
  });

  test('add task functionality works', async ({ page }) => {
    await page.click('text=Add Task');
    
    // Check if task type dropdown is visible
    await expect(page.locator('select[name="taskType"]')).toBeVisible();
    
    // Check if priority dropdown is visible
    await expect(page.locator('select[name="priority"]')).toBeVisible();
    
    // Check if add button is visible
    await expect(page.locator('button:has-text("Add Task")')).toBeVisible();
  });

  test('custom command input works', async ({ page }) => {
    await expect(page.locator('input[placeholder*="custom command"]')).toBeVisible();
    await expect(page.locator('button:has-text("Execute")')).toBeVisible();
  });

  test('agent statistics display', async ({ page }) => {
    await expect(page.locator('text=Tasks Completed')).toBeVisible();
    await expect(page.locator('text=Analyses Performed')).toBeVisible();
    await expect(page.locator('text=Discoveries Made')).toBeVisible();
    await expect(page.locator('text=Uptime')).toBeVisible();
  });

  test('agent capabilities are displayed', async ({ page }) => {
    await page.click('text=Personality');
    await expect(page.locator('text=Capabilities')).toBeVisible();
    
    // Check for specific capabilities
    await expect(page.locator('text=autonomous_analysis')).toBeVisible();
    await expect(page.locator('text=threat_detection')).toBeVisible();
    await expect(page.locator('text=vulnerability_scanning')).toBeVisible();
  });
});

test.describe('Autonomous Agent API', () => {
  test('agent status endpoint responds', async ({ request }) => {
    const response = await request.get('/api/ai/agent?view=status');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.agent).toBeDefined();
    expect(data.data.memory).toBeDefined();
  });

  test('agent personality endpoint responds', async ({ request }) => {
    const response = await request.get('/api/ai/agent?view=personality');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.personality).toBeDefined();
    expect(data.data.soul).toBeDefined();
    expect(data.data.capabilities).toBeDefined();
  });

  test('agent memory endpoint responds', async ({ request }) => {
    const response = await request.get('/api/ai/agent?view=memory');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.memory).toBeDefined();
    expect(data.data.statistics).toBeDefined();
  });

  test('agent statistics endpoint responds', async ({ request }) => {
    const response = await request.get('/api/ai/agent?view=statistics');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.statistics).toBeDefined();
    expect(data.data.performance).toBeDefined();
  });

  test('agent capabilities endpoint responds', async ({ request }) => {
    const response = await request.get('/api/ai/agent?view=capabilities');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.capabilities).toBeDefined();
    expect(data.data.supportedTaskTypes).toBeDefined();
  });

  test('start agent endpoint works', async ({ request }) => {
    const response = await request.post('/api/ai/agent', {
      data: { action: 'start' }
    });
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.message).toContain('started successfully');
  });

  test('stop agent endpoint works', async ({ request }) => {
    const response = await request.post('/api/ai/agent', {
      data: { action: 'stop' }
    });
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.message).toContain('stopped successfully');
  });

  test('add task endpoint works', async ({ request }) => {
    const response = await request.post('/api/ai/agent', {
      data: {
        action: 'add_task',
        taskType: 'security_analysis',
        priority: 'medium',
        data: { timestamp: new Date().toISOString() }
      }
    });
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.taskId).toBeDefined();
    expect(data.data.message).toContain('Task added');
  });

  test('custom command endpoint works', async ({ request }) => {
    const response = await request.post('/api/ai/agent', {
      data: {
        action: 'custom_command',
        data: {
          command: 'Test command',
          parameters: {},
          context: { timestamp: new Date().toISOString() }
        }
      }
    });
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.taskId).toBeDefined();
    expect(data.data.command).toBe('Test command');
  });

  test('update personality endpoint works', async ({ request }) => {
    const response = await request.post('/api/ai/agent', {
      data: {
        action: 'update_personality',
        personalityUpdates: {
          traits: { analytical: 0.95, creative: 0.8 }
        }
      }
    });
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.message).toContain('personality updated');
  });
});

test.describe('Autonomous Agent Integration', () => {
  test('agent integrates with Mistral AI', async ({ page }) => {
    await page.goto('/agent');
    
    // Start the agent
    await page.click('button:has-text("Start Agent")');
    
    // Wait for agent to initialize
    await page.waitForTimeout(3000);
    
    // Add a task that requires AI analysis
    await page.click('text=Add Task');
    await page.selectOption('select[name="taskType"]', 'security_analysis');
    await page.selectOption('select[name="priority"]', 'high');
    await page.click('button:has-text("Add Task")');
    
    // Wait for task to be processed
    await page.waitForTimeout(5000);
    
    // Check if agent status changed
    const status = page.locator('[data-testid="agent-status"]');
    await expect(status).toBeVisible();
  });

  test('agent memory systems work', async ({ page }) => {
    await page.goto('/agent');
    await page.click('text=Memory');
    
    // Check if memory sections are visible
    await expect(page.locator('text=Short-term Memory')).toBeVisible();
    await expect(page.locator('text=Long-term Memory')).toBeVisible();
    await expect(page.locator('text=Episodic Memory')).toBeVisible();
    
    // Check if memory statistics are displayed
    await expect(page.locator('text=Conversations:')).toBeVisible();
    await expect(page.locator('text=Current Tasks:')).toBeVisible();
    await expect(page.locator('text=Recent Findings:')).toBeVisible();
  });

  test('agent learning functionality works', async ({ page }) => {
    await page.goto('/agent');
    
    // Add a learning task
    await page.click('text=Add Task');
    await page.selectOption('select[name="taskType"]', 'learning');
    await page.selectOption('select[name="priority"]', 'medium');
    await page.click('button:has-text("Add Task")');
    
    // Wait for learning to process
    await page.waitForTimeout(5000);
    
    // Check analytics for learning events
    await page.click('text=Analytics');
    await expect(page.locator('text=Learning Events')).toBeVisible();
  });

  test('agent error handling works', async ({ page }) => {
    await page.goto('/agent');
    
    // Try to add invalid task
    await page.click('text=Add Task');
    await page.click('button:has-text("Add Task")');
    
    // Should show validation error
    await expect(page.locator('text=Task type is required')).toBeVisible();
  });
});

test.describe('Autonomous Agent Performance', () => {
  test('agent page loads quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/agent');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('agent status updates in real-time', async ({ page }) => {
    await page.goto('/agent');
    
    // Start monitoring status updates
    let statusCount = 0;
    page.on('response', response => {
      if (response.url().includes('/api/ai/agent')) {
        statusCount++;
      }
    });
    
    // Start agent and monitor
    await page.click('button:has-text("Start Agent")');
    await page.waitForTimeout(10000);
    
    // Should have received status updates
    expect(statusCount).toBeGreaterThan(0);
  });

  test('agent handles multiple concurrent tasks', async ({ page }) => {
    await page.goto('/agent');
    
    // Add multiple tasks
    const tasks = [
      { type: 'security_analysis', priority: 'high' },
      { type: 'threat_hunting', priority: 'medium' },
      { type: 'documentation', priority: 'low' },
      { type: 'learning', priority: 'medium' }
    ];
    
    for (const task of tasks) {
      await page.click('text=Add Task');
      await page.selectOption('select[name="taskType"]', task.type);
      await page.selectOption('select[name="priority"]', task.priority);
      await page.click('button:has-text("Add Task")');
      await page.waitForTimeout(1000);
    }
    
    // Check if all tasks are queued
    await page.waitForTimeout(5000);
    await expect(page.locator('text=Current Tasks:')).toBeVisible();
  });
});

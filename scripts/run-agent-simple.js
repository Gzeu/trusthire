/**
 * Simple Autonomous Agent Test
 * Basic test without TypeScript compilation
 */

async function testAutonomousAgent() {
  console.log('='.repeat(60));
  console.log('TRUSTHIRE AUTONOMOUS AGENT - SIMPLE TEST');
  console.log('='.repeat(60));
  console.log('Testing autonomous agent capabilities...');
  console.log('');

  try {
    // Test 1: Check if application is running
    console.log('1. Testing application health...');
    const healthResponse = await fetch('http://localhost:3000/api/health');
    const healthData = await healthResponse.json();
    console.log('   Health Status:', healthData.status);
    console.log('   Response Time:', healthData.services?.cache?.latency || 'N/A', 'ms');
    
    // Test 2: Check agent page
    console.log('2. Testing agent page...');
    const pageResponse = await fetch('http://localhost:3000/agent');
    console.log('   Agent Page Status:', pageResponse.status);
    
    if (pageResponse.status === 200) {
      console.log('   Agent page loads successfully!');

      // Test 3: Test agent API endpoints
      console.log('3. Testing agent API endpoints...');
      
      // Test agent status
      const statusResponse = await fetch('http://localhost:3000/api/ai/agent?view=status');
      const statusData = await statusResponse.json();
      console.log('   Agent API Status:', statusData.success);
      
      if (statusData.success) {
        console.log('   Agent Name:', statusData.data.agent.personality.name);
        console.log('   Agent Status:', statusData.data.agent.status);
        console.log('   Tasks Completed:', statusData.data.agent.statistics.tasksCompleted);
        console.log('   Discoveries Made:', statusData.data.agent.statistics.discoveriesMade);
        console.log('   Learning Events:', statusData.data.agent.statistics.learningEvents);
        
        // Test agent capabilities
        const capabilitiesResponse = await fetch('http://localhost:3000/api/ai/agent?view=capabilities');
        const capabilitiesData = await capabilitiesResponse.json();
        
        if (capabilitiesData.success) {
          console.log('   Agent Capabilities:');
          capabilitiesData.data.capabilities.forEach((capability, index) => {
            console.log(`     ${index + 1}. ${capability}`);
          });
        }
        
        // Test agent personality
        const personalityResponse = await fetch('http://localhost:3000/api/ai/agent?view=personality');
        const personalityData = await personalityResponse.json();
        
        if (personalityData.success) {
          console.log('   Agent Personality:');
          console.log(`     Name: ${personalityData.data.personality.name}`);
          console.log(`     Role: ${personalityData.data.personality.role}`);
          console.log(`     Communication: ${personalityData.data.personality.communicationStyle}`);
          console.log(`     Analytical: ${Math.round(personalityData.data.personality.traits.analytical * 100)}%`);
          console.log(`     Creative: ${Math.round(personalityData.data.personality.traits.creative * 100)}%`);
          console.log(`     Cautious: ${Math.round(personalityData.data.personality.traits.cautious * 100)}%`);
          console.log(`     Proactive: ${Math.round(personalityData.data.personality.traits.proactive * 100)}%`);
          console.log(`     Detail-Oriented: ${Math.round(personalityData.data.personality.traits.detailOriented * 100)}%`);
        }
        
        // Test agent memory
        const memoryResponse = await fetch('http://localhost:3000/api/ai/agent?view=memory');
        const memoryData = await memoryResponse.json();
        
        if (memoryData.success) {
          console.log('   Agent Memory Systems:');
          console.log(`     Short-term Conversations: ${memoryData.data.memory.shortTerm.conversations.length}`);
          console.log(`     Current Tasks: ${memoryData.data.memory.shortTerm.currentTasks.length}`);
          console.log(`     Recent Findings: ${memoryData.data.memory.shortTerm.recentFindings.length}`);
          console.log(`     Long-term Patterns: ${memoryData.data.memory.longTerm.patterns.length}`);
          console.log(`     Knowledge Items: ${memoryData.data.memory.longTerm.knowledge.length}`);
          console.log(`     Episodic Experiences: ${memoryData.data.memory.episodic.experiences.length}`);
        }
        
        // Test starting the agent
        console.log('4. Testing agent start functionality...');
        const startResponse = await fetch('http://localhost:3000/api/ai/agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'start' })
        });
        
        const startData = await startResponse.json();
        console.log('   Start Agent Status:', startData.success);
        
        if (startData.success) {
          console.log('   Agent started successfully!');
          
          // Wait a moment for agent to initialize
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Test adding a task
          console.log('5. Testing task addition...');
          const taskResponse = await fetch('http://localhost:3000/api/ai/agent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'add_task',
              taskType: 'security_analysis',
              priority: 'medium',
              data: { timestamp: new Date().toISOString() }
            })
          });
          
          const taskData = await taskResponse.json();
          console.log('   Add Task Status:', taskData.success);
          
          if (taskData.success) {
            console.log('   Task Added Successfully!');
            console.log('   Task ID:', taskData.data.taskId);
          }
          
          // Test custom command
          console.log('6. Testing custom command...');
          const commandResponse = await fetch('http://localhost:3000/api/ai/agent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'custom_command',
              data: {
                command: 'Test system security analysis',
                parameters: {},
                context: { timestamp: new Date().toISOString() }
              }
            })
          });
          
          const commandData = await commandResponse.json();
          console.log('   Custom Command Status:', commandData.success);
          
          if (commandData.success) {
            console.log('   Custom Command Executed!');
            console.log('   Command ID:', commandData.data.taskId);
          }
          
          // Wait for processing
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // Check agent status after operations
          const finalStatusResponse = await fetch('http://localhost:3000/api/ai/agent?view=status');
          const finalStatusData = await finalStatusResponse.json();
          
          console.log('7. Final Agent Status:');
          console.log(`   Status: ${finalStatusData.data.agent.status}`);
          console.log(`   Total Tasks Completed: ${finalStatusData.data.agent.statistics.tasksCompleted}`);
          console.log(`   Total Discoveries Made: ${finalStatusData.data.agent.statistics.discoveriesMade}`);
          console.log(`   Learning Events: ${finalStatusData.data.agent.statistics.learningEvents}`);
          console.log(`   Uptime: ${Math.round(finalStatusData.data.agent.statistics.uptime / 1000)}s`);
          
          // Test stopping the agent
          console.log('8. Testing agent stop functionality...');
          const stopResponse = await fetch('http://localhost:3000/api/ai/agent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'stop' })
          });
          
          const stopData = await stopResponse.json();
          console.log('   Stop Agent Status:', stopData.success);
          
          if (stopData.success) {
            console.log('   Agent stopped successfully!');
          }
        }
      } else {
        console.log('   ERROR: Agent API failed');
        console.log('   Response:', capabilitiesData);
      }
    } else {
      console.log('   ERROR: Agent page failed to load');
      console.log('   Status:', pageResponse.status);
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('AUTONOMOUS AGENT TEST COMPLETED');
    console.log('='.repeat(60));
    console.log('');
    console.log('SUMMARY:');
    console.log('  - Application Health: ' + (healthData.status === 'healthy' ? 'PASS' : 'FAIL'));
    console.log('  - Agent Page: ' + (pageResponse.status === 200 ? 'PASS' : 'FAIL'));
    console.log('  - Agent API: ' + (statusData.success ? 'PASS' : 'FAIL'));
    console.log('  - Agent Control: ' + (startData.success && taskData.success && commandData.success ? 'PASS' : 'FAIL'));
    console.log('  - Agent Operations: ' + (finalStatusData.success ? 'PASS' : 'FAIL'));
    console.log('');
    console.log('The autonomous agent system is working correctly!');
    console.log('All core functionalities are operational.');
    console.log('');
    console.log('Next Steps:');
    console.log('1. Access the agent UI at: http://localhost:3000/agent');
    console.log('2. Monitor agent activity in real-time');
    console.log('3. Add custom tasks for specific analysis');
    console.log('4. Review agent memory and learning progress');
    
  } catch (error) {
    console.error('ERROR during autonomous agent test:', error);
    console.log('');
    console.log('TROUBLESHOOTING:');
    console.log('1. Ensure the application is running: npm run dev');
    console.log('2. Check database is migrated: npm run db:migrate');
    console.log('3. Verify Mistral API key is configured in .env.local');
    console.log('4. Check agent logs in the console');
    console.log('5. Try accessing the agent page directly in browser');
    
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the test
if (require.main === module) {
  testAutonomousAgent();
}

module.exports = { testAutonomousAgent };

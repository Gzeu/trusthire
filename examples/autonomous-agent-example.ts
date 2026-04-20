/**
 * Autonomous Agent Example
 * Complete example of autonomous agent analyzing the entire TrustHire system
 */

import { autonomousAgent } from '@/lib/ai/autonomous-agent';

async function runCompleteSystemAnalysis() {
  console.log('=== Starting Complete System Analysis ===');
  
  // Start the autonomous agent if not already running
  await autonomousAgent.start();
  
  // Wait for agent to initialize
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Add comprehensive system analysis task
  const systemAnalysisTask = autonomousAgent.addTask('custom_command', 'high', {
    command: 'Perform comprehensive security analysis of the entire TrustHire system including all components, APIs, databases, and infrastructure',
    context: {
      analysisScope: 'complete_system',
      includeVulnerabilities: true,
      includeThreats: true,
      includePerformance: true,
      includeCompliance: true,
      timestamp: new Date().toISOString()
    }
  });
  
  console.log(`Added system analysis task: ${systemAnalysisTask}`);
  
  // Add threat hunting task
  const threatHuntingTask = autonomousAgent.addTask('threat_hunting', 'high', {
    context: {
      timeRange: '24h',
      targetSystems: ['web', 'api', 'database', 'infrastructure'],
      focusAreas: ['authentication', 'authorization', 'data_protection', 'network_security']
    }
  });
  
  console.log(`Added threat hunting task: ${threatHuntingTask}`);
  
  // Add documentation processing task
  const documentationTask = autonomousAgent.addTask('documentation', 'medium', {
    context: {
      documentationScope: 'all',
      includeAPI: true,
      includeCode: true,
      includeConfiguration: true,
      includeSecurity: true
    }
  });
  
  console.log(`Added documentation task: ${documentationTask}`);
  
  // Add learning task
  const learningTask = autonomousAgent.addTask('learning', 'medium', {
    context: {
      learningScope: 'comprehensive',
      recentExperiences: 'last_30_days',
      focusAreas: ['threat_patterns', 'vulnerabilities', 'performance', 'user_behavior']
    }
  });
  
  console.log(`Added learning task: ${learningTask}`);
  
  // Add reporting task
  const reportingTask = autonomousAgent.addTask('reporting', 'high', {
    context: {
      reportType: 'comprehensive',
      includeMetrics: true,
      includeFindings: true,
      includeRecommendations: true,
      timeframe: '24h'
    }
  });
  
  console.log(`Added reporting task: ${reportingTask}`);
  
  // Wait for initial tasks to complete
  await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds
  
  // Monitor progress
  const checkProgress = async () => {
    const status = autonomousAgent.getAgentStatus();
    const memory = autonomousAgent.getMemorySnapshot();
    
    console.log('\n=== Agent Status ===');
    console.log(`Status: ${status.status}`);
    console.log(`Current Task: ${status.currentTask || 'None'}`);
    console.log(`Tasks Completed: ${status.statistics.tasksCompleted}`);
    console.log(`Analyses Performed: ${finalStatus.statistics.analysesPerformed || 0}`);
    console.log(`Discoveries Made: ${status.statistics.discoveriesMade}`);
    console.log(`Learning Events: ${status.statistics.learningEvents}`);
    console.log(`Uptime: ${status.statistics.uptime}ms`);
    
    console.log('\n=== Memory Overview ===');
    console.log(`Short-term Conversations: ${memory.shortTerm.conversations.length}`);
    console.log(`Current Tasks: ${memory.shortTerm.currentTasks.length}`);
    console.log(`Recent Findings: ${memory.shortTerm.recentFindings.length}`);
    console.log(`Long-term Patterns: ${memory.longTerm.patterns.length}`);
    console.log(`Knowledge Items: ${memory.longTerm.knowledge.length}`);
    console.log(`Episodic Experiences: ${memory.episodic.experiences.length}`);
    
    return status;
  };
  
  // Monitor for 60 seconds
  for (let i = 0; i < 12; i++) {
    await checkProgress();
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds intervals
  }
  
  console.log('\n=== Analysis Complete ===');
  
  // Get final status
  const finalStatus = await checkProgress();
  const memorySnapshot = autonomousAgent.getMemorySnapshot();
  
  console.log('\n=== Final Results ===');
  console.log(`Total Tasks Completed: ${finalStatus.statistics.tasksCompleted}`);
  console.log(`Total Analyses Performed: ${finalStatus.analysesPerformed}`);
  console.log(`Total Discoveries Made: ${finalStatus.statistics.discoveriesMade}`);
  console.log(`Learning Events: ${finalStatus.statistics.learningEvents}`);
  console.log(`Total Uptime: ${formatUptime(finalStatus.statistics.uptime)}`);
  
  // Get recent findings
  const recentFindings = memorySnapshot.shortTerm.recentFindings.slice(0, 10);
  if (recentFindings.length > 0) {
    console.log('\n=== Recent Findings ===');
    recentFindings.forEach((finding: any, index: number) => {
      console.log(`${index + 1}. ${finding.type} (${Math.round(finding.confidence * 100)}% confidence)`);
      console.log(`   Content: ${finding.content.substring(0, 100)}...`);
    });
  }
  
  // Get patterns identified
  const patterns = memorySnapshot.longTerm.patterns.slice(0, 5);
  if (patterns.length > 0) {
    console.log('\n=== Identified Patterns ===');
    patterns.forEach((pattern: any, index: number) => {
      console.log(`${index + 1}. ${pattern.pattern} (frequency: ${pattern.frequency})`);
      console.log(`   Significance: ${pattern.significance}`);
      console.log(`   Last Seen: ${pattern.lastSeen.toLocaleString()}`);
    });
  }
  
  // Get knowledge items
  const knowledgeItems = memorySnapshot.longTerm.knowledge.slice(0, 5);
  if (knowledgeItems.length > 0) {
    console.log('\n=== Knowledge Base ===');
    knowledgeItems.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${item.domain}: ${item.fact}`);
      console.log(`   Source: ${item.source} (${Math.round(item.confidence * 100)}% confidence)`);
      console.log(`   Learned: ${item.learnedAt.toLocaleString()}`);
    });
  }
  
  // Get experiences
  const experiences = memorySnapshot.episodic.experiences.slice(0, 5);
  if (experiences.length > 0) {
    console.log('\n=== Recent Experiences ===');
    experiences.forEach((experience: any, index: number) => {
      console.log(`${index + 1}. Event: ${experience.event}`);
      console.log(`   Outcome: ${experience.outcome}`);
      console.log(`   Lesson: ${experience.lesson}`);
      console.log(`   Emotional Weight: ${experience.emotionalWeight}`);
      console.log(`   Timestamp: ${experience.timestamp.toLocaleString()}`);
    });
  }
  
  // Stop the agent
  await autonomousAgent.stop();
  
  console.log('\n=== Agent Stopped ===');
  
  return {
    finalStatus,
    memorySnapshot,
    recentFindings,
    patterns,
    knowledgeItems,
    experiences
  };
}

// Helper function to format uptime
function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// Example usage
if (require.main === module) {
  runCompleteSystemAnalysis()
    .then(results => {
      console.log('\n=== Example Complete ===');
      console.log('System analysis completed successfully!');
    })
    .catch(error => {
      console.error('Error during system analysis:', error);
    });
}

export { runCompleteSystemAnalysis };
export default runCompleteSystemAnalysis;

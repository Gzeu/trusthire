/**
 * Run Autonomous Agent Analysis Script
 * Complete example of autonomous agent analyzing the TrustHire system
 */

const { runCompleteSystemAnalysis } = require('../examples/autonomous-agent-example');

async function main() {
  console.log('='.repeat(60));
  console.log('TRUSTHIRE AUTONOMOUS AGENT SYSTEM ANALYSIS');
  console.log('='.repeat(60));
  console.log('Starting comprehensive system analysis...');
  console.log('This will analyze the entire TrustHire system including:');
  console.log('- Security vulnerabilities and threats');
  console.log('- Performance metrics and bottlenecks');
  console.log('- API endpoints and database security');
  console.log('- Authentication and authorization systems');
  console.log('- Infrastructure and network security');
  console.log('- Compliance and regulatory requirements');
  console.log('');
  console.log('The agent will use Mistral AI for advanced analysis and');
  console.log('OpenClaw for document processing and automation.');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Run the complete system analysis
    const results = await runCompleteSystemAnalysis();
    
    console.log('');
    console.log('='.repeat(60));
    console.log('ANALYSIS COMPLETE - SUMMARY');
    console.log('='.repeat(60));
    console.log(`Final Status: ${results.finalStatus.status}`);
    console.log(`Total Tasks Completed: ${results.finalStatus.statistics.tasksCompleted}`);
    console.log(`Total Discoveries Made: ${results.finalStatus.statistics.discoveriesMade}`);
    console.log(`Learning Events: ${results.finalStatus.statistics.learningEvents}`);
    console.log(`Total Uptime: ${results.finalStatus.statistics.uptime}ms`);
    console.log('');
    
    if (results.recentFindings.length > 0) {
      console.log('Key Findings:');
      results.recentFindings.slice(0, 5).forEach((finding, index) => {
        console.log(`${index + 1}. ${finding.type} (${Math.round(finding.confidence * 100)}% confidence)`);
        console.log(`   ${finding.content.substring(0, 100)}...`);
      });
    }
    
    if (results.patterns.length > 0) {
      console.log('');
      console.log('Identified Patterns:');
      results.patterns.slice(0, 3).forEach((pattern, index) => {
        console.log(`${index + 1}. ${pattern.pattern} (frequency: ${pattern.frequency})`);
      });
    }
    
    console.log('');
    console.log('The autonomous agent has completed its analysis of the TrustHire system.');
    console.log('All findings have been stored in the agent\'s memory systems.');
    console.log('You can access the agent UI at http://localhost:3000/agent');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error during system analysis:', error);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Ensure the Mistral API key is configured in .env.local');
    console.log('2. Check that the application is running (npm run dev)');
    console.log('3. Verify network connectivity to Mistral API');
    console.log('4. Check the agent logs for detailed error information');
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

// Run the analysis
if (require.main === module) {
  main();
}

module.exports = { main };

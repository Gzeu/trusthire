/**
 * Autonomous AI Agent API
 * Control interface for the autonomous security agent
 */

import { NextRequest, NextResponse } from 'next/server';
import { autonomousAgent } from '@/lib/ai/autonomous-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate agent request
    const { 
      action,
      taskType,
      priority = 'medium',
      data,
      personalityUpdates
    } = body;
    
    switch (action) {
      case 'start': {
        await autonomousAgent.start();
        return NextResponse.json({
          success: true,
          data: {
            message: 'Autonomous agent started successfully',
            agentStatus: autonomousAgent.getAgentStatus()
          }
        });
      }

      case 'stop': {
        await autonomousAgent.stop();
        return NextResponse.json({
          success: true,
          data: {
            message: 'Autonomous agent stopped successfully',
            agentStatus: autonomousAgent.getAgentStatus()
          }
        });
      }

      case 'add_task': {
        if (!taskType) {
          return NextResponse.json(
            { error: 'Task type is required' },
            { status: 400 }
          );
        }

        const taskId = autonomousAgent.addTask(taskType, priority, data);
        
        return NextResponse.json({
          success: true,
          data: {
            taskId,
            message: 'Task added to queue',
            taskType,
            priority
          }
        });
      }

      case 'update_personality': {
        if (!personalityUpdates) {
          return NextResponse.json(
            { error: 'Personality updates are required' },
            { status: 400 }
          );
        }

        autonomousAgent.updatePersonality(personalityUpdates);
        
        return NextResponse.json({
          success: true,
          data: {
            message: 'Agent personality updated successfully',
            agentStatus: autonomousAgent.getAgentStatus()
          }
        });
      }

      case 'custom_command': {
        if (!data || !data.command) {
          return NextResponse.json(
            { error: 'Command is required for custom action' },
            { status: 400 }
          );
        }

        // Add custom command as a high-priority task
        const taskId = autonomousAgent.addTask('custom_command', 'high', {
          command: data.command,
          parameters: data.parameters,
          context: data.context
        });
        
        return NextResponse.json({
          success: true,
          data: {
            taskId,
            message: 'Custom command queued for execution',
            command: data.command
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: start, stop, add_task, update_personality, custom_command' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Autonomous agent API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during agent operation',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'status';

    switch (view) {
      case 'status': {
        const agentStatus = autonomousAgent.getAgentStatus();
        const memorySnapshot = autonomousAgent.getMemorySnapshot();
        
        return NextResponse.json({
          success: true,
          data: {
            agent: agentStatus,
            memory: memorySnapshot,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'personality': {
        const agentStatus = autonomousAgent.getAgentStatus();
        
        return NextResponse.json({
          success: true,
          data: {
            personality: agentStatus.personality,
            soul: agentStatus.soul,
            capabilities: agentStatus.capabilities
          }
        });
      }

      case 'memory': {
        const memorySnapshot = autonomousAgent.getMemorySnapshot();
        
        return NextResponse.json({
          success: true,
          data: {
            memory: memorySnapshot,
            statistics: {
              shortTermConversations: memorySnapshot.shortTerm.conversations.length,
              shortTermTasks: memorySnapshot.shortTerm.currentTasks.length,
              recentFindings: memorySnapshot.shortTerm.recentFindings.length,
              longTermPatterns: memorySnapshot.longTerm.patterns.length,
              longTermKnowledge: memorySnapshot.longTerm.knowledge.length,
              episodicExperiences: memorySnapshot.episodic.experiences.length
            }
          }
        });
      }

      case 'statistics': {
        const agentStatus = autonomousAgent.getAgentStatus();
        
        return NextResponse.json({
          success: true,
          data: {
            statistics: agentStatus.statistics,
            performance: {
              uptime: agentStatus.statistics.uptime,
              tasksCompleted: agentStatus.statistics.tasksCompleted,
              analysesPerformed: agentStatus.statistics.analysesPerformed,
              discoveriesMade: agentStatus.statistics.discoveriesMade,
              errorsEncountered: agentStatus.statistics.errorsEncountered,
              learningEvents: agentStatus.statistics.learningEvents,
              errorRate: agentStatus.statistics.errorsEncountered / Math.max(agentStatus.statistics.tasksCompleted, 1),
              discoveryRate: agentStatus.statistics.discoveriesMade / Math.max(agentStatus.statistics.analysesPerformed, 1)
            }
          }
        });
      }

      case 'capabilities': {
        const agentStatus = autonomousAgent.getAgentStatus();
        
        return NextResponse.json({
          success: true,
          data: {
            capabilities: agentStatus.capabilities,
            personality: agentStatus.personality,
            supportedTaskTypes: [
              'security_analysis',
              'threat_hunting',
              'documentation',
              'learning',
              'reporting',
              'custom_command'
            ],
            supportedPriorities: ['low', 'medium', 'high'],
            communicationStyles: ['formal', 'casual', 'technical', 'friendly'],
            reportFormats: ['detailed', 'summary', 'executive'],
            analysisDepths: ['quick', 'thorough', 'comprehensive']
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid view. Supported views: status, personality, memory, statistics, capabilities' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Agent status check error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error while checking agent status' },
      { status: 500 }
    );
  }
}

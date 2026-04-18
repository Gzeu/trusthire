// AI Analysis API Endpoint
// Provides AI-powered communication and threat analysis

import { NextRequest, NextResponse } from 'next/server';
import { aiAnalyzer } from '@/lib/ai-analyzer';
import { behavioralAnalyzer } from '@/lib/behavioral-analyzer';
import { threatIntelligence } from '@/lib/threat-intelligence';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case 'communication':
        result = await aiAnalyzer.analyzeCommunication(
          data.message,
          data.context
        );
        break;

      case 'threat':
        result = await aiAnalyzer.predictThreat(data);
        break;

      case 'profile':
        result = await aiAnalyzer.analyzeProfile(data.profileData);
        break;

      case 'recommendations':
        result = await aiAnalyzer.generateRecommendations(data.context);
        break;

      case 'behavioral':
        const monitor = behavioralAnalyzer.startMonitoring();
        
        // Simulate behavioral analysis (in real implementation, this would monitor actual execution)
        if (data.simulatedData) {
          data.simulatedData.networkRequests?.forEach((req: any) => 
            behavioralAnalyzer.recordNetworkActivity(req)
          );
          data.simulatedData.fileOperations?.forEach((op: any) => 
            behavioralAnalyzer.recordFileActivity(op)
          );
          data.simulatedData.processCreations?.forEach((proc: any) => 
            behavioralAnalyzer.recordProcessActivity(proc)
          );
        }

        result = behavioralAnalyzer.completeMonitoring(monitor);
        break;

      case 'threat_intelligence':
        result = await threatIntelligence.analyzeThreats(data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let result;

    switch (type) {
      case 'threat_stats':
        result = threatIntelligence.getStatistics();
        break;

      case 'behavioral_stats':
        result = behavioralAnalyzer.getStatistics();
        break;

      case 'threat_search':
        const query = searchParams.get('query') || '';
        result = threatIntelligence.searchThreats(query);
        break;

      case 'threat_feeds':
        result = threatIntelligence.getAllThreats();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid query type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI analysis GET error:', error);
    return NextResponse.json(
      { 
        error: 'Query failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

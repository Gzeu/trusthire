/**
 * Behavioral Analysis API
 * Analyzes user behavior patterns and detects anomalies
 */

import { NextRequest, NextResponse } from 'next/server';
import { behavioralAnalyzer } from '@/lib/ml/behavioral-analyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { userId, includeHistory = false } = body;
    
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'User ID is required and must be a string' },
        { status: 400 }
      );
    }

    // Analyze user behavior
    const behaviorProfile = await behavioralAnalyzer.analyzeUserBehavior(userId);

    // Detect anomalies
    const anomalyReport = await behavioralAnalyzer.detectAnomalies(behaviorProfile);

    return NextResponse.json({
      success: true,
      data: {
        behaviorProfile,
        anomalyReport,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Behavioral analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during behavioral analysis',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID parameter is required' },
        { status: 400 }
      );
    }

    // Get cached behavior profile
    const profile = behavioralAnalyzer.getBehaviorProfile(userId);

    if (!profile) {
      return NextResponse.json(
        { error: 'No behavior profile found for this user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        profile,
        lastUpdated: profile.lastUpdated,
        riskScore: profile.riskScore,
        anomalyCount: profile.anomalies.length
      }
    });

  } catch (error) {
    console.error('Profile retrieval error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

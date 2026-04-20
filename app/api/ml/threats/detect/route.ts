/**
 * Advanced ML Threat Detection API
 * Uses custom models for sophisticated threat analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { customThreatDetector } from '@/lib/ml/custom-threat-detector';
import { ThreatInput } from '@/lib/ml/model-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { content, context, metadata = {} } = body;
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    // Prepare threat input
    const threatInput: ThreatInput = {
      content: content.trim(),
      context: {
        platform: context?.platform || 'unknown',
        userType: context?.userType || 'unknown',
        interactionType: context?.interactionType || 'unknown'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'api_ml_threats_detect',
        ...metadata
      }
    };

    // Run threat detection
    const prediction = await customThreatDetector.predictThreatLevel(threatInput);

    // Log the detection for analytics
    console.log(`Threat detection completed: ${prediction.threatLevel} (${prediction.confidence})`);

    return NextResponse.json({
      success: true,
      data: {
        prediction,
        input: {
          content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
          context: threatInput.context,
          timestamp: threatInput.metadata.timestamp
        },
        processing_time: Date.now() - new Date(threatInput.metadata.timestamp).getTime()
      }
    });

  } catch (error) {
    console.error('Threat detection error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during threat detection',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return threat detection status and capabilities
    const patterns = customThreatDetector.getPatterns();
    const rules = customThreatDetector.getRules();

    return NextResponse.json({
      success: true,
      data: {
        status: 'active',
        capabilities: {
          pattern_count: patterns.length,
          rule_count: rules.length,
          threat_types: ['phishing', 'malware', 'social_engineering', 'data_exfiltration', 'other'],
          severity_levels: ['low', 'medium', 'high', 'critical']
        },
        patterns: patterns.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          severity: p.severity,
          confidence: p.confidence
        })),
        rules: rules.map(r => ({
          id: r.id,
          name: r.name,
          severity: r.severity,
          action: r.action,
          confidence: r.confidence
        }))
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

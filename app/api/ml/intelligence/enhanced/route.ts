/**
 * Enhanced Threat Intelligence API 2026
 * Advanced AI-powered threat prediction and prevention
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhancedThreatIntelligence } from '@/lib/ml/enhanced-threat-intelligence';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate intelligence request
    const { 
      action,
      context,
      actorIdentifier,
      timeframe = '30d',
      includePredictions = true,
      includeActors = true,
      includeTrends = true,
      includeZeroDay = true
    } = body;
    
    switch (action) {
      case 'predict_threats': {
        if (!context) {
          return NextResponse.json(
            { error: 'Context is required for threat prediction' },
            { status: 400 }
          );
        }

        const predictions = await enhancedThreatIntelligence.predictThreats(context);
        
        return NextResponse.json({
          success: true,
          data: {
            predictions,
            context,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'analyze_actor': {
        if (!actorIdentifier) {
          return NextResponse.json(
            { error: 'Actor identifier is required for actor analysis' },
            { status: 400 }
          );
        }

        const actorProfile = await enhancedThreatIntelligence.analyzeThreatActor(actorIdentifier);
        
        if (!actorProfile) {
          return NextResponse.json(
            { error: 'Threat actor not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            actorProfile,
            actorIdentifier,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'analyze_trends': {
        const trends = await enhancedThreatIntelligence.analyzeThreatTrends(timeframe);
        
        return NextResponse.json({
          success: true,
          data: {
            trends,
            timeframe,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'detect_zeroday': {
        const zeroDayThreats = await enhancedThreatIntelligence.detectZeroDayThreats();
        
        return NextResponse.json({
          success: true,
          data: {
            zeroDayThreats,
            total: zeroDayThreats.length,
            critical: zeroDayThreats.filter(z => z.severity === 'critical').length,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'generate_report': {
        const report = await enhancedThreatIntelligence.generateThreatReport({
          timeframe,
          threatTypes: context?.threatTypes,
          platforms: context?.platforms,
          includePredictions,
          includeActors,
          includeTrends,
          includeZeroDay
        });

        return NextResponse.json({
          success: true,
          data: {
            report,
            generatedAt: new Date().toISOString()
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: predict_threats, analyze_actor, analyze_trends, detect_zeroday, generate_report' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Enhanced threat intelligence error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during intelligence operation',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'overview';
    const timeframe = searchParams.get('timeframe') || '30d';

    switch (view) {
      case 'overview': {
        const predictions = enhancedThreatIntelligence.getThreatPredictions();
        const actors = enhancedThreatIntelligence.getThreatActors();
        const trends = enhancedThreatIntelligence.getThreatTrends();
        const zeroDayThreats = enhancedThreatIntelligence.getZeroDayThreats();
        const sources = enhancedThreatIntelligence.getIntelligenceSources();

        const overview = {
          intelligenceStatus: 'active',
          totalPredictions: predictions.length,
          activeActors: actors.length,
          emergingTrends: trends.filter(t => t.category === 'emerging').length,
          zeroDayThreats: zeroDayThreats.length,
          intelligenceSources: Array.from(sources.values()).map(s => ({
            name: s.name,
            enabled: s.enabled,
            lastUpdate: s.lastUpdate
          })),
          overallRiskLevel: this.calculateOverallRiskLevel(predictions, zeroDayThreats)
        };

        return NextResponse.json({
          success: true,
          data: {
            overview,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'predictions': {
        const predictions = enhancedThreatIntelligence.getThreatPredictions();
        
        return NextResponse.json({
          success: true,
          data: {
            predictions,
            total: predictions.length,
            highRisk: predictions.filter(p => p.impact === 'critical' || p.impact === 'high').length,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'actors': {
        const actors = enhancedThreatIntelligence.getThreatActors();
        
        return NextResponse.json({
          success: true,
          data: {
            actors,
            total: actors.length,
            sophisticated: actors.filter(a => 
              a.sophistication === 'professional' || 
              a.sophistication === 'state_sponsored' || 
              a.sophistication === 'organized_crime'
            ).length,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'trends': {
        const trends = await enhancedThreatIntelligence.analyzeThreatTrends(timeframe);
        
        return NextResponse.json({
          success: true,
          data: {
            trends,
            timeframe,
            total: trends.length,
            emerging: trends.filter(t => t.category === 'emerging').length,
            critical: trends.filter(t => t.riskScore > 0.8).length,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'zeroday': {
        const zeroDayThreats = enhancedThreatIntelligence.getZeroDayThreats();
        
        return NextResponse.json({
          success: true,
          data: {
            zeroDayThreats,
            total: zeroDayThreats.length,
            critical: zeroDayThreats.filter(z => z.severity === 'critical').length,
            verified: zeroDayThreats.filter(z => z.verified).length,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'dashboard': {
        const predictions = enhancedThreatIntelligence.getThreatPredictions();
        const actors = enhancedThreatIntelligence.getThreatActors();
        const trends = enhancedThreatIntelligence.getThreatTrends();
        const zeroDayThreats = enhancedThreatIntelligence.getZeroDayThreats();

        const dashboard = {
          executiveSummary: {
            overallRiskLevel: this.calculateOverallRiskLevel(predictions, zeroDayThreats),
            criticalThreats: predictions.filter(p => p.impact === 'critical').length + 
                             zeroDayThreats.filter(z => z.severity === 'critical').length,
            emergingTrends: trends.filter(t => t.category === 'emerging').length,
            activeActors: actors.filter(a => a.patterns.attackFrequency > 0).length,
            zeroDayThreats: zeroDayThreats.length
          },
          threatLandscape: {
            predictions: predictions.slice(0, 10),
            actors: actors.slice(0, 5),
            trends: trends.slice(0, 8),
            zeroDayThreats: zeroDayThreats.slice(0, 3)
          },
          riskDistribution: this.calculateRiskDistribution(predictions, zeroDayThreats),
          threatEvolution: this.analyzeThreatEvolution(trends),
          intelligenceCoverage: this.analyzeIntelligenceCoverage()
        };

        return NextResponse.json({
          success: true,
          data: {
            dashboard,
            timestamp: new Date().toISOString()
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid view. Supported views: overview, predictions, actors, trends, zeroday, dashboard' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Intelligence data fetch error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error while fetching intelligence data' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateOverallRiskLevel(predictions: any[], zeroDayThreats: any[]): string {
  const criticalCount = predictions.filter((p: any) => p.impact === 'critical').length +
                       zeroDayThreats.filter((z: any) => z.severity === 'critical').length;
  
  if (criticalCount >= 5) return 'CRITICAL';
  if (criticalCount >= 3) return 'HIGH';
  if (criticalCount >= 1) return 'MEDIUM';
  return 'LOW';
}

function calculateRiskDistribution(predictions: any[], zeroDayThreats: any[]): {
  critical: number;
  high: number;
  medium: number;
  low: number;
} {
  const allThreats = [...predictions, ...zeroDayThreats];
  
  return allThreats.reduce((acc: any, threat: any) => {
    const impact = threat.impact || threat.severity;
    if (impact === 'critical' || impact === 'high') acc.critical++;
    else if (impact === 'high') acc.high++;
    else if (impact === 'medium') acc.medium++;
    else acc.low++;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0 });
}

function analyzeThreatEvolution(trends: any[]): {
  emerging: number;
  trending: number;
  declining: number;
  stable: number;
} {
  return trends.reduce((acc: any, trend: any) => {
    acc[trend.category]++;
    return acc;
  }, { emerging: 0, trending: 0, declining: 0, stable: 0 });
}

function analyzeIntelligenceCoverage(): {
  darkWeb: boolean;
  blockchain: boolean;
  socialMedia: boolean;
  malware: boolean;
  threatSharing: boolean;
  lastUpdate: string;
} {
  return {
    darkWeb: true,
    blockchain: true,
    socialMedia: true,
    malware: true,
    threatSharing: true,
    lastUpdate: new Date().toISOString()
  };
}

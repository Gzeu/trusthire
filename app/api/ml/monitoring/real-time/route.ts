/**
 * Real-time Threat Monitoring API 2026
 * Continuous monitoring for sophisticated scammer activities
 */

import { NextRequest, NextResponse } from 'next/server';
import { realTimeThreatMonitoring } from '@/lib/ml/real-time-threat-monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate monitoring request
    const { 
      action, 
      targetType, 
      targetValue, 
      alertId, 
      action: alertAction,
      webhookUrl 
    } = body;
    
    switch (action) {
      case 'add_target': {
        if (!targetType || !targetValue) {
          return NextResponse.json(
            { error: 'Target type and value are required for add_target action' },
            { status: 400 }
          );
        }

        const targetId = realTimeThreatMonitoring.addMonitoringTarget({
          type: targetType,
          value: targetValue,
          riskLevel: 'medium' // Default risk level
        });

        return NextResponse.json({
          success: true,
          data: {
            targetId,
            message: 'Monitoring target added successfully',
            targetType,
            targetValue
          }
        });
      }

      case 'remove_target': {
        if (!targetValue) {
          return NextResponse.json(
            { error: 'Target value is required for remove_target action' },
            { status: 400 }
          );
        }

        const targets = realTimeThreatMonitoring.getMonitoringTargets();
        const target = targets.find(t => t.value === targetValue);
        
        if (!target) {
          return NextResponse.json(
            { error: 'Target not found' },
            { status: 404 }
          );
        }

        const removed = realTimeThreatMonitoring.removeMonitoringTarget(target.id);
        
        return NextResponse.json({
          success: removed,
          data: {
            message: removed ? 'Target removed successfully' : 'Failed to remove target',
            targetValue
          }
        });
      }

      case 'acknowledge_alert': {
        if (!alertId) {
          return NextResponse.json(
            { error: 'Alert ID is required for acknowledge_alert action' },
            { status: 400 }
          );
        }

        const acknowledged = realTimeThreatMonitoring.acknowledgeAlert(alertId, alertAction);
        
        return NextResponse.json({
          success: acknowledged,
          data: {
            message: acknowledged ? 'Alert acknowledged successfully' : 'Alert not found',
            alertId,
            action: alertAction
          }
        });
      }

      case 'dismiss_alert': {
        if (!alertId) {
          return NextResponse.json(
            { error: 'Alert ID is required for dismiss_alert action' },
            { status: 400 }
          );
        }

        const dismissed = realTimeThreatMonitoring.dismissAlert(alertId);
        
        return NextResponse.json({
          success: dismissed,
          data: {
            message: dismissed ? 'Alert dismissed successfully' : 'Alert not found',
            alertId
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: add_target, remove_target, acknowledge_alert, dismiss_alert' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Real-time monitoring error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during monitoring operation',
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
    const targetType = searchParams.get('target_type');
    const severity = searchParams.get('severity');

    switch (view) {
      case 'overview': {
        const statistics = realTimeThreatMonitoring.getStatistics();
        
        return NextResponse.json({
          success: true,
          data: {
            statistics,
            timestamp: new Date().toISOString(),
            monitoringStatus: 'active'
          }
        });
      }

      case 'threats': {
        const threats = realTimeThreatMonitoring.getActiveThreats();
        
        let filteredThreats = threats;
        if (severity) {
          filteredThreats = threats.filter(t => t.severity === severity);
        }

        return NextResponse.json({
          success: true,
          data: {
            threats: filteredThreats,
            total: threats.length,
            filtered: filteredThreats.length,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'patterns': {
        const patterns = realTimeThreatMonitoring.getThreatPatterns();
        
        return NextResponse.json({
          success: true,
          data: {
            patterns,
            total: patterns.length,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'targets': {
        const targets = realTimeThreatMonitoring.getMonitoringTargets();
        
        let filteredTargets = targets;
        if (targetType) {
          filteredTargets = targets.filter(t => t.type === targetType);
        }

        return NextResponse.json({
          success: true,
          data: {
            targets: filteredTargets,
            total: targets.length,
            filtered: filteredTargets.length,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'dashboard': {
        const statistics = realTimeThreatMonitoring.getStatistics();
        const threats = realTimeThreatMonitoring.getActiveThreats();
        const patterns = realTimeThreatMonitoring.getThreatPatterns();
        const targets = realTimeThreatMonitoring.getMonitoringTargets();

        // Prepare dashboard data
        const dashboard = {
          overview: statistics,
          recentThreats: threats.slice(-10).reverse(),
          topPatterns: patterns.sort((a, b) => b.frequency - a.frequency).slice(0, 5),
          highRiskTargets: targets.filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical').slice(0, 10),
          threatTimeline: this.generateThreatTimeline(threats),
          riskDistribution: this.calculateRiskDistribution(targets),
          alertTrends: this.calculateAlertTrends(threats)
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
          { error: 'Invalid view. Supported views: overview, threats, patterns, targets, dashboard' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Monitoring data fetch error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error while fetching monitoring data' },
      { status: 500 }
    );
  }
}

// Helper functions for dashboard data
function generateThreatTimeline(threats: any[]): Array<{ time: string; count: number; severity: string }> {
  const now = new Date();
  const timeline = [];
  
  for (let i = 0; i < 24; i++) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourThreats = threats.filter(t => 
      t.timestamp.getHours() === hour.getHours() &&
      t.timestamp.getDate() === hour.getDate()
    );
    
    timeline.push({
      time: hour.toISOString(),
      count: hourThreats.length,
      severity: hourThreats.some((t: any) => t.severity === 'critical') ? 'critical' :
               hourThreats.some((t: any) => t.severity === 'high') ? 'high' : 'medium'
    });
  }
  
  return timeline.reverse();
}

function calculateRiskDistribution(targets: any[]): { low: number; medium: number; high: number; critical: number } {
  return targets.reduce((acc: any, target: any) => {
    acc[target.riskLevel]++;
    return acc;
  }, { low: 0, medium: 0, high: 0, critical: 0 });
}

function calculateAlertTrends(threats: any[]): { daily: number[]; weekly: number[]; severity: Record<string, number> } {
  const now = new Date();
  const daily = [];
  const weekly = [];
  
  // Daily trends (last 7 days)
  for (let i = 0; i < 7; i++) {
    const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayThreats = threats.filter((t: any) => 
      t.timestamp.getDate() === day.getDate() &&
      t.timestamp.getMonth() === day.getMonth()
    );
    daily.push(dayThreats.length);
  }
  
  // Weekly trends (last 4 weeks)
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const weekThreats = threats.filter((t: any) => 
      t.timestamp >= weekStart && t.timestamp < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    );
    weekly.push(weekThreats.length);
  }
  
  // Severity distribution
  const severity = threats.reduce((acc: any, threat: any) => {
    acc[threat.severity] = (acc[threat.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    daily: daily.reverse(),
    weekly: weekly.reverse(),
    severity
  };
}

/**
 * Real-Time Threat Intelligence API
 * Global threat sharing and intelligence aggregation
 */

import { NextRequest, NextResponse } from 'next/server';
import { ThreatIntelligence, GlobalThreatNetwork } from '@/types/security';

interface ThreatIntelligenceRequest {
  type: 'submit' | 'query' | 'subscribe';
  data?: any;
  filters?: ThreatFilters;
  subscription?: {
    endpoint: string;
    events: string[];
  };
}

interface ThreatFilters {
  severity?: string[];
  category?: string[];
  timeframe?: string;
  location?: string;
  platform?: string;
  limit?: number;
}

interface ThreatSubmission {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  indicators: string[];
  location: string;
  platform: string;
  confidence: number;
  timestamp: Date;
  submitter: string;
  verified: boolean;
  relatedThreats?: string[];
}

interface IntelligenceSubscription {
  id: string;
  endpoint: string;
  events: string[];
  active: boolean;
  createdAt: Date;
  lastActivity: Date;
}

// In-memory storage for demo (in production, this would be a database)
const threatDatabase: ThreatSubmission[] = [];
const subscriptions: Map<string, IntelligenceSubscription> = new Map();
const globalNetwork: GlobalThreatNetwork = {
  nodes: [],
  connections: [],
  threatTypes: [],
  lastUpdate: new Date(),
  totalThreats: 0,
  activeAlerts: 0
};

export async function POST(req: NextRequest) {
  try {
    const body: ThreatIntelligenceRequest = await req.json();
    
    switch (body.type) {
      case 'submit':
        return await handleThreatSubmission(body.data);
      case 'query':
        return await handleThreatQuery(body.filters);
      case 'subscribe':
        return await handleSubscription(body.subscription);
      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Threat intelligence API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    switch (type) {
      case 'network':
        return NextResponse.json(globalNetwork);
      case 'threats':
        return await handleThreatQuery(Object.fromEntries(searchParams));
      case 'stats':
        return NextResponse.json(getNetworkStats());
      case 'subscriptions':
        return NextResponse.json(Array.from(subscriptions.values()));
      default:
        return NextResponse.json({ error: 'Invalid query type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Threat intelligence GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleThreatSubmission(submission: any): Promise<NextResponse> {
  try {
    // Validate submission
    if (!submission.type || !submission.description || !submission.severity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const threat: ThreatSubmission = {
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: submission.type,
      severity: submission.severity,
      description: submission.description,
      indicators: submission.indicators || [],
      location: submission.location || 'unknown',
      platform: submission.platform || 'unknown',
      confidence: submission.confidence || 0.5,
      timestamp: new Date(),
      submitter: submission.submitter || 'anonymous',
      verified: false
    };

    // Add to database
    threatDatabase.push(threat);
    
    // Update global network
    updateGlobalNetwork(threat);
    
    // Notify subscribers
    await notifySubscribers('threat_submitted', threat);
    
    console.log(`Threat submitted: ${threat.id}`);
    
    return NextResponse.json({
      success: true,
      threatId: threat.id,
      message: 'Threat submitted successfully'
    });

  } catch (error) {
    console.error('Error handling threat submission:', error);
    return NextResponse.json({ error: 'Failed to submit threat' }, { status: 500 });
  }
}

async function handleThreatQuery(filters: any): Promise<NextResponse> {
  try {
    let filteredThreats = [...threatDatabase];
    
    // Apply filters
    if (filters) {
      if (filters.severity) {
        const severities = Array.isArray(filters.severity) ? filters.severity : [filters.severity];
        filteredThreats = filteredThreats.filter(t => severities.includes(t.severity));
      }
      
      if (filters.category) {
        const categories = Array.isArray(filters.category) ? filters.category : [filters.category];
        filteredThreats = filteredThreats.filter(t => categories.includes(t.type));
      }
      
      if (filters.location) {
        filteredThreats = filteredThreats.filter(t => 
          t.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      if (filters.platform) {
        filteredThreats = filteredThreats.filter(t => 
          t.platform.toLowerCase().includes(filters.platform.toLowerCase())
        );
      }
      
      if (filters.timeframe) {
        const now = new Date();
        let cutoffDate: Date;
        
        switch (filters.timeframe) {
          case '1h':
            cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case '24h':
            cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }
        
        filteredThreats = filteredThreats.filter(t => t.timestamp >= cutoffDate);
      }
      
      // Apply limit
      if (filters.limit) {
        filteredThreats = filteredThreats.slice(0, parseInt(filters.limit));
      }
    }
    
    // Sort by timestamp (most recent first)
    filteredThreats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return NextResponse.json({
      threats: filteredThreats,
      total: filteredThreats.length,
      filters: filters,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error handling threat query:', error);
    return NextResponse.json({ error: 'Failed to query threats' }, { status: 500 });
  }
}

async function handleSubscription(subscriptionData: any): Promise<NextResponse> {
  try {
    if (!subscriptionData || !subscriptionData.endpoint || !subscriptionData.events) {
      return NextResponse.json({ error: 'Missing subscription data' }, { status: 400 });
    }

    const subscription: IntelligenceSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      endpoint: subscriptionData.endpoint,
      events: subscriptionData.events,
      active: true,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    subscriptions.set(subscription.id, subscription);
    
    console.log(`Subscription created: ${subscription.id}`);
    
    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      message: 'Subscription created successfully'
    });

  } catch (error) {
    console.error('Error handling subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

function updateGlobalNetwork(threat: ThreatSubmission): void {
  // Add threat node to global network
  const node = {
    id: threat.id,
    type: threat.type,
    name: threat.description.substring(0, 50),
    location: threat.location,
    platform: threat.platform,
    severity: threat.severity,
    timestamp: threat.timestamp,
    confidence: threat.confidence,
    metadata: {
      indicators: threat.indicators,
      submitter: threat.submitter,
      verified: threat.verified
    }
  };

  globalNetwork.nodes.push(node);
  
  // Update connections (mock - would use similarity algorithms)
  if (globalNetwork.nodes.length > 1) {
    const lastNode = globalNetwork.nodes[globalNetwork.nodes.length - 2];
    globalNetwork.connections.push({
      source: { x: 0, y: 0, z: 0 },
      target: { x: 1, y: 1, z: 1 },
      strength: Math.random() * 0.8 + 0.2,
      type: 'similarity',
      confidence: Math.random() * 0.7 + 0.3,
      lastSeen: new Date()
    });
  }
  
  // Update threat types
  if (!globalNetwork.threatTypes.find(t => t.name === threat.type)) {
    globalNetwork.threatTypes.push({
      name: threat.type,
      category: getCategoryForType(threat.type),
      patterns: threat.indicators,
      severity: threat.severity,
      prevalence: 1,
      mitigation: getMitigationForType(threat.type),
      references: []
    });
  }
  
  globalNetwork.lastUpdate = new Date();
  globalNetwork.totalThreats = globalNetwork.nodes.length;
  globalNetwork.activeAlerts = globalNetwork.nodes.filter(n => 
    n.severity === 'critical' || n.severity === 'high'
  ).length;
}

function getCategoryForType(type: string): string {
  const categories: { [key: string]: string } = {
    'phishing': 'Social Engineering',
    'malware': 'Malicious Code',
    'data_breach': 'Data Breach',
    'impersonation': 'Identity Theft',
    'reconnaissance': 'Reconnaissance',
    'dos': 'Denial of Service',
    'injection': 'Code Injection'
  };
  
  return categories[type] || 'Other';
}

function getMitigationForType(type: string): string[] {
  const mitigations: { [key: string]: string[] } = {
    'phishing': [
      'Verify sender identity',
      'Check URL legitimacy',
      'Use email authentication'
    ],
    'malware': [
      'Scan all files',
      'Use antivirus software',
      'Isolate affected systems'
    ],
    'data_breach': [
      'Change passwords',
      'Enable 2FA',
      'Monitor accounts'
    ],
    'impersonation': [
      'Verify through multiple channels',
      'Check official sources',
      'Use video verification'
    ],
    'reconnaissance': [
      'Monitor network traffic',
      'Review access logs',
      'Implement rate limiting'
    ],
    'dos': [
      'Implement DDoS protection',
      'Scale infrastructure',
      'Use CDN services'
    ],
    'injection': [
      'Input validation',
      'Parameterized queries',
      'Web application firewall'
    ]
  };
  
  return mitigations[type] || ['Investigate further', 'Implement security controls'];
}

async function notifySubscribers(event: string, data: any): Promise<void> {
  const notifications = Array.from(subscriptions.values())
    .filter(sub => sub.active && sub.events.includes(event));
  
  for (const subscription of notifications) {
    try {
      // Mock webhook notification
      console.log(`Notifying subscriber ${subscription.endpoint} about ${event}`);
      
      // In a real implementation, this would send HTTP POST to the endpoint
      // await fetch(subscription.endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ event, data, timestamp: new Date() })
      // });
      
      subscription.lastActivity = new Date();
      
    } catch (error) {
      console.error(`Failed to notify subscriber ${subscription.endpoint}:`, error);
    }
  }
}

function getNetworkStats(): any {
  const severityCounts = globalNetwork.nodes.reduce((counts, node) => {
    counts[node.severity] = (counts[node.severity] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  const platformCounts = globalNetwork.nodes.reduce((counts, node) => {
    counts[node.platform] = (counts[node.platform] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  const typeCounts = globalNetwork.nodes.reduce((counts, node) => {
    counts[node.type] = (counts[node.type] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  return {
    totalThreats: globalNetwork.totalThreats,
    activeAlerts: globalNetwork.activeAlerts,
    lastUpdate: globalNetwork.lastUpdate,
    severityBreakdown: severityCounts,
    platformBreakdown: platformCounts,
    typeBreakdown: typeCounts,
    activeSubscriptions: subscriptions.size,
    networkHealth: {
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '120ms'
    }
  };
}

// Add some sample threats for demonstration
const sampleThreats: ThreatSubmission[] = [
  {
    id: 'sample_1',
    type: 'phishing',
    severity: 'high',
    description: 'Sophisticated phishing campaign targeting tech recruiters',
    indicators: [
      'Urgent job offers with high salaries',
      'Requests for upfront payment',
      'Fake company websites',
      'Grammar errors in communications'
    ],
    location: 'Global',
    platform: 'LinkedIn',
    confidence: 0.85,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    submitter: 'security_team',
    verified: true
  },
  {
    id: 'sample_2',
    type: 'malware',
    severity: 'critical',
    description: 'Malicious npm packages targeting developers',
    indicators: [
      'Postinstall scripts with crypto theft',
      'Typosquatting popular packages',
      'Obfuscated malicious code',
      'Connections to suspicious domains'
    ],
    location: 'npm registry',
    platform: 'GitHub/npm',
    confidence: 0.95,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    submitter: 'automated_scanner',
    verified: true
  },
  {
    id: 'sample_3',
    type: 'impersonation',
    severity: 'medium',
    description: 'Fake recruiter profiles impersonating legitimate companies',
    indicators: [
      'Recently created profiles',
      'Few connections',
      'Inconsistent work history',
      'Stock profile photos'
    ],
    location: 'North America',
    platform: 'LinkedIn',
    confidence: 0.72,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    submitter: 'community_reports',
    verified: false
  }
];

// Initialize with sample data
threatDatabase.push(...sampleThreats);
sampleThreats.forEach(threat => updateGlobalNetwork(threat));

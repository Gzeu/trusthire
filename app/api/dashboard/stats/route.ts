import { NextRequest, NextResponse } from 'next/server';

// Mock implementation for deployment
// Types
export interface RecentAssessment {
  id: string;
  createdAt: string;
  recruiterName: string;
  company: string;
  finalScore: number;
  verdict: string;
  shareToken: string;
}

export interface DashboardStats {
  total: number;
  avgScore: number;
  byVerdict: {
    critical: number;
    high_risk: number;
    caution: number;
    low_risk: number;
  };
  recent: RecentAssessment[];
}

// Mock data generators
function generateMockAssessment(id: string, index: number): RecentAssessment {
  const companies = [
    'TechCorp Solutions',
    'SecureNet Inc',
    'CyberShield Systems',
    'DataGuard Technologies',
    'TrustWave Global',
    'InfoSecure Pro',
    'SafeHarbor Tech',
    'Protecta Systems'
  ];
  
  const names = [
    'John Smith',
    'Sarah Johnson',
    'Michael Chen',
    'Emily Davis',
    'Robert Wilson',
    'Lisa Anderson',
    'David Martinez',
    'Jennifer Taylor'
  ];
  
  const verdicts = ['low_risk', 'caution', 'high_risk', 'critical'];
  const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
  
  const baseScore = verdict === 'critical' ? 20 : verdict === 'high_risk' ? 40 : verdict === 'caution' ? 60 : 80;
  const finalScore = baseScore + Math.floor(Math.random() * 20) - 10;
  
  return {
    id,
    createdAt: new Date(Date.now() - (index * 3600000)).toISOString(),
    recruiterName: names[index % names.length],
    company: companies[index % companies.length],
    finalScore: Math.max(0, Math.min(100, finalScore)),
    verdict,
    shareToken: `share_${id}_${Math.random().toString(36).substr(2, 9)}`
  };
}

function generateMockStats(): DashboardStats {
  const total = Math.floor(Math.random() * 500) + 100;
  const recent = Array.from({ length: 10 }, (_, i) => 
    generateMockAssessment(`assessment_${i + 1}`, i)
  );
  
  // Calculate verdict counts
  const byVerdict = recent.reduce((acc, assessment) => {
    acc[assessment.verdict as keyof typeof acc]++;
    return acc;
  }, { critical: 0, high_risk: 0, caution: 0, low_risk: 0 });
  
  // Calculate average score
  const avgScore = Math.round(
    recent.reduce((sum, a) => sum + a.finalScore, 0) / recent.length
  );
  
  return {
    total,
    avgScore,
    byVerdict,
    recent
  };
}

// GET /api/dashboard/stats
export async function GET(req: NextRequest) {
  try {
    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const stats = generateMockStats();
    
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (err) {
    console.error('[dashboard/stats] Error:', err);
    return NextResponse.json(
      { error: 'Failed to load dashboard stats.' },
      { status: 500 }
    );
  }
}

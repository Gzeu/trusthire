// Scoring system for TrustHire Autonomous System
// Scoring system for TrustHire Autonomous System
export function calculateScores(factors: any): Promise<any> {
  return Promise.resolve({
    overall: 0.8,
    technical: 0.85,
    experience: 0.75,
    education: 0.9,
    breakdown: factors
  });
}

export function getVerdict(score: number): string {
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.6) return 'Good';
  if (score >= 0.4) return 'Fair';
  return 'Poor';
}

export function generateRedFlags(data: any): string[] {
  return ['No major red flags detected'];
}

export function generateGreenSignals(data: any): string[] {
  return ['Strong technical background', 'Consistent experience'];
}

export function generateMissingEvidence(data: any): string[] {
  return ['Consider adding more project examples'];
}

export function generateWorkflowAdvice(data: any): string[] {
  return ['Focus on highlighting recent achievements'];
}

export interface ScoringFactors {
  experience: number;
  education: number;
  skills: number;
  reputation: number;
  background: number;
}

export class ScoringService {
  calculateScore(factors: ScoringFactors): number {
    const weights = {
      experience: 0.3,
      education: 0.2,
      skills: 0.25,
      reputation: 0.15,
      background: 0.1
    };

    const score = 
      factors.experience * weights.experience +
      factors.education * weights.education +
      factors.skills * weights.skills +
      factors.reputation * weights.reputation +
      factors.background * weights.background;

    return Math.min(100, Math.max(0, score * 100));
  }

  getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    return 'high';
  }

  getRecommendations(score: number, factors: ScoringFactors): string[] {
    const recommendations: string[] = [];
    
    if (factors.experience < 0.7) {
      recommendations.push('Verify work experience thoroughly');
    }
    if (factors.education < 0.7) {
      recommendations.push('Validate educational credentials');
    }
    if (factors.reputation < 0.6) {
      recommendations.push('Conduct additional reference checks');
    }
    if (factors.background < 0.8) {
      recommendations.push('Perform comprehensive background check');
    }

    return recommendations;
  }
}

export const scoringService = new ScoringService();

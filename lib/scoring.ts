// Scoring system for TrustHire Autonomous System
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

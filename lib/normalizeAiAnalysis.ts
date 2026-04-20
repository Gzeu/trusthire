// Normalize AI analysis for TrustHire Autonomous System
export interface NormalizedAnalysis {
  id: string;
  type: string;
  score: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  insights: string[];
  recommendations: string[];
  metadata: Record<string, any>;
  timestamp: string;
}

export interface RawAnalysis {
  [key: string]: any;
}

export class NormalizeAiAnalysis {
  normalize(rawAnalysis: RawAnalysis, type: string): NormalizedAnalysis {
    return {
      id: this.generateId(),
      type,
      score: this.normalizeScore(rawAnalysis.score || rawAnalysis.riskScore || 0),
      confidence: this.normalizeConfidence(rawAnalysis.confidence || 0),
      riskLevel: this.determineRiskLevel(rawAnalysis.score || rawAnalysis.riskScore || 0),
      insights: this.normalizeInsights(rawAnalysis.insights || rawAnalysis.analysis || []),
      recommendations: this.normalizeRecommendations(rawAnalysis.recommendations || []),
      metadata: this.extractMetadata(rawAnalysis),
      timestamp: new Date().toISOString()
    };
  }

  normalizeBatch(rawAnalyses: RawAnalysis[], type: string): NormalizedAnalysis[] {
    return rawAnalyses.map(analysis => this.normalize(analysis, type));
  }

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private normalizeScore(score: number): number {
    return Math.min(100, Math.max(0, score * 100));
  }

  private normalizeConfidence(confidence: number): number {
    return Math.min(1, Math.max(0, confidence));
  }

  private determineRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 70) return 'low';
    if (score >= 40) return 'medium';
    return 'high';
  }

  private normalizeInsights(insights: any[]): string[] {
    if (Array.isArray(insights)) {
      return insights.map(insight => 
        typeof insight === 'string' ? insight : JSON.stringify(insight)
      );
    }
    return [];
  }

  private normalizeRecommendations(recommendations: any[]): string[] {
    if (Array.isArray(recommendations)) {
      return recommendations.map(rec => 
        typeof rec === 'string' ? rec : rec.text || JSON.stringify(rec)
      );
    }
    return [];
  }

  private extractMetadata(rawAnalysis: RawAnalysis): Record<string, any> {
    const metadata = { ...rawAnalysis };
    
    // Remove fields that are already handled
    delete metadata.score;
    delete metadata.riskScore;
    delete metadata.confidence;
    delete metadata.insights;
    delete metadata.analysis;
    delete metadata.recommendations;
    
    return metadata;
  }

  aggregateAnalyses(analyses: NormalizedAnalysis[]): {
    averageScore: number;
    averageConfidence: number;
    riskDistribution: Record<string, number>;
    totalInsights: number;
    totalRecommendations: number;
  } {
    if (analyses.length === 0) {
      return {
        averageScore: 0,
        averageConfidence: 0,
        riskDistribution: { low: 0, medium: 0, high: 0 },
        totalInsights: 0,
        totalRecommendations: 0
      };
    }

    const averageScore = analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length;
    const averageConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;
    
    const riskDistribution = analyses.reduce((dist, a) => {
      dist[a.riskLevel] = (dist[a.riskLevel] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);

    const totalInsights = analyses.reduce((sum, a) => sum + a.insights.length, 0);
    const totalRecommendations = analyses.reduce((sum, a) => sum + a.recommendations.length, 0);

    return {
      averageScore,
      averageConfidence,
      riskDistribution,
      totalInsights,
      totalRecommendations
    };
  }
}

export const normalizeAiAnalysis = new NormalizeAiAnalysis();

'use client';

import { Brain, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import EnhancedLoadingState from './EnhancedLoadingStates';
import EnhancedScoreGauge from './EnhancedScoreGauge';

interface AIAnalysisData {
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    reasoning: string;
  };
  codeAnalysis: {
    suspiciousPatterns: Array<{
      pattern: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      location?: string;
    }>;
    recommendations: string[];
  };
  profileAnalysis: {
    redFlags: string[];
    greenFlags: string[];
    inconsistencies: string[];
  };
  summary: {
    overallRisk: string;
    keyFindings: string[];
    nextSteps: string[];
  };
}

interface AIAnalysisCardProps {
  analysis: AIAnalysisData | null;
  isLoading?: boolean;
}

export default function AIAnalysisCard({ analysis, isLoading }: AIAnalysisCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-400" />
          <h2 className="font-mono font-bold text-white">AI Analysis</h2>
        </div>
        <div className="py-8">
          <EnhancedLoadingState
            type="spinner"
            size="lg"
            message="AI Analysis in Progress"
            submessage="Analyzing patterns and detecting threats..."
            variant="analysis"
          />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-white/30" />
          <h2 className="font-mono font-bold text-white/50">AI Analysis</h2>
        </div>
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/30 font-mono text-sm">AI analysis unavailable</p>
          <p className="text-white/20 font-mono text-xs mt-2">Using standard heuristic analysis</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-white/40';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400 border-green-400/20';
      case 'medium': return 'text-yellow-400 border-yellow-400/20';
      case 'high': return 'text-orange-400 border-orange-400/20';
      case 'critical': return 'text-red-400 border-red-400/20';
      default: return 'text-white/40 border-white/10';
    }
  };

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-5 h-5 text-blue-400" />
        <h2 className="font-mono font-bold">AI-Enhanced Analysis</h2>
        <div className="ml-auto">
          <span className={`text-xs font-mono font-bold ${getRiskColor(analysis.riskAssessment.level)}`}>
            {analysis.riskAssessment.level.toUpperCase()} RISK
          </span>
        </div>
      </div>

      {/* Score Gauge */}
      <div className="mb-6">
        <EnhancedScoreGauge
          score={Math.round(analysis.riskAssessment.confidence * 100)}
          label="Risk Score"
          sublabel="AI Confidence"
          size="md"
          riskLevel={analysis.riskAssessment.level}
          showDetails={true}
          metrics={[
            { label: 'Confidence', value: `${Math.round(analysis.riskAssessment.confidence * 100)}%`, color: 'text-white' },
            { label: 'Patterns', value: analysis.codeAnalysis.suspiciousPatterns.length, color: 'text-white' }
          ]}
        />
      </div>

      {/* Risk Assessment */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-white/60">AI Confidence</span>
          <span className="text-xs font-mono text-white/80">
            {(analysis.riskAssessment.confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2">
          <div 
            className="bg-blue-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${analysis.riskAssessment.confidence * 100}%` }}
          ></div>
        </div>
        <p className="text-xs font-mono text-white/60 mt-2">
          {analysis.riskAssessment.reasoning}
        </p>
      </div>

      {/* Code Analysis */}
      {analysis.codeAnalysis.suspiciousPatterns.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-mono font-bold text-white/80 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Suspicious Code Patterns
          </h3>
          <div className="space-y-2">
            {analysis.codeAnalysis.suspiciousPatterns.map((pattern, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${getSeverityColor(pattern.severity)}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-mono font-bold">{pattern.pattern}</span>
                  <span className={`text-xs font-mono ${getSeverityColor(pattern.severity)}`}>
                    {pattern.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-mono text-white/60">{pattern.description}</p>
                {pattern.location && (
                  <p className="text-xs font-mono text-white/40 mt-1">Location: {pattern.location}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Analysis */}
      <div className="mb-6">
        <h3 className="text-xs font-mono font-bold text-white/80 mb-3">Profile Analysis</h3>
        
        {analysis.profileAnalysis.redFlags.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono text-red-400">AI Red Flags</span>
            </div>
            <div className="space-y-1">
              {analysis.profileAnalysis.redFlags.map((flag, index) => (
                <div key={index} className="text-xs font-mono text-white/60 pl-6">
                  {flag}
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.profileAnalysis.greenFlags.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs font-mono text-green-400">Positive Indicators</span>
            </div>
            <div className="space-y-1">
              {analysis.profileAnalysis.greenFlags.map((flag, index) => (
                <div key={index} className="text-xs font-mono text-white/60 pl-6">
                  {flag}
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.profileAnalysis.inconsistencies.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-mono text-yellow-400">Inconsistencies</span>
            </div>
            <div className="space-y-1">
              {analysis.profileAnalysis.inconsistencies.map((inconsistency, index) => (
                <div key={index} className="text-xs font-mono text-white/60 pl-6">
                  {inconsistency}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Findings */}
      {analysis.summary.keyFindings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-mono font-bold text-white/80 mb-3">Key Findings</h3>
          <div className="space-y-2">
            {analysis.summary.keyFindings.map((finding, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <p className="text-xs font-mono text-white/60">{finding}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {analysis.summary.nextSteps.length > 0 && (
        <div>
          <h3 className="text-xs font-mono font-bold text-white/80 mb-3">Recommended Next Steps</h3>
          <div className="space-y-2">
            {analysis.summary.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-4 h-4 bg-blue-400/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-mono text-blue-400">{index + 1}</span>
                </div>
                <p className="text-xs font-mono text-white/60">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs font-mono text-white/30 text-center">
          Powered by Groq AI Analysis
        </p>
      </div>
    </div>
  );
}

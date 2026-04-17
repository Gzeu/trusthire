'use client';

export function AiAnalysisSection({ ai }: { ai: any }) {
  const hasSummary = Boolean(typeof ai?.summary === 'string' && ai?.summary?.trim()) || 
                     Boolean(typeof ai?.analysis === 'string' && ai?.analysis?.trim());
  const hasFindings = Array.isArray(ai?.findings) && ai?.findings?.length > 0;
  const hasNextSteps = Array.isArray(ai?.nextSteps) && ai?.nextSteps?.length > 0;
  const hasContent = hasSummary || hasFindings || hasNextSteps;
  const isPartial = ai?.status === 'partial' || ai?.available === false;

  if (!hasContent) {
    return (
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
        <h2 className="font-mono font-bold mb-4 flex items-center gap-2">
          <span className="text-white/50 text-sm">AI Analysis</span>
        </h2>
        <div className="text-center py-8">
          <p className="text-white/30 text-sm font-mono mb-2">AI analysis unavailable</p>
          <p className="text-white/20 text-xs font-mono">Using standard heuristic analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
      <h2 className="font-mono font-bold mb-4 flex items-center gap-2">
        <span className="text-white/50 text-sm">AI Analysis</span>
        {isPartial && (
          <span className="text-xs font-mono px-2 py-0.5 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
            Partial Analysis
          </span>
        )}
      </h2>
      
      {hasSummary && (
        <div className="mb-6">
          <h3 className="text-sm font-mono font-bold text-white/70 mb-3">Summary</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            {typeof ai?.summary === 'string' ? ai.summary : 
             typeof ai?.analysis === 'string' ? ai.analysis : 
             'Analysis content unavailable'}
          </p>
        </div>
      )}

      {hasFindings && (
        <div className="mb-6">
          <h3 className="text-sm font-mono font-bold text-white/70 mb-3">Key Findings</h3>
          <ul className="space-y-2">
            {ai.findings.map((finding: string, i: number) => (
              <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">{'\u2022'}</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasNextSteps && (
        <div className="mb-6">
          <h3 className="text-sm font-mono font-bold text-white/70 mb-3">Recommended Next Steps</h3>
          <ul className="space-y-2">
            {ai.nextSteps.map((step: string, i: number) => (
              <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ai?.riskAssessment && (
        <div className="border-t border-white/10 pt-4 mt-4">
          <h3 className="text-sm font-mono font-bold text-white/70 mb-3">Risk Assessment</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/40">Risk Level:</span>
              <span className="ml-2 font-mono text-white/80">
                {ai.riskAssessment.level?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
            <div>
              <span className="text-white/40">Confidence:</span>
              <span className="ml-2 font-mono text-white/80">
                {typeof ai.riskAssessment?.confidence === 'number' && 
                 !isNaN(ai.riskAssessment.confidence) && 
                 ai.riskAssessment.confidence >= 0 && 
                 ai.riskAssessment.confidence <= 1
                  ? `${(ai.riskAssessment.confidence * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
          {typeof ai?.riskAssessment?.reasoning === 'string' && ai?.riskAssessment.reasoning && (
            <div className="mt-3">
              <span className="text-white/40">Reasoning:</span>
              <p className="text-sm text-white/60 mt-1">{ai.riskAssessment.reasoning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

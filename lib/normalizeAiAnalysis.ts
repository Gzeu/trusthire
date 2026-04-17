export function normalizeAiAnalysis(ai: any) {
  const hasSummary = Boolean(typeof ai?.summary === 'string' && ai?.summary?.trim());
  const hasAnalysis = Boolean(typeof ai?.analysis === 'string' && ai?.analysis?.trim());
  const hasFindings = Array.isArray(ai?.findings) && ai?.findings?.length > 0;
  const hasNextSteps = Array.isArray(ai?.nextSteps) && ai?.nextSteps?.length > 0;
  const hasRiskAssessment = Boolean(typeof ai?.riskAssessment?.reasoning === 'string' && 
    ai?.riskAssessment?.reasoning?.trim() && 
    !ai?.riskAssessment?.reasoning?.includes('Unable to generate detailed assessment'));

  const hasContent = hasSummary || hasAnalysis || hasFindings || hasNextSteps || hasRiskAssessment;

  return {
    ...ai,
    status: hasContent ? (ai?.riskAssessment?.reasoning?.includes('Unable') ? 'partial' : 'complete') : 'unavailable',
    available: hasContent,
    hasContent,
    hasSummary,
    hasAnalysis,
    hasFindings,
    hasNextSteps,
    hasRiskAssessment
  };
}

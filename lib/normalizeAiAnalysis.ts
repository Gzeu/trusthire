export function normalizeAiAnalysis(ai: any) {
  const hasSummary = Boolean(ai?.summary?.trim());
  const hasAnalysis = Boolean(ai?.analysis?.trim());
  const hasFindings = (ai?.findings?.length ?? 0) > 0;
  const hasNextSteps = (ai?.nextSteps?.length ?? 0) > 0;
  const hasRiskAssessment = Boolean(ai?.riskAssessment?.reasoning?.trim() && !ai?.riskAssessment?.reasoning?.includes('Unable to generate detailed assessment'));

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

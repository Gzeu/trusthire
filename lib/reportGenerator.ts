import type { AssessmentResult } from './scoring'
import type { RepoScanResult } from './repoScanner'
import type { DomainCheckResult } from './domainChecker'

export function generateIncidentReport(params: {
  recruiterName: string
  company: string
  assessment: AssessmentResult
  repoScans?: RepoScanResult[]
  domainChecks?: DomainCheckResult[]
}): string {
  const { recruiterName, company, assessment, repoScans, domainChecks } = params
  const date = new Date().toISOString().split('T')[0]
  const time = new Date().toLocaleTimeString('en-US', { hour12: false })

  const verdictLabel = {
    low_risk: 'LOW RISK',
    caution: 'CAUTION',
    high_risk: 'HIGH RISK',
    critical: 'CRITICAL'
  }[assessment.verdict]

  const lines: string[] = [
    '='.repeat(60),
    'TRUSTHIRE SECURITY ASSESSMENT REPORT',
    `Generated: ${date} at ${time} UTC`,
    '='.repeat(60),
    '',
    `SUBJECT: ${recruiterName} — ${company}`,
    `FINAL SCORE: ${assessment.finalScore}/100`,
    `VERDICT: ${verdictLabel}`,
    '',
    'SCORE BREAKDOWN',
    '-'.repeat(40),
    `Identity Confidence:  ${assessment.scores.identityConfidence}/25`,
    `Employer Legitimacy:  ${assessment.scores.employerLegitimacy}/25`,
    `Process Legitimacy:   ${assessment.scores.processLegitimacy}/25`,
    `Technical Safety:     ${assessment.scores.technicalSafety}/25`,
    ''
  ]

  if (assessment.redFlags.length > 0) {
    lines.push('RED FLAGS DETECTED')
    lines.push('-'.repeat(40))
    for (const flag of assessment.redFlags) {
      const icon = flag.severity === 'critical' ? '🚨' : flag.severity === 'red_flag' ? '⚠️' : '⚡'
      lines.push(`${icon} [${flag.severity.toUpperCase()}] ${flag.signal}`)
      lines.push(`   ${flag.explanation}`)
      lines.push(`   → ${flag.recommendation}`)
      lines.push('')
    }
  }

  if (repoScans && repoScans.length > 0) {
    lines.push('REPOSITORY SCAN RESULTS')
    lines.push('-'.repeat(40))
    for (const scan of repoScans) {
      lines.push(`Repo: ${scan.owner}/${scan.repo} — Risk: ${scan.riskLevel.toUpperCase()}`)
      if (scan.repoAgeDays !== undefined) lines.push(`  Age: ${scan.repoAgeDays} days`)
      if (scan.dangerousScripts.length > 0) {
        lines.push(`  🚨 Dangerous lifecycle scripts:`)
        for (const s of scan.dangerousScripts) lines.push(`    - ${s}`)
      }
      if (scan.envExfiltrationRisk) lines.push('  🚨 Environment variable exfiltration pattern detected')
      if (scan.dynamicExecutionRisk) lines.push('  🚨 Dynamic code execution pattern detected')
      if (scan.typosquattedPackages.length > 0) lines.push(`  ⚠️ Possible typosquatted packages: ${scan.typosquattedPackages.join(', ')}`)
      lines.push('')
    }
  }

  if (domainChecks && domainChecks.length > 0) {
    lines.push('DOMAIN / URL CHECKS')
    lines.push('-'.repeat(40))
    for (const check of domainChecks) {
      lines.push(`Domain: ${check.domain} — Risk: ${check.riskLevel.toUpperCase()}`)
      for (const flag of check.riskFlags) lines.push(`  ⚠️ ${flag}`)
      if (check.vtPermalink) lines.push(`  VT Report: ${check.vtPermalink}`)
      lines.push('')
    }
  }

  lines.push('RECOMMENDED ACTIONS')
  lines.push('-'.repeat(40))
  for (const step of assessment.workflowAdvice) {
    lines.push(`${step.icon} [${step.priority.toUpperCase()}] ${step.title}`)
    lines.push(`   ${step.description}`)
    lines.push('')
  }

  lines.push('REPORT TO')
  lines.push('-'.repeat(40))
  lines.push('• GitHub abuse: https://github.com/contact/report-abuse')
  lines.push('• LinkedIn: Use "Report" button on the recruiter profile')
  lines.push('• Romania DNSC: https://dnsc.ro')
  lines.push('• USA CISA: https://www.cisa.gov/report')
  lines.push('• UK NCSC: https://www.ncsc.gov.uk/section/about-ncsc/report-incident')
  lines.push('')
  lines.push('DISCLAIMER')
  lines.push('-'.repeat(40))
  lines.push('This report provides risk signals, not legal verdicts.')
  lines.push('TrustHire does not access private data or verify identity definitively.')
  lines.push('Use this report as due diligence input, not as accusation evidence.')
  lines.push('='.repeat(60))

  return lines.join('\n')
}

export interface RecruiterInput {
  linkedinUrl?: string
  name: string
  claimedCompany: string
  emailReceived?: string
  recruiterMessages?: string
}

export interface JobInput {
  jobDescription?: string
  salaryMentioned?: boolean
  urgencySignals?: boolean
  askedToRunLocally?: boolean
  askedForWalletSeed?: boolean
  askedForKYC?: boolean
  conversationGeneric?: boolean
}

export interface ArtifactInput {
  type: 'github' | 'gitlab' | 'zip' | 'drive' | 'notion' | 'url' | 'shortlink'
  url: string
}

export interface AssessmentInput {
  recruiter: RecruiterInput
  job: JobInput
  artifacts: ArtifactInput[]
}

export interface RedFlag {
  category: 'identity' | 'employer' | 'process' | 'technical'
  severity: 'warning' | 'red_flag' | 'critical'
  signal: string
  explanation: string
  recommendation: string
}

export interface GreenSignal {
  category: 'identity' | 'employer' | 'process' | 'technical'
  signal: string
  explanation: string
}

export interface MissingEvidence {
  category: 'identity' | 'employer' | 'process' | 'technical'
  missing: string
  howToObtain: string
}

export interface WorkflowStep {
  action: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  description: string
  icon: string
}

export interface ScoreBreakdown {
  identityConfidence: number
  employerLegitimacy: number
  processLegitimacy: number
  technicalSafety: number
}

export type Verdict = 'low_risk' | 'caution' | 'high_risk' | 'critical'

export interface AssessmentResult {
  finalScore: number
  verdict: Verdict
  scores: ScoreBreakdown
  redFlags: RedFlag[]
  greenSignals: GreenSignal[]
  missingEvidence: MissingEvidence[]
  workflowAdvice: WorkflowStep[]
}

const GENERIC_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'protonmail.com', 'icloud.com', 'aol.com', 'mail.com'
]

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function isGenericEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() || ''
  return GENERIC_EMAIL_DOMAINS.some(d => domain === d)
}

function emailMatchesCompany(email: string, company: string): boolean {
  if (!email || !company) return false
  const emailDomain = email.split('@')[1]?.toLowerCase() || ''
  const companySlug = company.toLowerCase().replace(/[^a-z0-9]/g, '')
  return emailDomain.includes(companySlug.slice(0, 6)) || companySlug.includes(emailDomain.split('.')[0])
}

export function calculateScores(input: AssessmentInput): AssessmentResult {
  const redFlags: RedFlag[] = []
  const greenSignals: GreenSignal[] = []
  const missingEvidence: MissingEvidence[] = []

  // --- IDENTITY CONFIDENCE (0-25) ---
  let identity = 12 // start neutral
  const { recruiter } = input

  if (recruiter.linkedinUrl) {
    identity += 5
    greenSignals.push({
      category: 'identity',
      signal: 'LinkedIn profile provided',
      explanation: 'A LinkedIn profile was shared. This is a partial trust signal — not a guarantee of identity.'
    })
  } else {
    identity -= 8
    redFlags.push({
      category: 'identity',
      severity: 'red_flag',
      signal: 'No LinkedIn profile provided',
      explanation: 'The recruiter did not provide a LinkedIn profile URL, making identity verification impossible.',
      recommendation: 'Ask for their LinkedIn profile before proceeding.'
    })
    missingEvidence.push({
      category: 'identity',
      missing: 'LinkedIn profile URL',
      howToObtain: 'Ask the recruiter to share their LinkedIn profile link.'
    })
  }

  if (recruiter.emailReceived) {
    if (isGenericEmail(recruiter.emailReceived)) {
      identity -= 5
      redFlags.push({
        category: 'identity',
        severity: 'red_flag',
        signal: 'Generic email provider used',
        explanation: `The email "${recruiter.emailReceived}" uses a free provider. Legitimate companies use corporate email addresses.`,
        recommendation: 'Request communication from an official company email domain.'
      })
    } else if (emailMatchesCompany(recruiter.emailReceived, recruiter.claimedCompany)) {
      identity += 5
      greenSignals.push({
        category: 'identity',
        signal: 'Email aligns with company domain',
        explanation: 'The email domain appears to match the claimed company name.'
      })
    } else {
      identity -= 3
      redFlags.push({
        category: 'identity',
        severity: 'warning',
        signal: 'Email domain mismatch',
        explanation: 'The email domain does not clearly match the claimed company.',
        recommendation: 'Verify the company\'s official website and check the email domain matches.'
      })
    }
  } else {
    missingEvidence.push({
      category: 'identity',
      missing: 'Contact email address',
      howToObtain: 'Ask for the recruiter\'s official company email address.'
    })
  }

  // --- EMPLOYER LEGITIMACY (0-25) ---
  let employer = 10
  const companyWordCount = recruiter.claimedCompany.trim().split(/\s+/).length

  if (companyWordCount >= 2) {
    employer += 3
    greenSignals.push({
      category: 'employer',
      signal: 'Company name appears specific',
      explanation: 'The claimed company name has multiple words, suggesting a real organization.'
    })
  } else {
    employer -= 3
    redFlags.push({
      category: 'employer',
      severity: 'warning',
      signal: 'Vague company name',
      explanation: 'The company name is very short or generic, which is harder to verify.',
      recommendation: 'Search for the company on LinkedIn, Crunchbase, and their official website.'
    })
  }

  if (recruiter.emailReceived && !isGenericEmail(recruiter.emailReceived)) {
    employer += 4
  } else if (!recruiter.emailReceived) {
    employer -= 4
    missingEvidence.push({
      category: 'employer',
      missing: 'Company website or official domain',
      howToObtain: 'Search the company name + "official website" and verify the domain.'
    })
  }

  if (input.job.jobDescription && input.job.jobDescription.length > 100) {
    employer += 4
  }

  // --- PROCESS LEGITIMACY (0-25) ---
  let process = 15

  if (input.job.askedToRunLocally) {
    process -= 8
    redFlags.push({
      category: 'process',
      severity: 'critical',
      signal: 'Pressure to run code locally',
      explanation: 'The recruiter is pressuring you to run unknown code on your machine. This is the primary delivery vector for credential theft and malware.',
      recommendation: 'Do NOT run any code locally. Use an isolated VM or online sandbox. Perform static analysis only.'
    })
  }

  if (input.job.askedForWalletSeed) {
    process -= 10
    redFlags.push({
      category: 'process',
      severity: 'critical',
      signal: 'Wallet or seed phrase requested',
      explanation: 'A legitimate employer will NEVER ask for your seed phrase, private key, or wallet credentials during recruitment.',
      recommendation: 'Immediately stop communication. Never share seed phrases or private keys with anyone.'
    })
  }

  if (input.job.askedForKYC) {
    process -= 6
    redFlags.push({
      category: 'process',
      severity: 'red_flag',
      signal: 'Premature KYC or document request',
      explanation: 'Requesting personal documents before any formal offer or contract is unusual and suspicious.',
      recommendation: 'Do not share ID documents until a formal offer is signed with a verified company.'
    })
  }

  if (input.job.urgencySignals) {
    process -= 6
    redFlags.push({
      category: 'process',
      severity: 'red_flag',
      signal: 'Artificial urgency detected',
      explanation: 'Creating time pressure is a classic social engineering tactic to prevent due diligence.',
      recommendation: 'Ignore artificial deadlines. Any legitimate opportunity will allow time for proper verification.'
    })
  }

  if (input.job.conversationGeneric) {
    process -= 5
    redFlags.push({
      category: 'process',
      severity: 'warning',
      signal: 'Generic or copy-paste conversation style',
      explanation: 'Scripted or overly templated messages may indicate an automated scam campaign.',
      recommendation: 'Ask specific questions about the role and company to test authenticity.'
    })
  }

  if (input.job.jobDescription && input.job.jobDescription.length > 200) {
    process += 5
    greenSignals.push({
      category: 'process',
      signal: 'Detailed job description provided',
      explanation: 'A detailed job description suggests a real, structured hiring process.'
    })
  } else {
    missingEvidence.push({
      category: 'process',
      missing: 'Public job listing',
      howToObtain: 'Ask for the job posting URL on the company\'s official careers page or LinkedIn.'
    })
  }

  if (input.job.salaryMentioned) {
    greenSignals.push({
      category: 'process',
      signal: 'Salary range mentioned',
      explanation: 'Mentioning salary is common in legitimate outreach, though not conclusive.'
    })
  }

  // --- TECHNICAL SAFETY (0-25) ---
  // Base score — adjusted by repo scan results added later
  let technical = 20

  const hasGithubArtifact = input.artifacts.some(a =>
    a.url.includes('github.com') || a.url.includes('gitlab.com')
  )

  if (!hasGithubArtifact && input.artifacts.length === 0) {
    greenSignals.push({
      category: 'technical',
      signal: 'No repository or code links provided yet',
      explanation: 'No technical artifacts to scan at this time. Score reflects identity and process signals only.'
    })
    missingEvidence.push({
      category: 'technical',
      missing: 'Repository or code artifact',
      howToObtain: 'If the recruiter sends a GitHub/GitLab repo, paste the URL here for scanning.'
    })
  }

  const hasShortlink = input.artifacts.some(a =>
    /bit\.ly|tinyurl|t\.co|is\.gd|goo\.gl|ow\.ly/.test(a.url)
  )
  if (hasShortlink) {
    technical -= 6
    redFlags.push({
      category: 'technical',
      severity: 'red_flag',
      signal: 'Shortlink / redirect URL detected',
      explanation: 'Shortened URLs hide the real destination and are commonly used in phishing attacks.',
      recommendation: 'Expand the link using a service like checkshorturl.com before clicking.'
    })
  }

  // Clamp all scores
  const scores: ScoreBreakdown = {
    identityConfidence: clamp(identity, 0, 25),
    employerLegitimacy: clamp(employer, 0, 25),
    processLegitimacy: clamp(process, 0, 25),
    technicalSafety: clamp(technical, 0, 25)
  }

  const finalScore = scores.identityConfidence + scores.employerLegitimacy + scores.processLegitimacy + scores.technicalSafety

  let verdict: Verdict
  if (finalScore >= 80) verdict = 'low_risk'
  else if (finalScore >= 55) verdict = 'caution'
  else if (finalScore >= 30) verdict = 'high_risk'
  else verdict = 'critical'

  const workflowAdvice = generateWorkflowAdvice(redFlags, verdict)

  return { finalScore, verdict, scores, redFlags, greenSignals, missingEvidence, workflowAdvice }
}

function generateWorkflowAdvice(redFlags: RedFlag[], verdict: Verdict): WorkflowStep[] {
  const steps: WorkflowStep[] = []
  const hasCritical = redFlags.some(f => f.severity === 'critical')
  const hasWalletFlag = redFlags.some(f => f.signal.includes('seed') || f.signal.includes('wallet'))
  const hasRunLocalFlag = redFlags.some(f => f.signal.includes('run code locally'))

  if (hasWalletFlag) {
    steps.push({
      action: 'stop_interaction',
      priority: 'urgent',
      title: 'Stop communication immediately',
      description: 'A request for wallet credentials or seed phrases is an absolute red line. No legitimate employer ever needs these.',
      icon: '🛑'
    })
  }

  if (hasRunLocalFlag || hasCritical) {
    steps.push({
      action: 'do_not_run_locally',
      priority: 'urgent',
      title: 'Do NOT run this code locally',
      description: 'Running unknown code on your machine can result in credential theft, .env exfiltration, and persistent backdoors.',
      icon: '⛔'
    })
    steps.push({
      action: 'use_vm_sandbox',
      priority: 'high',
      title: 'Use an isolated VM or online sandbox',
      description: 'If you must review code, use a disposable VM (VirtualBox, VMware, Tails OS) with no access to your real credentials.',
      icon: '🔒'
    })
  }

  steps.push({
    action: 'verify_job_listing',
    priority: 'high',
    title: 'Verify job on company official website',
    description: 'Search the company name + "careers" or "jobs" on Google and verify the role exists independently of the recruiter.',
    icon: '🔍'
  })

  steps.push({
    action: 'request_more_proof',
    priority: 'medium',
    title: 'Request official contact verification',
    description: 'Ask for a video call, official company email, and LinkedIn profile connected to the company page.',
    icon: '📋'
  })

  if (verdict === 'critical' || verdict === 'high_risk') {
    steps.push({
      action: 'report_profile',
      priority: 'medium',
      title: 'Consider reporting the profile',
      description: 'If you believe this is a scam attempt, report the LinkedIn profile and any GitHub repos to protect other developers.',
      icon: '🚩'
    })
  }

  steps.push({
    action: 'rotate_secrets',
    priority: verdict === 'critical' ? 'urgent' : 'low',
    title: 'Rotate secrets if you ran any code',
    description: 'If you already ran any code from this recruiter, immediately rotate all secrets: API keys, .env variables, SSH keys, wallet credentials.',
    icon: '🔄'
  })

  return steps
}

import { AssessmentInput, RedFlag, ScoreBreakdown, WorkflowStep, Verdict, RepoScanResult, DomainCheckResult } from '@/types';

const GENERIC_EMAILS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'protonmail.com', 'icloud.com'];
const HIGH_RISK_MESSAGE_PATTERNS = [
  'urgent opportunity', 'immediate start', 'download and run', 'clone and execute',
  'wallet verification', 'seed phrase', 'private key', 'telegram interview',
  'complete the form', 'assessment repository', 'test assignment repo', 'quick task for payment'
];

export function calculateScores(
  input: AssessmentInput,
  repoScans: RepoScanResult[],
  domainChecks: DomainCheckResult[]
): ScoreBreakdown {
  let identity = 13;
  let employer = 13;
  let process = 13;
  let technical = 25;

  const { recruiter, job } = input;
  const combinedMessage = `${recruiter.sampleMessage || ''} ${recruiter.recruiterMessages || ''}`.toLowerCase();

  if (recruiter.linkedinUrl) identity += 5;
  else identity -= 8;

  if (recruiter.emailReceived) {
    const email = recruiter.emailReceived.toLowerCase();
    const company = recruiter.claimedCompany.toLowerCase().replace(/\s+/g, '');
    const domain = email.split('@')[1] || '';

    if (GENERIC_EMAILS.includes(domain)) identity -= 6;
    else if (company && domain.includes(company.slice(0, Math.min(5, company.length)))) identity += 5;
    else identity += 1;

    if (/20(24|25|26|27)/.test(email)) identity -= 8;
    if (email.includes('temp') || email.includes('test') || email.includes('verify')) identity -= 10;
    if (email.includes('recruiter') || email.includes('hr')) identity -= 2;
  } else {
    identity -= 4;
  }

  if (recruiter.profileAge) {
    const joinedDate = new Date(recruiter.profileAge);
    const now = new Date();
    const profileAgeMonths = (now.getFullYear() - joinedDate.getFullYear()) * 12 + (now.getMonth() - joinedDate.getMonth());
    if (profileAgeMonths < 3) identity -= 15;
    else if (profileAgeMonths < 6) identity -= 10;
    else if (profileAgeMonths < 12) identity -= 5;
    else identity += 5;
  }

  if (recruiter.connections && recruiter.connections > 0) {
    const title = recruiter.jobTitle?.toLowerCase() || '';
    const isSeniorRecruiter = title.includes('senior') || title.includes('lead') || title.includes('principal') || title.includes('head');
    if (isSeniorRecruiter) {
      if (recruiter.connections < 300) identity -= 10;
      else if (recruiter.connections >= 500) identity += 5;
    } else {
      if (recruiter.connections < 100) identity -= 8;
      else if (recruiter.connections >= 300) identity += 3;
    }
  } else {
    identity -= 3;
  }

  if (recruiter.hasVerifiedBadge) identity += 4;

  const suspiciousMessageHits = HIGH_RISK_MESSAGE_PATTERNS.filter((k) => combinedMessage.includes(k)).length;
  identity -= Math.min(10, suspiciousMessageHits * 2);

  identity = Math.min(25, Math.max(0, identity));

  if (recruiter.claimedCompany.split(' ').length >= 2) employer += 3;
  if (recruiter.claimedCompany.length < 3) employer -= 10;

  if (recruiter.emailReceived) {
    const domain = recruiter.emailReceived.split('@')[1] || '';
    if (!GENERIC_EMAILS.includes(domain)) employer += 4;
    else employer -= 6;
  }

  for (const dc of domainChecks) {
    if (dc.vtMalicious && dc.vtMalicious > 0) employer -= 12;
    if (dc.isBrandSpoofing) employer -= 10;
    if (dc.hasSuspiciousTLD) employer -= 6;
    if (dc.riskFlags.length >= 3) employer -= 5;
    if (dc.domainAgeYears !== null && dc.domainAgeYears !== undefined && dc.domainAgeYears < 1) employer -= 5;
  }

  employer = Math.min(25, Math.max(0, employer));

  if (job.jobDescription && job.jobDescription.length > 200) process += 5;
  else process -= 6;

  if (job.runCodeLocally) process -= 10;
  if (job.walletSeedKycRequest) process -= 12;
  if (job.urgencySignals) process -= 8;
  if (job.salaryMentioned) process -= 1;

  if (combinedMessage.includes('telegram') || combinedMessage.includes('whatsapp')) process -= 6;
  if (combinedMessage.includes('google form') || combinedMessage.includes('typeform')) process -= 5;
  if (combinedMessage.includes('complete the form') || combinedMessage.includes('move to next step')) process -= 5;
  if (combinedMessage.includes('various roles')) process -= 4;
  if (combinedMessage.length > 300) process += 2;
  if (recruiter.recruiterMessages && recruiter.recruiterMessages.length < 30) process -= 5;

  process = Math.min(25, Math.max(0, process));

  for (const scan of repoScans) {
    if (scan.riskLevel === 'critical') technical -= 16;
    else if (scan.riskLevel === 'warning') technical -= 8;

    if (scan.dangerousScripts.length > 0) technical -= 10;
    if (scan.repoAge !== undefined && scan.repoAge < 14) technical -= 4;
    if (scan.stars === 0 && scan.forks === 0 && scan.repoAge !== undefined && scan.repoAge < 30) technical -= 4;

    for (const pm of scan.patternMatches) {
      if (pm.severity === 'critical') technical -= 5;
      else if (pm.severity === 'high') technical -= 3;
      else if (pm.severity === 'medium') technical -= 1;
    }
  }

  technical = Math.min(25, Math.max(0, technical));

  return {
    identityConfidence: identity,
    employerLegitimacy: employer,
    processLegitimacy: process,
    technicalSafety: technical,
  };
}

export function getVerdict(score: number): Verdict {
  if (score >= 80) return 'low_risk';
  if (score >= 55) return 'caution';
  if (score >= 30) return 'high_risk';
  return 'critical';
}

export function generateRedFlags(
  input: AssessmentInput,
  repoScans: RepoScanResult[],
  domainChecks: DomainCheckResult[]
): RedFlag[] {
  const flags: RedFlag[] = [];
  const { recruiter, job } = input;
  const combinedMessage = `${recruiter.sampleMessage || ''} ${recruiter.recruiterMessages || ''}`.toLowerCase();

  if (job.walletSeedKycRequest) {
    flags.push({
      category: 'process', severity: 'critical',
      signal: 'Wallet / seed phrase / KYC requested',
      explanation: 'Legitimate employers never ask for crypto wallet access, seed phrases, private keys, or sensitive KYC documents during early recruitment.',
      recommendation: 'Immediately stop communication and do not share any credentials or identity documents.',
    });
  }

  if (job.runCodeLocally) {
    flags.push({
      category: 'process', severity: 'critical',
      signal: 'Pressure to run code locally',
      explanation: 'Running untrusted code locally is one of the most common delivery methods for info-stealers in fake technical assessments.',
      recommendation: 'Do not run any code locally. Only inspect inside an isolated VM or trusted online sandbox.',
    });
  }

  if (job.urgencySignals) {
    flags.push({
      category: 'process', severity: 'red_flag',
      signal: 'Urgency pressure detected',
      explanation: 'Artificial time pressure is a classic social engineering tactic used to reduce careful verification.',
      recommendation: 'Slow down and verify all claims independently before taking action.',
    });
  }

  if (!job.jobDescription || job.jobDescription.length < 100) {
    flags.push({
      category: 'process', severity: 'warning',
      signal: 'Vague or missing job description',
      explanation: 'Legitimate offers usually include role scope, requirements, and responsibilities in writing.',
      recommendation: 'Request a formal job description from the company careers page or official recruiter email.',
    });
  }

  if (!recruiter.linkedinUrl) {
    flags.push({
      category: 'identity', severity: 'warning',
      signal: 'No LinkedIn profile provided',
      explanation: 'Without a verifiable professional profile, recruiter identity confidence is significantly lower.',
      recommendation: 'Ask for a LinkedIn profile URL and verify profile age, activity, and mutual connections.',
    });
  }

  if (recruiter.emailReceived) {
    const domain = recruiter.emailReceived.split('@')[1] || '';
    if (GENERIC_EMAILS.includes(domain)) {
      flags.push({
        category: 'identity', severity: 'red_flag',
        signal: 'Generic email for corporate claim',
        explanation: `A recruiter claiming to work at "${recruiter.claimedCompany}" is using a free personal email address.`,
        recommendation: 'Request communication from the official company domain.',
      });
    }
  }

  if (combinedMessage.includes('telegram') || combinedMessage.includes('whatsapp')) {
    flags.push({
      category: 'process', severity: 'red_flag',
      signal: 'Off-platform communication requested',
      explanation: 'Moving recruiting conversations to Telegram or WhatsApp is common in scam workflows because it reduces accountability.',
      recommendation: 'Keep communication on official channels such as company email or verified LinkedIn accounts.',
    });
  }

  if (combinedMessage.includes('google form') || combinedMessage.includes('typeform') || combinedMessage.includes('complete the form')) {
    flags.push({
      category: 'process', severity: 'warning',
      signal: 'External form submission requested early',
      explanation: 'Scammers often rush targets into forms to collect personal details before trust is established.',
      recommendation: 'Do not submit private information until the job and employer are independently verified.',
    });
  }

  for (const dc of domainChecks) {
    if (dc.vtMalicious && dc.vtMalicious > 0) {
      flags.push({
        category: 'technical', severity: 'critical',
        signal: `VirusTotal: ${dc.vtMalicious} engines flagged ${dc.domain} as malicious`,
        explanation: 'The domain has already been identified as malicious by security vendors.',
        recommendation: 'Do not open or interact with this domain.',
      });
    }
    if (dc.isBrandSpoofing) {
      flags.push({
        category: 'employer', severity: 'critical',
        signal: `Brand spoofing detected: ${dc.domain}`,
        explanation: 'The domain appears to impersonate a legitimate brand or typosquat a known company.',
        recommendation: 'Verify the official domain directly through the company website or public documentation.',
      });
    }
    if (dc.isShortlink) {
      flags.push({
        category: 'technical', severity: 'red_flag',
        signal: 'Shortlink URL detected',
        explanation: 'Shortened links conceal the real destination and are frequently used in phishing campaigns.',
        recommendation: 'Expand and inspect the URL before visiting.',
      });
    }
    if (dc.riskFlags.length >= 3) {
      flags.push({
        category: 'employer', severity: 'red_flag',
        signal: `Multiple domain risk indicators on ${dc.domain}`,
        explanation: 'The domain triggered several independent warning signals, increasing the likelihood of abuse.',
        recommendation: 'Treat the employer claim as unverified until confirmed through official channels.',
      });
    }
  }

  for (const scan of repoScans) {
    if (scan.dangerousScripts.length > 0) {
      flags.push({
        category: 'technical', severity: 'critical',
        signal: `Dangerous lifecycle scripts: ${scan.dangerousScripts.join(', ')}`,
        explanation: 'Lifecycle scripts can execute automatically during installation and are frequently abused for silent payload delivery.',
        recommendation: 'Do not install dependencies locally before full manual review.',
      });
    }

    for (const pm of scan.patternMatches.filter((p) => p.severity === 'critical')) {
      flags.push({
        category: 'technical', severity: 'critical',
        signal: `Malicious pattern: ${pm.pattern} in ${pm.file}`,
        explanation: 'This code pattern is strongly associated with code execution, credential theft, or payload download behavior.',
        recommendation: 'Do not run this repository. Consider reporting it to GitHub.',
      });
    }

    if (scan.patternMatches.some((p) => p.pattern.startsWith('suspicious_dependency:'))) {
      flags.push({
        category: 'technical', severity: 'red_flag',
        signal: 'Suspicious dependency detected',
        explanation: 'The repository depends on a package name that resembles known typosquatting or impersonation behavior.',
        recommendation: 'Verify every dependency manually against npm and inspect the lockfile before installation.',
      });
    }

    if (scan.repoAge !== undefined && scan.repoAge < 14) {
      flags.push({
        category: 'technical', severity: 'red_flag',
        signal: 'Repository created less than 2 weeks ago',
        explanation: 'Fresh repositories with little history are common in malicious assessment campaigns.',
        recommendation: 'Ask for a long-lived company repository or a public code sample with verifiable history.',
      });
    }
  }

  return flags;
}

export function generateGreenSignals(
  input: AssessmentInput,
  repoScans: RepoScanResult[],
  domainChecks: DomainCheckResult[]
): string[] {
  const signals: string[] = [];
  const { recruiter, job } = input;

  if (recruiter.linkedinUrl) signals.push('LinkedIn profile URL provided');
  if (recruiter.emailReceived) {
    const domain = recruiter.emailReceived.split('@')[1] || '';
    if (!GENERIC_EMAILS.includes(domain)) signals.push(`Corporate email domain: ${domain}`);
  }
  if (job.jobDescription && job.jobDescription.length > 200) signals.push('Detailed job description provided');
  if (!job.walletSeedKycRequest) signals.push('No wallet or seed phrase requests detected');
  if (!job.runCodeLocally) signals.push('No pressure to run unknown code locally');
  if (!job.urgencySignals) signals.push('No urgency pressure detected');

  for (const scan of repoScans) {
    if (scan.dangerousScripts.length === 0) signals.push('No dangerous lifecycle scripts detected');
    if (scan.patternMatches.length === 0) signals.push('No suspicious code patterns detected in scanned files');
    if (scan.repoAge !== undefined && scan.repoAge > 180) signals.push(`Repository has established history (${scan.repoAge} days old)`);
  }

  for (const dc of domainChecks) {
    if (dc.vtMalicious === 0) signals.push(`${dc.domain} has no VirusTotal malicious detections`);
    if (!dc.isShortlink && !dc.hasSuspiciousTLD && !dc.isBrandSpoofing) signals.push(`${dc.domain} passed core domain checks`);
  }

  if (signals.length === 0) {
    signals.push('Basic assessment completed without immediate high-confidence malicious indicators');
  }

  return signals;
}

export function generateMissingEvidence(input: AssessmentInput): string[] {
  const missing: string[] = [];
  const { recruiter, job } = input;

  if (!recruiter.linkedinUrl) missing.push('LinkedIn profile URL not provided');
  if (!recruiter.emailReceived) missing.push('No corporate email address received');
  if (!job.jobDescription || job.jobDescription.length < 50) missing.push('Formal job description not provided');
  if (!recruiter.recruiterMessages || recruiter.recruiterMessages.length < 50) missing.push('Recruiter conversation history not provided');

  missing.push('Public job listing on company website not verified');
  missing.push('Video call with official company email confirmation not performed');
  missing.push('Company registration and business verification not completed');
  missing.push('Employee references or internal referrals not verified');
  missing.push('Technical interview with a verifiable team member not completed');

  return missing;
}

export function generateWorkflowAdvice(verdict: Verdict, flags: RedFlag[]): WorkflowStep[] {
  const steps: WorkflowStep[] = [];
  const hasCritical = flags.some((f) => f.severity === 'critical');
  const hasWallet = flags.some((f) => /wallet|seed/i.test(f.signal));
  const hasRunCode = flags.some((f) => /run code|locally/i.test(f.signal));
  const hasRepoRisk = flags.some((f) => f.category === 'technical' && f.severity === 'critical');
  const hasVTMalicious = flags.some((f) => f.signal.includes('VirusTotal'));

  if (hasWallet) {
    steps.push({ action: 'stop_interaction', priority: 'urgent', description: 'Immediately stop communication. Never share wallet credentials, seed phrases, private keys, or KYC documents.' });
    steps.push({ action: 'rotate_secrets', priority: 'urgent', description: 'If anything sensitive was shared, rotate wallet keys, API keys, passwords, session tokens, and SSH credentials immediately.' });
  }

  if (hasRunCode || hasRepoRisk) {
    steps.push({ action: 'do_not_run_locally', priority: 'urgent', description: 'Do not run npm install, pnpm install, pip install, shell scripts, or setup scripts on your local machine.' });
    steps.push({ action: 'use_vm_sandbox', priority: 'high', description: 'If code review is required, only inspect it inside an isolated VM or disposable sandbox with no access to real credentials.' });
    steps.push({ action: 'report_repository', priority: 'high', description: 'Report the suspicious repository to GitHub with details about the dangerous scripts or malicious patterns detected.' });
  }

  if (hasVTMalicious) {
    steps.push({ action: 'report_profile', priority: 'high', description: 'Report the recruiter profile or sender account because the associated infrastructure was flagged by security vendors.' });
  }

  steps.push({ action: 'request_more_proof', priority: 'medium', description: 'Request a video call, official company email confirmation, and a public job listing on the company website.' });
  steps.push({ action: 'request_more_proof', priority: 'medium', description: 'Verify the company through official domains, legal registration records, and real employee profiles.' });
  steps.push({ action: 'safe_to_proceed', priority: 'low', description: 'Keep a record of all recruiter messages, links, and repositories for auditability.' });

  if (verdict === 'low_risk' && !hasCritical) {
    steps.push({ action: 'safe_to_proceed', priority: 'low', description: 'No critical flags were detected. Proceed with normal professional caution and independent verification.' });
  }

  return steps;
}

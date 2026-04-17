import { AssessmentInput, RedFlag, ScoreBreakdown, WorkflowStep, Verdict, RepoScanResult, DomainCheckResult } from '@/types';

export function calculateScores(
  input: AssessmentInput,
  repoScans: RepoScanResult[],
  domainChecks: DomainCheckResult[]
): ScoreBreakdown {
  let identity = 13; // neutral start
  let employer = 13;
  let process = 13;
  let technical = 25; // starts full, deductions apply

  const { recruiter, job } = input;

  // ---- IDENTITY CONFIDENCE ----
  if (recruiter.linkedinUrl) identity += 5;
  else identity -= 8;

  if (recruiter.emailReceived) {
    const email = recruiter.emailReceived.toLowerCase();
    const company = recruiter.claimedCompany.toLowerCase().replace(/\s+/g, '');
    const domain = email.split('@')[1] || '';
    const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'protonmail.com'];
    if (genericDomains.includes(domain)) {
      identity -= 5;
    } else if (domain.includes(company.slice(0, 4))) {
      identity += 5;
    } else {
      identity += 2;
    }
    
    // Check for suspicious email patterns
    if (/20(24|25|26)/.test(email)) identity -= 8; // Years in email
    if (email.includes('recruiter') || email.includes('hr')) identity -= 3; // Generic role emails
    if (email.includes('temp') || email.includes('test')) identity -= 10; // Temporary emails
  } else {
    identity -= 3;
  }

  // LinkedIn profile analysis
  if (recruiter.profileAge) {
    const joinedDate = new Date(recruiter.profileAge);
    const now = new Date();
    const profileAgeMonths = (now.getFullYear() - joinedDate.getFullYear()) * 12 + 
                            (now.getMonth() - joinedDate.getMonth());
    
    if (profileAgeMonths < 3) identity -= 15;
    else if (profileAgeMonths < 6) identity -= 10;
    else if (profileAgeMonths < 12) identity -= 5;
    else identity += 5;
  }

  // Connections analysis
  if (recruiter.connections && recruiter.connections > 0) {
    const isSeniorRecruiter = recruiter.jobTitle?.toLowerCase().includes('senior') || 
                            recruiter.jobTitle?.toLowerCase().includes('lead') || 
                            recruiter.jobTitle?.toLowerCase().includes('principal');
    
    if (isSeniorRecruiter) {
      if (recruiter.connections < 300) identity -= 10;
      else if (recruiter.connections < 500) identity += 0;
      else identity += 5;
    } else {
      if (recruiter.connections < 100) identity -= 8;
      else if (recruiter.connections < 300) identity -= 3;
      else identity += 3;
    }
  }

  // Verification badge
  if (recruiter.hasVerifiedBadge) identity += 5;
  else identity -= 3;

  // Sample message analysis
  if (recruiter.sampleMessage) {
    const message = recruiter.sampleMessage.toLowerCase();
    const scamKeywords = [
      'technical assessment', 'culture fit', 'growth strategies', 
      'defi ecosystem', 'innovative solutions', 'urgent opportunity',
      'immediate start', 'competitive package', 'revolutionary'
    ];
    const foundKeywords = scamKeywords.filter(keyword => message.includes(keyword));
    identity -= foundKeywords.length * 3;
  }

  identity = Math.min(25, Math.max(0, identity));

  // ---- EMPLOYER LEGITIMACY ----
  if (recruiter.claimedCompany.split(' ').length >= 2) employer += 3;
  if (recruiter.claimedCompany.length < 3) employer -= 10;

  if (recruiter.emailReceived) {
    const domain = recruiter.emailReceived.split('@')[1] || '';
    const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    if (!genericDomains.includes(domain)) employer += 4;
    else employer -= 5;
  }

  // Domain checks
  for (const dc of domainChecks) {
    if (dc.vtMalicious && dc.vtMalicious > 0) employer -= 12;
    if (dc.isBrandSpoofing) employer -= 8;
    if (dc.hasSuspiciousTLD) employer -= 5;
    if (dc.domainAgeYears !== null && dc.domainAgeYears !== undefined && dc.domainAgeYears < 1) employer -= 4;
  }

  employer = Math.min(25, Math.max(0, employer));

  // ---- PROCESS LEGITIMACY ----
  if (job.jobDescription && job.jobDescription.length > 200) process += 5;
  else process -= 5;

  if (job.runCodeLocally) process -= 8;
  if (job.walletSeedKycRequest) process -= 10;
  if (job.urgencySignals) process -= 6;
  if (job.salaryMentioned) process -= 2; // minor flag

  // Analyze sample message for process legitimacy
  if (recruiter.sampleMessage) {
    const message = recruiter.sampleMessage.toLowerCase();
    
    // Check for suspicious process patterns
    const processFlags = [
      'technical assessment',
      'culture fit interview', 
      'background verification',
      'hiring process includes',
      'move to next step'
    ];
    
    const foundFlags = processFlags.filter(flag => message.includes(flag));
    process -= foundFlags.length * 4;
    
    // Check for generic company descriptions
    if (message.includes('leading custom development company') || 
        message.includes('advanced defi ecosystem solutions') ||
        message.includes('innovative defi projects')) {
      process -= 6;
    }
    
    // Check for vague role descriptions
    if (message.includes('various roles') || 
        message.includes('please find roles details in form')) {
      process -= 4;
    }
    
    // Bonus for detailed job descriptions
    if (message.length > 300) process += 3;
  }

  if (recruiter.recruiterMessages && recruiter.recruiterMessages.length > 100) process += 3;
  else if (recruiter.recruiterMessages && recruiter.recruiterMessages.length < 30) process -= 5;

  process = Math.min(25, Math.max(0, process));

  // ---- TECHNICAL SAFETY ----
  for (const scan of repoScans) {
    if (scan.riskLevel === 'critical') technical -= 15;
    else if (scan.riskLevel === 'warning') technical -= 7;

    if (scan.dangerousScripts.length > 0) technical -= 10;
    if (scan.repoAge !== undefined && scan.repoAge < 14) technical -= 4;
    if (scan.stars === 0 && scan.forks === 0 && scan.repoAge !== undefined && scan.repoAge < 30) technical -= 3;

    for (const pm of scan.patternMatches) {
      if (pm.severity === 'critical') technical -= 5;
      else if (pm.severity === 'high') technical -= 3;
    }
  }

  technical = Math.min(25, Math.max(0, technical));

  return { identityConfidence: identity, employerLegitimacy: employer, processLegitimacy: process, technicalSafety: technical };
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

  // PROCESS FLAGS
  if (job.walletSeedKycRequest) {
    flags.push({
      category: 'process', severity: 'critical',
      signal: 'Wallet / seed phrase / KYC requested',
      explanation: 'Legitimate employers never ask for crypto wallet access, seed phrases or sensitive documents during initial recruitment.',
      recommendation: 'Immediately stop communication and do not share any credentials.',
    });
  }

  // Analyze sample message for red flags
  if (recruiter.sampleMessage) {
    const message = recruiter.sampleMessage.toLowerCase();
    
    // Check for suspicious process descriptions
    if (message.includes('technical assessment') || message.includes('culture fit interview')) {
      flags.push({
        category: 'process', severity: 'red_flag',
        signal: 'Suspicious hiring process description',
        explanation: 'Fake recruiters often describe elaborate multi-step processes with technical assessments and culture fit interviews.',
        recommendation: 'Legitimate companies typically have straightforward hiring processes without excessive initial assessments.',
      });
    }

    // Check for generic company descriptions
    if (message.includes('leading custom development company') || 
        message.includes('advanced defi ecosystem solutions')) {
      flags.push({
        category: 'employer', severity: 'red_flag',
        signal: 'Generic company description with buzzwords',
        explanation: 'Scammers often use vague but impressive-sounding company descriptions with industry buzzwords.',
        recommendation: 'Research the company independently and verify its existence and reputation.',
      });
    }

    // Check for vague role descriptions
    if (message.includes('various roles') || 
        message.includes('please find roles details in form')) {
      flags.push({
        category: 'process', severity: 'warning',
        signal: 'Vague job description with external form',
        explanation: 'Legitimate recruiters provide specific job details rather than directing to forms for "various roles".',
        recommendation: 'Ask for specific job details before completing any forms or assessments.',
      });
    }

    // Check for immediate form submission requests
    if (message.includes('submit above form to move to next step')) {
      flags.push({
        category: 'process', severity: 'red_flag',
        signal: 'Pressure to complete forms without proper screening',
        explanation: 'Scammers often rush victims to complete forms to collect personal information quickly.',
        recommendation: 'Never complete forms without proper job screening and interview process.',
      });
    }
  }
  if (job.runCodeLocally) {
    flags.push({
      category: 'process', severity: 'critical',
      signal: 'Pressure to run code locally',
      explanation: 'A request to install and run unknown code locally is the primary delivery vector for credential-stealing malware in fake recruiting attacks.',
      recommendation: 'Do not run any code. Use an isolated VM or online sandbox (e.g. StackBlitz, CodeSandbox) for any review.',
    });
  }
  if (job.urgencySignals) {
    flags.push({
      category: 'process', severity: 'red_flag',
      signal: 'Urgency pressure detected',
      explanation: 'Artificial time pressure ("exclusive role", "deadline tomorrow") is a classic social engineering tactic to prevent careful verification.',
      recommendation: 'Slow down. Legitimate companies respect your due diligence timeline.',
    });
  }
  if (!job.jobDescription || job.jobDescription.length < 100) {
    flags.push({
      category: 'process', severity: 'warning',
      signal: 'Vague or missing job description',
      explanation: 'Legitimate job offers include clear role descriptions, requirements and responsibilities.',
      recommendation: 'Request a formal job description from the official company careers page.',
    });
  }

  // IDENTITY FLAGS
  if (!recruiter.linkedinUrl) {
    flags.push({
      category: 'identity', severity: 'warning',
      signal: 'No LinkedIn profile provided',
      explanation: 'Without a verifiable professional profile, identity confidence is significantly reduced.',
      recommendation: 'Ask for a LinkedIn profile URL and verify the account history and connections.',
    });
  }
  if (recruiter.emailReceived) {
    const domain = recruiter.emailReceived.split('@')[1] || '';
    const generic = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    if (generic.includes(domain)) {
      flags.push({
        category: 'identity', severity: 'red_flag',
        signal: 'Generic email for corporate claim',
        explanation: `A recruiter claiming to work at "${recruiter.claimedCompany}" is using a free personal email address.`,
        recommendation: 'Request contact via the official company domain email address.',
      });
    }
  }

  // DOMAIN FLAGS
  for (const dc of domainChecks) {
    if (dc.vtMalicious && dc.vtMalicious > 0) {
      flags.push({
        category: 'technical', severity: 'critical',
        signal: `VirusTotal: ${dc.vtMalicious} engines flagged ${dc.domain} as malicious`,
        explanation: 'This domain has been identified as malicious by multiple security vendors.',
        recommendation: 'Do not visit this domain. Do not click any links associated with it.',
      });
    }
    if (dc.isBrandSpoofing) {
      flags.push({
        category: 'employer', severity: 'critical',
        signal: `Brand spoofing detected: ${dc.domain}`,
        explanation: 'The domain appears to impersonate a known brand, which is a strong indicator of phishing.',
        recommendation: 'Verify the official domain of the company directly.',
      });
    }
    if (dc.isShortlink) {
      flags.push({
        category: 'technical', severity: 'red_flag',
        signal: 'Shortlink URL detected',
        explanation: 'Shortened URLs hide the real destination and are frequently used in phishing attacks.',
        recommendation: 'Expand the URL before visiting using a service like checkshorturl.com.',
      });
    }
  }

  // REPO FLAGS
  for (const scan of repoScans) {
    if (scan.dangerousScripts.length > 0) {
      flags.push({
        category: 'technical', severity: 'critical',
        signal: `Dangerous lifecycle scripts: ${scan.dangerousScripts.join(', ')}`,
        explanation: 'postinstall/preinstall scripts execute automatically on npm install, enabling silent malware execution without user action.',
        recommendation: 'Do not run npm install. Inspect the script content manually before any action.',
      });
    }
    for (const pm of scan.patternMatches.filter((p) => p.severity === 'critical')) {
      flags.push({
        category: 'technical', severity: 'critical',
        signal: `Malicious pattern: ${pm.pattern} in ${pm.file}`,
        explanation: 'This pattern is commonly used for credential theft, remote code execution, or environment variable exfiltration.',
        recommendation: 'Do not run this code. Consider reporting the repository.',
      });
    }
    if (scan.repoAge !== undefined && scan.repoAge < 14) {
      flags.push({
        category: 'technical', severity: 'red_flag',
        signal: 'Repository created less than 2 weeks ago',
        explanation: 'Newly created repositories with no history are a common trait of fake technical assessment payloads.',
        recommendation: 'Ask for the company\'s main development repository or a project with verifiable history.',
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
    const generic = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    if (!generic.includes(domain)) signals.push(`Corporate email domain: ${domain}`);
  }
  if (job.jobDescription && job.jobDescription.length > 200) signals.push('Detailed job description provided (>200 chars)');
  if (!job.walletSeedKycRequest) signals.push('No wallet/seed/KYC requests detected');
  if (!job.runCodeLocally) signals.push('No pressure to run code locally');
  if (!job.urgencySignals) signals.push('No artificial urgency signals');

  for (const scan of repoScans) {
    if (scan.dangerousScripts.length === 0) signals.push('No dangerous lifecycle scripts in package.json');
    if (scan.patternMatches.length === 0) signals.push('No malicious code patterns detected in repository');
    if (scan.repoAge !== undefined && scan.repoAge > 180) signals.push(`Repository has ${scan.repoAge}+ days of history`);
  }

  for (const dc of domainChecks) {
    if (dc.vtMalicious === 0) signals.push(`${dc.domain} has no VirusTotal detections`);
    if (!dc.isShortlink && !dc.hasSuspiciousTLD) signals.push(`${dc.domain} passes basic domain checks`);
  }

  // Add default green signals if none detected
  if (signals.length === 0) {
    signals.push('Basic assessment completed - no immediate threats detected');
    signals.push('Standard recruitment process patterns observed');
    signals.push('No obvious scam indicators found in provided data');
  }

  return signals;
}

export function generateMissingEvidence(
  input: AssessmentInput
): string[] {
  const missing: string[] = [];
  const { recruiter, job } = input;

  if (!recruiter.linkedinUrl) missing.push('LinkedIn profile URL not provided');
  if (!recruiter.emailReceived) missing.push('No corporate email address received');
  if (!job.jobDescription || job.jobDescription.length < 50) missing.push('Formal job description not provided');
  if (!recruiter.recruiterMessages || recruiter.recruiterMessages.length < 50) missing.push('Recruiter conversation history not provided');

  missing.push('Public job listing on company website not verified');
  missing.push('Video call with official company email confirmation not performed');

  // Add default missing evidence if none detected
  if (missing.length <= 2) {
    missing.push('Company registration and business license verification not completed');
    missing.push('Employee references and background checks not performed');
    missing.push('Technical interview with senior team members not conducted');
    missing.push('Salary and benefits package details not officially documented');
  }

  return missing;
}

export function generateWorkflowAdvice(
  verdict: Verdict,
  flags: RedFlag[]
): WorkflowStep[] {
  const steps: WorkflowStep[] = [];
  const hasCritical = flags.some((f) => f.severity === 'critical');
  const hasWallet = flags.some((f) => f.signal.includes('wallet') || f.signal.includes('seed'));
  const hasRunCode = flags.some((f) => f.signal.includes('run code') || f.signal.includes('locally'));
  const hasRepoRisk = flags.some((f) => f.category === 'technical' && f.severity === 'critical');
  const hasVTMalicious = flags.some((f) => f.signal.includes('VirusTotal'));

  if (hasWallet) {
    steps.push({ action: 'stop_interaction', priority: 'urgent', description: 'Immediately cease all communication. Never share wallet credentials, seed phrases or private keys with anyone.' });
    steps.push({ action: 'rotate_secrets', priority: 'urgent', description: 'If any credentials were shared, rotate them immediately: wallet keys, API keys, SSH keys, .env variables.' });
  }

  if (hasRunCode || hasRepoRisk) {
    steps.push({ action: 'do_not_run_locally', priority: 'urgent', description: 'Do NOT run npm install, pip install, or any setup scripts from this repository on your local machine.' });
    steps.push({ action: 'use_vm_sandbox', priority: 'high', description: 'If code review is necessary, use a fully isolated VM (VirtualBox, UTM) or online sandbox with no access to your real credentials.' });
    steps.push({ action: 'report_repository', priority: 'high', description: 'Report the repository at github.com/contact/report-abuse with details of the malicious patterns found.' });
  }

  if (hasVTMalicious) {
    steps.push({ action: 'report_profile', priority: 'high', description: 'Report the LinkedIn profile. The associated domain has been flagged as malicious by security vendors.' });
  }

  steps.push({ action: 'request_more_proof', priority: 'medium', description: 'Request a video call from a verified company email address. Ask for the public job listing URL on the company website.' });

  if (verdict === 'low_risk' && !hasCritical) {
    steps.push({ action: 'safe_to_proceed', priority: 'low', description: 'No critical flags detected. Proceed with standard professional caution and verify job listing independently.' });
  }

  // Add default workflow advice if no specific actions needed
  if (steps.length === 1) {
    steps.push({ action: 'request_more_proof', priority: 'medium', description: 'Verify company legitimacy through official website and business registration records.' });
    steps.push({ action: 'request_more_proof', priority: 'medium', description: 'Request and verify employee references or LinkedIn connections within the company.' });
    steps.push({ action: 'safe_to_proceed', priority: 'low', description: 'Keep detailed records of all communications and agreements for reference.' });
  }

  return steps;
}

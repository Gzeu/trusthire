export interface RecruiterInput {
  linkedinUrl?: string;
  name: string;
  claimedCompany: string;
  emailReceived?: string;
  recruiterMessages?: string;
}

export interface JobInput {
  jobDescription?: string;
  salaryMentioned: boolean;
  urgencySignals: boolean;
  walletSeedKycRequest: boolean;
  runCodeLocally: boolean;
}

export interface ArtifactInput {
  type: 'github' | 'gitlab' | 'zip' | 'drive' | 'notion' | 'url' | 'shortlink';
  url: string;
}

export interface PatternMatch {
  pattern: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line?: number;
}

export interface RepoScanResult {
  repoUrl: string;
  repoAge?: number;
  stars?: number;
  forks?: number;
  hasPackageJson: boolean;
  dangerousScripts: string[];
  patternMatches: PatternMatch[];
  riskLevel: 'safe' | 'warning' | 'critical';
  error?: string;
}

export interface VTUrlResult {
  status: 'clean' | 'malicious' | 'suspicious' | 'pending' | 'undetected' | 'error';
  malicious: number;
  suspicious: number;
  clean: number;
  permalink?: string;
}

export interface VTDomainResult {
  reputation: number;
  malicious: number;
  suspicious?: number;
  categories: string[];
  creationDate?: number;
  country?: string;
}

export interface DomainCheckResult {
  domain: string;
  hasSuspiciousTLD: boolean;
  isBrandSpoofing: boolean;
  isShortlink: boolean;
  domainAgeYears?: number | null;
  vtMalicious?: number;
  vtReputation?: number;
  vtCategories?: string[];
  riskFlags: string[];
}

export interface RedFlag {
  category: 'identity' | 'employer' | 'process' | 'technical';
  severity: 'warning' | 'red_flag' | 'critical';
  signal: string;
  explanation: string;
  recommendation: string;
}

export interface WorkflowStep {
  action:
    | 'safe_to_proceed'
    | 'request_more_proof'
    | 'do_not_run_locally'
    | 'use_vm_sandbox'
    | 'report_profile'
    | 'report_repository'
    | 'rotate_secrets'
    | 'stop_interaction';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
}

export interface ScoreBreakdown {
  identityConfidence: number;
  employerLegitimacy: number;
  processLegitimacy: number;
  technicalSafety: number;
}

export type Verdict = 'low_risk' | 'caution' | 'high_risk' | 'critical';

export interface AssessmentResult {
  id: string;
  createdAt: string;
  recruiterName: string;
  company: string;
  finalScore: number;
  verdict: Verdict;
  scores: ScoreBreakdown;
  redFlags: RedFlag[];
  greenSignals: string[];
  missingEvidence: string[];
  workflowAdvice: WorkflowStep[];
  repoScans: RepoScanResult[];
  vtResults: Array<{ url: string; urlResult?: VTUrlResult; domainResult?: VTDomainResult }>;
  shareToken: string;
}

export interface AssessmentInput {
  recruiter: RecruiterInput;
  job: JobInput;
  artifacts: ArtifactInput[];
}

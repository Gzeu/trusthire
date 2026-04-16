export type Verdict = 'low_risk' | 'caution' | 'high_risk' | 'critical';

export interface RecruiterInput {
  linkedinUrl?: string;
  name: string;
  claimedCompany: string;
  emailReceived?: string;
}

export interface JobInput {
  jobDescription?: string;
  recruiterMessages?: string;
  salaryMentioned: boolean;
  urgencyDetected: boolean;
  walletSeedKycRequested: boolean;
  runCodeLocallyRequested: boolean;
}

export interface ArtifactInput {
  url: string;
  type: 'github' | 'gitlab' | 'zip' | 'drive' | 'notion' | 'url' | 'shortlink';
}

export interface AssessmentInput {
  recruiter: RecruiterInput;
  job: JobInput;
  artifacts: ArtifactInput[];
}

export interface ScoreBreakdown {
  identityConfidence: number;
  employerLegitimacy: number;
  processLegitimacy: number;
  technicalSafety: number;
}

export type RedFlagSeverity = 'warning' | 'red_flag' | 'critical';
export type RedFlagCategory = 'identity' | 'employer' | 'process' | 'technical';

export interface RedFlag {
  category: RedFlagCategory;
  severity: RedFlagSeverity;
  signal: string;
  explanation: string;
  recommendation: string;
}

export interface GreenSignal {
  category: RedFlagCategory;
  signal: string;
  explanation: string;
}

export interface MissingEvidence {
  item: string;
  why: string;
  howToGet: string;
}

export type WorkflowAction =
  | 'safe_to_proceed'
  | 'request_more_proof'
  | 'do_not_run_locally'
  | 'use_vm_sandbox'
  | 'report_profile'
  | 'report_repository'
  | 'rotate_secrets'
  | 'stop_interaction'
  | 'verify_job_listing'
  | 'request_video_call';

export interface WorkflowStep {
  action: WorkflowAction;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
}

export interface PatternMatch {
  pattern: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line?: number;
  snippet?: string;
}

export interface RepoScanResult {
  url: string;
  owner?: string;
  repo?: string;
  repoAgeDays?: number;
  stars?: number;
  forks?: number;
  hasPackageJson: boolean;
  dangerousLifecycleScripts: string[];
  patternMatches: PatternMatch[];
  suspiciousNetworkCalls: string[];
  envExfiltrationRisk: boolean;
  dynamicExecutionRisk: boolean;
  riskLevel: 'safe' | 'warning' | 'critical';
  error?: string;
}

export interface VTUrlResult {
  status: 'clean' | 'malicious' | 'suspicious' | 'pending' | 'undetected' | 'error';
  malicious: number;
  suspicious: number;
  clean: number;
  permalink?: string;
  scanDate?: string;
}

export interface VTDomainResult {
  reputation: number;
  malicious: number;
  suspicious: number;
  categories: string[];
  creationDate?: number;
  country?: string;
  error?: string;
}

export interface DomainCheckResult {
  domain: string;
  hasSuspiciousTLD: boolean;
  isBrandSpoofing: boolean;
  isShortlink: boolean;
  domainAgeYears?: number;
  vtMalicious?: number;
  vtReputation?: number;
  vtCategories?: string[];
  riskFlags: string[];
}

export interface AssessmentResult {
  id: string;
  shareToken: string;
  createdAt: string;
  recruiterName: string;
  company: string;
  scores: ScoreBreakdown;
  finalScore: number;
  verdict: Verdict;
  redFlags: RedFlag[];
  greenSignals: GreenSignal[];
  missingEvidence: MissingEvidence[];
  workflowAdvice: WorkflowStep[];
  repoScans: RepoScanResult[];
  domainChecks: DomainCheckResult[];
  incidentReport: string;
}

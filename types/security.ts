/**
 * Security Types for TrustHire
 * Type definitions for security analysis and threat detection
 */

export interface RecruiterProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  position?: string;
  experienceYears?: number;
  connectionCount?: number;
  verificationStatus?: 'verified' | 'unverified' | 'pending';
  profileCompleteness?: number;
  sentimentScore?: number;
  urgencyIndicators?: number;
  vagueDescriptionCount?: number;
  technicalComplexity?: number;
  companyVerificationStatus?: boolean;
  onlinePresenceScore?: number;
  profileAge?: number;
  description?: string;
  skills?: string[];
  education?: string[];
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface ThreatPattern {
  id: string;
  category: string;
  description: string;
  indicators: string[];
  riskFactors: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  verified: boolean;
  examples?: string[];
  prevention?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SecurityAnalysis {
  id: string;
  profileId: string;
  threatScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  findings: SecurityFinding[];
  recommendations: string[];
  timestamp: Date;
  analystId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface SecurityFinding {
  id: string;
  type: 'vulnerability' | 'threat' | 'risk' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number;
  timestamp: Date;
  evidence?: string[];
  recommendations?: string[];
  impact?: string;
  category?: string;
}

// AI and ML related types
export interface PredictionResult {
  threatScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  predictions: string[];
  recommendations: string[];
  timeframe: string;
}

export interface PredictiveModel {
  analyze: (features: any[]) => Promise<number>;
  train: (trainingData: any[]) => Promise<void>;
  predict: (input: any) => Promise<PredictionResult>;
  loadModel: () => Promise<void>;
  getModelMetrics: () => Promise<ModelMetrics>;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  loss?: number;
}

// Blockchain related types
export interface VerificationResult {
  verified: boolean;
  reputation: number;
  auditTrail: AuditRecord[];
  timestamp: Date;
  verificationId: string;
}

export interface AuditRecord {
  id: string;
  action: string;
  timestamp: Date;
  result: 'success' | 'failed' | 'pending';
  details: string;
  performedBy: string;
}

export interface ReputationScore {
  score: number;
  confidence: number;
  factors: ReputationFactor[];
  lastUpdated: Date;
  source: string;
}

export interface ReputationFactor {
  factor: string;
  weight: number;
  value: number;
  confidence: number;
  evidence: string;
}

// Privacy and compliance types
export interface PrivacyMetrics {
  dataMinimization: boolean;
  anonymization: boolean;
  encryption: boolean;
  consent: boolean;
  compliance: string[];
  auditTrail: boolean;
}

export interface ComplianceStatus {
  regulation: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  lastAudit: Date;
  findings: ComplianceFinding[];
  score: number;
  report: string;
}

export interface ComplianceFinding {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  requirement: string;
  status: 'open' | 'resolved' | 'pending';
  assignedTo?: string;
  dueDate?: Date;
  resolution?: string;
  created: Date;
}

// Analytics and metrics types
export interface SecurityMetrics {
  totalAnalyses: number;
  threatsDetected: number;
  threatsBlocked: number;
  accuracy: number;
  responseTime: number;
  userSatisfaction: number;
  riskReduction: number;
  falsePositives: number;
  coverage: number;
}

export interface ThreatTrend {
  timestamp: Date;
  category: string;
  severity: string;
  count: number;
  location: string;
  platform: string;
  detectionMethod: string;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
  resourceUsage: ResourceUsage;
  modelAccuracy: number;
  databasePerformance: DatabasePerformance;
}

export interface ResourceUsage {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  gpu?: number;
}

export interface DatabasePerformance {
  queryTime: number;
  connectionPool: number;
  cacheHitRate: number;
  indexPerformance: number;
  storageEfficiency: number;
}

// Agent related types
export interface AgentMetrics {
  tasksCompleted: number;
  analysesPerformed: number;
  discoveriesMade: number;
  errorsEncountered: number;
  learningEvents: number;
  uptime: number;
  averageResponseTime: number;
}

export interface AgentCapability {
  name: string;
  enabled: boolean;
  accuracy: number;
  lastUsed: Date;
  usageCount: number;
  performance: PerformanceMetrics;
}

export interface AgentPersonality {
  traits: {
    analytical: number;
    creative: number;
    cautious: number;
    proactive: number;
    detailOriented: number;
  };
  preferences: {
    reportFormat: string;
    analysisDepth: string;
    automationLevel: string;
  };
  communicationStyle: string;
  expertise: string[];
}

export interface AgentMemory {
  shortTerm: {
    conversations: Conversation[];
    currentTasks: Task[];
    recentFindings: Finding[];
  };
  longTerm: {
    patterns: Pattern[];
    knowledge: Knowledge[];
    relationships: Relationship[];
  };
  episodic: {
    experiences: Experience[];
  };
}

export interface Task {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  data: any;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

export interface Conversation {
  id: string;
  agentId: string;
  messages: Message[];
  timestamp: Date;
  context: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface Finding {
  id: string;
  type: string;
  content: string;
  confidence: number;
  timestamp: Date;
  category?: string;
  severity?: string;
  source: string;
}

export interface Pattern {
  pattern: string;
  frequency: number;
  significance: number;
  lastSeen: Date;
  category: string;
  confidence: number;
  evidence: string[];
}

export interface Knowledge {
  domain: string;
  fact: string;
  source: string;
  confidence: number;
  learnedAt: Date;
  tags: string[];
}

export interface Relationship {
  entity: string;
  relationship: string;
  strength: number;
  lastInteraction: Date;
  context: string;
}

export interface Experience {
  event: string;
  outcome: string;
  lesson: string;
  emotionalWeight: number;
  timestamp: Date;
  context: string;
}

export interface Task {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  data: any;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

export interface LearningEvent {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  impact: string;
  context: any;
}

export interface AgentStatus {
  id: string;
  status: 'idle' | 'thinking' | 'analyzing' | 'reporting' | 'learning' | 'error';
  personality: AgentPersonality;
  memory: AgentMemory;
  soul: AgentSoul;
  capabilities: string[];
  statistics: AgentMetrics;
  currentTask?: Task;
  lastActivity: Date;
}

export interface AgentSoul {
  coreValues: string[];
  ethicalPrinciples: string[];
  decisionFramework: {
    riskTolerance: number;
    privacyPriority: number;
    accuracyRequirement: number;
    userSafetyPriority: number;
  };
  learningStyle: {
    curiosity: number;
    adaptability: number;
    feedbackReceptivity: number;
    selfImprovement: number;
  };
  emotionalProfile: {
    confidence: number;
    empathy: number;
    patience: number;
    resilience: number;
  };
}

export interface AgentStatistics {
  tasksCompleted: number;
  analysesPerformed: number;
  discoveriesMade: number;
  errorsEncountered: number;
  learningEvents: number;
  uptime: number;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
  resourceUsage: ResourceUsage;
  modelAccuracy: number;
  databasePerformance: DatabasePerformance;
}

export interface ResourceUsage {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  gpu?: number;
}

export interface DatabasePerformance {
  queryTime: number;
  connectionPool: number;
  cacheHitRate: number;
  indexPerformance: number;
  storageEfficiency: number;
}

// API and integration types
export interface APIResponse<T = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface ThreatIntelligence {
  id: string;
  source: string;
  threatType: string;
  description: string;
  severity: string;
  confidence: number;
  timestamp: Date;
  location: string;
  affectedPlatforms: string[];
  indicators: string[];
  relatedThreats: string[];
  mitigation: string[];
}

export interface GlobalThreatNetwork {
  nodes: ThreatNode[];
  connections: ThreatConnection[];
  threatTypes: ThreatType[];
  lastUpdate: Date;
  totalThreats: number;
  activeAlerts: number;
}

export interface ThreatNode {
  id: string;
  type: string;
  name: string;
  location: string;
  severity: string;
  timestamp: Date;
  confidence: number;
  relatedNodes: string[];
  metadata: any;
}

export interface ThreatConnection {
  source: string;
  target: string;
  strength: number;
  type: string;
  lastSeen: Date;
  confidence: number;
}

export interface ThreatType {
  name: string;
  category: string;
  patterns: string[];
  severity: string;
  prevalence: number;
  mitigation: string;
  references: string[];
}

// AR and visualization types
export interface ARVisualization {
  id: string;
  type: 'threat_map' | 'security_dashboard' | 'threat_timeline';
  data: VisualizationData;
  timestamp: Date;
  user: string;
  session: string;
  interactions: ARInteraction[];
}

export interface VisualizationData {
  threats: ThreatPoint[];
  connections: ThreatConnection[];
  metrics: VisualizationMetrics;
  filters: VisualizationFilters;
  timeRange: TimeRange;
}

export interface ThreatPoint {
  id: string;
  type: string;
  severity: string;
  location: {
    x: number;
    y: number;
    z: number;
  };
  timestamp: Date;
  description: string;
  confidence: number;
  metadata: any;
}

export interface ThreatConnection {
  source: {
    x: number;
    y: number;
    z: number;
  };
  target: {
    x: number;
    y: number;
    z: number;
  };
  strength: number;
  type: string;
  confidence: number;
  lastSeen: Date;
}

export interface VisualizationMetrics {
  totalThreats: number;
  activeAlerts: number;
  resolvedThreats: number;
  averageResponseTime: number;
  userEngagement: number;
  systemPerformance: number;
}

export interface VisualizationFilters {
  severity: string[];
  category: string[];
  timeframe: string;
  location: string;
  platform: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
  label: string;
}

export interface ARInteraction {
  id: string;
  type: string;
  timestamp: Date;
  user: string;
  action: string;
  element: string;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  metadata: any;
}

// IoT and edge computing types
export interface IoTDevice {
  id: string;
  type: string;
  manufacturer: string;
  model: string;
  firmware: string;
  lastSeen: Date;
  securityStatus: 'secure' | 'compromised' | 'unknown';
  trustScore: number;
  vulnerabilities: Vulnerability[];
  metadata: IoTMetadata;
}

export interface IoTMetadata {
  networkId: string;
  ipAddress: string;
  macAddress: string;
  os: string;
  version: string;
  lastUpdate: Date;
  capabilities: string[];
}

export interface Vulnerability {
  id: string;
  type: string;
  severity: string;
  description: string;
  location: string;
  discovered: Date;
  fixed: Date;
  cvssScore?: number;
  references: string[];
  patchAvailable: boolean;
  exploitAvailable: boolean;
}

// Edge computing types
export interface EdgeNode {
  id: string;
  location: string;
  capabilities: string[];
  currentLoad: number;
  securityStatus: 'secure' | 'compromised' | 'unknown';
  lastCheck: Date;
  performance: EdgePerformance;
}

export interface EdgePerformance {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  throughput: number;
  errorRate: number;
  uptime: number;
}

// Mobile security types
export interface MobileSecurityMetrics {
  deviceFingerprint: string;
  securityScore: number;
  appIntegrity: number;
  networkSecurity: NetworkSecurity;
  biometricSecurity: BiometricSecurity;
  locationSecurity: LocationSecurity;
  appPermissions: AppPermissions;
  deviceSecurity: DeviceSecurity;
}

export interface NetworkSecurity {
  encryption: boolean;
  httpsEnabled: boolean;
  certificateValid: boolean;
  dnsSecurity: boolean;
  firewallEnabled: boolean;
  vpnEnabled: boolean;
  proxyEnabled: boolean;
  lastCheck: Date;
}

export interface BiometricSecurity {
  faceRecognition: boolean;
  voiceRecognition: boolean;
  fingerprintScanning: boolean;
  behavioralBiometrics: boolean;
  livenessDetection: boolean;
  anti-spoofing: boolean;
  lastVerification: Date;
}

export interface LocationSecurity {
  gpsEnabled: boolean;
  geofencingEnabled: boolean;
  locationServices: string[];
  lastLocation: Date;
  locationHistory: LocationPoint[];
}

export interface LocationPoint {
  timestamp: Date;
  latitude: number;
  longitude: number;
  accuracy: number;
  source: string;
}

export interface AppPermissions {
  camera: boolean;
  microphone: boolean;
  storage: boolean;
  location: boolean;
  contacts: boolean;
  biometrics: boolean;
  notifications: boolean;
  backgroundRefresh: boolean;
}

export interface DeviceSecurity {
  jailbroken: boolean;
  rooted: boolean;
  developerMode: boolean;
  osVersion: string;
  securityPatchLevel: string;
  encryptionStatus: EncryptionStatus;
  biometricProtection: BiometricProtection;
  appIntegrity: boolean;
  malwareDetected: boolean;
  suspiciousApps: string[];
}

export interface EncryptionStatus {
  deviceEncryption: boolean;
  appEncryption: boolean;
  fileEncryption: boolean;
  communicationEncryption: boolean;
  databaseEncryption: boolean;
  keyManagement: KeyManagement;
  lastRotation: Date;
  encryptionLevel: string;
}

export interface KeyManagement {
  algorithm: string;
  keyLength: number;
  rotationPolicy: string;
  lastRotation: Date;
  nextRotation: Date;
  encryptionStandard: string;
  compliance: string[];
}

// Quantum cryptography types
export interface QuantumSecurityMetrics {
  quantumResistance: QuantumResistance;
  postQuantumCryptography: boolean;
  quantumKeyDistribution: boolean;
  quantumRandomNumberGeneration: boolean;
  quantumKeyExchange: boolean;
  lastQuantumUpdate: Date;
}

export interface QuantumResistance {
  current: string;
  target: string;
  timeline: string;
  algorithms: string[];
  confidence: number;
  lastAssessment: Date;
}

export interface PostQuantumCryptography {
  algorithms: string[];
  keyLength: number;
  implementation: string;
  testingStatus: TestingStatus;
  certification: string;
  lastUpdate: Date;
}

export interface TestingStatus {
  status: string;
  testResults: TestResult[];
  lastRun: Date;
  nextTest: Date;
  coverage: number;
  issues: string[];
}

export interface TestResult {
  testType: string;
  status: string;
  score: number;
  details: string;
  timestamp: Date;
  environment: string;
  issues: string[];
  recommendations: string[];
}

// Regulatory compliance types
export interface RegulatoryFramework {
  name: string;
  requirements: RegulatoryRequirement[];
  complianceStatus: ComplianceStatus;
  lastAudit: Date;
  nextAudit: Date;
  score: number;
  findings: ComplianceFinding[];
}

export interface RegulatoryRequirement {
  id: string;
  requirement: string;
  category: string;
  severity: string;
  description: string;
  implementation: ImplementationStatus;
  dueDate?: Date;
  responsible: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  evidence: string[];
  lastUpdated: Date;
}

export interface ImplementationStatus {
  status: string;
  progress: number;
  lastUpdate: Date;
  blockers: string[];
  dependencies: string[];
  tested: boolean;
  documented: boolean;
}

export interface ComplianceFinding {
  id: string;
  requirement: string;
  category: string;
  severity: string;
  description: string;
  status: 'open' | 'resolved' | 'pending';
  assignedTo?: string;
  dueDate?: Date;
  resolution?: string;
  created: Date;
  updated: Date;
  priority: string;
  tags: string[];
  evidence: string[];
}

// User experience types
export interface UserExperienceMetrics {
  taskCompletionTime: number;
  errorRate: number;
  userSatisfaction: number;
  featureAdoption: number;
  userRetention: number;
  supportRequests: number;
  feedbackQuality: number;
  usabilityScore: number;
  accessibilityScore: number;
  performanceScore: number;
}

export interface UserBehaviorAnalytics {
  sessionDuration: number;
  clickPatterns: ClickPattern[];
  navigationPaths: NavigationPath[];
  featureUsage: FeatureUsage[];
  errorEvents: ErrorEvent[];
  successEvents: SuccessEvent[];
  abandonmentPoints: AbandonmentPoint[];
  engagementMetrics: EngagementMetrics;
}

export interface ClickPattern {
  element: string;
  action: string;
  timestamp: Date;
  coordinates: {
    x: number;
    y: number;
  };
  userId?: string;
  sessionId?: string;
}

export interface NavigationPath {
  path: string;
  timestamp: Date;
  duration: number;
  exitPoint?: string;
  userId?: string;
  sessionId?: string;
}

export interface FeatureUsage {
  feature: string;
  usage: number;
  frequency: number;
  lastUsed: Date;
  userSatisfaction: number;
  errorRate: number;
  performance: PerformanceMetrics;
}

export interface EngagementMetrics {
  activeUsers: number;
  sessionDuration: number;
  bounceRate: number;
  retentionRate: number;
  taskCompletionRate: number;
  featureAdoptionRate: number;
  userSatisfaction: number;
  netPromoterScore: number;
}

export interface SuccessEvent {
  event: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  context: string;
  impact: string;
}

export interface ErrorEvent {
  error: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  context: string;
  severity: string;
  stackTrace?: string;
  userAgent: string;
  platform: string;
  browser: string;
  location: string;
  ip: string;
}

export interface AbandonmentPoint {
  element: string;
  step: string;
  timestamp: Date;
  reason: string;
  user?: string;
  sessionId?: string;
  context: string;
}

// Performance and monitoring types
export interface SystemPerformance {
  cpu: SystemResourceUsage;
  memory: SystemResourceUsage;
  disk: SystemResourceUsage;
  network: NetworkPerformance;
  database: DatabasePerformance;
  cache: CachePerformance;
  uptime: number;
  errorRate: number;
  responseTime: number;
}

export interface SystemResourceUsage {
  used: number;
  available: number;
  percentage: number;
  average: number;
  peak: number;
  timestamp: Date;
}

export interface NetworkPerformance {
  latency: number;
  throughput: number;
  packetLoss: number;
  jitter: number;
  errorRate: number;
  connectionCount: number;
  bandwidth: number;
  timestamp: Date;
}

export interface CachePerformance {
  hitRate: number;
  missRate: number;
  avgResponseTime: number;
  evictionRate: number;
  storageEfficiency: number;
  timestamp: Date;
}

export interface DatabasePerformance {
  queryTime: number;
  connectionPoolUtilization: number;
  cacheHitRate: number;
  indexPerformance: number;
  storageEfficiency: number;
  timestamp: Date;
}

// Innovation roadmap types
export class InnovationFeature {
  id: string;
  name: string;
  description: string;
  category: InnovationCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'planned' | 'in_progress' | 'testing' | 'deployed';
  timeline: InnovationTimeline;
  dependencies: string[];
  resources: ResourceRequirements;
  expectedImpact: ImpactLevel;
  riskAssessment: RiskAssessment;
  successMetrics: SuccessMetrics;
}

export enum InnovationCategory {
  AI_POWERED_SECURITY = 'ai_powered_security';
  BLOCKCHAIN_VERIFICATION = 'blockchain_verification';
  PRIVACY_PRESERVING = 'privacy_preserving';
  AUTONOMOUS_AGENTS = 'autonomous_agents';
  REAL_TIME_INTELLIGENCE = 'real_time_intelligence';
  AR_VISUALIZATION = 'ar_visualization';
  MOBILE_SECURITY = 'mobile_security';
  IOT_SECURITY = 'iot_security';
  QUANTUM_RESISTANT = 'quantum_resistant';
  PREDICTIVE_ANALYTICS = 'predictive_analytics';
}

export enum InnovationTimeline {
  IMMEDIATE = 'immediate';
  SHORT_TERM = 'short_term';
  MEDIUM_TERM = 'medium_term';
  LONG_TERM = 'long_term';
}

export enum ImpactLevel {
  LOW = 'low';
  MEDIUM = 'medium';
  HIGH = 'high';
  CRITICAL = 'critical';
  TRANSFORMATIONAL = 'transformational';
}

export enum ResourceRequirements {
  LOW = 'low';
  MEDIUM = 'medium';
  HIGH = 'high';
  VERY_HIGH = 'very_high';
  CRITICAL = 'critical';
}

export enum RiskAssessment {
  LOW = 'low';
  MEDIUM = 'medium';
  HIGH = 'high';
  CRITICAL = 'critical';
  UNKNOWN = 'unknown';
}

export enum SuccessMetrics {
  ACCURACY = 'accuracy';
  PRECISION = 'precision';
  RECALL = 'recall';
  F1_SCORE = 'f1_score';
  USER_SATISFACTION = 'user_satisfaction';
  TASK_COMPLETION = 'task_completion_rate';
  ERROR_REDUCTION = 'error_reduction';
  RISK_REDUCTION = 'risk_reduction';
}

// Utility types
export interface FilterOptions {
  category?: string[];
  severity?: string[];
  timeframe?: string;
  location?: string;
  platform?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
  priority: 'high' | 'medium' | 'low';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total?: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchOptions {
  query?: string;
  filters?: FilterOptions;
  sort?: SortOptions;
  pagination?: PaginationOptions;
}

export interface ApiResponse<T = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  pagination?: PaginationOptions;
  filters?: FilterOptions;
  sort?: SortOptions;
  total?: number;
  hasNext: boolean;
  hasPrev: boolean;
  page: number;
  limit: number;
  offset: number;
}

// Error handling types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
  timestamp: Date;
  user?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  browser?: string;
  location?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value: any;
  code: string;
  timestamp: Date;
}

export interface SystemError extends AppError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
  timestamp: Date;
  user?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  browser?: string;
  location?: string;
}

export interface NetworkError extends AppError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
  timestamp: Date;
  user?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  browser?: string;
  location?: string;
}

export interface DatabaseError extends AppError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
  timestamp: Date;
  user?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  browser?: string;
  location?: string;
}

export interface APIError extends AppError {
  code: string;
  message: string;
  status: number;
  details?: any;
  stack?: string;
  timestamp: Date;
  user?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  browser?: string;
  location?: string;
}

// Logging and monitoring types
export interface LogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  timestamp: Date;
  metadata?: any;
  user?: string;
  session?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  browser?: string;
  location?: string;
  stack?: string;
}

export interface SecurityLogEntry extends LogEntry {
  threatId?: string;
  severity: string;
  category: string;
  confidence: number;
  location: string;
  platform: string;
  action: string;
  result: string;
  metadata?: any;
}

export interface PerformanceLogEntry extends LogEntry {
  responseTime: number;
  throughput: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
  databaseConnections: number;
  timestamp: Date;
  user?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  browser?: string;
  location?: string;
}

export interface ErrorLogEntry extends LogEntry {
  error: string;
  stack?: string;
  code: string;
  user?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  browser?: string;
  location?: string;
}

// Event types
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: string;
  description: string;
  timestamp: Date;
  location: string;
  user?: string;
  sessionId?: string;
  metadata?: any;
}

export enum SecurityEventType {
  THREAT_DETECTED = 'threat_detected';
  VULNERABILITY_FOUND = 'vulnerability_found';
  RISK_ASSESSMENT = 'risk_assessment';
  COMPLIANCE_CHECK = 'compliance_check';
  AUTHENTICATION_EVENT = 'authentication_event';
  DATA_BREACH = 'data_breach';
  SYSTEM_ALERT = 'system_alert';
  USER_ACTION = 'user_action';
  AUTOMATED_RESPONSE = 'automated_response';
}

export interface ThreatDetectionEvent extends SecurityEvent {
  threatId: string;
  threatType: string;
  confidence: number;
  location: string;
  platform: string;
  indicators: string[];
  mitigation: string[];
  impact: string;
  metadata?: any;
}

export interface VulnerabilityDetectionEvent extends SecurityEvent {
  vulnerabilityId: string;
  cveId?: string;
  severity: string;
  category: string;
  description: string;
  location: string;
  platform: string;
  confidence: number;
  cvssScore?: number;
  references: string[];
  patchAvailable: boolean;
  exploitAvailable: boolean;
  metadata?: any;
}

export interface ComplianceCheckEvent extends SecurityEvent {
  regulation: string;
  requirement: string;
  status: string;
  result: string;
  score: number;
  findings: string[];
  metadata?: any;
}

export interface AuthenticationEvent extends SecurityEvent {
  userId?: string;
  method: string;
  location: string;
  success: boolean;
  biometricUsed?: boolean;
  mfaUsed?: boolean;
  riskLevel: string;
  metadata?: any;
}

export interface DataBreachEvent extends SecurityEvent {
  dataType: string;
  affectedRecords: number;
  impact: string;
  location: string;
  platform: string;
  attackVector: string;
  mitigation: string;
  metadata?: any;
}

export interface SystemAlertEvent extends SecurityEvent {
  system: string;
  alertType: string;
  severity: string;
  description: string;
  location: string;
  resolution?: string;
  metadata?: any;
}

export interface UserActionEvent extends SecurityEvent {
  userId?: string;
  action: string;
  location: string;
  result: string;
  metadata?: any;
}

export interface AutomatedResponseEvent extends SecurityEvent {
  responseTime: number;
  confidence: number;
  effectiveness: string;
  metadata?: any;
}

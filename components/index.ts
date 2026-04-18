// Unified Components - Consolidated exports for better organization and maintainability

// Core unified components
export { default as UnifiedScoreGauge } from './UnifiedScoreGauge';
export { default as UnifiedQuickScan } from './UnifiedQuickScan';
export { default as UnifiedNavbar } from './UnifiedNavbar';
export { default as UnifiedLoadingStates, LoadingSkeleton, LoadingCard } from './UnifiedLoadingStates';

// Enhanced components (kept for backward compatibility)
export { default as EnhancedScoreGauge } from './EnhancedScoreGauge';
export { default as EnhancedQuickScanCards } from './EnhancedQuickScanCards';
export { default as EnhancedNavbar } from './EnhancedNavbar';
export { default as EnhancedLoadingStates } from './EnhancedLoadingStates';

// Original components (kept for legacy support)
export { ScoreGauge } from './ScoreGauge';
export { ScoreCard } from './ScoreCard';
export { default as QuickScanCards } from './QuickScanCards';
export { default as Navbar } from './Navbar';
export { default as MobileBottomNav } from './MobileBottomNav';

// UI Components
export * from './ui/button';
export * from './ui/card';
export * from './ui/alert';
export * from './ui/badge';
export * from './ui/tabs';

// Feature components
export { default as RealTimeScanner } from './RealTimeScanner';
export { default as ExportManager } from './ExportManager';
export { default as SecurityHardening } from './SecurityHardening';
export { default as UserAnalytics } from './UserAnalytics';
export { default as UIPolish } from './UIPolish';

// Analysis components
export { default as AIAnalysisCard } from './AIAnalysisCard';
export { default as AIImageAnalysis } from './AIImageAnalysis';
export { AiAnalysisSection } from './AiAnalysisSection';
export { EvidencePanel } from './EvidencePanel';
export { RedFlagItem } from './RedFlagItem';

// Monitoring components
export { default as MonitoringDashboard } from './MonitoringDashboard';
export { default as PerformanceMonitor } from './PerformanceMonitor';
export { default as PerformanceOptimizer } from './PerformanceOptimizer';

// Utility components
export { ThemeToggle } from './ThemeToggle';
export { default as MobileOptimizedInput } from './MobileOptimizedInput';
export { default as QuickLinkedInCheck } from './QuickLinkedInCheck';
export { default as ReverseImageSearch } from './ReverseImageSearch';
export { RepoScanReport } from './RepoScanReport';
export { VirusTotalPanel } from './VirusTotalPanel';
export { SimpleChart } from './SimpleChart';

// Advanced components
export { CrossBrowserTester } from './CrossBrowserTester';
export { DebugTools } from './DebugTools';
export { EnhancedActionButtons } from './EnhancedActionButtons';
export { EnhancedErrorState } from './EnhancedErrorState';
export { EnhancedHeroSection } from './EnhancedHeroSection';
export { IncidentReportGenerator } from './IncidentReportGenerator';
export { SocialProofSection } from './SocialProofSection';
export { WorkflowAdvisor } from './WorkflowAdvisor';

// ML and AI components
export { langChainPanel } from './langchain/LangChainPanel';
export { ModelTrainingPanel } from './ml/ModelTrainingPanel';
export { AnalysisPanel } from './ai/AnalysisPanel';

// Theme provider
export { ThemeProvider } from './theme-provider';

// Re-export commonly used component combinations
export const Components = {
  // Unified components (recommended for new development)
  ScoreGauge: UnifiedScoreGauge,
  QuickScan: UnifiedQuickScan,
  Navbar: UnifiedNavbar,
  LoadingStates: UnifiedLoadingStates,
  
  // Enhanced components (for advanced features)
  EnhancedScoreGauge: EnhancedScoreGauge,
  EnhancedQuickScanCards: EnhancedQuickScanCards,
  EnhancedNavbar: EnhancedNavbar,
  EnhancedLoadingStates: EnhancedLoadingStates,
  
  // Legacy components (for backward compatibility)
  LegacyScoreGauge: ScoreGauge,
  LegacyQuickScanCards: QuickScanCards,
  LegacyNavbar: Navbar,
  
  // Feature-specific components
  RealTimeScanner: RealTimeScanner,
  ExportManager: ExportManager,
  SecurityHardening: SecurityHardening,
  UserAnalytics: UserAnalytics,
  UIPolish: UIPolish,
  
  // UI components
  ScoreCard,
  MobileBottomNav: MobileBottomNav
};

// Migration helper - provides guidance on which components to use
export const MigrationGuide = {
  // Recommended replacements
  'ScoreGauge → UnifiedScoreGauge': 'Use UnifiedScoreGauge for enhanced features and better performance',
  'QuickScanCards → UnifiedQuickScan': 'Use UnifiedQuickScan for improved UX and unified scanning interface',
  'Navbar → UnifiedNavbar': 'Use UnifiedNavbar for enhanced navigation with quick tools dropdown',
  'EnhancedScoreGauge → UnifiedScoreGauge': 'UnifiedScoreGauge includes all EnhancedScoreGauge features with better performance',
  
  // When to use enhanced versions
  'Use EnhancedScoreGauge when': 'You need specific advanced features not yet in UnifiedScoreGauge',
  'Use EnhancedQuickScanCards when': 'You need legacy scan card behavior for compatibility',
  'Use EnhancedNavbar when': 'You need specific enhanced navigation features',
  
  // When to use legacy versions
  'Use ScoreGauge when': 'You need simple, lightweight gauge without animations',
  'Use QuickScanCards when': 'You need legacy scan card implementation',
  'Use Navbar when': 'You need simple navigation without advanced features'
} as const;

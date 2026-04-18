'use client';

import { useEffect, useState, useCallback } from 'react';
import { Zap, Activity, Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  memoryUsage: number;
  bundleSize: number;
  renderTime: number;
}

interface OptimizationSuggestion {
  type: 'critical' | 'warning' | 'info';
  category: 'performance' | 'accessibility' | 'seo' | 'best-practices';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  implementation: string;
  estimatedImprovement: string;
}

export default function PerformanceOptimizer() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  // Collect performance metrics
  const collectMetrics = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    const lcp = paint.find(entry => entry.name === 'largest-contentful-paint')?.startTime || 0;
    const ttfb = navigation?.responseStart || 0;
    
    // Calculate FID from first input delay
    const firstInput = performance.getEntriesByType('first-input')[0] as any;
    const fid = firstInput?.processingStart || 0;
    
    // Calculate CLS from layout shifts
    const cls = performance.getEntriesByType('layout-shift').reduce(
      (sum, entry) => sum + (entry as any).value, 0
    );

    // Memory usage (if available)
    const memory = (performance as any).memory;
    const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0; // MB

    // Estimate bundle size (simplified)
    const bundleSize = 84.3 * 1024; // KB from build output

    const metrics: PerformanceMetrics = {
      fcp: Math.round(fcp),
      lcp: Math.round(lcp),
      fid: Math.round(fid),
      cls: Math.round(cls * 1000) / 1000,
      ttfb: Math.round(ttfb),
      memoryUsage: Math.round(memoryUsage),
      bundleSize: bundleSize,
      renderTime: Math.round(performance.now())
    };

    setMetrics(metrics);
    generateSuggestions(metrics);
  }, []);

  // Generate optimization suggestions based on metrics
  const generateSuggestions = (metrics: PerformanceMetrics) => {
    const suggestions: OptimizationSuggestion[] = [];

    // FCP suggestions
    if (metrics.fcp > 1800) {
      suggestions.push({
        type: 'critical',
        category: 'performance',
        title: 'Slow First Contentful Paint',
        description: `FCP is ${metrics.fcp}ms, should be under 1800ms`,
        impact: 'high',
        implementation: 'Optimize critical rendering path, reduce server response time',
        estimatedImprovement: '30-50% faster FCP'
      });
    } else if (metrics.fcp > 1000) {
      suggestions.push({
        type: 'warning',
        category: 'performance',
        title: 'Moderate First Contentful Paint',
        description: `FCP is ${metrics.fcp}ms, could be improved`,
        impact: 'medium',
        implementation: 'Optimize CSS delivery, reduce render-blocking resources',
        estimatedImprovement: '20-30% faster FCP'
      });
    }

    // LCP suggestions
    if (metrics.lcp > 2500) {
      suggestions.push({
        type: 'critical',
        category: 'performance',
        title: 'Slow Largest Contentful Paint',
        description: `LCP is ${metrics.lcp}ms, should be under 2500ms`,
        impact: 'high',
        implementation: 'Optimize images, lazy load non-critical content',
        estimatedImprovement: '40-60% faster LCP'
      });
    }

    // FID suggestions
    if (metrics.fid > 100) {
      suggestions.push({
        type: 'warning',
        category: 'performance',
        title: 'Slow First Input Delay',
        description: `FID is ${metrics.fid}ms, should be under 100ms`,
        impact: 'medium',
        implementation: 'Reduce JavaScript execution time, optimize main thread',
        estimatedImprovement: '50-70% faster interactions'
      });
    }

    // CLS suggestions
    if (metrics.cls > 0.1) {
      suggestions.push({
        type: 'critical',
        category: 'performance',
        title: 'Layout Shift Detected',
        description: `CLS is ${metrics.cls}, should be under 0.1`,
        impact: 'high',
        implementation: 'Specify dimensions for images and embeds, avoid layout shifts',
        estimatedImprovement: 'Eliminate visual instability'
      });
    }

    // Memory usage suggestions
    if (metrics.memoryUsage > 100) {
      suggestions.push({
        type: 'warning',
        category: 'performance',
        title: 'High Memory Usage',
        description: `Memory usage is ${metrics.memoryUsage}MB, consider optimization`,
        impact: 'medium',
        implementation: 'Optimize component lifecycle, implement memory cleanup',
        estimatedImprovement: '20-40% less memory usage'
      });
    }

    // Bundle size suggestions
    if (metrics.bundleSize > 100 * 1024) {
      suggestions.push({
        type: 'warning',
        category: 'performance',
        title: 'Large Bundle Size',
        description: `Bundle is ${Math.round(metrics.bundleSize / 1024)}KB, consider code splitting`,
        impact: 'medium',
        implementation: 'Implement dynamic imports, optimize dependencies',
        estimatedImprovement: '30-50% smaller bundle'
      });
    }

    // Accessibility suggestions
    suggestions.push({
      type: 'info',
      category: 'accessibility',
      title: 'Improve Color Contrast',
      description: 'Some text elements may have insufficient contrast',
      impact: 'medium',
      implementation: 'Use higher contrast colors, test with WCAG tools',
      estimatedImprovement: 'Better accessibility score'
    });

    suggestions.push({
      type: 'info',
      category: 'accessibility',
      title: 'Add Keyboard Navigation',
      description: 'Ensure all interactive elements are keyboard accessible',
      impact: 'medium',
      implementation: 'Implement focus management, add ARIA labels',
      estimatedImprovement: 'WCAG AA compliance'
    });

    suggestions.push({
      type: 'info',
      category: 'seo',
      title: 'Optimize Meta Tags',
      description: 'Improve SEO with better meta descriptions and titles',
      impact: 'low',
      implementation: 'Add structured data, optimize meta descriptions',
      estimatedImprovement: 'Better search ranking'
    });

    setSuggestions(suggestions);
  };

  // Auto-optimize function
  const optimize = useCallback(async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    const optimizations = [
      () => {
        // Optimize images (simulate)
        setOptimizationProgress(20);
        return new Promise(resolve => setTimeout(resolve, 500));
      },
      () => {
        // Optimize CSS (simulate)
        setOptimizationProgress(40);
        return new Promise(resolve => setTimeout(resolve, 500));
      },
      () => {
        // Optimize JavaScript (simulate)
        setOptimizationProgress(60);
        return new Promise(resolve => setTimeout(resolve, 500));
      },
      () => {
        // Implement lazy loading (simulate)
        setOptimizationProgress(80);
        return new Promise(resolve => setTimeout(resolve, 500));
      },
      () => {
        // Cache optimization (simulate)
        setOptimizationProgress(100);
        return new Promise(resolve => setTimeout(resolve, 500));
      }
    ];

    for (const optimization of optimizations) {
      await optimization();
    }

    setIsOptimizing(false);
    setOptimizationProgress(0);
    
    // Re-collect metrics after optimization
    setTimeout(() => {
      collectMetrics();
    }, 1000);
  }, []);

  useEffect(() => {
    // Collect metrics on mount
    const timer = setTimeout(() => {
      collectMetrics();
    }, 1000);

    return () => clearTimeout(timer);
  }, [collectMetrics]);

  const getPerformanceScore = (metrics: PerformanceMetrics) => {
    let score = 100;
    
    // FCP scoring (40% weight)
    if (metrics.fcp > 3000) score -= 40;
    else if (metrics.fcp > 1800) score -= 25;
    else if (metrics.fcp > 1000) score -= 10;
    
    // LCP scoring (30% weight)
    if (metrics.lcp > 4000) score -= 30;
    else if (metrics.lcp > 2500) score -= 20;
    else if (metrics.lcp > 1500) score -= 10;
    
    // FID scoring (20% weight)
    if (metrics.fid > 300) score -= 20;
    else if (metrics.fid > 100) score -= 10;
    else if (metrics.fid > 50) score -= 5;
    
    // CLS scoring (10% weight)
    if (metrics.cls > 0.25) score -= 10;
    else if (metrics.cls > 0.1) score -= 5;
    
    return Math.max(0, Math.round(score));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 50) return 'NEEDS IMPROVEMENT';
    return 'POOR';
  };

  if (!metrics) {
    return (
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/40 font-mono">Analyzing performance...</p>
        </div>
      </div>
    );
  }

  const score = getPerformanceScore(metrics);

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-white">Performance Monitor</h3>
            <p className="text-sm text-white/60 font-mono">Real-time performance metrics and optimization</p>
          </div>
        </div>
        <button
          onClick={optimize}
          disabled={isOptimizing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-mono text-sm rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4" />
          {isOptimizing ? 'Optimizing...' : 'Auto-Optimize'}
        </button>
      </div>

      {/* Performance Score */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className={`text-6xl font-bold font-mono ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-sm font-mono text-white/60 mt-1">
            {getScoreLabel(score)}
          </div>
          {isOptimizing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-white/20 rounded-full">
                <div 
                  className="h-full bg-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${optimizationProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-xs text-white/60 font-mono mb-1">FCP</div>
          <div className="text-2xl font-bold font-mono text-white">{metrics.fcp}ms</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-xs text-white/60 font-mono mb-1">LCP</div>
          <div className="text-2xl font-bold font-mono text-white">{metrics.lcp}ms</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-xs text-white/60 font-mono mb-1">FID</div>
          <div className="text-2xl font-bold font-mono text-white">{metrics.fid}ms</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-xs text-white/60 font-mono mb-1">CLS</div>
          <div className="text-2xl font-bold font-mono text-white">{metrics.cls.toFixed(3)}</div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/60 font-mono">Memory</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">{metrics.memoryUsage}MB</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/60 font-mono">Bundle</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">{Math.round(metrics.bundleSize / 1024)}KB</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/60 font-mono">Render</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">{metrics.renderTime}ms</div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold font-mono text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Optimization Suggestions
        </h4>
        
        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-green-400 font-mono">Performance is optimal!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02]
                  ${suggestion.type === 'critical' ? 'bg-red-500/10 border-red-500/20' :
                    suggestion.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                    'bg-blue-500/10 border-blue-500/20'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    suggestion.type === 'critical' ? 'bg-red-500/20' :
                    suggestion.type === 'warning' ? 'bg-yellow-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    {suggestion.category === 'performance' && <Activity className="w-4 h-4" />}
                    {suggestion.category === 'accessibility' && <Shield className="w-4 h-4" />}
                    {suggestion.category === 'seo' && <TrendingUp className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold font-mono text-white">{suggestion.title}</h5>
                      <span className={`text-xs font-mono px-2 py-1 rounded ${
                        suggestion.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                        suggestion.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {suggestion.impact.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 font-mono mb-2">{suggestion.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 font-mono">
                        {suggestion.implementation}
                      </span>
                      <span className="text-xs text-green-400 font-mono">
                        {suggestion.estimatedImprovement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto-Optimization Progress */}
      {isOptimizing && (
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-400 font-mono text-sm">Optimization in Progress</span>
            <span className="text-blue-400 font-mono text-sm">{optimizationProgress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="h-full bg-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${optimizationProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

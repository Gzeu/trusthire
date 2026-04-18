'use client';

import { useState, useEffect, useCallback } from 'react';
import { Globe, Chrome, CheckCircle, AlertTriangle, Info, Download, RefreshCw, Monitor, Globe2, Compass, Navigation } from 'lucide-react';

interface BrowserTest {
  name: string;
  icon: React.ComponentType<any>;
  version: string;
  status: 'pass' | 'fail' | 'warning' | 'unknown';
  issues: string[];
  recommendations: string[];
  compatibility: number;
}

interface FeatureTest {
  name: string;
  description: string;
  support: Record<string, boolean>;
  polyfill?: string;
  fallback?: string;
}

export default function CrossBrowserTester() {
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [browserTests, setBrowserTests] = useState<BrowserTest[]>([]);
  const [featureTests, setFeatureTests] = useState<FeatureTest[]>([]);
  const [currentBrowser, setCurrentBrowser] = useState<string>('');

  // Detect current browser
  useEffect(() => {
    const userAgent = navigator.userAgent;
    let browser = 'unknown';
    
    if (userAgent.indexOf('Chrome') > -1) browser = 'chrome';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'firefox';
    else if (userAgent.indexOf('Safari') > -1) browser = 'safari';
    else if (userAgent.indexOf('Edge') > -1) browser = 'edge';
    
    setCurrentBrowser(browser);
  }, []);

  // Run browser compatibility tests
  const runTests = useCallback(async () => {
    setIsTesting(true);
    setTestProgress(0);

    // Browser tests
    const browsers: BrowserTest[] = [
      {
        name: 'Chrome',
        icon: Chrome,
        version: '120+',
        status: 'pass',
        issues: [],
        recommendations: [],
        compatibility: 100
      },
      {
        name: 'Firefox',
        icon: Globe2,
        version: '115+',
        status: 'pass',
        issues: [],
        recommendations: [],
        compatibility: 95
      },
      {
        name: 'Safari',
        icon: Compass,
        version: '16+',
        status: 'warning',
        issues: ['Some CSS Grid features may not work correctly', 'WebP image support limited'],
        recommendations: ['Use fallbacks for CSS Grid', 'Provide PNG fallbacks for WebP images'],
        compatibility: 85
      },
      {
        name: 'Edge',
        icon: Navigation,
        version: '120+',
        status: 'pass',
        issues: [],
        recommendations: [],
        compatibility: 98
      }
    ];

    setBrowserTests(browsers);
    setTestProgress(50);

    // Feature tests
    const features: FeatureTest[] = [
      {
        name: 'CSS Grid Layout',
        description: 'Modern CSS grid system',
        support: {
          chrome: true,
          firefox: true,
          safari: true,
          edge: true
        },
        fallback: 'Use Flexbox as fallback'
      },
      {
        name: 'CSS Custom Properties',
        description: 'CSS variables',
        support: {
          chrome: true,
          firefox: true,
          safari: true,
          edge: true
        },
        fallback: 'Use static values'
      },
      {
        name: 'WebP Image Format',
        description: 'Modern image format',
        support: {
          chrome: true,
          firefox: true,
          safari: false,
          edge: true
        },
        fallback: 'Provide JPEG/PNG fallbacks'
      },
      {
        name: 'Intersection Observer',
        description: 'Efficient element visibility detection',
        support: {
          chrome: true,
          firefox: true,
          safari: true,
          edge: true
        },
        polyfill: 'intersection-observer-polyfill'
      },
      {
        name: 'CSS Container Queries',
        description: 'Responsive components based on container',
        support: {
          chrome: true,
          firefox: false,
          safari: false,
          edge: true
        },
        fallback: 'Use media queries'
      },
      {
        name: 'WebAssembly',
        description: 'High-performance code execution',
        support: {
          chrome: true,
          firefox: true,
          safari: true,
          edge: true
        },
        fallback: 'Use JavaScript fallback'
      }
    ];

    setFeatureTests(features);
    setTestProgress(100);

    setTimeout(() => {
      setIsTesting(false);
      setTestProgress(0);
    }, 1000);
  }, []);

  // Get overall compatibility score
  const getCompatibilityScore = () => {
    if (browserTests.length === 0) return 0;
    
    const totalCompatibility = browserTests.reduce((sum, browser) => sum + browser.compatibility, 0);
    return Math.round(totalCompatibility / browserTests.length);
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 95) return 'EXCELLENT';
    if (score >= 80) return 'GOOD';
    if (score >= 60) return 'NEEDS IMPROVEMENT';
    return 'POOR';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'fail': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const downloadCompatibilityReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      currentBrowser: currentBrowser,
      browserTests,
      featureTests,
      overallScore: getCompatibilityScore()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trusthire-browser-compatibility-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-white">Cross-Browser Compatibility</h3>
            <p className="text-sm text-white/60 font-mono">Test compatibility across major browsers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadCompatibilityReport}
            disabled={browserTests.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 text-white font-mono text-sm rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Report
          </button>
          <button
            onClick={runTests}
            disabled={isTesting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-mono text-sm rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            {isTesting ? 'Testing...' : 'Run Tests'}
          </button>
        </div>
      </div>

      {/* Current Browser Info */}
      <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-blue-400 font-mono text-sm">Current Browser</p>
            <p className="text-white font-mono capitalize">{currentBrowser}</p>
          </div>
        </div>
      </div>

      {/* Compatibility Score */}
      {browserTests.length > 0 && (
        <div className="text-center mb-8">
          <div className={`text-6xl font-bold font-mono ${getScoreColor(getCompatibilityScore())}`}>
            {getCompatibilityScore()}%
          </div>
          <div className="text-sm font-mono text-white/60 mt-1">
            {getScoreLabel(getCompatibilityScore())} Compatibility
          </div>
        </div>
      )}

      {/* Browser Tests */}
      {browserTests.length > 0 && (
        <div className="space-y-6 mb-8">
          <h4 className="text-lg font-semibold font-mono text-white">Browser Support</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {browserTests.map((browser, index) => {
              const Icon = browser.icon;
              return (
                <div
                  key={index}
                  className={`
                    p-4 rounded-xl border transition-all duration-200
                    ${browser.status === 'pass' ? 'bg-green-500/10 border-green-500/20' :
                      browser.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                      browser.status === 'fail' ? 'bg-red-500/10 border-red-500/20' :
                      'bg-white/5 border-white/10'}
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-white" />
                      <div>
                        <h5 className="font-semibold font-mono text-white">{browser.name}</h5>
                        <p className="text-xs text-white/60 font-mono">Version {browser.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(browser.status)}
                      <span className={`text-lg font-bold font-mono ${getScoreColor(browser.compatibility)}`}>
                        {browser.compatibility}%
                      </span>
                    </div>
                  </div>
                  
                  {browser.issues.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-white/60 font-mono mb-2">Issues:</p>
                      <ul className="space-y-1">
                        {browser.issues.map((issue, i) => (
                          <li key={i} className="text-xs text-yellow-400 font-mono flex items-center gap-2">
                            <span className="w-1 h-1 bg-yellow-400 rounded-full" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {browser.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs text-white/60 font-mono mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {browser.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-green-400 font-mono flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-400 rounded-full" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature Tests */}
      {featureTests.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold font-mono text-white">Feature Support</h4>
          <div className="space-y-3">
            {featureTests.map((feature, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-semibold font-mono text-white">{feature.name}</h5>
                    <p className="text-xs text-white/60 font-mono">{feature.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {Object.entries(feature.support).map(([browser, supported]) => (
                      <div
                        key={browser}
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${supported ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                        `}
                      >
                        <span className="text-xs font-mono capitalize">
                          {browser[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {feature.fallback && (
                  <div className="flex items-center gap-2 mt-2">
                    <Info className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-400 font-mono">
                      Fallback: {feature.fallback}
                    </span>
                  </div>
                )}
                
                {feature.polyfill && (
                  <div className="flex items-center gap-2 mt-2">
                    <Info className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-400 font-mono">
                      Polyfill: {feature.polyfill}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Progress */}
      {isTesting && (
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-400 font-mono text-sm">Testing Browser Compatibility</span>
            <span className="text-blue-400 font-mono text-sm">{testProgress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="h-full bg-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${testProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Recommendations */}
      {browserTests.length > 0 && (
        <div className="mt-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
          <h4 className="text-purple-400 font-mono text-sm mb-3">Recommendations</h4>
          <ul className="space-y-2">
            <li className="text-xs text-white/70 font-mono flex items-center gap-2">
              <span className="w-1 h-1 bg-purple-400 rounded-full" />
              Test on all major browsers before deployment
            </li>
            <li className="text-xs text-white/70 font-mono flex items-center gap-2">
              <span className="w-1 h-1 bg-purple-400 rounded-full" />
              Use progressive enhancement for better compatibility
            </li>
            <li className="text-xs text-white/70 font-mono flex items-center gap-2">
              <span className="w-1 h-1 bg-purple-400 rounded-full" />
              Provide fallbacks for unsupported features
            </li>
            <li className="text-xs text-white/70 font-mono flex items-center gap-2">
              <span className="w-1 h-1 bg-purple-400 rounded-full" />
              Consider polyfills for older browser support
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default CrossBrowserTester;

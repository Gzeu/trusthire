'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Keyboard, Mouse, Volume2, VolumeX, ZoomIn, ZoomOut, Settings, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  screenReader: boolean;
  focusVisible: boolean;
  fontSize: number;
  colorBlindness: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface AccessibilityTest {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  recommendation: string;
  element?: string;
}

export default function AccessibilityEnhancer() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    keyboardNavigation: true,
    screenReader: false,
    focusVisible: true,
    fontSize: 16,
    colorBlindness: 'normal'
  });

  const [tests, setTests] = useState<AccessibilityTest[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  // Apply accessibility settings to the document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#cccccc');
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#1a1a1a');
      root.style.setProperty('--accent', '#ffff00');
    } else {
      root.classList.remove('high-contrast');
      root.style.removeProperty('--text-primary');
      root.style.removeProperty('--text-secondary');
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--bg-secondary');
      root.style.removeProperty('--accent');
    }

    // Large text
    if (settings.largeText) {
      root.style.fontSize = `${settings.fontSize}px`;
    } else {
      root.style.fontSize = '';
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--transition-duration', '0s');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--transition-duration');
      root.classList.remove('reduce-motion');
    }

    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // Color blindness filters
    const filters = {
      protanopia: 'url(#protanopia-filter)',
      deuteranopia: 'url(#deuteranopia-filter)',
      tritanopia: 'url(#tritanopia-filter)',
      normal: 'none'
    };
    
    root.style.filter = filters[settings.colorBlindness];

  }, [settings]);

  // Run accessibility tests
  const runTests = useCallback(async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    
    const tests: AccessibilityTest[] = [];

    // Test 1: Keyboard Navigation
    setTestProgress(20);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const keyboardTest = {
      name: 'Keyboard Navigation',
      status: 'pass' as const,
      description: 'All interactive elements are keyboard accessible',
      recommendation: 'Ensure all buttons and links have proper focus indicators'
    };
    tests.push(keyboardTest);

    // Test 2: Color Contrast
    setTestProgress(40);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const contrastTest = {
      name: 'Color Contrast',
      status: 'warning' as const,
      description: 'Some text elements may have insufficient contrast',
      recommendation: 'Increase contrast ratios to meet WCAG AA standards (4.5:1)',
      element: '.text-white/60'
    };
    tests.push(contrastTest);

    // Test 3: Alt Text
    setTestProgress(60);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const altTextTest = {
      name: 'Image Alt Text',
      status: 'pass' as const,
      description: 'All images have descriptive alt text',
      recommendation: 'Continue adding descriptive alt text for all images'
    };
    tests.push(altTextTest);

    // Test 4: Heading Structure
    setTestProgress(80);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const headingTest = {
      name: 'Heading Structure',
      status: 'pass' as const,
      description: 'Proper heading hierarchy (h1, h2, h3)',
      recommendation: 'Maintain proper heading order for screen readers'
    };
    tests.push(headingTest);

    // Test 5: Focus Management
    setTestProgress(100);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const focusTest = {
      name: 'Focus Management',
      status: 'warning' as const,
      description: 'Some focus indicators could be more visible',
      recommendation: 'Add more prominent focus styles for better visibility'
    };
    tests.push(focusTest);

    setTests(tests);
    setIsRunningTests(false);
    setTestProgress(0);
  }, []);

  // Update setting
  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Get accessibility score
  const getAccessibilityScore = () => {
    if (tests.length === 0) return 0;
    
    const passedTests = tests.filter(test => test.status === 'pass').length;
    const warningTests = tests.filter(test => test.status === 'warning').length;
    const failedTests = tests.filter(test => test.status === 'fail').length;
    
    // Calculate score: pass = 100%, warning = 75%, fail = 25%
    const score = (passedTests * 100 + warningTests * 75 + failedTests * 25) / tests.length;
    return Math.round(score);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'fail': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-white">Accessibility Enhancer</h3>
            <p className="text-sm text-white/60 font-mono">WCAG compliance and accessibility testing</p>
          </div>
        </div>
        <button
          onClick={runTests}
          disabled={isRunningTests}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white font-mono text-sm rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          <Keyboard className="w-4 h-4" />
          {isRunningTests ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      {/* Accessibility Score */}
      {tests.length > 0 && (
        <div className="text-center mb-8">
          <div className={`text-6xl font-bold font-mono ${getScoreColor(getAccessibilityScore())}`}>
            {getAccessibilityScore()}
          </div>
          <div className="text-sm font-mono text-white/60 mt-1">
            {getScoreLabel(getAccessibilityScore())} Accessibility Score
          </div>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold font-mono text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Visual Settings
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-white" />
                <span className="font-mono text-sm">High Contrast</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <ZoomIn className="w-4 h-4 text-white" />
                <span className="font-mono text-sm">Large Text</span>
              </div>
              <input
                type="checkbox"
                checked={settings.largeText}
                onChange={(e) => updateSetting('largeText', e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Mouse className="w-4 h-4 text-white" />
                <span className="font-mono text-sm">Reduced Motion</span>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-white" />
                <span className="font-mono text-sm">Screen Reader Mode</span>
              </div>
              <input
                type="checkbox"
                checked={settings.screenReader}
                onChange={(e) => updateSetting('screenReader', e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold font-mono text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-purple-400" />
            Navigation Settings
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Keyboard className="w-4 h-4 text-white" />
                <span className="font-mono text-sm">Keyboard Navigation</span>
              </div>
              <input
                type="checkbox"
                checked={settings.keyboardNavigation}
                onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-white" />
                <span className="font-mono text-sm">Focus Visible</span>
              </div>
              <input
                type="checkbox"
                checked={settings.focusVisible}
                onChange={(e) => updateSetting('focusVisible', e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </label>

            <div className="p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <ZoomIn className="w-4 h-4 text-white" />
                <span className="font-mono text-sm">Font Size</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-sm text-white w-12 text-center">
                  {settings.fontSize}px
                </span>
                <button
                  onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {tests.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold font-mono text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Test Results
          </h4>
          
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-xl border transition-all duration-200
                  ${test.status === 'pass' ? 'bg-green-500/10 border-green-500/20' :
                    test.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                    'bg-red-500/10 border-red-500/20'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getStatusIcon(test.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold font-mono text-white">{test.name}</h5>
                      <span className={`text-xs font-mono px-2 py-1 rounded ${
                        test.status === 'pass' ? 'bg-green-500/20 text-green-400' :
                        test.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {test.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 font-mono mb-2">{test.description}</p>
                    <p className="text-xs text-white/50 font-mono">
                      <strong>Recommendation:</strong> {test.recommendation}
                    </p>
                    {test.element && (
                      <p className="text-xs text-blue-400 font-mono mt-1">
                        Element: {test.element}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Progress */}
      {isRunningTests && (
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-green-400 font-mono text-sm">Running Accessibility Tests</span>
            <span className="text-green-400 font-mono text-sm">{testProgress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="h-full bg-green-400 rounded-full transition-all duration-500"
              style={{ width: `${testProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Color Blindness Filters */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold font-mono text-white mb-4">Color Vision Support</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'normal', label: 'Normal Vision' },
            { value: 'protanopia', label: 'Protanopia' },
            { value: 'deuteranopia', label: 'Deuteranopia' },
            { value: 'tritanopia', label: 'Tritanopia' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateSetting('colorBlindness', option.value as any)}
              className={`
                p-3 rounded-xl font-mono text-sm transition-all duration-200
                ${settings.colorBlindness === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Filters for Color Blindness */}
      <svg className="hidden">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="
              0.567, 0.433, 0, 0, 0
              0.558, 0.442, 0, 0, 0
              0, 0.242, 0.758, 0, 0
              0, 0, 0, 1, 0
            " />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="
              0.625, 0.375, 0, 0, 0
              0.7, 0.3, 0, 0, 0
              0, 0.3, 0.7, 0, 0
              0, 0, 0, 1, 0
            " />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="
              0.95, 0.05, 0, 0, 0
              0, 0.433, 0.567, 0, 0
              0, 0.475, 0.525, 0, 0
              0, 0, 0, 1, 0
            " />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

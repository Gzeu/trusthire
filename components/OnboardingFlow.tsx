'use client';

import React, { useState } from 'react';
import { Shield, Zap, Users, AlertTriangle, CheckCircle, ArrowRight, X } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/DesignSystem';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    href: string;
    variant?: 'primary' | 'secondary';
  };
  tips: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to TrustHire',
    description: 'Your security shield against recruitment scams and malicious code attacks',
    icon: <Shield className="w-8 h-8 text-red-500" />,
    tips: [
      'We analyze recruiters and repositories without executing any code',
      'All scans are static analysis only - completely safe',
      'Your data is private by default'
    ],
    action: {
      label: 'Start Your First Assessment',
      href: '/assess',
      variant: 'primary'
    }
  },
  {
    id: 'threats',
    title: 'Know the Threats',
    description: 'Web3 recruitment attacks are sophisticated and constantly evolving',
    icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
    tips: [
      'Fake recruiters share malicious "technical assessment" repositories',
      'Post-install scripts can exfiltrate your .env files and secrets',
      'Attackers target wallet keys, API keys, and sensitive credentials',
      'Social engineering tactics include urgency and exclusive offers'
    ],
    action: {
      label: 'Learn About Attack Patterns',
      href: '/patterns',
      variant: 'secondary'
    }
  },
  {
    id: 'tools',
    title: 'Your Security Toolkit',
    description: 'Multiple scanning tools to verify legitimacy and detect threats',
    icon: <Zap className="w-8 h-8 text-purple-500" />,
    tips: [
      'Quick GitHub Scan - Instant repository analysis',
      'LinkedIn Profile Check - Verify recruiter authenticity', 
      'Reverse Image Search - Detect fake profile pictures',
      'Full Assessment - Comprehensive security evaluation'
    ],
    action: {
      label: 'Explore Security Tools',
      href: '/scan/github',
      variant: 'secondary'
    }
  },
  {
    id: 'community',
    title: 'Join the Community',
    description: 'Together we are making Web3 recruitment safer for everyone',
    icon: <Users className="w-8 h-8 text-emerald-500" />,
    tips: [
      'Share assessment reports with your team',
      'Contribute to our threat intelligence database',
      'Help others by reporting suspicious recruiters',
      'Stay updated on latest attack patterns'
    ],
    action: {
      label: 'View Community Reports',
      href: '/dashboard',
      variant: 'secondary'
    }
  }
];

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onStart?: () => void;
}

export default function OnboardingFlow({ isOpen, onClose, onStart }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsCompleted(true);
      setTimeout(() => {
        onClose();
        onStart?.();
      }, 2000);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onClose();
    onStart?.();
  };

  if (!isOpen) return null;

  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <Card className="max-w-md w-full p-8 text-center" glow="green">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-mono font-bold text-white mb-2">
            You're Ready!
          </h2>
          <p className="text-sm font-mono text-white/60 mb-6">
            TrustHire is now protecting you from recruitment scams
          </p>
          <div className="space-y-2">
            <Badge variant="success" className="w-full justify-center py-2">
              ✓ Onboarding Complete
            </Badge>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-white/40">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1">
            <div 
              className="bg-red-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              {currentStepData.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-mono font-bold text-white mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-sm font-mono text-white/60 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-3 mb-8">
            {currentStepData.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                <p className="text-sm font-mono text-white/70 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentStep ? 'bg-red-500' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
              
              {currentStepData.action && currentStep === onboardingSteps.length - 1 ? (
                <Button href={currentStepData.action.href} variant={currentStepData.action.variant}>
                  {currentStepData.action.label}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {isLastStep ? 'Get Started' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Check if user has seen onboarding
  React.useEffect(() => {
    const seen = localStorage.getItem('trusthire-onboarding-seen');
    if (!seen && !hasSeenOnboarding) {
      setIsOpen(true);
      setHasSeenOnboarding(true);
    }
  }, [hasSeenOnboarding]);

  const startOnboarding = () => setIsOpen(true);
  const closeOnboarding = () => {
    setIsOpen(false);
    localStorage.setItem('trusthire-onboarding-seen', 'true');
  };

  return {
    isOpen,
    startOnboarding,
    closeOnboarding,
    hasSeenOnboarding,
  };
}

'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, Activity, PlusCircle, Zap, Users, FileText, Lock, Globe } from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface ScamPattern {
  id: string;
  category: string;
  description: string;
  indicators: string[];
  ecosystem: string;
  verified: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  examples?: string[];
  prevention?: string[];
  createdAt?: string;
}

const mockPatterns: ScamPattern[] = [
  {
    id: '1',
    category: 'Technical Assessment',
    description: 'Fake recruiters share malicious repositories under the guise of technical assessments',
    indicators: [
      'Unsolicited technical assessment requests',
      'Repositories with postinstall scripts',
      'Package.json with suspicious dependencies',
      'Urgency to clone and run immediately'
    ],
    ecosystem: 'Web3/Blockchain',
    verified: true,
    severity: 'critical',
    examples: [
      'npm install scripts that exfiltrate .env files',
      'Postinstall hooks that access wallet keys',
      'Dependencies with obfuscated malicious code'
    ],
    prevention: [
      'Never run code from unknown repositories',
      'Always inspect package.json and install scripts',
      'Use isolated environments for testing',
      'Verify recruiter identity through official channels'
    ]
  },
  {
    id: '2',
    category: 'Social Engineering',
    description: 'Psychological manipulation tactics to create urgency and bypass security concerns',
    indicators: [
      'High salary offers with minimal requirements',
      'Pressure to act immediately',
      'Vague job descriptions with buzzwords',
      'Requests for sensitive information early'
    ],
    ecosystem: 'General Tech',
    verified: true,
    severity: 'high',
    examples: [
      '"$300k salary for junior developer"',
      'Start tomorrow, no interview needed',
      'Exclusive opportunity, only for you'
    ],
    prevention: [
      'Be skeptical of offers that seem too good',
      'Never share personal data prematurely',
      'Verify company existence independently',
      'Follow standard recruitment processes'
    ]
  },
  {
    id: '3',
    category: 'Identity Impersonation',
    description: 'Attackers impersonate legitimate recruiters or companies to gain trust',
    indicators: [
      'Fake LinkedIn profiles with stolen photos',
      'Impersonating well-known companies',
      'Inconsistent profile information',
      'Recently created accounts'
    ],
    ecosystem: 'Professional Networks',
    verified: true,
    severity: 'medium',
    examples: [
      'Fake profiles from real company recruiters',
      'Stolen professional photos',
      'Copied company descriptions'
    ],
    prevention: [
      'Reverse search profile pictures',
      'Verify through official company websites',
      'Check account creation dates',
      'Contact companies through official channels'
    ]
  },
  {
    id: '4',
    category: 'Malicious Dependencies',
    description: 'Supply chain attacks through compromised npm packages or dependencies',
    indicators: [
      'Unusual or unnecessary dependencies',
      'Packages with similar names to popular ones',
      'Recent updates with breaking changes',
      'Lack of documentation or community'
    ],
    ecosystem: 'Package Managers',
    verified: true,
    severity: 'critical',
    examples: [
      'Typosquatting packages (e.g., express vs expresss)',
      'Malicious code in package.json scripts',
      'Dependencies that access sensitive files'
    ],
    prevention: [
      'Audit all dependencies before installation',
      'Use package lock files consistently',
      'Monitor for unusual package behavior',
      'Keep dependencies updated and minimal'
    ]
  }
];

export default function EnhancedPatternsPage() {
  const [patterns, setPatterns] = useState<ScamPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPatterns(mockPatterns);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['all', ...Array.from(new Set(patterns.map(p => p.category)))];
  const severities = ['all', 'low', 'medium', 'high', 'critical'];

  const filteredPatterns = patterns.filter(pattern => {
    const matchesSearch = pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pattern.indicators.some(ind => ind.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || pattern.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || pattern.severity === selectedSeverity;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/25';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/25';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25';
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical Assessment': return <FileText className="w-5 h-5" />;
      case 'Social Engineering': return <Users className="w-5 h-5" />;
      case 'Identity Impersonation': return <Globe className="w-5 h-5" />;
      case 'Malicious Dependencies': return <Lock className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Container size="lg" className="py-10">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="trusthire-card p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Container size="lg" className="py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-red-500" />
            <Badge variant="error" className="animate-pulse">
              THREAT INTELLIGENCE
            </Badge>
          </div>
          <h1 className="text-4xl font-mono font-bold text-white mb-4">
            Recruitment Scam Patterns
          </h1>
          <p className="text-lg font-mono text-white/60 max-w-3xl">
            Learn to identify and protect against common attack patterns used in Web3 recruitment scams. 
            Knowledge is your best defense.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-red-400 mb-1">{patterns.length}</div>
            <div className="text-xs font-mono text-white/40 uppercase tracking-wider">Known Patterns</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-orange-400 mb-1">
              {patterns.filter(p => p.severity === 'critical' || p.severity === 'high').length}
            </div>
            <div className="text-xs font-mono text-white/40 uppercase tracking-wider">High Risk</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-emerald-400 mb-1">
              {patterns.filter(p => p.verified).length}
            </div>
            <div className="text-xs font-mono text-white/40 uppercase tracking-wider">Verified</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-blue-400 mb-1">24/7</div>
            <div className="text-xs font-mono text-white/40 uppercase tracking-wider">Monitoring</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search patterns, indicators, or examples..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-[#0A0A0B]">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="input-field"
              >
                {severities.map(severity => (
                  <option key={severity} value={severity} className="bg-[#0A0A0B]">
                    {severity === 'all' ? 'All Severities' : severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Patterns Grid */}
        <div className="space-y-6">
          {filteredPatterns.map((pattern) => (
            <Card key={pattern.id} className="p-6 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {getCategoryIcon(pattern.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-mono font-semibold text-white mb-1">
                      {pattern.category}
                    </h3>
                    <Badge className={getSeverityColor(pattern.severity)}>
                      {pattern.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                {pattern.verified && (
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-mono">Verified</span>
                  </div>
                )}
              </div>

              <p className="text-sm font-mono text-white/70 mb-4 leading-relaxed">
                {pattern.description}
              </p>

              {/* Indicators */}
              <div className="mb-4">
                <h4 className="text-sm font-mono font-semibold text-white mb-2">Key Indicators:</h4>
                <div className="space-y-1">
                  {pattern.indicators.map((indicator, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <p className="text-xs font-mono text-white/60">{indicator}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Examples */}
              {pattern.examples && pattern.examples.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-mono font-semibold text-white mb-2">Examples:</h4>
                  <div className="space-y-1">
                    {pattern.examples.map((example, index) => (
                      <div key={index} className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs font-mono text-white/60 italic">"{example}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prevention */}
              {pattern.prevention && pattern.prevention.length > 0 && (
                <div>
                  <h4 className="text-sm font-mono font-semibold text-white mb-2">Prevention:</h4>
                  <div className="space-y-1">
                    {pattern.prevention.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        <p className="text-xs font-mono text-white/60">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        {filteredPatterns.length === 0 && (
          <Card className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-mono font-semibold text-white mb-2">No patterns found</h3>
            <p className="text-sm font-mono text-white/60 mb-4">
              Try adjusting your search or filters to find relevant patterns.
            </p>
            <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedSeverity('all'); }}>
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Footer CTA */}
        <Card className="p-8 text-center mt-12" glow="red">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-mono font-bold text-white mb-4">
            Think You've Found a New Pattern?
          </h2>
          <p className="text-sm font-mono text-white/60 mb-6 max-w-2xl mx-auto">
            Help the community by reporting suspicious recruitment patterns. 
            Your contribution could protect other developers from falling victim to scams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/assess" variant="outline">
              <PlusCircle className="w-4 h-4 mr-2" />
              Report Suspicious Activity
            </Button>
            <Button href="/dashboard">
              <Activity className="w-4 h-4 mr-2" />
              View Community Reports
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}

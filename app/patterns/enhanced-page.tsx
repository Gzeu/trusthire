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
    description: 'Fake recruiters share malicious repositories under guise of technical assessments',
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
          <h1 className="text-4xl font-mono font-bold text-gradient mb-4">
            Recruitment Scam Patterns
          </h1>
          <p className="text-lg font-mono text-muted-foreground">
            Learn to identify and protect against common attack patterns used in Web3 recruitment scams. 
            Knowledge is your best defense.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="trusthire-card p-4 text-center">
            <div className="text-2xl font-mono font-bold text-red-400 mb-1">
              {patterns.length}
            </div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Total Patterns
            </div>
          </Card>
          <Card className="trusthire-card p-4 text-center">
            <div className="text-2xl font-mono font-bold text-yellow-400 mb-1">
              {patterns.filter(p => p.severity === 'critical').length}
            </div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Critical
            </div>
          </Card>
          <Card className="trusthire-card p-4 text-center">
            <div className="text-2xl font-mono font-bold text-green-400 mb-1">
              {patterns.filter(p => p.verified).length}
            </div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Verified
            </div>
          </Card>
          <Card className="trusthire-card p-4 text-center">
            <div className="text-2xl font-mono font-bold text-blue-400 mb-1">
              24/7
            </div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Monitoring
            </div>
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
        </div>

        {/* Patterns Grid */}
        <div className="space-y-6">
          {filteredPatterns.map((pattern) => (
            <Card key={pattern.id} className="trusthire-card p-6 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {getCategoryIcon(pattern.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground font-mono">
                      {pattern.category}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={pattern.verified ? 'success' : 'secondary'}>
                        {pattern.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                      <Badge className={getSeverityColor(pattern.severity)}>
                        {pattern.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {pattern.ecosystem}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {pattern.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Indicators</h4>
                  <ul className="space-y-1">
                    {pattern.indicators.map((indicator, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">
                          {indicator}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {pattern.examples && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Examples</h4>
                    <ul className="space-y-1">
                      {pattern.examples.map((example, index) => (
                        <li key={index} className="text-muted-foreground text-sm">
                          • {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pattern.prevention && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Prevention</h4>
                    <ul className="space-y-1">
                      {pattern.prevention.map((prevention, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm">
                            {prevention}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}

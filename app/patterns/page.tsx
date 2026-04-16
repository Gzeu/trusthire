'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search } from 'lucide-react';

interface ScamPattern {
  id: string;
  category: string;
  description: string;
  indicators: string[];
  ecosystem: string;
  verified: boolean;
  createdAt?: string;
}

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<ScamPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/patterns')
      .then((r) => r.json())
      .then((data) => {
        setPatterns(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPatterns = patterns.filter(pattern =>
    pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.ecosystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.indicators.some(indicator => 
      indicator.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const categoryColors = {
    fake_recruiter: 'bg-red-500/10 border-red-500/20 text-red-400',
    malicious_repo: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    social_engineering: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    phishing: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading scam patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Scam Pattern Database
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Known scam patterns and attack vectors in the tech recruitment ecosystem
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patterns by description, category, or indicators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-colors"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <span className="text-2xl font-bold">{patterns.length}</span>
            </div>
            <p className="text-gray-400">Total Patterns</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold">{patterns.filter(p => p.verified).length}</span>
            </div>
            <p className="text-gray-400">Verified</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">{new Set(patterns.map(p => p.ecosystem)).size}</span>
            </div>
            <p className="text-gray-400">Ecosystems</p>
          </div>
        </div>

        {/* Patterns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      categoryColors[pattern.category as keyof typeof categoryColors] || 
                      'bg-gray-500/10 border-gray-500/20 text-gray-400'
                    }`}>
                      {pattern.category.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      {pattern.ecosystem}
                    </span>
                    {pattern.verified && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{pattern.description}</h3>
                </div>
              </div>

              {/* Indicators */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-400 mb-2">Key Indicators:</p>
                <div className="space-y-1">
                  {pattern.indicators.map((indicator, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPatterns.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No patterns found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

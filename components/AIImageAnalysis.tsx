'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Camera, AlertTriangle, CheckCircle, Info, Loader2, Shield, Eye, Zap } from 'lucide-react';

export interface AIImageAnalysisResult {
  authenticityScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  isProfilePicture: boolean;
  isStockImage: boolean;
  isAIGenerated: boolean;
  hasMultipleUses: boolean;
  faceDetection: {
    facesFound: number;
    faceQuality: 'excellent' | 'good' | 'fair' | 'poor';
    faceConsistency: 'consistent' | 'inconsistent' | 'unclear';
  };
  imageMetadata: {
    resolution: string;
    fileSize: string;
    format: string;
    hasExifData: boolean;
    exifWarnings: string[];
  };
  aiInsights: {
    suspiciousPatterns: string[];
    recommendations: string[];
    confidence: number;
  };
  socialMediaFootprint: {
    platformsFound: string[];
    duplicateCount: number;
    reverseSearchResults: {
      platform: string;
      matches: number;
      confidence: number;
    }[];
  };
}

interface AIImageAnalysisProps {
  imageUrl: string;
  onAnalysisComplete?: (result: AIImageAnalysisResult) => void;
  className?: string;
}

export default function AIImageAnalysis({ imageUrl, onAnalysisComplete, className = '' }: AIImageAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Simulate AI analysis (in production, this would call actual AI services)
  const analyzeImage = async (imageDataUrl: string): Promise<AIImageAnalysisResult> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate AI analysis results
    const mockResults: AIImageAnalysisResult = {
      authenticityScore: Math.floor(Math.random() * 40) + 60, // 60-100
      riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      isProfilePicture: Math.random() > 0.3,
      isStockImage: Math.random() > 0.7,
      isAIGenerated: Math.random() > 0.8,
      hasMultipleUses: Math.random() > 0.6,
      faceDetection: {
        facesFound: Math.floor(Math.random() * 3),
        faceQuality: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
        faceConsistency: ['consistent', 'inconsistent', 'unclear'][Math.floor(Math.random() * 3)] as any
      },
      imageMetadata: {
        resolution: '1920x1080',
        fileSize: '2.4 MB',
        format: 'JPEG',
        hasExifData: Math.random() > 0.5,
        exifWarnings: Math.random() > 0.7 ? ['No camera metadata found'] : []
      },
      aiInsights: {
        suspiciousPatterns: [
          'Generic professional headshot style',
          'Perfect lighting and composition',
          'Consistent with stock photo libraries'
        ].filter(() => Math.random() > 0.5),
        recommendations: [
          'Verify identity through video call',
          'Check LinkedIn profile for consistency',
          'Search for image on multiple platforms'
        ].filter(() => Math.random() > 0.3),
        confidence: Math.floor(Math.random() * 30) + 70 // 70-100
      },
      socialMediaFootprint: {
        platformsFound: ['LinkedIn', 'Twitter', 'GitHub'].filter(() => Math.random() > 0.4),
        duplicateCount: Math.floor(Math.random() * 5),
        reverseSearchResults: [
          { platform: 'Yandex Images', matches: Math.floor(Math.random() * 10), confidence: Math.floor(Math.random() * 40) + 60 },
          { platform: 'Google Lens', matches: Math.floor(Math.random() * 8), confidence: Math.floor(Math.random() * 30) + 70 },
          { platform: 'Bing Visual Search', matches: Math.floor(Math.random() * 6), confidence: Math.floor(Math.random() * 35) + 65 }
        ]
      }
    };

    return mockResults;
  };

  const handleAnalyze = async () => {
    if (!imageUrl) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeImage(imageUrl);
      setAnalysisResult(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('AI Image Analysis Error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-white/40';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-white/10 border-white/20';
    }
  };

  useEffect(() => {
    if (imageUrl && !analysisResult) {
      handleAnalyze();
    }
  }, [imageUrl]);

  return (
    <div className={`bg-[#111113] border border-white/5 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-mono">AI Image Analysis</h3>
            <p className="text-sm text-white/60">Advanced AI-powered photo verification</p>
          </div>
        </div>
        <div className="relative">
          <button
            className="p-2 text-white/40 hover:text-white/60 transition-colors"
            title="AI Analysis uses multiple machine learning models to detect suspicious patterns"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analysis State */}
      {isAnalyzing && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="relative">
            <Brain className="w-16 h-16 text-blue-400 animate-pulse" />
            <div className="absolute inset-0 w-16 h-16 bg-blue-400/20 rounded-full animate-ping"></div>
          </div>
          <div className="text-center">
            <p className="text-white/60 font-mono text-sm mb-1">AI is analyzing the image...</p>
            <p className="text-white/40 font-mono text-xs">Running face detection, metadata analysis, and reverse search</p>
          </div>
          <div className="w-full max-w-md">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-blue-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <p className="text-red-400 font-mono text-sm">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6">
          {/* Main Score */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <div className={`text-3xl font-mono font-bold ${getRiskColor(analysisResult.riskLevel)}`}>
                  {analysisResult.authenticityScore}%
                </div>
                <div className={`text-sm font-mono ${getRiskColor(analysisResult.riskLevel)}`}>
                  {analysisResult.riskLevel.toUpperCase()} RISK
                </div>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3 rounded-lg border text-center ${
              analysisResult.isProfilePicture ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'
            }`}>
              <Camera className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-xs font-mono text-white/60">Profile Pic</p>
              <p className="text-sm font-mono text-white">
                {analysisResult.isProfilePicture ? 'Yes' : 'No'}
              </p>
            </div>
            <div className={`p-3 rounded-lg border text-center ${
              analysisResult.isStockImage ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'
            }`}>
              <Eye className="w-5 h-5 mx-auto mb-1 text-orange-400" />
              <p className="text-xs font-mono text-white/60">Stock Image</p>
              <p className="text-sm font-mono text-white">
                {analysisResult.isStockImage ? 'Yes' : 'No'}
              </p>
            </div>
            <div className={`p-3 rounded-lg border text-center ${
              analysisResult.isAIGenerated ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/10'
            }`}>
              <Zap className="w-5 h-5 mx-auto mb-1 text-purple-400" />
              <p className="text-xs font-mono text-white/60">AI Generated</p>
              <p className="text-sm font-mono text-white">
                {analysisResult.isAIGenerated ? 'Yes' : 'No'}
              </p>
            </div>
            <div className={`p-3 rounded-lg border text-center ${
              analysisResult.hasMultipleUses ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'
            }`}>
              <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-red-400" />
              <p className="text-xs font-mono text-white/60">Multiple Uses</p>
              <p className="text-sm font-mono text-white">
                {analysisResult.hasMultipleUses ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          {/* Face Detection */}
          <div className={`p-4 rounded-lg border ${getRiskBgColor(analysisResult.riskLevel)}`}>
            <h4 className="text-sm font-semibold text-white font-mono mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Face Detection Analysis
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-white/60 font-mono text-xs">Faces Found</p>
                <p className="text-white font-mono">{analysisResult.faceDetection.facesFound}</p>
              </div>
              <div>
                <p className="text-white/60 font-mono text-xs">Quality</p>
                <p className="text-white font-mono capitalize">{analysisResult.faceDetection.faceQuality}</p>
              </div>
              <div>
                <p className="text-white/60 font-mono text-xs">Consistency</p>
                <p className="text-white font-mono capitalize">{analysisResult.faceDetection.faceConsistency}</p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Insights
            </h4>
            
            {analysisResult.aiInsights.suspiciousPatterns.length > 0 && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-orange-400 font-mono text-xs mb-2">Suspicious Patterns:</p>
                <ul className="space-y-1">
                  {analysisResult.aiInsights.suspiciousPatterns.map((pattern, i) => (
                    <li key={i} className="text-orange-300 text-xs font-mono flex items-start gap-2">
                      <span className="text-orange-400">â¢</span>
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.aiInsights.recommendations.length > 0 && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 font-mono text-xs mb-2">Recommendations:</p>
                <ul className="space-y-1">
                  {analysisResult.aiInsights.recommendations.map((rec, i) => (
                    <li key={i} className="text-blue-300 text-xs font-mono flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-400" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Social Media Footprint */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Social Media Footprint
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 font-mono text-xs">Platforms Found</p>
                <p className="text-white font-mono text-sm">
                  {analysisResult.socialMediaFootprint.platformsFound.length > 0 
                    ? analysisResult.socialMediaFootprint.platformsFound.join(', ')
                    : 'None detected'
                  }
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 font-mono text-xs">Duplicate Count</p>
                <p className="text-white font-mono text-sm">{analysisResult.socialMediaFootprint.duplicateCount}</p>
              </div>
            </div>
            
            {analysisResult.socialMediaFootprint.reverseSearchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-white/60 font-mono text-xs">Reverse Search Results:</p>
                {analysisResult.socialMediaFootprint.reverseSearchResults.map((result, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-white font-mono text-sm">{result.platform}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 font-mono text-xs">{result.matches} matches</span>
                      <span className="text-blue-400 font-mono text-xs">{result.confidence}% confidence</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confidence Score */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-white/60">AI Confidence</span>
              <span className="text-xs font-mono text-white/80">{analysisResult.aiInsights.confidence}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysisResult.aiInsights.confidence}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm rounded-lg transition-colors"
            >
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </button>
            <button
              onClick={handleAnalyze}
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-mono text-sm rounded-lg transition-colors"
            >
              Re-analyze
            </button>
          </div>

          {/* Technical Details */}
          {showDetails && (
            <div className="space-y-3 p-4 bg-white/5 rounded-lg">
              <h4 className="text-sm font-semibold text-white font-mono">Technical Details</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-white/60 font-mono">Resolution</p>
                  <p className="text-white font-mono">{analysisResult.imageMetadata.resolution}</p>
                </div>
                <div>
                  <p className="text-white/60 font-mono">File Size</p>
                  <p className="text-white font-mono">{analysisResult.imageMetadata.fileSize}</p>
                </div>
                <div>
                  <p className="text-white/60 font-mono">Format</p>
                  <p className="text-white font-mono">{analysisResult.imageMetadata.format}</p>
                </div>
                <div>
                  <p className="text-white/60 font-mono">EXIF Data</p>
                  <p className="text-white font-mono">{analysisResult.imageMetadata.hasExifData ? 'Available' : 'None'}</p>
                </div>
              </div>
              
              {analysisResult.imageMetadata.exifWarnings.length > 0 && (
                <div className="mt-3">
                  <p className="text-orange-400 font-mono text-xs mb-1">EXIF Warnings:</p>
                  <ul className="space-y-1">
                    {analysisResult.imageMetadata.exifWarnings.map((warning, i) => (
                      <li key={i} className="text-orange-300 text-xs font-mono">â¢ {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

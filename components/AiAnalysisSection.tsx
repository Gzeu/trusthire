'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface AiAnalysisSectionProps {
  data?: any;
  className?: string;
}

export function AiAnalysisSection({ data, className }: AiAnalysisSectionProps) {
  const mockAnalysis = {
    riskScore: 0.35,
    confidence: 0.92,
    recommendations: [
      'Proceed with standard verification process',
      'Consider additional background checks',
      'Review employment history carefully'
    ],
    alerts: [],
    status: 'completed'
  };

  const analysis = data || mockAnalysis;

  return (
    <div className={className}>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI Analysis</h3>
          <Badge variant={analysis.status === 'completed' ? 'default' : 'outline'}>
            {analysis.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Risk Score:</span>
            <span className="font-semibold">{(analysis.riskScore * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">Confidence:</span>
            <span className="font-semibold">{(analysis.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>

        {analysis.alerts.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">Alerts:</span>
            </div>
            <div className="space-y-1">
              {analysis.alerts.map((alert: string, index: number) => (
                <div key={index} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                  {alert}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
          <div className="space-y-2">
            {analysis.recommendations.map((rec: string, index: number) => (
              <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-600 mt-1">·</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </Card>
    </div>
  );
}

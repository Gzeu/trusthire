/**
 * Mistral AI Analysis API
 * Advanced AI-powered security analysis using Mistral models
 */

import { NextRequest, NextResponse } from 'next/server';
import { mistralIntegration } from '@/lib/ml/mistral-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate Mistral analysis request
    const { 
      action,
      content,
      code,
      language,
      threatData,
      context,
      analysisType = 'threat_detection'
    } = body;
    
    switch (action) {
      case 'security_analysis': {
        if (!content) {
          return NextResponse.json(
            { error: 'Content is required for security analysis' },
            { status: 400 }
          );
        }

        const analysis = await mistralIntegration.performSecurityAnalysis({
          content,
          context,
          analysisType
        });

        return NextResponse.json({
          success: true,
          data: {
            analysis,
            analysisType,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'code_analysis': {
        if (!code) {
          return NextResponse.json(
            { error: 'Code is required for code analysis' },
            { status: 400 }
          );
        }

        const codeAnalysis = await mistralIntegration.analyzeCodeSecurity(code, language);

        return NextResponse.json({
          success: true,
          data: {
            codeAnalysis,
            language: language || 'auto-detected',
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'threat_report': {
        if (!threatData) {
          return NextResponse.json(
            { error: 'Threat data is required for report generation' },
            { status: 400 }
          );
        }

        const report = await mistralIntegration.generateThreatReport(threatData);

        return NextResponse.json({
          success: true,
          data: {
            report,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'social_engineering': {
        if (!content) {
          return NextResponse.json(
            { error: 'Content is required for social engineering detection' },
            { status: 400 }
          );
        }

        const socialEngineeringAnalysis = await mistralIntegration.detectSocialEngineering(content, context);

        return NextResponse.json({
          success: true,
          data: {
            socialEngineeringAnalysis,
            timestamp: new Date().toISOString()
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: security_analysis, code_analysis, threat_report, social_engineering' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Mistral analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during Mistral analysis',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'overview';

    switch (view) {
      case 'overview': {
        const stats = mistralIntegration.getUsageStatistics();
        const config = mistralIntegration.getConfig();

        const overview = {
          status: 'active',
          model: config.model,
          apiKey: config.apiKey ? 'configured' : 'not_configured',
          totalRequests: stats.totalRequests,
          successRate: stats.totalRequests > 0 ? 
            (stats.successfulRequests / stats.totalRequests) * 100 : 0,
          averageTokens: Math.round(stats.averageTokens),
          mostUsedModel: stats.mostUsedModel,
          capabilities: [
            'Security Analysis',
            'Code Security Analysis',
            'Threat Intelligence Reports',
            'Social Engineering Detection',
            'Behavioral Pattern Analysis'
          ],
          supportedModels: [
            'mistral-tiny',
            'mistral-small', 
            'mistral-medium',
            'mistral-large',
            'codestral'
          ]
        };

        return NextResponse.json({
          success: true,
          data: {
            overview,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'usage': {
        const stats = mistralIntegration.getUsageStatistics();
        
        return NextResponse.json({
          success: true,
          data: {
            statistics: stats,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'config': {
        const config = mistralIntegration.getConfig();
        
        // Don't expose the actual API key
        const safeConfig = {
          ...config,
          apiKey: config.apiKey ? 'configured' : 'not_configured'
        };

        return NextResponse.json({
          success: true,
          data: {
            config: safeConfig,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'models': {
        const models = [
          {
            name: 'mistral-tiny',
            description: 'Fast and efficient for simple tasks',
            maxTokens: 32000,
            contextWindow: 32000,
            useCase: 'Quick analysis, simple classification'
          },
          {
            name: 'mistral-small',
            description: 'Balanced performance for general tasks',
            maxTokens: 32000,
            contextWindow: 32000,
            useCase: 'General security analysis, content moderation'
          },
          {
            name: 'mistral-medium',
            description: 'High performance for complex tasks',
            maxTokens: 32000,
            contextWindow: 32000,
            useCase: 'Advanced threat analysis, detailed reporting'
          },
          {
            name: 'mistral-large',
            description: 'Maximum performance for most complex tasks',
            maxTokens: 32000,
            contextWindow: 32000,
            useCase: 'Comprehensive threat intelligence, strategic analysis'
          },
          {
            name: 'codestral',
            description: 'Specialized for code analysis and security',
            maxTokens: 32000,
            contextWindow: 32000,
            useCase: 'Code security analysis, vulnerability detection'
          }
        ];

        return NextResponse.json({
          success: true,
          data: {
            models,
            currentModel: mistralIntegration.getConfig().model,
            timestamp: new Date().toISOString()
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid view. Supported views: overview, usage, config, models' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Mistral status check error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error while checking Mistral status' },
      { status: 500 }
    );
  }
}

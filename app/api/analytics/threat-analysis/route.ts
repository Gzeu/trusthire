// Analytics API Routes
// Advanced analytics and threat pattern analysis endpoints

import { NextRequest, NextResponse } from 'next/server';
import { getThreatPatternAnalyzer } from '@/lib/analytics/threat-pattern-analyzer';

export async function POST(request: NextRequest) {
  try {
    const { threatData } = await request.json();

    if (!threatData) {
      return NextResponse.json({
        success: false,
        error: 'Threat data is required',
        code: 'MISSING_THREAT_DATA'
      }, { status: 400 });
    }

    const analyzer = getThreatPatternAnalyzer();
    const analysis = await analyzer.analyzeThreat(threatData);

    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Threat analysis completed successfully'
    });
  } catch (error) {
    console.error('Threat analysis error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { threatData } = await request.json();

    if (!threatData || !Array.isArray(threatData)) {
      return NextResponse.json({
        success: false,
        error: 'Threat data array is required',
        code: 'MISSING_THREAT_DATA'
      }, { status: 400 });
    }

    const analyzer = getThreatPatternAnalyzer();
    const patterns = await analyzer.recognizePatterns(threatData);

    return NextResponse.json({
      success: true,
      data: patterns,
      message: 'Pattern recognition completed successfully'
    });
  } catch (error) {
    console.error('Pattern recognition error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patternData } = await request.json();

    if (!patternData) {
      return NextResponse.json({
        success: false,
        error: 'Pattern data is required',
        code: 'MISSING_PATTERN_DATA'
      }, { status: 400 });
    }

    // Validate pattern data
    const requiredFields = ['name', 'description', 'category', 'severity'];
    const missingFields = requiredFields.filter(field => !patternData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        code: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    const analyzer = getThreatPatternAnalyzer();
    const pattern = await analyzer.createPattern(patternData);

    return NextResponse.json({
      success: true,
      data: pattern,
      message: 'Pattern created successfully'
    });
  } catch (error) {
    console.error('Pattern creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Pattern ID is required',
        code: 'MISSING_PATTERN_ID'
      }, { status: 400 });
    }

    if (!updates) {
      return NextResponse.json({
        success: false,
        error: 'Update data is required',
        code: 'MISSING_UPDATE_DATA'
      }, { status: 400 });
    }

    const analyzer = getThreatPatternAnalyzer();
    const pattern = await analyzer.updatePattern(id, updates);

    return NextResponse.json({
      success: true,
      data: pattern,
      message: 'Pattern updated successfully'
    });
  } catch (error) {
    console.error('Pattern update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Pattern ID is required',
        code: 'MISSING_PATTERN_ID'
      }, { status: 400 });
    }

    const analyzer = getThreatPatternAnalyzer();
    const deleted = await analyzer.deletePattern(id);

    if (deleted) {
      return NextResponse.json({
        success: true,
        data: { deleted: true },
        message: 'Pattern deleted successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Pattern not found',
        code: 'PATTERN_NOT_FOUND'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Pattern deletion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const options = {
      category: searchParams.get('category'),
      severity: searchParams.get('severity'),
      active: searchParams.get('active') === 'true',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    };

    const analyzer = getThreatPatternAnalyzer();
    const patterns = await analyzer.getPatterns(options);

    return NextResponse.json({
      success: true,
      data: patterns,
      metadata: {
        total: patterns.length,
        filters: options
      }
    });
  } catch (error) {
    console.error('Get patterns error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const options = {
      type: searchParams.get('type'),
      category: searchParams.get('category'),
      status: searchParams.get('status'),
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    };

    const analyzer = getThreatPatternAnalyzer();
    const models = await analyzer.getModels(options);

    return NextResponse.json({
      success: true,
      data: models,
      metadata: {
        total: models.length,
        filters: options
      }
    });
  } catch (error) {
    console.error('Get models error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const options = {
      threatId: searchParams.get('threatId'),
      analysisType: searchParams.get('analysisType'),
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    };

    const analyzer = getThreatPatternAnalyzer();
    const analyses = await analyzer.getAnalyses(options);

    return NextResponse.json({
      success: true,
      data: analyses,
      metadata: {
        total: analyses.length,
        filters: options
      }
    });
  } catch (error) {
    console.error('Get analyses error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const analyzer = getThreatPatternAnalyzer();
    const analytics = await analyzer.getAnalytics();

    return NextResponse.json({
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      modelType, 
      category, 
      trainingData, 
      hyperparameters, 
      validationSplit = 0.2 
    } = await request.json();

    if (!modelType || !category || !trainingData) {
      return NextResponse.json({
        success: false,
        error: 'Model type, category, and training data are required',
        code: 'MISSING_TRAINING_PARAMETERS'
      }, { status: 400 });
    }

    // Mock model training - in production, this would trigger actual ML training
    const trainingJob = {
      id: `training-${Date.now()}`,
      modelType,
      category,
      status: 'training',
      progress: 0,
      startedAt: new Date().toISOString(),
      estimatedDuration: '2-4 hours',
      trainingData: {
        samples: trainingData.length,
        features: Object.keys(trainingData[0] || {}).length,
        classes: new Set(trainingData.map(d => d.label)).size
      }
    };

    // In a real implementation, you would:
    // 1. Validate training data
    // 2. Preprocess features
    // 3. Split into train/validation sets
    // 4. Train the model
    // 5. Evaluate performance
    // 6. Deploy if meets thresholds

    return NextResponse.json({
      success: true,
      data: trainingJob,
      message: 'Model training started successfully'
    });
  } catch (error) {
    console.error('Model training error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({
        success: false,
        error: 'Job ID is required',
        code: 'MISSING_JOB_ID'
      }, { status: 400 });
    }

    // Mock job status - in production, this would check actual training status
    const jobStatus = {
      id: jobId,
      status: 'completed',
      progress: 100,
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      duration: '2 hours 15 minutes',
      model: {
        id: `model-${Date.now()}`,
        name: `Trained ${modelType} Model`,
        type: 'classification',
        category: 'threat',
        version: '1.0.0',
        accuracy: 0.94,
        precision: 0.92,
        recall: 0.89,
        f1Score: 0.90,
        status: 'active',
        deployment: {
          endpoint: '/api/analytics/predict',
          version: '1.0.0',
          deployedAt: new Date().toISOString(),
          health: 'healthy'
        }
      },
      metrics: {
        trainingLoss: 0.12,
        validationLoss: 0.15,
        accuracy: 0.94,
        precision: 0.92,
        recall: 0.89,
        f1Score: 0.90
      }
    };

    return NextResponse.json({
      success: true,
      data: jobStatus,
      message: 'Training job status retrieved successfully'
    });
  } catch (error) {
    console.error('Get training status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { modelId, inputData } = await request.json();

    if (!modelId || !inputData) {
      return NextResponse.json({
        success: false,
        error: 'Model ID and input data are required',
        code: 'MISSING_PREDICTION_PARAMETERS'
      }, { status: 400 });
    }

    // Mock prediction - in production, this would use actual ML model
    const prediction = {
      id: `prediction-${Date.now()}`,
      modelId,
      prediction: 'malware',
      confidence: 0.87,
      probability: {
        malware: 0.87,
        phishing: 0.05,
        apt: 0.03,
        ransomware: 0.02,
        vulnerability: 0.03
      },
      features: {
        content_length: inputData.description?.length || 0,
        keyword_density: 0.15,
        urgency_score: 0.8,
        domain_age: 45,
        ip_reputation: 0.3,
        hash_complexity: 0.75
      },
      riskScore: 0.82,
      recommendations: [
        'Scan with updated antivirus',
        'Isolate potentially infected systems',
        'Review recent file downloads'
      ],
      metadata: {
        model: 'Threat Classification Model',
        version: '1.0.0',
        processingTime: '125ms',
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      data: prediction,
      message: 'Prediction completed successfully'
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

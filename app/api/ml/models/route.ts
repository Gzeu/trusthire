// Custom ML Models API Endpoint
// Organization-specific model training and management

import { NextRequest, NextResponse } from 'next/server';
import { customMLModels } from '@/lib/custom-ml-models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, organizationId, modelType, data } = body;

    let result;

    switch (action) {
      case 'train':
        result = await customMLModels.trainModel(organizationId, modelType, data);
        break;

      case 'predict':
        result = await customMLModels.predict(organizationId, modelType, data);
        break;

      case 'add_training_data':
        const dataId = customMLModels.addTrainingData(data);
        result = { success: true, dataId };
        break;

      case 'update_feedback':
        await customMLModels.updateModelFromFeedback(organizationId, modelType, data.prediction, data.feedback);
        result = { success: true };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ML models API error:', error);
    return NextResponse.json(
      { 
        error: 'ML operation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'default';
    const modelType = searchParams.get('type');

    let result;

    switch (modelType) {
      case 'models':
        result = customMLModels.getModels(organizationId);
        break;

      case 'training_data':
        result = customMLModels.getTrainingData(organizationId);
        break;

      default:
        result = customMLModels.getModels(organizationId);
        break;
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ML models GET error:', error);
    return NextResponse.json(
      { 
        error: 'Query failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');

    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID required' },
        { status: 400 }
      );
    }

    const success = customMLModels.deleteModel(modelId);

    return NextResponse.json({
      success,
      message: success ? 'Model deleted successfully' : 'Model not found',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ML models DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Delete failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

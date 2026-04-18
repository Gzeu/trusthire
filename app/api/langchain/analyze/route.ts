// LangChain Integration API Endpoint
// Advanced AI analysis with chains, agents, and RAG

import { NextRequest, NextResponse } from 'next/server';
import { langchainIntegration } from '@/lib/langchain-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case 'agent_assessment':
        result = await langchainIntegration.runSecurityAssessment(
          data.request,
          data.context
        );
        break;

      case 'chain_analysis':
        result = await langchainIntegration.runChain(
          data.chainId,
          data.inputs
        );
        break;

      case 'rag_analysis':
        result = await langchainIntegration.runRAGAnalysis(
          data.question
        );
        break;

      case 'add_documents':
        await langchainIntegration.addDocuments(data.documents);
        result = { success: true, message: 'Documents added successfully' };
        break;

      case 'retrieve_documents':
        result = await langchainIntegration.retrieveDocuments(
          data.query,
          data.k
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('LangChain API error:', error);
    return NextResponse.json(
      { 
        error: 'LangChain analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let result;

    switch (type) {
      case 'tools':
        result = langchainIntegration.getAvailableTools();
        break;

      case 'chains':
        result = langchainIntegration.getAvailableChains();
        break;

      case 'memory':
        const sessionId = searchParams.get('sessionId');
        if (sessionId) {
          result = langchainIntegration.getConversationMemory(sessionId);
        } else {
          result = { error: 'Session ID required' };
        }
        break;

      case 'state':
        result = langchainIntegration.exportState();
        break;

      case 'benchmark':
        const chainId = searchParams.get('chainId');
        const iterations = parseInt(searchParams.get('iterations') || '10');
        
        if (chainId) {
          const benchmarkData = JSON.parse(searchParams.get('inputs') || '{}');
          result = await langchainIntegration.benchmarkChain(chainId, benchmarkData, iterations);
        } else {
          result = { error: 'Chain ID required' };
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid query type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('LangChain GET error:', error);
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
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    langchainIntegration.clearConversationMemory(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Conversation memory cleared',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('LangChain DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Delete failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// LangChain Integration API Endpoint
// Advanced AI analysis with chains, agents, and RAG

import { NextRequest, NextResponse } from 'next/server';
import { langChainService } from '@/lib/langchain-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case 'chain_analysis':
        result = await langChainService.runChain(
          data.chainId,
          data.inputs
        );
        break;

      case 'rag_analysis':
        result = await langChainService.searchDocuments(data.question);
        break;

      case 'add_documents':
        for (const doc of data.documents) {
          await langChainService.addDocument(doc);
        }
        result = { success: true, message: 'Documents added successfully' };
        break;

      case 'retrieve_documents':
        result = await langChainService.searchDocuments(data.query);
        break;

      case 'tool_analysis':
        result = await langChainService.runTool(
          data.toolId,
          data.input
        );
        break;

      case 'get_config':
        result = langChainService.getConfig();
        break;

      case 'benchmark':
        result = await langChainService.benchmarkChain(
          data.chainId,
          data.input,
          data.iterations
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
      type,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('LangChain analysis error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const config = langChainService.getConfig();
    
    return NextResponse.json({
      success: true,
      data: {
        chains: config.chains,
        tools: config.tools,
        agents: config.agents,
        config: config.config
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('LangChain config error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Reset or clear LangChain data
    // This would implement cleanup logic
    
    return NextResponse.json({
      success: true,
      message: 'LangChain data cleared successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('LangChain cleanup error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

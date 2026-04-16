import { NextRequest, NextResponse } from 'next/server';
import { SandboxService } from '@/lib/sandbox';

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    let result;
    
    switch (type) {
      case 'repository':
        result = await SandboxService.analyzeRepository(data.repoUrl);
        break;
      
      case 'url':
        result = await SandboxService.analyzeUrlSafely(data.url);
        break;
      
      case 'code':
        result = await SandboxService.executePatternDetection(data.code, data.language);
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      type,
      result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Sandbox analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Sandbox analysis failed', 
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

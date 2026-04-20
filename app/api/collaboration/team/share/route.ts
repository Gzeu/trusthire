/**
 * Team Sharing API
 * Manages team sharing of assessments with permissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { reviewSystem } from '@/lib/collaboration/review-system';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { 
      assessmentId, 
      teamId, 
      permissions = {
        canView: true,
        canComment: true,
        canEdit: false,
        canShare: false,
        canExport: true
      },
      expiresAt,
      message 
    } = body;
    
    if (!assessmentId || !teamId) {
      return NextResponse.json(
        { error: 'Assessment ID and team ID are required' },
        { status: 400 }
      );
    }

    // Get user ID from session (simplified)
    const userId = request.headers.get('x-user-id') || 'demo_user';
    
    // Create team share
    const share = reviewSystem.createTeamShare({
      assessmentId,
      teamId,
      sharedBy: userId,
      permissions,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      message
    });

    return NextResponse.json({
      success: true,
      data: {
        share,
        shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/shared/${share.id}`,
        message: 'Assessment shared with team successfully'
      }
    });

  } catch (error) {
    console.error('Error creating team share:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error while creating team share',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || request.headers.get('x-user-id');
    const assessmentId = searchParams.get('assessmentId');
    const teamId = searchParams.get('teamId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let shares;
    
    if (assessmentId) {
      // Get shares for specific assessment
      shares = reviewSystem.getAssessmentShares(assessmentId);
    } else if (teamId) {
      // Get shares for specific team
      shares = reviewSystem.getUserTeamShares(userId).filter(s => s.teamId === teamId);
    } else {
      // Get all shares created by user
      shares = reviewSystem.getUserTeamShares(userId);
    }

    // Filter out expired shares
    const activeShares = shares.filter(share => 
      !share.expiresAt || share.expiresAt > new Date()
    );

    return NextResponse.json({
      success: true,
      data: {
        shares: activeShares,
        count: activeShares.length,
        filters: {
          userId,
          assessmentId,
          teamId
        }
      }
    });

  } catch (error) {
    console.error('Error fetching team shares:', error);
    
    return NextResponse.json(
      { error: 'Internal server error while fetching team shares' },
      { status: 500 }
    );
  }
}

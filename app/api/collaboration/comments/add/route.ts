/**
 * Add Comment API
 * Adds comments and replies to collaborative reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { reviewSystem } from '@/lib/collaboration/review-system';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { 
      reviewId, 
      content, 
      type = 'general',
      severity = 'info',
      position,
      parentCommentId 
    } = body;
    
    if (!reviewId || !content) {
      return NextResponse.json(
        { error: 'Review ID and content are required' },
        { status: 400 }
      );
    }

    // Get user ID from session (simplified)
    const userId = request.headers.get('x-user-id') || 'demo_user';
    
    let comment;
    
    if (parentCommentId) {
      // Reply to existing comment
      comment = reviewSystem.replyToComment(parentCommentId, {
        reviewId,
        authorId: userId,
        content: content.trim(),
        type,
        severity,
        position,
        resolved: false
      });
    } else {
      // Add new comment
      comment = reviewSystem.addComment({
        reviewId,
        authorId: userId,
        content: content.trim(),
        type,
        severity,
        position,
        resolved: false
      });
    }

    if (!comment) {
      return NextResponse.json(
        { error: 'Failed to add comment - review or parent comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        comment,
        message: parentCommentId ? 'Reply added successfully' : 'Comment added successfully'
      }
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error while adding comment',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const comments = reviewSystem.getReviewComments(reviewId);

    return NextResponse.json({
      success: true,
      data: {
        reviewId,
        comments,
        count: comments.length
      }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    
    return NextResponse.json(
      { error: 'Internal server error while fetching comments' },
      { status: 500 }
    );
  }
}

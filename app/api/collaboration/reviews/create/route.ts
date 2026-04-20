/**
 * Create Collaborative Review API
 * Creates and manages collaborative assessment reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { reviewSystem } from '@/lib/collaboration/review-system';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { 
      assessmentId, 
      title, 
      description, 
      priority = 'medium',
      reviewers = [], 
      assignedReviewers = [],
      dueDate,
      tags = [],
      metadata = {}
    } = body;
    
    if (!assessmentId || !title || !description) {
      return NextResponse.json(
        { error: 'Assessment ID, title, and description are required' },
        { status: 400 }
      );
    }

    // Get user ID from session (simplified - in production, use proper auth)
    const userId = request.headers.get('x-user-id') || 'demo_user';
    
    // Create review
    const review = reviewSystem.createReview({
      assessmentId,
      title,
      description,
      status: 'pending',
      priority,
      createdBy: userId,
      reviewers,
      assignedReviewers,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        review,
        message: 'Collaborative review created successfully'
      }
    });

  } catch (error) {
    console.error('Error creating collaborative review:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error while creating review',
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
    const role = searchParams.get('role') as 'creator' | 'reviewer' | 'all' || 'all';
    const assessmentId = searchParams.get('assessmentId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const query = searchParams.get('query') || '';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let reviews;
    
    if (assessmentId) {
      // Get specific assessment reviews
      reviews = reviewSystem.getUserReviews(userId, role).filter(r => r.assessmentId === assessmentId);
    } else if (query || status || priority) {
      // Search with filters
      const filters: any = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (userId && role !== 'all') {
        if (role === 'creator') filters.createdBy = userId;
        if (role === 'reviewer') filters.assignedTo = userId;
      }
      
      reviews = reviewSystem.searchReviews(query, filters);
    } else {
      // Get user reviews
      reviews = reviewSystem.getUserReviews(userId, role);
    }

    // Get statistics
    const statistics = reviewSystem.getReviewStatistics(userId);

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        statistics,
        filters: {
          userId,
          role,
          assessmentId,
          status,
          priority,
          query
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    
    return NextResponse.json(
      { error: 'Internal server error while fetching reviews' },
      { status: 500 }
    );
  }
}

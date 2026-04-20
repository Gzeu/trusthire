/**
 * Collaborative Review System
 * Manages collaborative assessment reviews and team sharing
 */

export interface CollaborativeReview {
  id: string;
  assessmentId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_review' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  reviewers: string[];
  assignedReviewers: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  metadata: Record<string, any>;
}

export interface ReviewComment {
  id: string;
  reviewId: string;
  authorId: string;
  content: string;
  type: 'general' | 'security' | 'recommendation' | 'question' | 'issue';
  severity: 'info' | 'warning' | 'error' | 'critical';
  position?: {
    line: number;
    column: number;
    section: string;
  };
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  replies: ReviewComment[];
  createdAt: Date;
  updatedAt: Date;
  reactions: {
    emoji: string;
    users: string[];
    count: number;
  }[];
}

export interface TeamShare {
  id: string;
  assessmentId: string;
  teamId: string;
  sharedBy: string;
  sharedAt: Date;
  permissions: {
    canView: boolean;
    canComment: boolean;
    canEdit: boolean;
    canShare: boolean;
    canExport: boolean;
  };
  expiresAt?: Date;
  accessCount: number;
  lastAccessed?: Date;
  message?: string;
}

export interface ReviewAssignment {
  id: string;
  reviewId: string;
  reviewerId: string;
  assignedBy: string;
  assignedAt: Date;
  dueDate?: Date;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  completedAt?: Date;
  notes?: string;
}

class ReviewSystem {
  private reviews: Map<string, CollaborativeReview> = new Map();
  private comments: Map<string, ReviewComment[]> = new Map();
  private teamShares: Map<string, TeamShare> = new Map();
  private assignments: Map<string, ReviewAssignment[]> = new Map();

  // Create a new collaborative review
  createReview(reviewData: Omit<CollaborativeReview, 'id' | 'createdAt' | 'updatedAt'>): CollaborativeReview {
    const review: CollaborativeReview = {
      ...reviewData,
      id: this.generateId('review'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.reviews.set(review.id, review);
    this.comments.set(review.id, []);

    // Create assignments for reviewers
    review.assignedReviewers.forEach(reviewerId => {
      this.createAssignment({
        reviewId: review.id,
        reviewerId,
        assignedBy: review.createdBy,
        assignedAt: new Date(),
        dueDate: review.dueDate,
        status: 'pending'
      });
    });

    console.log(`Collaborative review created: ${review.id}`);
    return review;
  }

  // Get review by ID
  getReview(reviewId: string): CollaborativeReview | undefined {
    return this.reviews.get(reviewId);
  }

  // Get all reviews for a user
  getUserReviews(userId: string, role: 'creator' | 'reviewer' | 'all' = 'all'): CollaborativeReview[] {
    const reviews = Array.from(this.reviews.values());

    switch (role) {
      case 'creator':
        return reviews.filter(review => review.createdBy === userId);
      case 'reviewer':
        return reviews.filter(review => 
          review.assignedReviewers.includes(userId) || review.reviewers.includes(userId)
        );
      case 'all':
      default:
        return reviews.filter(review => 
          review.createdBy === userId || 
          review.assignedReviewers.includes(userId) || 
          review.reviewers.includes(userId)
        );
    }
  }

  // Update review status
  updateReviewStatus(reviewId: string, status: CollaborativeReview['status'], updatedBy: string): boolean {
    const review = this.reviews.get(reviewId);
    if (!review) return false;

    review.status = status;
    review.updatedAt = new Date();

    // Update assignment status if completed
    if (status === 'completed') {
      const assignments = this.assignments.get(reviewId) || [];
      assignments.forEach(assignment => {
        if (assignment.reviewerId === updatedBy && assignment.status === 'accepted') {
          assignment.status = 'completed';
          assignment.completedAt = new Date();
        }
      });
    }

    console.log(`Review ${reviewId} status updated to ${status} by ${updatedBy}`);
    return true;
  }

  // Add comment to review
  addComment(commentData: Omit<ReviewComment, 'id' | 'replies' | 'createdAt' | 'updatedAt' | 'reactions'>): ReviewComment {
    const comment: ReviewComment = {
      ...commentData,
      id: this.generateId('comment'),
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      reactions: []
    };

    const comments = this.comments.get(comment.reviewId) || [];
    comments.push(comment);
    this.comments.set(comment.reviewId, comments);

    // Update review timestamp
    const review = this.reviews.get(comment.reviewId);
    if (review) {
      review.updatedAt = new Date();
    }

    console.log(`Comment added to review ${comment.reviewId}: ${comment.id}`);
    return comment;
  }

  // Get comments for a review
  getReviewComments(reviewId: string): ReviewComment[] {
    return this.comments.get(reviewId) || [];
  }

  // Reply to comment
  replyToComment(parentCommentId: string, replyData: Omit<ReviewComment, 'id' | 'replies' | 'createdAt' | 'updatedAt' | 'reactions'>): ReviewComment | null {
    // Find parent comment
    for (const [reviewId, comments] of this.comments.entries()) {
      const parentComment = comments.find(c => c.id === parentCommentId);
      if (parentComment) {
        const reply: ReviewComment = {
          ...replyData,
          id: this.generateId('comment'),
          replies: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          reactions: []
        };

        parentComment.replies.push(reply);
        parentComment.updatedAt = new Date();

        // Update review timestamp
        const review = this.reviews.get(reviewId);
        if (review) {
          review.updatedAt = new Date();
        }

        console.log(`Reply added to comment ${parentCommentId}: ${reply.id}`);
        return reply;
      }
    }

    return null;
  }

  // Resolve comment
  resolveComment(commentId: string, resolvedBy: string): boolean {
    for (const [reviewId, comments] of this.comments.entries()) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.resolved = true;
        comment.resolvedBy = resolvedBy;
        comment.resolvedAt = new Date();
        comment.updatedAt = new Date();

        // Update review timestamp
        const review = this.reviews.get(reviewId);
        if (review) {
          review.updatedAt = new Date();
        }

        console.log(`Comment ${commentId} resolved by ${resolvedBy}`);
        return true;
      }
    }

    return false;
  }

  // Create team share
  createTeamShare(shareData: Omit<TeamShare, 'id' | 'sharedAt' | 'accessCount'>): TeamShare {
    const share: TeamShare = {
      ...shareData,
      id: this.generateId('share'),
      sharedAt: new Date(),
      accessCount: 0
    };

    this.teamShares.set(share.id, share);
    console.log(`Team share created: ${share.id} for assessment ${share.assessmentId}`);
    return share;
  }

  // Get team shares for assessment
  getAssessmentShares(assessmentId: string): TeamShare[] {
    return Array.from(this.teamShares.values())
      .filter(share => share.assessmentId === assessmentId);
  }

  // Get team shares for user
  getUserTeamShares(userId: string): TeamShare[] {
    return Array.from(this.teamShares.values())
      .filter(share => share.sharedBy === userId);
  }

  // Record share access
  recordShareAccess(shareId: string): boolean {
    const share = this.teamShares.get(shareId);
    if (!share) return false;

    share.accessCount++;
    share.lastAccessed = new Date();

    // Check if share has expired
    if (share.expiresAt && share.expiresAt < new Date()) {
      this.teamShares.delete(shareId);
      return false;
    }

    return true;
  }

  // Create assignment
  private createAssignment(assignmentData: Omit<ReviewAssignment, 'id'>): ReviewAssignment {
    const assignment: ReviewAssignment = {
      ...assignmentData,
      id: this.generateId('assignment')
    };

    const assignments = this.assignments.get(assignment.reviewId) || [];
    assignments.push(assignment);
    this.assignments.set(assignment.reviewId, assignments);

    return assignment;
  }

  // Get assignments for user
  getUserAssignments(userId: string): ReviewAssignment[] {
    const allAssignments = Array.from(this.assignments.values()).flat();
    return allAssignments.filter(assignment => assignment.reviewerId === userId);
  }

  // Accept assignment
  acceptAssignment(assignmentId: string, userId: string): boolean {
    for (const [reviewId, assignments] of this.assignments.entries()) {
      const assignment = assignments.find(a => a.id === assignmentId && a.reviewerId === userId);
      if (assignment && assignment.status === 'pending') {
        assignment.status = 'accepted';
        console.log(`Assignment ${assignmentId} accepted by ${userId}`);
        return true;
      }
    }

    return false;
  }

  // Decline assignment
  declineAssignment(assignmentId: string, userId: string, notes?: string): boolean {
    for (const [reviewId, assignments] of this.assignments.entries()) {
      const assignment = assignments.find(a => a.id === assignmentId && a.reviewerId === userId);
      if (assignment && assignment.status === 'pending') {
        assignment.status = 'declined';
        assignment.notes = notes;
        console.log(`Assignment ${assignmentId} declined by ${userId}`);
        return true;
      }
    }

    return false;
  }

  // Get review statistics
  getReviewStatistics(userId?: string): {
    totalReviews: number;
    pendingReviews: number;
    inProgressReviews: number;
    completedReviews: number;
    averageCompletionTime: number;
    assignedToMe: number;
    createdByMe: number;
  } {
    const reviews = userId ? this.getUserReviews(userId) : Array.from(this.reviews.values());
    const assignments = userId ? this.getUserAssignments(userId) : Array.from(this.assignments.values()).flat();

    const totalReviews = reviews.length;
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;
    const inProgressReviews = reviews.filter(r => r.status === 'in_review').length;
    const completedReviews = reviews.filter(r => r.status === 'completed').length;

    // Calculate average completion time
    const completedReviewTimes = reviews
      .filter(r => r.status === 'completed')
      .map(r => r.updatedAt.getTime() - r.createdAt.getTime());
    const averageCompletionTime = completedReviewTimes.length > 0
      ? completedReviewTimes.reduce((sum, time) => sum + time, 0) / completedReviewTimes.length
      : 0;

    return {
      totalReviews,
      pendingReviews,
      inProgressReviews,
      completedReviews,
      averageCompletionTime,
      assignedToMe: assignments.filter(a => a.status === 'pending' || a.status === 'accepted').length,
      createdByMe: reviews.filter(r => r.createdBy === userId).length
    };
  }

  // Search reviews
  searchReviews(query: string, filters?: {
    status?: CollaborativeReview['status'];
    priority?: CollaborativeReview['priority'];
    createdBy?: string;
    assignedTo?: string;
    tags?: string[];
  }): CollaborativeReview[] {
    const reviews = Array.from(this.reviews.values());
    const lowerQuery = query.toLowerCase();

    return reviews.filter(review => {
      // Text search
      const matchesQuery = !query || 
        review.title.toLowerCase().includes(lowerQuery) ||
        review.description.toLowerCase().includes(lowerQuery) ||
        review.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

      // Filter by status
      const matchesStatus = !filters?.status || review.status === filters.status;

      // Filter by priority
      const matchesPriority = !filters?.priority || review.priority === filters.priority;

      // Filter by creator
      const matchesCreator = !filters?.createdBy || review.createdBy === filters.createdBy;

      // Filter by assigned reviewer
      const matchesAssigned = !filters?.assignedTo || 
        review.assignedReviewers.includes(filters.assignedTo) ||
        review.reviewers.includes(filters.assignedTo);

      // Filter by tags
      const matchesTags = !filters?.tags?.length || 
        filters.tags.some(tag => review.tags.includes(tag));

      return matchesQuery && matchesStatus && matchesPriority && matchesCreator && matchesAssigned && matchesTags;
    });
  }

  // Generate unique ID
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clean up expired shares
  cleanupExpiredShares(): number {
    const now = new Date();
    let cleanedCount = 0;

    for (const [shareId, share] of this.teamShares.entries()) {
      if (share.expiresAt && share.expiresAt < now) {
        this.teamShares.delete(shareId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired team shares`);
    }

    return cleanedCount;
  }
}

export const reviewSystem = new ReviewSystem();
export default ReviewSystem;

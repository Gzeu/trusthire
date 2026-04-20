// Review system for TrustHire Autonomous System collaboration
export interface Review {
  id: string;
  type: 'comment' | 'review' | 'suggestion';
  content: string;
  authorId: string;
  authorName: string;
  targetId: string;
  targetType: 'assessment' | 'candidate' | 'report';
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  createdAt: string;
  updatedAt: string;
  replies?: Review[];
  tags?: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Comment {
  id: string;
  reviewId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  isReply: boolean;
  parentCommentId?: string;
}

export interface TeamShare {
  id: string;
  itemId: string;
  itemType: 'assessment' | 'report' | 'candidate';
  sharedBy: string;
  sharedWith: string[];
  permissions: 'read' | 'write' | 'admin';
  createdAt: string;
  expiresAt?: string;
}

export class ReviewSystem {
  private reviews = new Map<string, Review>();
  private comments = new Map<string, Comment>();
  private shares = new Map<string, TeamShare>();

  async createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const review: Review = {
      ...reviewData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: []
    };

    this.reviews.set(review.id, review);
    return review;
  }

  async updateReview(reviewId: string, updates: Partial<Review>): Promise<Review | null> {
    const review = this.reviews.get(reviewId);
    if (!review) return null;

    const updatedReview = {
      ...review,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.reviews.set(reviewId, updatedReview);
    return updatedReview;
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    return this.reviews.delete(reviewId);
  }

  async getReview(reviewId: string): Promise<Review | null> {
    return this.reviews.get(reviewId) || null;
  }

  async getReviewsByTarget(targetId: string, targetType: string): Promise<Review[]> {
    const reviews: Review[] = [];
    const entries = Array.from(this.reviews.entries());
    
    for (const [, review] of entries) {
      if (review.targetId === targetId && review.targetType === targetType) {
        reviews.push(review);
      }
    }

    return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async addComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const comment: Comment = {
      ...commentData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.comments.set(comment.id, comment);

    // Add comment to review's replies if it's a reply to a review
    if (!comment.isReply) {
      const review = this.reviews.get(comment.reviewId);
      if (review) {
        review.replies = review.replies || [];
        review.replies.push({
          ...comment,
          id: comment.id,
          type: 'comment' as const,
          content: comment.content,
          authorId: comment.authorId,
          authorName: comment.authorName,
          targetId: '',
          targetType: 'assessment' as const,
          status: 'pending' as const,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          priority: 'medium' as const
        });
        this.reviews.set(comment.reviewId, review);
      }
    }

    return comment;
  }

  async getCommentsByReview(reviewId: string): Promise<Comment[]> {
    const comments: Comment[] = [];
    const entries = Array.from(this.comments.entries());
    
    for (const [, comment] of entries) {
      if (comment.reviewId === reviewId) {
        comments.push(comment);
      }
    }

    return comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async shareWithTeam(shareData: Omit<TeamShare, 'id' | 'createdAt'>): Promise<TeamShare> {
    const share: TeamShare = {
      ...shareData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    this.shares.set(share.id, share);
    return share;
  }

  async getSharedItems(userId: string): Promise<TeamShare[]> {
    const shares: TeamShare[] = [];
    const entries = Array.from(this.shares.entries());
    
    for (const [, share] of entries) {
      if (share.sharedWith.includes(userId) || share.sharedBy === userId) {
        shares.push(share);
      }
    }

    return shares;
  }

  async updateSharePermissions(shareId: string, permissions: 'read' | 'write' | 'admin'): Promise<TeamShare | null> {
    const share = this.shares.get(shareId);
    if (!share) return null;

    const updatedShare = {
      ...share,
      permissions
    };

    this.shares.set(shareId, updatedShare);
    return updatedShare;
  }

  async revokeAccess(shareId: string, userId?: string): Promise<boolean> {
    const share = this.shares.get(shareId);
    if (!share) return false;

    if (userId) {
      share.sharedWith = share.sharedWith.filter(id => id !== userId);
      this.shares.set(shareId, share);
      return true;
    } else {
      return this.shares.delete(shareId);
    }
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getReviewStats(): {
    totalReviews: number;
    pendingReviews: number;
    approvedReviews: number;
    rejectedReviews: number;
    totalComments: number;
  } {
    const reviews = Array.from(this.reviews.values());
    const comments = Array.from(this.comments.values());

    return {
      totalReviews: reviews.length,
      pendingReviews: reviews.filter(r => r.status === 'pending').length,
      approvedReviews: reviews.filter(r => r.status === 'approved').length,
      rejectedReviews: reviews.filter(r => r.status === 'rejected').length,
      totalComments: comments.length
    };
  }
}

export const reviewSystem = new ReviewSystem();

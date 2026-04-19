import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
  timestamp: string;
  requestId?: string;
}

export class TrustHireError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly timestamp: string;

  constructor(message: string, code: string = 'INTERNAL_ERROR', statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'TrustHireError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends TrustHireError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends TrustHireError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends TrustHireError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends TrustHireError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends TrustHireError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ExternalServiceError extends TrustHireError {
  constructor(service: string, message: string = 'External service error', details?: any) {
    super(`${service}: ${message}`, 'EXTERNAL_SERVICE_ERROR', 502, { service, ...details });
    this.name = 'ExternalServiceError';
  }
}

export function logError(error: Error, context?: any, requestId?: string): void {
  const logData = {
    timestamp: new Date().toISOString(),
    requestId,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  };

  if (error instanceof TrustHireError) {
    logData.error = {
      ...logData.error,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  // Log to console (in production, this would go to a logging service)
  console.error('[API_ERROR]', JSON.stringify(logData, null, 2));
}

export function handleApiError(error: unknown, context?: any, requestId?: string): NextResponse {
  // Generate request ID if not provided
  if (!requestId) {
    requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Log the error
  logError(error as Error, context, requestId);

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));

    const apiError: ApiError = {
      code: 'VALIDATION_ERROR',
      message: 'Input validation failed',
      statusCode: 400,
      timestamp: new Date().toISOString(),
      requestId,
      details: { validationErrors },
    };

    return NextResponse.json(apiError, { status: 400 });
  }

  // Handle known errors
  if (error instanceof TrustHireError) {
    const apiError: ApiError = {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: error.timestamp,
      requestId,
    };

    return NextResponse.json(apiError, { status: error.statusCode });
  }

  // Handle unknown errors
  const apiError: ApiError = {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date().toISOString(),
    requestId,
    details: process.env.NODE_ENV === 'development' ? 
      { originalError: error instanceof Error ? error.message : 'Unknown error' } : 
      undefined,
  };

  return NextResponse.json(apiError, { status: 500 });
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function withErrorHandling(
  handler: (req: NextRequest, context?: any) => Promise<Response>,
  options: { requireAuth?: boolean; rateLimit?: { max: number; window: number } } = {}
) {
  return async (req: NextRequest, context?: any) => {
    const requestId = generateRequestId();
    
    try {
      // Add request ID to response headers for debugging
      const response = await handler(req, context);
      if (response instanceof Response) {
        response.headers.set('X-Request-ID', requestId);
      }
      return response;
    } catch (error) {
      return handleApiError(error, { url: req.url, method: req.method }, requestId);
    }
  };
}

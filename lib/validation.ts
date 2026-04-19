import { z } from 'zod';
import type { AssessmentInput } from '@/types';

// Common schemas
export const UrlSchema = z.string().url('Invalid URL format');
export const EmailSchema = z.string().email('Invalid email format');
export const NonEmptyStringSchema = z.string().min(1, 'Field cannot be empty');
export const OptionalStringSchema = z.string().optional();

// Recruiter schema
export const RecruiterSchema = z.object({
  name: NonEmptyStringSchema.max(100, 'Name must be less than 100 characters'),
  claimedCompany: NonEmptyStringSchema.max(100, 'Company name must be less than 100 characters'),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  emailReceived: EmailSchema.optional().or(z.literal('')),
  jobTitle: OptionalStringSchema,
  recruiterMessages: z.string().max(2000, 'Messages too long').optional(),
});

// Job schema
export const JobSchema = z.object({
  jobDescription: z.string().max(5000, 'Job description too long').optional(),
  salaryMentioned: z.boolean(),
  urgencySignals: z.boolean(),
  walletSeedKycRequest: z.boolean(),
  runCodeLocally: z.boolean(),
});

// Artifact schema
export const ArtifactSchema = z.object({
  type: z.enum(['github', 'gitlab', 'zip', 'drive', 'notion', 'url', 'shortlink', 'forms']),
  url: z.string(),
});

// Assessment input schema
export const AssessmentInputSchema = z.object({
  recruiter: RecruiterSchema,
  job: JobSchema,
  artifacts: z.array(ArtifactSchema).default([]),
});

// Repository scan schema
export const RepoScanSchema = z.object({
  url: z.string().url('Invalid repository URL'),
});

// URL scan schema
export const UrlScanSchema = z.object({
  url: z.string().url('Invalid URL'),
});

// AI analysis schema
export const AiAnalysisSchema = z.object({
  recruiterMessages: z.array(z.string().max(1000, 'Message too long')).min(1, 'At least one message required'),
  context: z.object({
    type: z.enum(['recruiter_messages', 'profile_analysis', 'code_analysis']),
    platform: z.string().default('assessment'),
  }).optional(),
});

// LangChain analysis schema
export const LangChainAnalysisSchema = z.object({
  chainId: z.enum(['security', 'threat_detection', 'risk_assessment']),
  inputs: z.object({
    input: z.string().min(1, 'Input cannot be empty'),
    context: z.object({
      type: z.string(),
      platform: z.string().optional(),
    }).optional(),
  }),
});

// User registration schema
export const UserRegistrationSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: NonEmptyStringSchema.max(100, 'Name must be less than 100 characters'),
  company: OptionalStringSchema,
});

// User login schema
export const UserLoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Password cannot be empty'),
});

// Pattern submission schema
export const PatternSubmissionSchema = z.object({
  title: NonEmptyStringSchema.max(200, 'Title too long'),
  description: z.string().min(10, 'Description too short').max(1000, 'Description too long'),
  category: z.enum(['recruiter', 'domain', 'repository', 'process', 'other']),
  evidence: z.array(z.string().url('Invalid evidence URL')).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});

// Report generation schema
export const ReportGenerationSchema = z.object({
  assessmentId: z.string().min(1, 'Assessment ID required'),
  format: z.enum(['json', 'txt', 'pdf']).default('json'),
  includeEvidence: z.boolean().default(true),
});

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      throw new ValidationError(
        'Validation failed',
        { validationErrors: formattedErrors }
      );
    }
    throw new ValidationError('Invalid input data');
  }
}

// Transform validated input to match existing types
export function transformAssessmentInput(validated: any): AssessmentInput {
  return {
    recruiter: {
      ...validated.recruiter,
      recruiterMessages: validated.recruiter.recruiterMessages || undefined,
    },
    job: {
      ...validated.job,
      salaryMentioned: validated.job.salaryMentioned ?? false,
      urgencySignals: validated.job.urgencySignals ?? false,
      walletSeedKycRequest: validated.job.walletSeedKycRequest ?? false,
      runCodeLocally: validated.job.runCodeLocally ?? false,
    },
    artifacts: validated.artifacts || [],
  };
}

export function validatePartialInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.partial().parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      throw new ValidationError(
        'Validation failed',
        { validationErrors: formattedErrors }
      );
    }
    throw new ValidationError('Invalid input data');
  }
}

// Sanitization helpers
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS
    .substring(0, maxLength);
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Ensure HTTPS for production
    if (process.env.NODE_ENV === 'production' && urlObj.protocol !== 'https:') {
      urlObj.protocol = 'https:';
    }
    return urlObj.toString();
  } catch {
    throw new ValidationError('Invalid URL format');
  }
}

// Rate limiting validation
export function validateRateLimit(
  current: number,
  max: number,
  window: number
): { allowed: boolean; resetTime: number } {
  const now = Date.now();
  const resetTime = now + window;
  
  if (current >= max) {
    return { allowed: false, resetTime };
  }
  
  return { allowed: true, resetTime };
}

// File upload validation (for future features)
export const FileUploadSchema = z.object({
  filename: z.string().max(255, 'Filename too long'),
  mimetype: z.enum(['text/plain', 'application/json', 'text/javascript']),
  size: z.number().max(10 * 1024 * 1024, 'File too large (max 10MB)'), // 10MB
});

export function validateFileUpload(file: {
  filename: string;
  mimetype: string;
  size: number;
}): void {
  try {
    FileUploadSchema.parse(file);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      throw new ValidationError(
        'File validation failed',
        { validationErrors: formattedErrors }
      );
    }
    throw new ValidationError('Invalid file data');
  }
}

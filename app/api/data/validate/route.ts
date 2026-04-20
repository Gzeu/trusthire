/**
 * Data Validation API
 * Simple validation and cleaning for real data
 */

import { NextRequest, NextResponse } from 'next/server';

interface ValidationRequest {
  type: 'recruitment' | 'company' | 'candidate';
  data: any;
  id?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  cleanedData?: any;
  qualityScore: number;
  confidence: number;
}

interface CleaningRequest {
  type: 'deduplication' | 'standardization' | 'quality';
  data: any[];
  options?: any;
}

interface CleaningResult {
  processed: number;
  duplicates: number;
  standardized: any[];
  qualityIssues: any[];
  cleaned: any[];
}

// Simple validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]*[\d\s\-\(\)]{7,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateRequired(data: any, requiredFields: string[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateRecruitmentData(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let isValid = true;
  
  // Validate company name
  if (!data.companyName || data.companyName.trim() === '') {
    errors.push('Company name is required');
    isValid = false;
  }
  
  // Validate position
  if (!data.position || data.position.trim() === '') {
    errors.push('Position is required');
    isValid = false;
  }
  
  // Validate contact email
  if (data.contactEmail && !validateEmail(data.contactEmail)) {
    errors.push('Invalid email format');
    isValid = false;
  }
  
  // Validate contact phone
  if (data.contactPhone && !validatePhone(data.contactPhone)) {
    errors.push('Invalid phone format');
    isValid = false;
  }
  
  // Validate website
  if (data.website && !validateUrl(data.website)) {
    errors.push('Invalid website URL');
    isValid = false;
  }
  
  // Validate requirements
  if (data.requirements) {
    if (!Array.isArray(data.requirements)) {
      errors.push('Requirements must be an array');
      isValid = false;
    } else if (data.requirements.length === 0) {
      warnings.push('No requirements specified');
    }
  }
  
  // Validate salary format
  if (data.salary) {
    const salaryPattern = /^\$?\d{1,3}(,\d{3})*$/;
    if (!salaryPattern.test(data.salary)) {
      errors.push('Invalid salary format');
      isValid = false;
    }
  }
  
  // Calculate quality score
  const qualityScore = calculateQualityScore(data, errors);
  
  return {
    isValid,
    errors,
    warnings,
    cleanedData: isValid ? cleanData(data) : undefined,
    qualityScore,
    confidence: isValid ? Math.min(0.9, qualityScore / 100) : 0
  };
}

function validateCompanyData(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let isValid = true;
  
  // Validate required fields
  const requiredFields = ['companyName', 'industry', 'location', 'website', 'email'];
  const validation = validateRequired(data, requiredFields);
  
  if (!validation.isValid) {
    return validation;
  }
  
  errors.push(...validation.errors);
  
  // Validate email
  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
    isValid = false;
  }
  
  // Validate website
  if (data.website && !validateUrl(data.website)) {
    errors.push('Invalid website URL');
    isValid = false;
  }
  
  // Validate industry
  if (!data.industry || data.industry.trim() === '') {
    errors.push('Industry is required');
    isValid = false;
  }
  
  // Validate location
  if (!data.location || data.location.trim() === '') {
    errors.push('Location is required');
    isValid = false;
  }
  
  // Validate founded year
  if (data.foundedYear) {
    const currentYear = new Date().getFullYear();
    if (data.foundedYear < 1800 || data.foundedYear > currentYear) {
      errors.push('Invalid founded year');
      isValid = false;
    }
  }
  
  // Validate business license
  if (data.businessLicense && data.businessLicense.length < 5) {
    errors.push('Business license number too short');
    isValid = false;
  }
  
  // Calculate quality score
  const qualityScore = calculateQualityScore(data, errors);
  
  return {
    isValid,
    errors,
    warnings,
    cleanedData: isValid ? cleanData(data) : undefined,
    qualityScore,
    confidence: isValid ? Math.min(0.9, qualityScore / 100) : 0
  };
}

function validateCandidateData(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let isValid = true;
  
  // Validate personal info
  if (!data.personalInfo) {
    errors.push('Personal information is required');
    isValid = false;
  } else {
    const personalValidation = validateRequired(data.personalInfo, ['firstName', 'lastName', 'email']);
    if (!personalValidation.isValid) {
      errors.push(...personalValidation.errors);
      isValid = false;
    }
  }
  
  // Validate professional info
  if (!data.professionalInfo) {
    errors.push('Professional information is required');
    isValid = false;
  } else {
    if (!data.professionalInfo.experience || data.professionalInfo.experience < 0) {
      errors.push('Experience must be a positive number');
      isValid = false;
    }
    
    if (!data.professionalInfo.skills || !Array.isArray(data.professionalInfo.skills)) {
      errors.push('Skills must be an array');
      isValid = false;
    }
  }
  
  // Validate application info
  if (!data.applicationInfo) {
    errors.push('Application information is required');
    isValid = false;
  } else {
    const appValidation = validateRequired(data.applicationInfo, ['appliedPosition', 'appliedCompany', 'appliedDate']);
    if (!appValidation.isValid) {
      errors.push(...appValidation.errors);
      isValid = false;
    }
  }
  
  // Validate emails
  if (data.personalInfo.email && !validateEmail(data.personalInfo.email)) {
    errors.push('Invalid personal email format');
    isValid = false;
  }
  
  // Calculate quality score
  const qualityScore = calculateQualityScore(data, errors);
  
  return {
    isValid,
    errors,
    warnings,
    cleanedData: isValid ? cleanData(data) : undefined,
    qualityScore,
    confidence: isValid ? Math.min(0.9, qualityScore / 100) : 0
  };
}

function calculateQualityScore(data: any, errors: string[]): number {
  let score = 100;
  
  // Deduct points for errors
  score -= errors.length * 10;
  
  // Add points for completeness
  if (data.companyName) score += 10;
  if (data.position) score += 10;
  if (data.contactEmail) score += 10;
  if (data.contactPhone) score += 10;
  if (data.website) score += 10;
  if (data.requirements && data.requirements.length > 0) score += 10;
  
  return Math.max(0, score);
}

function cleanData(data: any): any {
  const cleaned = { ...data };
  
  // Clean string fields
  Object.keys(cleaned).forEach(key => {
    if (typeof cleaned[key] === 'string') {
      cleaned[key] = cleaned[key].trim().replace(/\s+/g, ' ');
    }
  });
  
  // Remove HTML tags
  Object.keys(cleaned).forEach(key => {
    if (typeof cleaned[key] === 'string') {
      cleaned[key] = cleaned[key].replace(/<[^>]*>/g, '');
    }
  });
  
  // Normalize text
  Object.keys(cleaned).forEach(key => {
    if (typeof cleaned[key] === 'string') {
      cleaned[key] = cleaned[key].toLowerCase().replace(/\b\w+/g, ' ');
    }
  });
  
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const body: ValidationRequest = await req.json();
    const { type, data } = body;
    
    let result: ValidationResult;
    
    switch (type) {
      case 'recruitment':
        result = validateRecruitmentData(data);
        break;
      case 'company':
        result = validateCompanyData(data);
        break;
      case 'candidate':
        result = validateCandidateData(data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid validation type' }, { status: 400 });
    }
    
    console.log(`Validation completed: ${result.isValid ? 'valid' : 'invalid'}, type: ${type}`);
    
    return NextResponse.json({
      success: true,
      type,
      result
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CleaningRequest = await req.json();
    const { type, data, options } = body;
    
    let result: CleaningResult;
    
    switch (type) {
      case 'deduplication':
        result = performDeduplication(data);
        break;
      case 'standardization':
        result = performStandardization(data);
        break;
      case 'quality':
        result = performQualityCheck(data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid cleaning type' }, { status: 400 });
    }
    
    console.log(`Cleaning completed: ${type}, processed: ${result.processed}`);
    
    return NextResponse.json({
      success: true,
      type,
      result
    });
    
  } catch (error) {
    console.error('Cleaning error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function performDeduplication(data: any[]): CleaningResult {
  const seen = new Set();
  const duplicates: any[] = [];
  const cleaned: any[] = [];
  
  data.forEach(item => {
    const key = JSON.stringify(item);
    if (seen.has(key)) {
      duplicates.push(item);
    } else {
      seen.add(key);
      cleaned.push(item);
    }
  });
  
  return {
    processed: data.length,
    duplicates: duplicates.length,
    standardized: cleaned,
    qualityIssues: [],
    cleaned
  };
}

function performStandardization(data: any[]): CleaningResult {
  const standardized = data.map(item => {
    const cleaned = { ...item };
    
    // Standardize company name
    if (cleaned.companyName) {
      cleaned.companyName = cleaned.companyName.toLowerCase().replace(/\b(ltd|inc|llc|corp)\b/g, '').trim();
    }
    
    // Standardize position
    if (cleaned.position) {
      cleaned.position = cleaned.position.toLowerCase().replace(/\b(junior|senior|lead|manager)\b/g, '').trim();
    }
    
    // Standardize location
    if (cleaned.location) {
      cleaned.location = cleaned.location.toLowerCase().replace(/\b(st|ave|blvd|boulevard)\b/g, '').trim();
    }
    
    return cleaned;
  });
  
  return {
    processed: data.length,
    duplicates: 0,
    standardized,
    qualityIssues: [],
    cleaned: standardized
  };
}

function performQualityCheck(data: any[]): CleaningResult {
  const qualityIssues: any[] = [];
  const cleaned: any[] = [];
  
  data.forEach(item => {
    const issues: string[] = [];
    
    // Check for missing required fields
    if (!item.companyName) issues.push('Missing company name');
    if (!item.position) issues.push('Missing position');
    if (!item.contactEmail) issues.push('Missing contact email');
    if (!item.website) issues.push('Missing website');
    
    // Check for data quality
    if (item.contactEmail && !validateEmail(item.contactEmail)) {
      issues.push('Invalid email format');
    }
    
    if (item.website && !validateUrl(item.website)) {
      issues.push('Invalid website URL');
    }
    
    if (issues.length === 0) {
      cleaned.push(item);
    } else {
      cleaned.push({ ...item, qualityIssues: issues });
    }
  });
  
  return {
    processed: data.length,
    duplicates: 0,
    standardized: cleaned,
    qualityIssues,
    cleaned
  };
}

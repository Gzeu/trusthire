/**
 * Real Data Collection API
 * Simplified system for collecting recruitment data
 */

import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, validateApiKey, addSecurityHeaders, logSecurityEvent } from '@/lib/security/api-security';

interface RecruitmentData {
  companyName: string;
  position: string;
  location: string;
  salary: string;
  requirements: string[];
  contactEmail: string;
  contactPhone: string;
  website: string;
  postedDate: Date;
  deadline: Date;
  status: 'active' | 'closed' | 'filled';
  source: string;
  confidence: number;
  notes: string;
}

interface CompanyData {
  companyName: string;
  industry: string;
  size: string;
  location: string;
  foundedYear: number;
  description: string;
  website: string;
  email: string;
  phone: string;
  verified: boolean;
  verificationDate: Date;
  businessLicense: string;
}

interface CandidateData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
  };
  professionalInfo: {
    currentPosition: string;
    experience: number;
    skills: string[];
    education: Education[];
    linkedin: string;
    github: string;
  };
  applicationInfo: {
    appliedPosition: string;
    appliedCompany: string;
    appliedDate: Date;
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
    expectedSalary: string;
  };
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: number;
}

interface DataRecord {
  id: string;
  type: 'recruitment' | 'company' | 'candidate';
  data: any;
  metadata: {
    source: string;
    confidence: number;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
  };
  searchable: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// In-memory storage for demo (in production, use database)
const dataStore: DataRecord[] = [];

// Simple validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]*[\d\s\-\(\)]{7,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
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

function calculateConfidence(data: any): number {
  let confidence = 0.5; // Base confidence
  
  // Boost confidence for complete data
  if (data.companyName) confidence += 0.1;
  if (data.position) confidence += 0.1;
  if (data.contactEmail && validateEmail(data.contactEmail)) confidence += 0.1;
  if (data.contactPhone && validatePhone(data.contactPhone)) confidence += 0.1;
  if (data.website) confidence += 0.1;
  if (data.requirements && data.requirements.length > 0) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
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
  
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    // Validate API key in production
    if (!validateApiKey(req)) {
      logSecurityEvent('INVALID_API_KEY', { endpoint: '/api/data/collect' }, req);
      return NextResponse.json({ error: 'Invalid API key' }, { 
        status: 401,
        headers: addSecurityHeaders({})
      });
    }
    
    const body = await req.json();
    
    // Sanitize input
    const sanitizedBody = sanitizeInput(body);
    const { type } = sanitizedBody;
    
    let dataRecord: DataRecord;
    
    switch (type) {
      case 'recruitment':
        dataRecord = await handleRecruitmentData(sanitizedBody.data);
        break;
      case 'company':
        dataRecord = await handleCompanyData(sanitizedBody.data);
        break;
      case 'candidate':
        dataRecord = await handleCandidateData(sanitizedBody.data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { 
          status: 400,
          headers: addSecurityHeaders({})
        });
    }
    
    // Add to store
    dataStore.push(dataRecord);
    
    console.log(`Data collected: ${dataRecord.id}, type: ${type}`);
    
    return NextResponse.json({
      success: true,
      id: dataRecord.id,
      type,
      message: 'Data collected successfully'
    }, {
      headers: addSecurityHeaders({})
    });
    
  } catch (error) {
    console.error('Data collection error:', error);
    logSecurityEvent('DATA_COLLECTION_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' }, req);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: addSecurityHeaders({})
    });
  }
}

async function handleRecruitmentData(data: any): Promise<DataRecord> {
  // Validate required fields
  const validation = validateRequired(data, [
    'companyName', 'position', 'location', 'contactEmail'
  ]);
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  // Clean data
  const cleanedData = cleanData(data);
  
  // Calculate confidence
  const confidence = calculateConfidence(cleanedData);
  
  const record: DataRecord = {
    id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'recruitment',
    data: cleanedData,
    metadata: {
      source: 'web_form',
      confidence,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['recruitment', 'job_posting']
    },
    searchable: {
      title: `${cleanedData.position} at ${cleanedData.companyName}`,
      description: `Job posting for ${cleanedData.position} position`,
      keywords: [
        cleanedData.position,
        cleanedData.companyName,
        cleanedData.location,
        ...(cleanedData.requirements || [])
      ]
    }
  };
  
  return record;
}

async function handleCompanyData(data: any): Promise<DataRecord> {
  // Validate required fields
  const validation = validateRequired(data, [
    'companyName', 'industry', 'location', 'website', 'email'
  ]);
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  // Clean data
  const cleanedData = cleanData(data);
  
  // Calculate confidence
  const confidence = calculateConfidence(cleanedData);
  
  const record: DataRecord = {
    id: `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'company',
    data: cleanedData,
    metadata: {
      source: 'company_form',
      confidence,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['company', 'business_info']
    },
    searchable: {
      title: cleanedData.companyName,
      description: cleanedData.description || `${cleanedData.industry} company in ${cleanedData.location}`,
      keywords: [
        cleanedData.companyName,
        cleanedData.industry,
        cleanedData.location,
        cleanedData.size
      ]
    }
  };
  
  return record;
}

async function handleCandidateData(data: any): Promise<DataRecord> {
  // Validate required fields
  const validation = validateRequired(data, [
    'personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.email'
  ]);
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  // Clean data
  const cleanedData = cleanData(data);
  
  // Calculate confidence
  const confidence = calculateConfidence(cleanedData);
  
  const record: DataRecord = {
    id: `candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'candidate',
    data: cleanedData,
    metadata: {
      source: 'candidate_form',
      confidence,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['candidate', 'job_application']
    },
    searchable: {
      title: `${cleanedData.personalInfo.firstName} ${cleanedData.personalInfo.lastName} - ${cleanedData.professionalInfo.currentPosition}`,
      description: `Candidate for ${cleanedData.applicationInfo.appliedPosition} at ${cleanedData.applicationInfo.appliedCompany}`,
      keywords: [
        cleanedData.personalInfo.firstName,
        cleanedData.personalInfo.lastName,
        cleanedData.professionalInfo.skills.slice(0, 5),
        cleanedData.professionalInfo.currentPosition
      ]
    }
  };
  
  return record;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Simple search implementation
    let filteredData = dataStore;
    
    if (query) {
      const queryLower = query.toLowerCase();
      filteredData = dataStore.filter(record => 
        record.searchable.title.toLowerCase().includes(queryLower) ||
        record.searchable.description.toLowerCase().includes(queryLower) ||
        record.searchable.keywords.some(keyword => keyword.toLowerCase().includes(queryLower))
      );
    }
    
    if (type) {
      filteredData = filteredData.filter(record => record.type === type);
    }
    
    // Apply limit
    const results = filteredData.slice(0, limit);
    
    return NextResponse.json({
      results,
      total: filteredData.length,
      query,
      type,
      limit
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

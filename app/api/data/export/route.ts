/**
 * Data Export API
 * Simple export functionality for real data
 */

import { NextRequest, NextResponse } from 'next/server';

interface ExportRequest {
  type: 'recruitment' | 'company' | 'candidate' | 'all';
  format: 'csv' | 'json' | 'excel';
  filters?: {
    dateRange?: string;
    type?: string;
    quality?: string;
    source?: string;
    limit?: number;
  };
}

interface ExportResult {
  success: boolean;
  format: string;
  data: any[];
  total: number;
  filename: string;
  downloadUrl?: string;
  error?: string;
}

// In-memory storage (in production, use database)
const dataStore: any[] = [];

// Load sample data (in production, this would come from database)
function loadSampleData() {
  // Sample recruitment data
  dataStore.push({
    id: 'rec_1',
    type: 'recruitment',
    data: {
      companyName: 'TechCorp Solutions',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      salary: '$150,000 - $180,000',
      requirements: ['5+ years experience', 'Computer Science degree', 'Experience with cloud technologies'],
      contactEmail: 'jobs@techcorp.com',
      contactPhone: '+1-555-123-4567',
      website: 'https://techcorp.com',
      postedDate: new Date('2024-01-15'),
      deadline: new Date('2024-02-15'),
      status: 'active',
      source: 'company_website',
      confidence: 0.9,
      notes: 'Direct application from company website'
    },
    searchable: {
      title: 'Senior Software Engineer at TechCorp Solutions',
      description: 'Senior Software Engineer position at TechCorp Solutions',
      keywords: ['senior', 'software', 'engineer', 'techcorp', 'san francisco', 'cloud', 'computer science']
    }
  });
  
  // Sample company data
  dataStore.push({
    id: 'company_1',
    type: 'company',
    data: {
      companyName: 'InnovateTech Inc',
      industry: 'Technology',
      size: '50-100',
      location: 'New York, NY',
      foundedYear: 2018,
      description: 'Innovative technology company specializing in AI and blockchain solutions',
      website: 'https://innovatech.com',
      email: 'info@innovatech.com',
      phone: '+1-212-555-0123',
      verified: true,
      verificationDate: new Date('2024-01-10'),
      businessLicense: 'NY-BUS-123456789'
    },
    searchable: {
      title: 'InnovateTech Inc',
      description: 'Technology company in New York focusing on AI and blockchain',
      keywords: ['technology', 'ai', 'blockchain', 'innovation', 'new york']
    }
  });
  
  // Sample candidate data
  dataStore.push({
    id: 'candidate_1',
    type: 'candidate',
    data: {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-123-4567',
        location: 'San Francisco, CA'
      },
      professionalInfo: {
        currentPosition: 'Full Stack Developer',
        experience: 8,
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'SQL', 'MongoDB'],
        education: [
          { school: 'University of California, Berkeley', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2010', endDate: '2014', gpa: 3.8 }
        ],
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe'
      },
      applicationInfo: {
        appliedPosition: 'Full Stack Developer',
        appliedCompany: 'TechCorp Solutions',
        appliedDate: new Date('2024-01-20'),
        status: 'pending',
        expectedSalary: '$140,000 - $160,000'
      }
    },
    searchable: {
      title: 'John Doe - Full Stack Developer',
      description: 'Candidate for Full Stack Developer at TechCorp Solutions',
      keywords: ['full stack', 'developer', 'javascript', 'react', 'nodejs', 'python', 'typescript']
    }
  });
}

function filterData(data: any[], filters: any): any[] {
  let filtered = data;
  
  if (filters.type) {
    filtered = filtered.filter(item => item.type === filters.type);
  }
  
  if (filters.dateRange) {
    const now = new Date();
    let startDate: Date;
    
    switch (filters.dateRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }
    
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.metadata.createdAt);
      return itemDate >= startDate;
    });
  }
  
  if (filters.quality) {
    const qualityThresholds = { high: 80, medium: 60, low: 40 };
    const threshold = qualityThresholds[filters.quality] || 0;
    
    filtered = filtered.filter(item => 
      item.metadata.confidence * 100 >= threshold
    );
  }
  
  if (filters.source) {
    filtered = filtered.filter(item => 
      item.metadata.source === filters.source
    );
  }
  
  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit);
  }
  
  return filtered;
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = data.map(item => {
    return headers.map(header => {
      const value = getNestedValue(item, header);
      return typeof value === 'string' ? `"${value}"` : value;
    }).join(',');
  });
  
  return csvRows.join('\n');
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] ? current[key] : obj[key];
  }, null);
}

function convertToJSON(data: any[]): string {
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    total: data.length,
    data
  }, null, 2);
}

function convertToExcel(data: any[]): Buffer {
  // Simple Excel format (CSV-like)
  const headers = Object.keys(data[0]);
  const csvContent = convertToCSV(data);
  
  // Create a simple Excel-like format
  const excelContent = headers.join(',') + '\n' + csvContent;
  
  return Buffer.from(excelContent, 'utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const body: ExportRequest = await req.json();
    const { type, format, filters } = body;
    
    // Filter data based on criteria
    const filteredData = filterData(dataStore, filters);
    
    let result: ExportResult;
    let filename: string;
    let downloadUrl: string;
    
    switch (format) {
      case 'csv':
        const csvData = convertToCSV(filteredData);
        filename = `trusthire_data_${type}_${Date.now()}.csv`;
        
        // In a real implementation, save to file and return download URL
        // For now, return the content directly
        result = {
          success: true,
          format: 'csv',
          data: filteredData,
          total: filteredData.length,
          filename,
          csvData
        };
        break;
        
      case 'json':
        const jsonData = convertToJSON(filteredData);
        filename = `trusthire_data_${type}_${Date.now()}.json`;
        
        result = {
          success: true,
          format: 'json',
          data: filteredData,
          total: filteredData.length,
          filename,
          jsonData
        };
        break;
        
      case 'excel':
        const excelData = convertToExcel(filteredData);
        filename = `trusthire_data_${type}_${Date.now()}.xlsx`;
        
        result = {
          success: true,
          format: 'excel',
          data: filteredData,
          total: filteredData.length,
          filename,
          excelData
        };
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid export format' }, { status: 400 });
    }
    
    console.log(`Export completed: ${result.format}, type: ${type}, records: ${result.total}`);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    
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
    
    return NextResponse.json({
      results: filteredData,
      total: filteredData.length,
      query,
      type
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

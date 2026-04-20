/**
 * Data Analytics API
 * Simple analytics for real data
 */

import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsRequest {
  type: 'overview' | 'trends' | 'quality' | 'export';
  filters?: {
    dateRange?: string;
    type?: string;
    source?: string;
  };
}

interface AnalyticsData {
  totalRecords: number;
  type: string;
  dateRange: string;
  metrics: {
    totalRecords: number;
    averageConfidence: number;
    qualityScore: number;
    sourceDistribution: { [key: string]: number };
    statusDistribution: { [key: string]: number };
  };
  trends: {
    topPositions: Array<{ position: string; count: number }>;
    topLocations: Array<{ location: string; count: number }>;
    topCompanies: Array<{ company: string; count: number }>;
  };
  quality: {
    high: number;
    medium: number;
    low: number;
    issues: Array<{
      type: string;
      count: number;
      description: string;
    }>;
  };
}

// In-memory storage (in production, use database)
const dataStore: any[] = [];

// Generate analytics for data
function generateAnalytics(type: string, filters?: any): AnalyticsData {
  const filteredData = filters ? filterData(dataStore, filters) : dataStore;
  
  const totalRecords = filteredData.length;
  
  // Calculate basic metrics
  const averageConfidence = filteredData.reduce((sum, item) => sum + (item.metadata?.confidence || 0), 0) / totalRecords;
  
  const qualityScores = filteredData.map(item => {
    // Simple quality calculation based on completeness
    let score = 50; // Base score
    
    if (item.metadata?.confidence) score += item.metadata.confidence * 30;
    if (item.data?.companyName) score += 10;
    if (item.data?.position) score += 10;
    if (item.data?.contactEmail) score += 10;
    if (item.data?.contactPhone) score += 10;
    if (item.data?.website) score += 10;
    if (item.data?.requirements && item.data.requirements.length > 0) score += 10;
    
    return Math.min(100, score);
  });
  
  const averageQualityScore = qualityScores.reduce((sum, score) => sum + score, 0) / totalRecords;
  
  // Source distribution
  const sourceDistribution: { [key: string]: number } = {};
  filteredData.forEach(item => {
    const source = item.metadata?.source || 'unknown';
    sourceDistribution[source] = (sourceDistribution[source] || 0) + 1;
  });
  
  // Status distribution
  const statusDistribution: { [key: string]: number } = {};
  filteredData.forEach(item => {
    const status = item.data?.status || 'unknown';
    statusDistribution[status] = (statusDistribution[status] || 0) + 1;
  });
  
  // Top positions
  const positionCounts: { [key: string]: number } = {};
  filteredData.forEach(item => {
    if (item.type === 'recruitment' && item.data?.position) {
      const position = item.data.position.toLowerCase();
      positionCounts[position] = (positionCounts[position] || 0) + 1;
    }
  });
  
  // Top locations
  const locationCounts: { [key: string]: number } = {};
  filteredData.forEach(item => {
    const location = item.data?.location || 'unknown';
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });
  
  // Top companies
  const companyCounts: { [key: string]: number } = {};
  filteredData.forEach(item => {
    if (item.type === 'company' && item.data?.companyName) {
      const company = item.data.companyName.toLowerCase();
      companyCounts[company] = (companyCounts[company] || 0) + 1;
    }
  });
  
  // Quality issues
  const qualityIssues: any[] = [];
  filteredData.forEach(item => {
    const issues: string[] = [];
    
    if (!item.data.companyName) issues.push('Missing company name');
    if (!item.data.position) issues.push('Missing position');
    if (!item.contactEmail) issues.push('Missing contact email');
    if (!item.data.website) issues.push('Missing website');
    
    if (issues.length > 0) {
      const qualityIssuesForItem = {
        type: item.type,
        count: 1,
        description: issues.join(', ')
      };
      qualityIssues.push(qualityIssuesForItem);
    }
  });
  
  // Categorize quality issues
  const qualityIssuesByType: { [key: string]: number } = {};
  qualityIssues.forEach(issue => {
    qualityIssuesByType[issue.type] = (qualityIssuesByType[issue.type] || 0) + 1;
  });
  
  // Determine quality levels
  const highQualityItems = qualityIssues.filter(issue => issue.count >= 3);
  const mediumQualityItems = qualityIssues.filter(issue => issue.count >= 2 && issue.count < 3);
  const lowQualityItems = qualityIssues.filter(issue => issue.count < 2);
  
  const quality = {
    high: highQualityItems.length,
    medium: mediumQualityItems.length,
    low: lowQualityItems.length
  };
  
  return {
    totalRecords,
    type,
    dateRange: filters?.dateRange || 'all',
    metrics: {
      totalRecords,
      averageConfidence,
      qualityScore: averageQualityScore,
      sourceDistribution,
      statusDistribution
    },
    trends: {
      topPositions: Object.entries(positionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([key, count]) => ({ position: key, count: Number(count) })),
      topLocations: Object.entries(locationCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([key, count]) => ({ location: key, count: Number(count) })),
      topCompanies: Object.entries(companyCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([key, count]) => ({ company: key, count: Number(count) }))
    },
    quality: {
      high: quality.high.length,
      medium: quality.medium.length,
      low: quality.low.length,
      issues: Object.entries(qualityIssuesByType).map(([type, count]) => ({
        type,
        count: Number(count),
        description: `${type} issues found`
      }))
    }
  };
}

function filterData(data: any[], filters?: any): any[] {
  let filtered = data;
  
  if (filters?.type) {
    filtered = data.filter(item => item.type === filters.type);
  }
  
  if (filters?.dateRange) {
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
      const itemDate = new Date(item.metadata?.createdAt);
      return itemDate >= startDate;
    });
  }
  
  if (filters?.source) {
    filtered = filtered.filter(item => 
      item.metadata?.source === filters.source
    );
  }
  
  return filtered;
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyticsRequest = await req.json();
    const { type, filters } = body;
    
    let result: AnalyticsData;
    
    switch (type) {
      case 'overview':
        result = generateAnalytics('overview', filters);
        break;
      case 'trends':
        result = generateAnalytics('trends', filters);
        break;
      case 'quality':
        result = generateAnalytics('quality', filters);
        break;
      case 'export':
        // For export, we'll need to format the data differently
        const filteredData = filterData(dataStore, filters);
        const exportData = {
          totalRecords: filteredData.length,
          type: filters?.type || 'all',
          dateRange: filters?.dateRange || 'all',
          data: filteredData
        };
        
        result = {
          ...exportData,
          metrics: generateAnalytics('overview', filters).metrics,
          trends: generateAnalytics('trends', filters).trends,
          quality: generateAnalytics('quality', filters).quality
        };
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }
    
    console.log(`Analytics generated: ${type}, records: ${result.totalRecords}`);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Analytics error:', error);
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
      filteredData = dataStore.filter((record: any) => 
        record.searchable.title.toLowerCase().includes(queryLower) ||
        record.searchable.description.toLowerCase().includes(queryLower) ||
        record.searchable.keywords.some((keyword: string) => keyword.toLowerCase().includes(queryLower))
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
    console.error('Analytics search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  BarChart, 
  PieChart, 
  TrendingUp, 
  Download, 
  Filter, 
  Search,
  Table,
  Activity,
  RefreshCw
} from 'lucide-react';

interface DataRecord {
  id: string;
  type: string;
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
    interface: string;
    keywords: string[];
  };
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }>;
}

interface DashboardMetrics {
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

export default function SimpleDataDashboard() {
  const [data, setData] = useState<DataRecord[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'all',
    quality: 'all',
    source: 'all'
  });
  <strong>const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [selectedChart, setSelectedChart] = useState<'overview' | 'positions' | 'locations' | 'companies' | 'quality'>('overview');
  
  // Mock data for demonstration
  const mockData: DataRecord[] = [
    {
      id: '1',
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
      metadata: {
        source: 'company_website',
        confidence: 0.9,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        tags: ['recruitment', 'job_posting']
      },
      searchable: {
        title: 'Senior Software Engineer at TechCorp Solutions',
        description: 'Senior Software Engineer position at TechCorp Solutions',
        keywords: ['senior', 'software', 'engineer', 'techcorp', 'san francisco', 'cloud', 'computer science']
      }
    },
    {
      id: '2',
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
      metadata: {
        source: 'company_form',
        confidence: 0.95,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        tags: ['company', 'business_info']
      },
      searchable: {
        title: 'InnovateTech Inc',
        description: 'Technology company in New York focusing on AI and blockchain',
        keywords: ['technology', 'ai', 'blockchain', 'innovation', 'new york']
      }
    },
    {
      id: '3',
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
      metadata: {
        source: 'candidate_form',
        confidence: 0.85,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        tags: ['candidate', 'job_application']
      },
      searchable: {
        title: 'John Doe - Full Stack Developer',
        description: 'Candidate for Full Stack Developer at TechCorp Solutions',
        keywords: ['full stack', 'developer', 'javascript', 'react', 'nodejs', 'python', 'typescript']
      }
    }
  ];

  // Calculate metrics when data changes
  const metrics = useMemo(() => {
    if (data.length === 0) return null;
    
    const totalRecords = data.length;
    const type = filters.type || 'all';
    const dateRange = filters.dateRange || 'all';
    
    // Calculate metrics
    const sourceDistribution: { [key: string]: number } = {};
    const statusDistribution: { [key: string]: number } = {};
    const positionCounts: { [key: string]: number } = {};
    const locationCounts: { [key: string]: number } = {};
    const companyCounts: { [key: string]: number } = {};
    
    const confidenceScores = data.map(item => item.metadata?.confidence || 0);
    const averageConfidence = confidenceScores.reduce((sum, score) => sum + score, 0) / totalRecords;
    const qualityScores = data.map(item => {
      let score = 50;
      if (item.metadata?.confidence) score += item.metadata.confidence * 30;
      if (item.data?.companyName) score += 10;
      if (item.data?.position) score += 10;
      if (item.data?.contactEmail && validateEmail(item.data.contactEmail)) score += 10;
      if (item.data?.contactPhone && validatePhone(item.data.contactPhone)) score += 10;
      if (item.data?.website && validateUrl(item.data.website)) score += 10;
      if (item.data?.requirements && item.data.requirements.length > 0) score += 10;
      
      return Math.min(100, score);
    });
    
    const averageQualityScore = qualityScores.reduce((sum, score) => sum + score, 0) / totalRecords;
    
    data.forEach(item => {
      const source = item.metadata?.source || 'unknown';
      sourceDistribution[source] = (sourceDistribution[source] || 0) + 1;
    });
    
    data.forEach(item => {
      const status = item.data?.status || 'unknown';
      statusDistribution[status] = (statusDistribution[status] || 0) + 1;
    });
    
    if (item.type === 'recruitment' && item.data?.position) {
      const position = item.data.position.toLowerCase();
      positionCounts[position] = (positionCounts[position] || 0) + 1;
    }
    
    if (item.type === 'company' && item.data?.companyName) {
      const company = item.data.companyName.toLowerCase();
      companyCounts[company] = (companyCounts[company] || 0) + 1;
    }
    
    if (item.type === 'candidate' && item.data?.personalInfo?.location) {
      const location = item.data.personalInfo.location || 'unknown';
      locationCounts[location] = (locationCounts[location || 0) + 1;
    }
    
    // Quality issues
    const qualityIssues: any[] = [];
    data.forEach(item => {
      const issues: string[] = [];
      
      if (!item.data.companyName) issues.push('Missing company name');
      if (!item.data.position) issues.push('Missing position');
      if (!item.data.contactEmail) issues.push('Missing contact email');
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
    
    return {
      totalRecords,
      type,
      dateRange,
      metrics: {
        totalRecords,
        averageConfidence,
        qualityScore: averageQualityScore,
        sourceDistribution,
        statusDistribution
      },
      trends: {
        topPositions: Object.entries(positionCounts)
          .sort(([, a], b) => b[1] - a[1])
          .slice(0, 5)
          .map(([key, count]) => ({ position: key, count })),
        topLocations: Object.entries(locationCounts)
          .sort(([, a], b) => b[1] - a[1])
          .slice(0, 5)
          .map(([key, count]) => ({ location: key, count })),
        topCompanies: Object.entries(companyCounts)
          .sort(([, a], b) => b[1] - a[1])
          .slice(0, 5)
          .map(([key, count]) => ({ company: key, count }))
      },
      quality: {
        high: qualityIssues.filter(issue => issue.count >= 3).length,
        medium: qualityIssues.filter(issue => issue.count >= 2 && issue.count < 3).length,
        low: qualityIssues.filter(issue => issue.count < 2).length
      }
    };
  };
  }, [data, filters, metrics]);

  // Apply filters
  const filteredData = useMemo(() => {
    let result = data;
    
    if (filters.type && filters.type !== 'all') {
      result = result.filter(item => item.type === filters.type);
    }
    
    if (filters.dateRange && filters.dateRange !== 'all') {
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
      
      result = result.filter(item => {
        const itemDate = new Date(item.metadata?.createdAt);
        return itemDate >= startDate;
      });
    }
    
    if (filters.source && filters.source !== 'all') {
      result = result.filter(item => 
        item.metadata?.source === filters.source
      );
    }
    
    if (filters.quality && filters.quality !== 'all') {
      const qualityThresholds = { high: 80, medium: 60, low: 40 };
      const threshold = qualityThresholds[filters.quality] || 0;
      
      result = result.filter(item => {
        const score = item.metadata?.confidence || 0;
        return score * 100 >= threshold;
      });
    }
    
    return result;
  }, [data, filters, metrics]);

  // Chart data preparation
  const chartData: ChartData = useMemo(() => {
    switch (selectedChart) {
      case 'overview':
        return {
          labels: ['Recruitment', 'Companies', 'Candidates'],
          datasets: [
            {
              label: 'Data by Type',
              data: [
                metrics.typeDistribution.recruitment || 0,
                metrics.typeDistribution.company || 0,
                metrics.statusDistribution.candidate || 0,
                metrics.sourceDistribution.company || 0
              ],
              backgroundColor: '#3b82f6'
            },
            {
              label: 'Data Quality',
              data: [
                metrics.quality.high,
                metrics.quality.medium,
                metrics.quality.low,
                metrics.quality.low
              ],
              backgroundColor: ['#ef4444', '#f97316', '#eab308']
            }
          ]
        };
      case 'positions':
        const positionData = Object.entries(metrics.trends.topPositions);
        return {
          labels: positionData.map(([key]) => key),
          datasets: [{
            label: 'Job Positions',
            data: positionData.map(([, count]) => count),
            backgroundColor: '#3b82f6'
          }]
        };
      case 'locations':
        const locationData = Object.entries(metrics.trends.topLocations);
        return {
          labels: locationData.map(([key]) => key),
          datasets: [{
            label: 'Top Locations',
            data: locationData.map(([, count]) => count),
            backgroundColor: '#10b981'
          }]
        };
      case 'companies':
        const companyData = Object.entries(metrics.trends.topCompanies);
        return {
          labels: companyData.map(([key]) => key),
          datasets: [{
            label: 'Top Companies',
            data: companyData.map(([, count]) => count),
            backgroundColor: '#22c55e'
          }]
        };
      case 'quality':
        return {
          labels: ['High', 'Medium', 'Low'],
          datasets: [{
            label: 'Data Quality',
            data: [
              metrics.quality.high,
              metrics.quality.medium,
              metrics.quality.low,
              metrics.quality.low
            ],
            backgroundColor: ['#ef4444', '#f97316', '#eab308']
          }]
        };
      default:
        return {
          labels: ['Total Records', 'Average Confidence'],
          datasets: [
            {
              label: 'Overview',
              data: [metrics.totalRecords, metrics.averageConfidence],
              backgroundColor: '#3b82f6'
            },
            {
              label: 'Average Quality Score',
              data: [metrics.averageQualityScore],
              backgroundColor: '#22c55e'
            }
          ]
        };
    }
  }, [selectedChart]);

  // Export functionality
  const handleExport = (format: string) => void => {
    const filteredData = filterData(data, filters);
    let exportData: string;
    let filename: string;
    
    switch (format) {
      case 'csv':
        exportData = convertToCSV(filteredData);
        filename = `trusthire_data_${Date.now()}.csv`;
        break;
      case 'json':
        exportData = convertToJSON(filteredData);
        filename = `trusthire_data_${Date.now()}.json`;
        break;
      case 'excel':
        exportData = convertToExcel(filteredData);
        filename = `trusthire_data_${Date.now()}.xlsx`;
        break;
      default:
        return;
    }
    
    // Create download link (in real app, this would save to file and return URL)
    const downloadUrl = `data/export/${filename}`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.textContent = `Download ${format.toUpperCase()} Export`;
    document.body.appendChild(link);
    
    // Auto-remove link after 5 seconds
    setTimeout(() => {
      document.body.removeChild(link);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">
            TrustHire Data Dashboard
          </h1>
          <p className="text-gray-300">
            Simple analytics and data management for recruitment data
          </p>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Activity className="w-4 h-4 inline mr-2" />
            Activity
          </div>
          <div className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </div>
          <div className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Refresh
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">
            Filters
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="all">All Types</option>
                <option value="recruitment">Recruitment</option>
                <option value="company">Companies</option>
                <option value="candidate">Candidates</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
              <select
                value={filters.quality}
                onChange={(e) => setFilters(prev => ({ ...prev, quality: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-lg text-white"
              >
                <option value="all">All Levels</option>
                <option value="high">High Only</option>
                <option value="medium">Medium+</option>
                <option value="low">Low Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
              <select
                value={filters.source}
                onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-lg text-white"
              >
                <option value="all">All Sources</option>
                <option value="company_form">Company Form</option>
                <option value="candidate_form">Candidate Form</option>
                <option value="web_form">Web Form</option>
              </select>
            </div>
            
            <button
              onClick={() => {
                setFilters({
                  type: 'all',
                  dateRange: 'all',
                  quality: 'all',
                  source: 'all'
                });
                setMetrics(null);
              }}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Total Records</h3>
            <div className="text-3xl font-bold text-blue-400">{metrics.totalRecords}</div>
          </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Average Confidence</h3>
            <div className="text-3xl font-bold text-green-400">{(averageConfidence * 100).toFixed(1)}%</div>
          </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Quality Score</h3>
            <div className="text-3xl font-bold text-yellow-400">{averageQualityScore.toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Data Quality</h3>
            <div className="flex items-center gap-2">
              <div className="text-sm text-red-400">High: {metrics.quality.high}</div>
              <div className="text-sm text-yellow-400">Medium: {metrics.quality.medium}</div>
              <div className="text-sm text-green-400">Low: {metrics.quality.low}</div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
      
      {/* Charts */}
      {selectedChart && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">
              {selectedChart === 'positions' && 'Job Positions'}
              {selectedChart === 'locations' && 'Top Locations'}
              {selectedChart === 'companies' && 'Top Companies'}
            </h3>
            </div>
            
            <div className="h-64">
              <BarChart3 data={chartData} />
            </div>
          </div>
      )}
      
      {/* Data Table */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Recent Data
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr>
                <th className="text-left text-gray-400">Type</th>
                <th>Company</th>
                <th>Position</th>
                <th>Location</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 10).map(item => (
                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2">
                    {item.type === 'recruitment' && (
                      <span className="text-blue-400">📋</span>
                    )}
                    {item.type === 'company' && (
                      <span className="text-green-400">🏢</span>
                    )}
                    {item.type === 'candidate' && (
                      <span className="text-purple-400">👤</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {item.searchable.title}
                  </td>
                  <td className="px-4 py-2">
                    {(item.metadata?.confidence || 0) * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-2">
                    {item.data?.status}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {/* Handle record selection */}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Export Options */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-xl font-semibold text-white mb-4">
          Export Options
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Download CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Download JSON
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Download Excel
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleDataDashboard;

// Scan History Component
// Interface for viewing and managing scan history with search and filtering

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trash2,
  Eye,
  BarChart3
} from 'lucide-react';

interface ScanHistoryEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  sessionId: string;
  scanType: 'github' | 'url' | 'linkedin' | 'forms';
  target: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  overallScore?: number;
  scanDuration?: number;
  resultData: string;
  errorData?: string;
  metadata?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface ScanHistoryFilter {
  scanType?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

interface ScanHistoryResponse {
  entries: ScanHistoryEntry[];
  total: number;
}

const ScanHistory: React.FC = () => {
  const [entries, setEntries] = useState<ScanHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ScanHistoryFilter>({
    limit: 20,
    offset: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  // Fetch scan history
  const fetchScanHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.scanType) params.append('scanType', filters.scanType);
      if (filters.status) params.append('status', filters.status);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await fetch(`/api/scan/history?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch scan history');
      }
      
      const data: ScanHistoryResponse = await response.json();
      setEntries(data.entries);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch scan history:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  // Refresh data
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchScanHistory();
  }, [fetchScanHistory]);

  // Toggle row expansion
  const toggleRowExpansion = useCallback((id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Toggle selection
  const toggleSelection = useCallback((id: string) => {
    setSelectedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Toggle all selection
  const toggleAllSelection = useCallback(() => {
    if (selectedEntries.size === entries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(entries.map(entry => entry.id)));
    }
  }, [entries, selectedEntries.size]);

  // Delete selected entries
  const handleDeleteSelected = useCallback(async () => {
    if (selectedEntries.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedEntries.size} scan history entries?`)) {
      return;
    }

    try {
      const response = await fetch('/api/scan/history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: Array.from(selectedEntries)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete entries');
      }

      setSelectedEntries(new Set());
      fetchScanHistory();
    } catch (err) {
      console.error('Failed to delete entries:', err);
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }, [selectedEntries, fetchScanHistory]);

  // Export selected entries
  const handleExportSelected = useCallback(async () => {
    if (selectedEntries.size === 0) return;

    try {
      const response = await fetch('/api/scan/history/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: Array.from(selectedEntries)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to export entries');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scan-history-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export entries:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  }, [selectedEntries]);

  // Format scan duration
  const formatDuration = useCallback((duration?: number) => {
    if (!duration) return 'N/A';
    
    if (duration < 1000) {
      return `${duration}ms`;
    } else if (duration < 60000) {
      return `${(duration / 1000).toFixed(1)}s`;
    } else {
      return `${(duration / 60000).toFixed(1)}m`;
    }
  }, []);

  // Get status icon and color
  const getStatusInfo = useCallback((status: string) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
      case 'failed':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };
      case 'running':
        return { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'pending':
        return { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  }, []);

  // Get scan type color
  const getScanTypeColor = useCallback((scanType: string) => {
    switch (scanType) {
      case 'github':
        return 'bg-gray-100 text-gray-800';
      case 'url':
        return 'bg-blue-100 text-blue-800';
      case 'linkedin':
        return 'bg-blue-100 text-blue-800';
      case 'forms':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchScanHistory();
  }, [fetchScanHistory]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scan History</h1>
            <p className="text-gray-600 mt-1">View and manage your security scan history</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search scans..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, offset: 0 }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            {selectedEntries.size > 0 && (
              <>
                <button
                  onClick={handleExportSelected}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export ({selectedEntries.size})
                </button>
                
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedEntries.size})
                </button>
              </>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scan Type</label>
                <select
                  value={filters.scanType || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, scanType: e.target.value || undefined, offset: 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="github">GitHub</option>
                  <option value="url">URL</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="forms">Forms</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined, offset: 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="running">Running</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value || undefined, offset: 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value || undefined, offset: 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {entries.length} of {total} scans
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading && entries.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Loading scan history...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scan history found</h3>
            <p className="text-gray-600">Start scanning to see your history here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEntries.size === entries.length && entries.length > 0}
                      onChange={toggleAllSelection}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => {
                  const statusInfo = getStatusInfo(entry.status);
                  const StatusIcon = statusInfo.icon;
                  const isExpanded = expandedRows.has(entry.id);
                  const isSelected = selectedEntries.has(entry.id);

                  return (
                    <React.Fragment key={entry.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelection(entry.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {entry.target}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScanTypeColor(entry.scanType)}`}>
                            {entry.scanType.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {entry.status}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {entry.overallScore !== undefined ? `${entry.overallScore}%` : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDuration(entry.scanDuration)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(entry.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleRowExpansion(entry.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {entry.status === 'completed' && (
                              <a
                                href={`/results/${entry.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Scan Details</h4>
                                  <dl className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <dt className="text-gray-600">Session ID:</dt>
                                      <dd className="text-gray-900 font-mono">{entry.sessionId}</dd>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <dt className="text-gray-600">Updated:</dt>
                                      <dd className="text-gray-900">{new Date(entry.updatedAt).toLocaleString()}</dd>
                                    </div>
                                    {entry.ipAddress && (
                                      <div className="flex justify-between text-sm">
                                        <dt className="text-gray-600">IP Address:</dt>
                                        <dd className="text-gray-900">{entry.ipAddress}</dd>
                                      </div>
                                    )}
                                  </dl>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Results</h4>
                                  <div className="space-y-2">
                                    {entry.status === 'completed' && entry.resultData && (
                                      <div className="bg-white p-3 rounded border border-gray-200">
                                        <pre className="text-xs text-gray-700 overflow-x-auto">
                                          {JSON.stringify(JSON.parse(entry.resultData), null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                    
                                    {entry.status === 'failed' && entry.errorData && (
                                      <div className="bg-red-50 p-3 rounded border border-red-200">
                                        <pre className="text-xs text-red-700 overflow-x-auto">
                                          {JSON.stringify(JSON.parse(entry.errorData), null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {total > entries.length && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {filters.offset || 0 + 1} to {Math.min((filters.offset || 0) + (filters.limit || 20), total)} of {total} results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, offset: Math.max(0, (prev.offset || 0) - (prev.limit || 20)) }))}
                  disabled={!filters.offset || filters.offset === 0}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => setFilters(prev => ({ ...prev, offset: (prev.offset || 0) + (prev.limit || 20) }))}
                  disabled={(filters.offset || 0) + (filters.limit || 20) >= total}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanHistory;

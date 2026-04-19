// User Management Component
// Comprehensive admin interface for user management with CRUD operations

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff, 
  Key, 
  Calendar,
  Mail,
  User,
  UserCheck,
  UserX,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Settings
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  avatar?: string;
  timezone?: string;
  language: string;
  createdAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

interface UserFilter {
  role?: string;
  status?: string;
  emailVerified?: boolean;
  mfaEnabled?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  mfaEnabledUsers: number;
  usersByRole: Record<string, number>;
  recentRegistrations: User[];
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<UserFilter>({
    limit: 20,
    offset: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.emailVerified !== undefined) params.append('emailVerified', filters.emailVerified.toString());
      if (filters.mfaEnabled !== undefined) params.append('mfaEnabled', filters.mfaEnabled.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  }, []);

  // Refresh data
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

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
    setSelectedUsers(prev => {
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
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user.id)));
    }
  }, [users, selectedUsers.size]);

  // Bulk actions
  const handleBulkAction = useCallback(async (action: string) => {
    if (selectedUsers.size === 0) return;

    const confirmMessages = {
      activate: 'Are you sure you want to activate the selected users?',
      deactivate: 'Are you sure you want to deactivate the selected users?',
      delete: 'Are you sure you want to delete the selected users? This action cannot be undone.',
      verify: 'Are you sure you want to verify the email addresses of the selected users?',
      unverify: 'Are you sure you want to unverify the email addresses of the selected users?'
    };

    if (!confirm(confirmMessages[action as keyof typeof confirmMessages] || 'Are you sure?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          userIds: Array.from(selectedUsers)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to perform bulk action');
      }

      setSelectedUsers(new Set());
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error('Bulk action failed:', err);
      setError(err instanceof Error ? err.message : 'Bulk action failed');
    }
  }, [selectedUsers, fetchUsers, fetchStats]);

  // Export users
  const handleExport = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users/export');
      if (!response.ok) {
        throw new Error('Failed to export users');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export failed:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  }, []);

  // Get role color
  const getRoleColor = useCallback((role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ANALYST':
        return 'bg-blue-100 text-blue-800';
      case 'USER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Get status icon and color
  const getStatusInfo = useCallback((status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' };
      case 'INACTIVE':
        return { icon: UserX, color: 'text-gray-600', bg: 'bg-gray-100' };
      case 'SUSPENDED':
        return { icon: ShieldOff, color: 'text-red-600', bg: 'bg-red-100' };
      case 'PENDING_VERIFICATION':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      default:
        return { icon: User, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, offset: 0 }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            {selectedUsers.size > 0 && (
              <div className="flex items-center space-x-2">
                <select
                  onChange={(e) => handleBulkAction(e.target.value)}
                  value=""
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled>Bulk Actions ({selectedUsers.size})</option>
                  <option value="activate">Activate</option>
                  <option value="deactivate">Deactivate</option>
                  <option value="verify">Verify Email</option>
                  <option value="unverify">Unverify Email</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
            )}
            
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">{stats.totalUsers}</span>
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <UserCheck className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">{stats.activeUsers}</span>
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Mail className="w-8 h-8 text-emerald-600" />
                <span className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</span>
              </div>
              <div className="text-sm text-gray-600">Verified Emails</div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">{stats.mfaEnabledUsers}</span>
              </div>
              <div className="text-sm text-gray-600">MFA Enabled</div>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={filters.role || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value || undefined, offset: 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Roles</option>
                  <option value="USER">User</option>
                  <option value="ANALYST">Analyst</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
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
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING_VERIFICATION">Pending Verification</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Verified</label>
                <select
                  value={filters.emailVerified !== undefined ? filters.emailVerified.toString() : ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    emailVerified: e.target.value === '' ? undefined : e.target.value === 'true', 
                    offset: 0 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MFA Enabled</label>
                <select
                  value={filters.mfaEnabled !== undefined ? filters.mfaEnabled.toString() : ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    mfaEnabled: e.target.value === '' ? undefined : e.target.value === 'true', 
                    offset: 0 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
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
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {users.length} of {total} users
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Get started by adding your first user</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === users.length && users.length > 0}
                      onChange={toggleAllSelection}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
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
                {users.map((user) => {
                  const statusInfo = getStatusInfo(user.status);
                  const StatusIcon = statusInfo.icon;
                  const isExpanded = expandedRows.has(user.id);
                  const isSelected = selectedUsers.has(user.id);

                  return (
                    <React.Fragment key={user.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelection(user.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.username || user.email
                                }
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.username && (
                                <div className="text-xs text-gray-400">@{user.username}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role.replace('_', ' ').toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {user.status.replace('_', ' ').toLowerCase()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {user.emailVerified && (
                              <div className="flex items-center text-green-600">
                                <Mail className="w-4 h-4 mr-1" />
                                <span className="text-xs">Verified</span>
                              </div>
                            )}
                            {user.mfaEnabled && (
                              <div className="flex items-center text-purple-600">
                                <Shield className="w-4 h-4 mr-1" />
                                <span className="text-xs">MFA</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div>{user.loginCount} logins</div>
                            {user.lastLoginAt && (
                              <div className="text-xs text-gray-500">
                                Last: {new Date(user.lastLoginAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleRowExpansion(user.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditModal(true);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => {
                                // Handle delete
                                if (confirm(`Are you sure you want to delete user ${user.email}?`)) {
                                  // Implement delete
                                }
                              }}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">User Details</h4>
                                  <dl className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <dt className="text-gray-600">User ID:</dt>
                                      <dd className="text-gray-900 font-mono">{user.id}</dd>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <dt className="text-gray-600">Timezone:</dt>
                                      <dd className="text-gray-900">{user.timezone || 'Not set'}</dd>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <dt className="text-gray-600">Language:</dt>
                                      <dd className="text-gray-900">{user.language}</dd>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <dt className="text-gray-600">Created:</dt>
                                      <dd className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</dd>
                                    </div>
                                  </dl>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Security Settings</h4>
                                  <dl className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <dt className="text-gray-600">Email Verified:</dt>
                                      <dd className="text-gray-900">
                                        {user.emailVerified ? (
                                          <span className="text-green-600">Yes</span>
                                        ) : (
                                          <span className="text-red-600">No</span>
                                        )}
                                      </dd>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <dt className="text-gray-600">MFA Enabled:</dt>
                                      <dd className="text-gray-900">
                                        {user.mfaEnabled ? (
                                          <span className="text-green-600">Yes</span>
                                        ) : (
                                          <span className="text-red-600">No</span>
                                        )}
                                      </dd>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <dt className="text-gray-600">Last Login:</dt>
                                      <dd className="text-gray-900">
                                        {user.lastLoginAt 
                                          ? new Date(user.lastLoginAt).toLocaleString()
                                          : 'Never'
                                        }
                                      </dd>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <dt className="text-gray-600">Login Count:</dt>
                                      <dd className="text-gray-900">{user.loginCount}</dd>
                                    </div>
                                  </dl>
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
        {total > users.length && (
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

export default UserManagement;

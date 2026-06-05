'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { adminApi } from '@/lib/api/admin';
import { Search, Ban, CheckCircle2, Shield } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'trainer' | 'company' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  created_at: string;
  verified: boolean;
}

function UsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await adminApi.getUsers();
        setUsers(data.data || []);
        setFilteredUsers(data.data || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        const mockUsers = getMockUsers();
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRole) {
      filtered = filtered.filter((u) => u.role === selectedRole);
    }

    if (selectedStatus) {
      filtered = filtered.filter((u) => u.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, selectedRole, selectedStatus, users]);

  const handleBanUser = async (userId: number) => {
    if (confirm('Are you sure you want to ban this user?')) {
      try {
        await adminApi.banUser(userId);
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: 'banned' as const } : u)));
      } catch (error) {
        console.error('Failed to ban user:', error);
      }
    }
  };

  const handleUnbanUser = async (userId: number) => {
    try {
      await adminApi.unbanUser(userId);
      setUsers(users.map((u) => (u.id === userId ? { ...u, status: 'active' as const } : u)));
    } catch (error) {
      console.error('Failed to unban user:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'trainer':
        return 'bg-purple-100 text-purple-800';
      case 'company':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'banned':
        return 'danger';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">👥 Users Management</h1>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="pl-9"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="trainer">Trainer</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">
            Users ({filteredUsers.length})
          </h2>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Role</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Verified</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Joined</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'trainer' ? 'purple' : 'primary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {user.verified ? (
                        <CheckCircle2 className="w-5 h-5 text-success-500 mx-auto" />
                      ) : (
                        <Ban className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {user.status === 'banned' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUnbanUser(user.id)}
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleBanUser(user.id)}
                        >
                          Ban
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function UsersPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <UsersContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockUsers(): User[] {
  return [
    { id: 1, name: 'Arjun Kumar', email: 'arjun@example.com', role: 'student', status: 'active', created_at: '2026-01-15', verified: true },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'trainer', status: 'active', created_at: '2026-02-10', verified: true },
    { id: 3, name: 'Tech Corp Inc', email: 'contact@techcorp.com', role: 'company', status: 'active', created_at: '2026-03-05', verified: true },
    { id: 4, name: 'Rahul Singh', email: 'rahul@example.com', role: 'student', status: 'inactive', created_at: '2025-12-20', verified: false },
    { id: 5, name: 'Fatima Ahmed', email: 'fatima@example.com', role: 'trainer', status: 'banned', created_at: '2026-01-08', verified: true },
    { id: 6, name: 'Admin User', email: 'admin@nexthire.com', role: 'admin', status: 'active', created_at: '2025-11-01', verified: true },
    { id: 7, name: 'Nadia Islam', email: 'nadia@example.com', role: 'student', status: 'active', created_at: '2026-04-12', verified: true },
    { id: 8, name: 'Vikram Patel', email: 'vikram@example.com', role: 'trainer', status: 'active', created_at: '2026-03-20', verified: false },
  ];
}

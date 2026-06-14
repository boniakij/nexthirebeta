'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import {
  Search, Download, Eye, Edit, Trash2, CheckCircle,
  AlertCircle, Lock, Users, UserCheck, Building2
} from 'lucide-react';

interface User {
  id: number;
  uuid: string;
  email: string;
  role: 'student' | 'trainer' | 'company' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  phone?: string;
  created_at: string;
}

const ROLES = ['all', 'student', 'trainer', 'company', 'admin'];
const STATUSES = ['all', 'active', 'suspended', 'pending'];

export default function UserManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const selectedRole = searchParams.get('role') || 'all';
  const selectedStatus = searchParams.get('status') || 'all';

  useEffect(() => {
    fetchUsers();
  }, [selectedRole, selectedStatus, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const { data } = await adminApi.getUsers({ role: selectedRole, status: selectedStatus });

      setTimeout(() => {
        const mockUsers: User[] = [
          { id: 1, uuid: 'uuid-1', email: 'student1@nexthire.com', role: 'student', status: 'active', phone: '+8801700000001', created_at: '2026-06-01' },
          { id: 2, uuid: 'uuid-2', email: 'student2@nexthire.com', role: 'student', status: 'active', phone: '+8801700000002', created_at: '2026-05-28' },
          { id: 3, uuid: 'uuid-3', email: 'trainer1@nexthire.com', role: 'trainer', status: 'active', phone: '+8801700000003', created_at: '2026-05-15' },
          { id: 4, uuid: 'uuid-4', email: 'company1@nexthire.com', role: 'company', status: 'pending', phone: '+8801700000004', created_at: '2026-06-04' },
          { id: 5, uuid: 'uuid-5', email: 'suspended@nexthire.com', role: 'student', status: 'suspended', phone: '+8801700000005', created_at: '2026-05-20' },
          { id: 6, uuid: 'uuid-6', email: 'admin2@nexthire.com', role: 'admin', status: 'active', phone: '+8801700000006', created_at: '2026-04-01' },
        ];

        let filtered = mockUsers;
        if (selectedRole !== 'all') {
          filtered = filtered.filter(u => u.role === selectedRole);
        }
        if (selectedStatus !== 'all') {
          filtered = filtered.filter(u => u.status === selectedStatus);
        }
        if (searchTerm) {
          filtered = filtered.filter(u =>
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.phone?.includes(searchTerm)
          );
        }
        setUsers(filtered);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const handleSelectUser = (id: number) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <UserCheck className="w-4 h-4" />;
      case 'trainer': return <CheckCircle className="w-4 h-4" />;
      case 'company': return <Building2 className="w-4 h-4" />;
      case 'admin': return <Lock className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'danger';
      case 'pending': return 'warning';
      default: return 'gray';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'blue';
      case 'trainer': return 'green';
      case 'company': return 'purple';
      case 'admin': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all users on the platform</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Users
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Role:</span>
            <div className="flex gap-2">
              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (role === 'all') params.delete('role');
                    else params.set('role', role);
                    router.push(`/admin/users?${params.toString()}`);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRole === role
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <div className="flex gap-2">
              {STATUSES.map(status => (
                <button
                  key={status}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (status === 'all') params.delete('status');
                    else params.set('status', status);
                    router.push(`/admin/users?${params.toString()}`);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">
            Users ({users.length})
          </h2>
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} selected
              </span>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Delete Selected
              </Button>
            </div>
          )}
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={getRoleColor(user.role) as any}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getRoleIcon(user.role)}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={getStatusColor(user.status) as any}
                          className="flex items-center gap-1 w-fit"
                        >
                          {user.status === 'active' && <CheckCircle className="w-4 h-4" />}
                          {user.status === 'suspended' && <AlertCircle className="w-4 h-4" />}
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.created_at}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-yellow-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {users.length > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Showing <strong>1</strong> to <strong>{users.length}</strong> of <strong>{users.length}</strong> users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled>Previous</Button>
            <Button variant="outline" disabled>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}

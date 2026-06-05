'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Spinner } from '@/components/ui';
import { adminApi } from '@/lib/api/admin';
import { Users, CheckCircle2, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminStats {
  total_users: number;
  total_trainers: number;
  total_companies: number;
  pending_approvals: number;
  kyc_pending: number;
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await adminApi.getDashboard();
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
        setStats(getMockStats());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const dashboardStats = stats || getMockStats();

  const userGrowth = [
    { month: 'Jan', students: 150, trainers: 20, companies: 5 },
    { month: 'Feb', students: 220, trainers: 28, companies: 8 },
    { month: 'Mar', students: 310, trainers: 35, companies: 12 },
    { month: 'Apr', students: 420, trainers: 45, companies: 15 },
    { month: 'May', students: 550, trainers: 58, companies: 20 },
    { month: 'Jun', students: 680, trainers: 72, companies: 25 },
  ];

  const activityData = [
    { time: '12 AM', activity: 45 },
    { time: '4 AM', activity: 30 },
    { time: '8 AM', activity: 120 },
    { time: '12 PM', activity: 280 },
    { time: '4 PM', activity: 190 },
    { time: '8 PM', activity: 250 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">📊 Admin Dashboard</h1>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.total_users}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Trainers</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.total_trainers}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-success-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Companies</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.total_companies}</p>
          </CardBody>
        </Card>

        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
            <p className="text-3xl font-bold text-yellow-600">{dashboardStats.pending_approvals}</p>
          </CardBody>
        </Card>

        <Card className="border-2 border-red-200 bg-red-50">
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">KYC Pending</p>
            <p className="text-3xl font-bold text-red-600">{dashboardStats.kyc_pending}</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">📈 User Growth (6 months)</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#1A56DB" name="Students" />
                <Bar dataKey="trainers" fill="#7E3AF2" name="Trainers" />
                <Bar dataKey="companies" fill="#0E9F6E" name="Companies" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">⏱️ Activity Over Time</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="activity" stroke="#1A56DB" strokeWidth={2} dot={{ fill: '#1A56DB' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Management Links */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">⚙️ Management</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <Link href="/admin/users" className="block">
              <Button variant="outline" className="w-full justify-center">
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/trainers" className="block">
              <Button variant="outline" className="w-full justify-center">
                Manage Trainers
              </Button>
            </Link>
            <Link href="/admin/companies" className="block">
              <Button variant="outline" className="w-full justify-center">
                Manage Companies
              </Button>
            </Link>
            <Link href="/admin/reports" className="block">
              <Button variant="outline" className="w-full justify-center">
                View Reports
              </Button>
            </Link>
          </CardBody>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">⏳ Pending Actions</h2>
          </CardHeader>
          <CardBody className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-btn">
              <span className="text-sm text-yellow-900">Trainer approvals</span>
              <Badge variant="warning">{dashboardStats.pending_approvals}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-btn">
              <span className="text-sm text-red-900">KYC verifications</span>
              <Badge variant="danger">{dashboardStats.kyc_pending}</Badge>
            </div>
            <Link href="/admin/trainers" className="block mt-3">
              <Button className="w-full" size="sm">
                Review Approvals
              </Button>
            </Link>
          </CardBody>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">✅ System Status</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">API Server</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Database</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Video Service</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email Service</span>
              <Badge variant="success">Online</Badge>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
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
          <AdminDashboardContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockStats(): AdminStats {
  return {
    total_users: 680,
    total_trainers: 72,
    total_companies: 25,
    pending_approvals: 12,
    kyc_pending: 8,
  };
}

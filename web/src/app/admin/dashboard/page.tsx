'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner } from '@/components/ui';
import {
  Users, UserCheck, Building2, Briefcase, DollarSign,
  AlertCircle, CheckCircle, TrendingUp, Activity
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  total_users: number;
  total_students: number;
  total_trainers: number;
  total_companies: number;
  total_bookings: number;
  total_revenue: number;
  pending_approvals: number;
  failed_payments: number;
  active_sessions: number;
  xp_distributed: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // TODO: Replace with actual API call to /admin/dashboard
      // const { data } = await adminApi.getDashboard();
      // setStats(data.data);

      // Mock data for now
      setTimeout(() => {
        setStats({
          total_users: 1250,
          total_students: 850,
          total_trainers: 280,
          total_companies: 120,
          total_bookings: 4560,
          total_revenue: 125400,
          pending_approvals: 12,
          failed_payments: 3,
          active_sessions: 8,
          xp_distributed: 45600,
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card>
          <CardBody className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Users</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.total_users || 0}</p>
            <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
          </CardBody>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardBody className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Revenue</h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">${(stats?.total_revenue || 0) / 1000}k</p>
            <p className="text-sm text-gray-500 mt-2">+8% from last month</p>
          </CardBody>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardBody className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Active Sessions</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.active_sessions || 0}</p>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              All systems normal
            </p>
          </CardBody>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardBody className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Pending Actions</h3>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.pending_approvals || 0}</p>
            <p className="text-sm text-orange-600 mt-2">Requires attention</p>
          </CardBody>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Breakdown */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-gray-900">User Breakdown</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Students</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{stats?.total_students || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${((stats?.total_students || 0) / (stats?.total_users || 1)) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Trainers</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{stats?.total_trainers || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${((stats?.total_trainers || 0) / (stats?.total_users || 1)) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Companies</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{stats?.total_companies || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${((stats?.total_companies || 0) / (stats?.total_users || 1)) * 100}%` }}
              ></div>
            </div>
          </CardBody>
        </Card>

        {/* Recent Issues */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-gray-900">Platform Metrics</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <Link href="/admin/payments/failed" className="block p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
              <p className="text-sm font-semibold text-red-900">Failed Payments</p>
              <p className="text-lg font-bold text-red-600">{stats?.failed_payments || 0}</p>
            </Link>

            <Link href="/admin/trainers/pending" className="block p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors">
              <p className="text-sm font-semibold text-orange-900">Pending Approvals</p>
              <p className="text-lg font-bold text-orange-600">{stats?.pending_approvals || 0}</p>
            </Link>

            <Link href="/admin/bookings" className="block p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors">
              <p className="text-sm font-semibold text-blue-900">Total Bookings</p>
              <p className="text-lg font-bold text-blue-600">{stats?.total_bookings || 0}</p>
            </Link>

            <Link href="/admin/gamification/xp" className="block p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
              <p className="text-sm font-semibold text-green-900">XP Distributed</p>
              <p className="text-lg font-bold text-green-600">{(stats?.xp_distributed || 0) / 1000}k</p>
            </Link>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-gray-900">Quick Actions</h2>
          </CardHeader>
          <CardBody className="space-y-2">
            <Link
              href="/admin/users"
              className="block p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 font-semibold transition-colors text-center"
            >
              View All Users
            </Link>
            <Link
              href="/admin/payments"
              className="block p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-green-700 font-semibold transition-colors text-center"
            >
              Review Payments
            </Link>
            <Link
              href="/admin/trainers/pending"
              className="block p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-orange-700 font-semibold transition-colors text-center"
            >
              Approve Trainers
            </Link>
            <Link
              href="/admin/notifications/send"
              className="block p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-700 font-semibold transition-colors text-center"
            >
              Send Notification
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Platform Health */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900">Platform Health</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">API Status</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="font-semibold text-gray-900">Operational</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Database</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="font-semibold text-gray-900">Connected</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Response Time</p>
              <p className="font-semibold text-gray-900">145ms</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

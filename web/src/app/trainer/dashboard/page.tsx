'use client';

import { useEffect, useState } from 'react';

import { Card, CardBody, CardHeader, Badge, Button, EmptyState, Spinner, StarRating } from '@/components/ui';
import { trainerApi } from '@/lib/api/trainer';
import { TrendingUp, AlertCircle, BarChart3, Star, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TrainerDashboardContent() {
  const [dashboardData, setDashboardData] = useState<any>(getMockDashboardData());
  const [walletData, setWalletData] = useState<any>(getMockWalletData());

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Try to fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('/api/v1/trainers/me/dashboard', {
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data?.success && data?.data) {
            setDashboardData(data.data);
          }
        }
      } catch (error) {
        console.log('Using mock dashboard data');
      }
    };

    const fetchWallet = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('/api/v1/trainers/me/wallet', {
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data?.success && data?.data) {
            setWalletData(data.data);
          }
        }
      } catch (error) {
        console.log('Using mock wallet data');
      }
    };

    // Fetch in background
    fetchDashboard();
    fetchWallet();
  }, []);

  const stats = dashboardData;
  const monthlyEarnings = [
    { month: 'Jan', earnings: 15000 },
    { month: 'Feb', earnings: 18000 },
    { month: 'Mar', earnings: 22000 },
    { month: 'Apr', earnings: 19000 },
    { month: 'May', earnings: 25000 },
    { month: 'Jun', earnings: 28000 },
  ];

  return (
    <div className="space-y-8">
      {/* Approval Status Banner */}
      {!stats.is_approved && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-btn flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">Pending Approval</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Your account is awaiting admin approval. You'll be able to accept bookings once approved.
            </p>
          </div>
        </div>
      )}

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600 mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-green-600">৳{walletData.available_balance?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Ready to withdraw</p>
            <Link href="/trainer/withdrawals" className="block mt-3">
              <Button size="sm" variant="primary" className="w-full">
                Withdraw
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600 mb-1">Pending Balance</p>
            <p className="text-3xl font-bold text-yellow-600">৳{walletData.pending_balance?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">After refund window</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Earned</p>
            <p className="text-3xl font-bold text-gray-900">৳{walletData.total_earned?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">All time</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600 mb-1">Withdrawn</p>
            <p className="text-3xl font-bold text-gray-900">৳{walletData.withdrawn_amount?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Total paid out</p>
          </CardBody>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-3xl font-bold text-gray-900">৳{stats.monthly_earnings?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Earnings</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-success-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">All Time</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_sessions}</p>
            <p className="text-xs text-gray-500 mt-2">Sessions Conducted</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Rating</p>
            <p className="text-3xl font-bold text-gray-900">⭐ {stats.average_rating}</p>
            <p className="text-xs text-gray-500 mt-2">Average</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pending_evaluations}</p>
            <p className="text-xs text-gray-500 mt-2">Evaluations</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">📅 Upcoming Sessions</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-btn hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">System Design Interview</p>
                        <p className="text-sm text-gray-600 mt-1">with Student {i}</p>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {i === 1 ? 'Today at 2:00 PM' : 'Tomorrow at 10:00 AM'}
                        </p>
                      </div>
                      <Button size="sm" variant="primary">
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Pending Evaluations */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">📋 Pending Evaluations</h2>
            </CardHeader>
            <CardBody>
              {stats.pending_evaluations > 0 ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border border-red-200 bg-red-50 rounded-btn flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Student {i} Interview</p>
                        <p className="text-sm text-gray-600">Completed 2 days ago</p>
                      </div>
                      <Button size="sm" variant="danger">
                        Evaluate
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="✅"
                  title="All evaluations complete"
                  description="Great work! You're all caught up."
                />
              )}
            </CardBody>
          </Card>

          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">📈 Monthly Earnings</h2>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
                  <Bar dataKey="earnings" fill="#1A56DB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Right Column */}
        <div>
          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">⭐ Recent Reviews</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <StarRating rating={4.5 + i * 0.1} size="sm" />
                  <p className="font-semibold text-sm text-gray-900 mt-2">Student Name {i}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Excellent trainer! Very knowledgeable.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{i} weeks ago</p>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">⚡ Quick Actions</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <Link href="/trainer/packages" className="block">
                <Button variant="primary" className="w-full justify-center">
                  Manage Packages
                </Button>
              </Link>
              <Link href="/trainer/availability" className="block">
                <Button variant="outline" className="w-full justify-center">
                  Set Availability
                </Button>
              </Link>
              <Link href="/trainer/withdrawals" className="block">
                <Button variant="outline" className="w-full justify-center">
                  Withdraw Money
                </Button>
              </Link>
              <Link href="/trainer/payout-methods" className="block">
                <Button variant="outline" className="w-full justify-center">
                  Payout Methods
                </Button>
              </Link>
              <Link href="/trainer/earnings" className="block">
                <Button variant="outline" className="w-full justify-center">
                  View Earnings
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function TrainerDashboard() {
  return <TrainerDashboardContent />;
}

function getMockDashboardData() {
  return {
    monthly_earnings: 28000,
    total_sessions: 245,
    average_rating: 4.8,
    pending_evaluations: 3,
    is_approved: true,
  };
}

function getMockWalletData() {
  return {
    currency: 'BDT',
    total_earned: 125000,
    available_balance: 18500,
    pending_balance: 6200,
    withdrawn_amount: 54300,
    minimum_withdraw_amount: 1000,
    withdrawal_allowed: true,
  };
}

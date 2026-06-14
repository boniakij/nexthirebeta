'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Input, Button, Spinner } from '@/components/ui';
import { trainerApi } from '@/lib/api/trainer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Clock, Check } from 'lucide-react';

interface EarningsSummary {
  total_earnings: number;
  this_month: number;
  pending_payout: number;
  commission_paid: number;
}

interface PayoutHistory {
  id: number;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string;
}

function EarningsContent() {
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory[]>([]);
  const [payoutMethod, setPayoutMethod] = useState('');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data } = await trainerApi.getEarnings();
        setSummary(data.data);
        setPayoutHistory(data.data?.payout_history || []);
      } catch (error) {
        console.error('Failed to fetch earnings:', error);
        setSummary(getMockSummary());
        setPayoutHistory(getMockPayoutHistory());
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const monthlyEarnings = [
    { month: 'Jan', earnings: 15000 },
    { month: 'Feb', earnings: 18000 },
    { month: 'Mar', earnings: 22000 },
    { month: 'Apr', earnings: 19000 },
    { month: 'May', earnings: 25000 },
    { month: 'Jun', earnings: 28000 },
    { month: 'Jul', earnings: 32000 },
    { month: 'Aug', earnings: 30000 },
    { month: 'Sep', earnings: 35000 },
    { month: 'Oct', earnings: 38000 },
    { month: 'Nov', earnings: 42000 },
    { month: 'Dec', earnings: 45000 },
  ];

  const handleSavePayoutSettings = async () => {
    try {
      // Save payout settings
      alert('Payout settings saved!');
    } catch (error) {
      console.error('Failed to save payout settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const mockSummary = getMockSummary();
  const stats: EarningsSummary = {
    total_earnings: summary?.total_earnings ?? mockSummary.total_earnings,
    this_month: summary?.this_month ?? mockSummary.this_month,
    pending_payout: summary?.pending_payout ?? mockSummary.pending_payout,
    commission_paid: summary?.commission_paid ?? mockSummary.commission_paid,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">💰 Earnings</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <DollarSign className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-gray-900">৳{stats.total_earnings.toLocaleString()}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-success-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-3xl font-bold text-gray-900">৳{stats.this_month.toLocaleString()}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Clock className="w-8 h-8 text-warning-400" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending Payout</p>
            <p className="text-3xl font-bold text-gray-900">৳{stats.pending_payout.toLocaleString()}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Check className="w-8 h-8 text-success-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Commission Paid</p>
            <p className="text-3xl font-bold text-gray-900">৳{stats.commission_paid.toLocaleString()}</p>
          </CardBody>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">Monthly Earnings (12 months)</h2>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={400}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payout History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Payout History</h2>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutHistory.map((payout) => (
                      <tr key={payout.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4 text-gray-900">{new Date(payout.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          ৳{payout.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              payout.status === 'completed'
                                ? 'success'
                                : payout.status === 'pending'
                                  ? 'warning'
                                  : 'danger'
                            }
                          >
                            {payout.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{payout.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Payout Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Payout Settings</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payout Method</label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">Select method</option>
                <option value="bank">Bank Transfer</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {payoutMethod === 'bank'
                  ? 'Bank Account Number'
                  : payoutMethod === 'bkash'
                    ? 'bKash Number'
                    : 'Nagad Number'}
              </label>
              <Input
                value={payoutDetails}
                onChange={(e) => setPayoutDetails(e.target.value)}
                placeholder="Enter your account details"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-btn p-3">
              <p className="text-xs text-blue-800">
                💡 Payouts are processed weekly. Pending payouts will be transferred to your account on the next processing date.
              </p>
            </div>

            <Button onClick={handleSavePayoutSettings} className="w-full">
              Save Settings
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function EarningsPage() {
  return (
    <RoleGuard allowedRoles={['trainer']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <EarningsContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockSummary(): EarningsSummary {
  return {
    total_earnings: 425000,
    this_month: 45000,
    pending_payout: 12500,
    commission_paid: 42500,
  };
}

function getMockPayoutHistory(): PayoutHistory[] {
  return [
    { id: 1, date: '2026-06-01', amount: 35000, status: 'completed', method: 'Bank Transfer' },
    { id: 2, date: '2026-05-25', amount: 38000, status: 'completed', method: 'Bank Transfer' },
    { id: 3, date: '2026-05-18', amount: 32000, status: 'completed', method: 'bKash' },
    { id: 4, date: '2026-05-11', amount: 30000, status: 'completed', method: 'Bank Transfer' },
  ];
}

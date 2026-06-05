'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Spinner } from '@/components/ui';
import { adminApi } from '@/lib/api/admin';
import { Download, TrendingUp, Users, Zap, Target } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ReportsContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Mock data for reports
  const userDistribution = [
    { name: 'Students', value: 680, color: '#1A56DB' },
    { name: 'Trainers', value: 72, color: '#7E3AF2' },
    { name: 'Companies', value: 25, color: '#0E9F6E' },
    { name: 'Admins', value: 5, color: '#EF4444' },
  ];

  const interviewMetrics = [
    { month: 'Jan', conducted: 45, completed: 42, rating_avg: 3.8 },
    { month: 'Feb', conducted: 68, completed: 65, rating_avg: 4.1 },
    { month: 'Mar', conducted: 92, completed: 88, rating_avg: 4.3 },
    { month: 'Apr', conducted: 115, completed: 110, rating_avg: 4.2 },
    { month: 'May', conducted: 148, completed: 142, rating_avg: 4.5 },
    { month: 'Jun', conducted: 185, completed: 178, rating_avg: 4.6 },
  ];

  const domainPopularity = [
    { domain: 'Software Eng', count: 245 },
    { domain: 'Data & AI', count: 156 },
    { domain: 'DevOps', count: 98 },
    { domain: 'Cybersecurity', count: 67 },
    { domain: 'Design', count: 45 },
  ];

  const conversionRates = [
    { stage: 'Applied', count: 680 },
    { stage: 'Interviewed', count: 324 },
    { stage: 'Offer', count: 118 },
    { stage: 'Hired', count: 89 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleExportReport = (type: string) => {
    alert(`Exporting ${type} report...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">📊 Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button onClick={() => handleExportReport('PDF')} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button onClick={() => handleExportReport('CSV')} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Users</p>
            <p className="text-3xl font-bold text-gray-900">782</p>
            <p className="text-xs text-success-500 mt-1">↑ 12% from last month</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Interviews This Month</p>
            <p className="text-3xl font-bold text-gray-900">185</p>
            <p className="text-xs text-success-500 mt-1">↑ 25% from last month</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Target className="w-8 h-8 text-success-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Hire Success Rate</p>
            <p className="text-3xl font-bold text-gray-900">54%</p>
            <p className="text-xs text-warning-500 mt-1">→ Stable from last month</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-success-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
            <p className="text-3xl font-bold text-gray-900">4.6/5</p>
            <p className="text-xs text-success-500 mt-1">↑ 0.3 from last month</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">👥 User Distribution</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Domain Popularity */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">🎯 Domain Popularity</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={domainPopularity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="domain" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1A56DB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Interview Metrics */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">📈 Interview Metrics (6 months)</h2>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={interviewMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="conducted" fill="#1A56DB" name="Interviews Conducted" />
              <Bar dataKey="completed" fill="#0E9F6E" name="Interviews Completed" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">🔄 Hiring Conversion Funnel</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {conversionRates.map((stage, idx) => {
              const percentage = (stage.count / 680) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{stage.stage}</span>
                    <span className="text-sm font-bold text-gray-600">
                      {stage.count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-purple-500 h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">💡 Key Insights</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-btn">
              <p className="text-sm text-blue-900">
                <strong>Growth:</strong> User base has grown by 45% in the last 6 months, with strongest growth in the student segment (102% YoY).
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-btn">
              <p className="text-sm text-purple-900">
                <strong>Engagement:</strong> Average interview rating has improved from 4.2 to 4.6, indicating better quality of trainers and students.
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-btn">
              <p className="text-sm text-green-900">
                <strong>Hiring Success:</strong> Conversion from interview to hire is 27%, which is above industry average of 18%.
              </p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-btn">
              <p className="text-sm text-orange-900">
                <strong>Popular Domains:</strong> Software Engineering dominates with 36% of all interviews, followed by Data & AI (23%).
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function ReportsPage() {
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
          <ReportsContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

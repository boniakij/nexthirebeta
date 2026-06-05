'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, EmptyState } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar } from '@/components/ui';

// Mock data
const trainerStats = {
  monthly_earnings: 45000,
  total_sessions: 127,
  average_rating: 4.8,
  pending_evaluations: 3,
  is_approved: true,
};

const upcomingSessions = [
  {
    id: 1,
    student_name: 'Arjun Kumar',
    package: 'System Design Mock Interview',
    date: '2026-06-10',
    time: '14:00',
    avatar: null,
  },
  {
    id: 2,
    student_name: 'Priya Sharma',
    package: 'Full-Stack Technical Interview',
    date: '2026-06-11',
    time: '15:30',
    avatar: null,
  },
  {
    id: 3,
    student_name: 'Rahul Singh',
    package: 'Behavioral & HR Interview',
    date: '2026-06-12',
    time: '10:00',
    avatar: null,
  },
];

const pendingEvaluations = [
  {
    id: 1,
    student_name: 'Fatima Ahmed',
    package: 'Data Science Interview',
    completed_at: '2026-06-05',
  },
  {
    id: 2,
    student_name: 'Nadia Islam',
    package: 'DevOps Interview',
    completed_at: '2026-06-04',
  },
  {
    id: 3,
    student_name: 'Hassan Khan',
    package: 'Backend Interview',
    completed_at: '2026-06-03',
  },
];

const monthlyEarnings = [
  { month: 'Jan', earnings: 28000 },
  { month: 'Feb', earnings: 35000 },
  { month: 'Mar', earnings: 42000 },
  { month: 'Apr', earnings: 38000 },
  { month: 'May', earnings: 45000 },
  { month: 'Jun', earnings: 41000 },
];

const recentReviews = [
  { student_name: 'Arjun Kumar', rating: 5, comment: 'Excellent trainer, very helpful!', date: '2 days ago' },
  { student_name: 'Priya Sharma', rating: 5, comment: 'Great session, learned a lot', date: '5 days ago' },
  { student_name: 'Rahul Singh', rating: 4, comment: 'Good feedback, could be more detailed', date: '1 week ago' },
];

export default function TrainerDashboard() {
  return (
    <RoleGuard allowedRoles={['trainer']}>
      <DashboardLayout>
        {/* Approval Status Banner */}
        {!trainerStats.is_approved && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-btn flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-900">Pending Approval</h3>
              <p className="text-sm text-yellow-800">
                Your account is awaiting admin approval. You'll be able to go live once approved.
              </p>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-2">This Month</p>
              <p className="text-3xl font-bold text-primary-600">₹{trainerStats.monthly_earnings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Earnings</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-2">All Time</p>
              <p className="text-3xl font-bold text-purple-600">{trainerStats.total_sessions}</p>
              <p className="text-xs text-gray-500 mt-2">Sessions Conducted</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-2">Rating</p>
              <p className="text-3xl font-bold text-success-500">⭐ {trainerStats.average_rating}</p>
              <p className="text-xs text-gray-500 mt-2">Average</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-2">Pending</p>
              <p className="text-3xl font-bold text-warning-400">{trainerStats.pending_evaluations}</p>
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
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-btn">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar src={session.avatar || undefined} name={session.student_name} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900">{session.student_name}</p>
                            <p className="text-sm text-gray-600">{session.package}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {session.date} at {session.time}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="primary">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="📅" title="No upcoming sessions" description="You're all caught up!" />
                )}
              </CardBody>
            </Card>

            {/* Pending Evaluations */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-900">📋 Pending Evaluations</h2>
              </CardHeader>
              <CardBody>
                {pendingEvaluations.length > 0 ? (
                  <div className="space-y-3">
                    {pendingEvaluations.map((eval_) => (
                      <div key={eval_.id} className="flex items-start justify-between p-3 bg-red-50 rounded-btn border border-red-200">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{eval_.student_name}</p>
                          <p className="text-sm text-gray-600">{eval_.package}</p>
                          <p className="text-xs text-gray-500 mt-1">Completed {eval_.completed_at}</p>
                        </div>
                        <Button size="sm" variant="danger">
                          Evaluate
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="✅" title="All evaluations complete" description="Great work!" />
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
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Bar dataKey="earnings" fill="#1A56DB" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          {/* Right Column */}
          <div>
            {/* Recent Reviews */}
            <Card className="h-full">
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-900">⭐ Recent Reviews</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {recentReviews.map((review, idx) => (
                  <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p className="font-semibold text-sm text-gray-900">{review.student_name}</p>
                    <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

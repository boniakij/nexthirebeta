'use client';

import { Suspense, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, EmptyState, Skeleton, Spinner } from '@/components/ui';
import { studentApi } from '@/lib/api/student';
import { Flame, Trophy, TrendingUp, CheckCircle2, Zap, Award, Clock } from 'lucide-react';
import Link from 'next/link';

function StudentDashboardPage() {
  return (
    <RoleGuard allowedRoles={['student']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <StudentDashboardContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function StudentDashboardContent() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await studentApi.getDashboard();
        setDashboardData(data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton height={100} className="w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={120} />
          ))}
        </div>
        <Skeleton height={300} className="w-full" />
      </div>
    );
  }

  const stats = dashboardData || {
    total_xp: 2500,
    current_level: 3,
    streak_days: 5,
    profile_completion: 75,
    upcoming_sessions: 2,
    completed_sessions: 8,
    global_rank: 156,
    country_rank: 23,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6 rounded-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-primary-100">Keep practicing to ace your interviews</p>
          </div>
          {stats.streak_days > 0 && (
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-btn flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="font-semibold">{stats.streak_days} day streak</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total XP</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_xp?.toLocaleString() || 0}</p>
            <Badge variant="purple" className="mt-2 mx-auto">
              Level {stats.current_level || 1}
            </Badge>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Global Rank</p>
            <p className="text-3xl font-bold text-gray-900">#{stats.global_rank || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Rank {stats.country_rank || 0} in your country</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-success-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-900">{stats.completed_sessions || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Interview sessions</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Profile</p>
            <p className="text-3xl font-bold text-gray-900">{stats.profile_completion || 0}%</p>
            <p className="text-xs text-gray-500 mt-2">Complete</p>
          </CardBody>
        </Card>
      </div>

      {/* XP Progress */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">🚀 Level Progress</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Level {stats.current_level || 1}: Learner</span>
              <span className="text-sm text-gray-500">500/1000 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-purple-500 h-full transition-all duration-500"
                style={{ width: '50%' }}
              />
            </div>
            <p className="text-xs text-gray-500">500 XP until next level</p>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">📅 Upcoming Sessions</h2>
            </CardHeader>
            <CardBody>
              {stats.upcoming_sessions > 0 ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-btn hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">System Design Mock Interview</p>
                          <p className="text-sm text-gray-600 mt-1">with John Trainer</p>
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
              ) : (
                <EmptyState
                  icon="📅"
                  title="No upcoming sessions"
                  description="Book your first interview session with a trainer"
                  action={
                    <Link href="/trainers">
                      <Button variant="primary">Book Now</Button>
                    </Link>
                  }
                />
              )}
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">⚡ Quick Actions</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <Link href="/trainers" className="block">
              <Button variant="primary" className="w-full justify-center">
                Book Interview
              </Button>
            </Link>
            <Link href="/student/profile" className="block">
              <Button variant="outline" className="w-full justify-center">
                Update Profile
              </Button>
            </Link>
            <Link href="/leaderboard" className="block">
              <Button variant="ghost" className="w-full justify-center">
                View Leaderboard
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Recent Badges */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">🏆 Recent Badges</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { icon: '🎯', name: 'First Interview' },
              { icon: '⚡', name: '5 Sessions' },
              { icon: '🔥', name: '7 Day Streak' },
              { icon: '🌟', name: 'Perfect Score' },
              { icon: '👑', name: 'Top 100' },
            ].map((badge) => (
              <div key={badge.name} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-btn">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="text-xs font-medium text-gray-700">{badge.name}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default StudentDashboardPage;

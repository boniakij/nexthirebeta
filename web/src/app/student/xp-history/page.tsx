'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Spinner } from '@/components/ui';
import { studentApi } from '@/lib/api/student';
import { TrendingUp, Award, Flame, Zap, Calendar } from 'lucide-react';
import { formatDateRelative } from '@/lib/utils';

interface XPEvent {
  id: number;
  type: 'session_complete' | 'badge_earned' | 'daily_login' | 'streak_bonus' | 'other';
  description: string;
  xp: number;
  created_at: string;
}

function XPHistoryContent() {
  const [events, setEvents] = useState<XPEvent[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXPHistory = async () => {
      try {
        const { data } = await studentApi.getXPHistory();
        setEvents(data.data || []);

        // Calculate total XP
        const total = (data.data || []).reduce((sum: number, event: XPEvent) => sum + event.xp, 0);
        setTotalXP(total);
      } catch (error) {
        console.error('Failed to fetch XP history:', error);
        const mockEvents = getMockXPEvents();
        setEvents(mockEvents);
        setTotalXP(mockEvents.reduce((sum) => sum + (Math.random() > 0.5 ? 100 : 150), 0));
      } finally {
        setLoading(false);
      }
    };

    fetchXPHistory();
  }, []);

  const eventIcons: Record<string, string> = {
    session_complete: '🎓',
    badge_earned: '🏆',
    daily_login: '📅',
    streak_bonus: '🔥',
    other: '⭐',
  };

  const eventColors: Record<string, { badge: string; text: string }> = {
    session_complete: { badge: 'bg-blue-100 text-blue-800', text: 'text-blue-600' },
    badge_earned: { badge: 'bg-purple-100 text-purple-800', text: 'text-purple-600' },
    daily_login: { badge: 'bg-cyan-100 text-cyan-800', text: 'text-cyan-600' },
    streak_bonus: { badge: 'bg-orange-100 text-orange-800', text: 'text-orange-600' },
    other: { badge: 'bg-yellow-100 text-yellow-800', text: 'text-yellow-600' },
  };

  const eventLabels: Record<string, string> = {
    session_complete: 'Session Completed',
    badge_earned: 'Badge Earned',
    daily_login: 'Daily Login',
    streak_bonus: 'Streak Bonus',
    other: 'Other',
  };

  // Group events by date
  const groupedEvents = events.reduce(
    (acc: Record<string, XPEvent[]>, event: XPEvent) => {
      const date = new Date(event.created_at).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(groupedEvents).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">📊 XP History</h1>

      {/* Total XP Card */}
      <Card className="bg-gradient-to-br from-primary-600 to-purple-600 text-white">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 mb-2">Total XP Earned</p>
              <p className="text-5xl font-bold">{totalXP.toLocaleString()}</p>
            </div>
            <Zap className="w-16 h-16 opacity-30" />
          </div>
        </CardBody>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <TrendingUp className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Events</p>
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Avg per Event</p>
            <p className="text-2xl font-bold text-gray-900">
              {events.length > 0 ? Math.round(totalXP / events.length) : 0}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-2xl font-bold text-gray-900">
              {events
                .filter(
                  (e) =>
                    new Date(e.created_at).getMonth() === new Date().getMonth() &&
                    new Date(e.created_at).getFullYear() === new Date().getFullYear()
                )
                .reduce((sum, e) => sum + e.xp, 0)
                .toLocaleString()}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* XP Timeline */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Activity Timeline
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-8">
            {sortedDates.map((date) => (
              <div key={date}>
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>

                <div className="space-y-3">
                  {groupedEvents[date].map((event, idx) => {
                    const colors = eventColors[event.type] || eventColors.other;
                    const icon = eventIcons[event.type] || eventIcons.other;
                    const label = eventLabels[event.type] || eventLabels.other;

                    return (
                      <div key={event.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-btn hover:bg-gray-100 transition">
                        <div className="text-2xl">{icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{event.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <Badge variant={event.type === 'session_complete' ? 'primary' : 'purple'} className="text-xs">
                              {label}
                            </Badge>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-primary-600">+{event.xp}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDateRelative(event.created_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No XP events yet. Start completing interview sessions to earn XP!</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default function XPHistoryPage() {
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
          <XPHistoryContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockXPEvents(): XPEvent[] {
  const now = new Date();
  return [
    {
      id: 1,
      type: 'session_complete',
      description: 'Completed System Design Interview',
      xp: 200,
      created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      type: 'badge_earned',
      description: 'Earned "7 Day Streak" badge',
      xp: 75,
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: 'session_complete',
      description: 'Completed Technical Interview',
      xp: 150,
      created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      type: 'daily_login',
      description: 'Daily login bonus',
      xp: 25,
      created_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      type: 'streak_bonus',
      description: '5-day streak bonus',
      xp: 100,
      created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 6,
      type: 'session_complete',
      description: 'Completed Frontend Interview',
      xp: 150,
      created_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 7,
      type: 'badge_earned',
      description: 'Earned "Five Sessions" badge',
      xp: 100,
      created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 8,
      type: 'session_complete',
      description: 'Completed DevOps Interview',
      xp: 180,
      created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

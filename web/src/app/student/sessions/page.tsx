'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Tabs, Spinner } from '@/components/ui';
import { Clock, User, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

function SessionsContent() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingSessions = [
    {
      id: 1,
      trainer: 'Arjun Kumar',
      package: 'System Design Mock',
      date: '2026-06-10',
      time: '14:00',
      duration: 60,
    },
    {
      id: 2,
      trainer: 'Priya Sharma',
      package: 'Frontend Interview Prep',
      date: '2026-06-12',
      time: '10:00',
      duration: 45,
    },
  ];

  const completedSessions = [
    {
      id: 3,
      trainer: 'Rahul Singh',
      package: 'DevOps Technical',
      date: '2026-06-05',
      xpEarned: 150,
      overallLevel: 'intermediate',
    },
    {
      id: 4,
      trainer: 'Fatima Ahmed',
      package: 'Data Science Interview',
      date: '2026-06-03',
      xpEarned: 200,
      overallLevel: 'advanced',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>

      <Tabs
        tabs={[
          { id: 'upcoming', label: '📅 Upcoming' },
          { id: 'completed', label: '✓ Completed' },
          { id: 'cancelled', label: '✗ Cancelled' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <Card key={session.id}>
              <CardBody>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-primary-600" />
                      <h3 className="font-bold text-gray-900">{session.trainer}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{session.package}</p>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {session.date} at {session.time}
                      </div>
                      <Badge variant="primary" className="text-xs">
                        {session.duration}m
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                    <Button size="sm" variant="primary">
                      Join
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedSessions.map((session) => (
            <Card key={session.id}>
              <CardBody>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-success-500" />
                      <h3 className="font-bold text-gray-900">{session.trainer}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{session.package}</p>
                    <div className="flex flex-wrap gap-3 items-center">
                      <span className="text-sm text-gray-500">{session.date}</span>
                      <Badge variant="success" className="text-xs">
                        ✓ Completed
                      </Badge>
                      <Badge variant="purple" className="text-xs">
                        +{session.xpEarned} XP
                      </Badge>
                      <Badge variant="primary" className="text-xs">
                        {session.overallLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/student/evaluations`}>
                      <Button size="sm" variant="outline">
                        View Evaluation
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Rate
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'cancelled' && (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-500">No cancelled sessions</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default function StudentSessionsPage() {
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
          <SessionsContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

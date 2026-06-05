'use client';

import { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Spinner } from '@/components/ui';
import { User, Calendar, TrendingUp } from 'lucide-react';

function EvaluationsContent() {
  const evaluations = [
    {
      id: 1,
      trainer: 'Arjun Kumar',
      date: '2026-06-05',
      scores: {
        communication: 8,
        technical: 9,
        confidence: 7,
        problemSolving: 8,
        english: 8,
        hrReadiness: 7,
      },
      overallLevel: 'intermediate',
      feedback: 'Great performance on system design questions. Work on explaining your thought process more clearly.',
      xpEarned: 200,
    },
    {
      id: 2,
      trainer: 'Priya Sharma',
      date: '2026-06-03',
      scores: {
        communication: 7,
        technical: 8,
        confidence: 8,
        problemSolving: 7,
        english: 9,
        hrReadiness: 8,
      },
      overallLevel: 'intermediate',
      feedback: 'Excellent communication skills. Your React knowledge is solid. Keep practicing DSA.',
      xpEarned: 150,
    },
  ];

  const levelColors: Record<string, string> = {
    not_ready: 'bg-red-100 text-red-800',
    beginner: 'bg-orange-100 text-orange-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-purple-100 text-purple-800',
    industry_ready: 'bg-green-100 text-green-800',
  };

  const ScoreBar = ({ label, score }: { label: string; score: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{score}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary-500 to-purple-500 h-full transition-all duration-500"
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Evaluations</h1>

      {evaluations.length > 0 ? (
        <div className="space-y-6">
          {evaluations.map((eval_) => (
            <Card key={eval_.id} className="hover:shadow-card-hover transition">
              <CardBody className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary-600" />
                      {eval_.trainer}
                    </h2>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(eval_.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="primary" className="text-lg px-4 py-2">
                      +{eval_.xpEarned} XP
                    </Badge>
                    <div
                      className={`px-4 py-2 rounded-btn font-semibold ${
                        levelColors[eval_.overallLevel] || levelColors.intermediate
                      }`}
                    >
                      {eval_.overallLevel}
                    </div>
                  </div>
                </div>

                {/* Scores Grid */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    Performance Scores
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ScoreBar label="Communication" score={eval_.scores.communication} />
                    <ScoreBar label="Technical Knowledge" score={eval_.scores.technical} />
                    <ScoreBar label="Confidence" score={eval_.scores.confidence} />
                    <ScoreBar label="Problem Solving" score={eval_.scores.problemSolving} />
                    <ScoreBar label="English Speaking" score={eval_.scores.english} />
                    <ScoreBar label="HR Readiness" score={eval_.scores.hrReadiness} />
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-btn p-4 border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-2">Feedback from Trainer</h3>
                  <p className="text-gray-700">{eval_.feedback}</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Average Score</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {Math.round(
                        (Object.values(eval_.scores).reduce((a, b) => a + b, 0) /
                          Object.keys(eval_.scores).length) *
                          10
                      ) / 10}
                      /10
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Highest Score</p>
                    <p className="text-2xl font-bold text-success-500">
                      {Math.max(...Object.values(eval_.scores))}/10
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Overall Level</p>
                    <p className="text-sm font-bold text-purple-600 capitalize">
                      {eval_.overallLevel}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-500 mb-4">No evaluations yet</p>
            <p className="text-sm text-gray-600">Complete your first interview session to receive an evaluation</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default function StudentEvaluationsPage() {
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
          <EvaluationsContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

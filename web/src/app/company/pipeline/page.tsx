'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Spinner, Avatar } from '@/components/ui';
import { companyApi } from '@/lib/api/company';
import { ChevronRight, MessageSquare, Star } from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  xp: number;
  level: number;
  rating: number;
  resume?: string;
}

interface Stage {
  id: string;
  title: string;
  count: number;
  candidates: Candidate[];
  color: string;
}

function PipelineContent() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        // Pipeline data would come from API, using mock for now
        setStages(getMockStages());
      } catch (error) {
        console.error('Failed to fetch pipeline:', error);
        setStages(getMockStages());
      } finally {
        setLoading(false);
      }
    };

    fetchPipeline();
  }, []);

  const draggedCandidate = useState<{ candidate: Candidate; fromStage: string } | null>(null);

  const handleDragStart = (candidate: Candidate, stageId: string) => {
    // Simulate drag-drop
  };

  const handleDropCandidate = async (candidate: Candidate, toStageId: string) => {
    // Update candidate stage
    try {
      // API call to move candidate
    } catch (error) {
      console.error('Failed to move candidate:', error);
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
      <h1 className="text-3xl font-bold text-gray-900">🎯 Candidate Pipeline</h1>

      {/* Pipeline Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 auto-cols-max overflow-x-auto">
        {stages.map((stage) => (
          <div key={stage.id} className="min-w-80 space-y-3">
            {/* Stage Header */}
            <div className={`p-4 rounded-btn ${stage.color}`}>
              <h2 className="font-bold text-gray-900">{stage.title}</h2>
              <Badge variant="primary" className="mt-2">
                {stage.count} candidates
              </Badge>
            </div>

            {/* Candidates List */}
            <div className="space-y-3">
              {stage.candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className="hover:shadow-card-hover cursor-move transition"
                  draggable
                  onDragStart={() => handleDragStart(candidate, stage.id)}
                >
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <Avatar name={candidate.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{candidate.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-600">{candidate.rating}/5.0</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Level {candidate.level} • {candidate.xp} XP
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                      <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-btn bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition">
                        <MessageSquare className="w-3 h-3" />
                        Message
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-btn bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition">
                        <ChevronRight className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Add Candidate Button */}
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-btn text-center hover:border-primary-600 hover:bg-primary-50 transition cursor-pointer">
              <p className="text-sm text-gray-600">Drag candidates here</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Stats */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">📊 Pipeline Summary</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {stages.map((stage) => (
              <div key={stage.id} className="text-center">
                <p className="text-sm text-gray-600 mb-1">{stage.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stage.count}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function PipelinePage() {
  return (
    <RoleGuard allowedRoles={['company']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <PipelineContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockStages(): Stage[] {
  return [
    {
      id: 'applied',
      title: 'Applied',
      count: 12,
      color: 'bg-gray-100',
      candidates: [
        { id: 1, name: 'Arjun Kumar', xp: 12500, level: 5, rating: 4.2 },
        { id: 2, name: 'Priya Sharma', xp: 10200, level: 4, rating: 4.5 },
      ],
    },
    {
      id: 'shortlisted',
      title: 'Shortlisted',
      count: 8,
      color: 'bg-blue-100',
      candidates: [
        { id: 3, name: 'Rahul Singh', xp: 8900, level: 3, rating: 4.1 },
        { id: 4, name: 'Fatima Ahmed', xp: 11200, level: 4, rating: 4.8 },
      ],
    },
    {
      id: 'interviewed',
      title: 'Interviewed',
      count: 5,
      color: 'bg-purple-100',
      candidates: [
        { id: 5, name: 'Nadia Islam', xp: 9500, level: 4, rating: 4.3 },
        { id: 6, name: 'Vikram Patel', xp: 13200, level: 5, rating: 4.7 },
      ],
    },
    {
      id: 'offer',
      title: 'Offer Extended',
      count: 2,
      color: 'bg-green-100',
      candidates: [
        { id: 7, name: 'Hassan Ali', xp: 14500, level: 6, rating: 4.9 },
      ],
    },
    {
      id: 'hired',
      title: 'Hired',
      count: 1,
      color: 'bg-success-100',
      candidates: [
        { id: 8, name: 'Zara Khan', xp: 15800, level: 6, rating: 5.0 },
      ],
    },
  ];
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Spinner, EmptyState } from '@/components/ui';
import { companyApi } from '@/lib/api/company';
import { TrendingUp, Users, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  active_campaigns: number;
  total_candidates: number;
  interviews_conducted: number;
  hire_rate: number;
  kyc_status: 'pending' | 'verified' | 'rejected';
}

function CompanyDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await companyApi.getDashboard();
        setStats(data.data);
        setCampaigns(data.data?.active_campaigns || []);
        setRecentCandidates(data.data?.recent_candidates || []);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
        setStats(getMockStats());
        setCampaigns(getMockCampaigns());
        setRecentCandidates(getMockCandidates());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const dashboardStats = stats || getMockStats();

  return (
    <div className="space-y-8">
      {/* KYC Status Banner */}
      {dashboardStats.kyc_status === 'pending' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-btn flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">KYC Verification Pending</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Your company is undergoing KYC verification. You'll be able to hire candidates once verified.
            </p>
          </div>
        </div>
      )}

      {dashboardStats.kyc_status === 'rejected' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-btn flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">KYC Verification Failed</h3>
            <p className="text-sm text-red-800 mt-1">
              Your KYC verification was rejected. Please contact support for more information.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Briefcase className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Campaigns</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.active_campaigns}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Candidates</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.total_candidates}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-success-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Interviews Conducted</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.interviews_conducted}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-success-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Hire Rate</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.hire_rate}%</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">🎯 Active Campaigns</h2>
            </CardHeader>
            <CardBody>
              {campaigns.length > 0 ? (
                <div className="space-y-3">
                  {campaigns.slice(0, 3).map((campaign: any) => (
                    <div key={campaign.id} className="p-4 border border-gray-200 rounded-btn hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{campaign.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">Role: {campaign.job_role}</p>
                          <p className="text-xs text-gray-500 mt-2">{campaign.candidate_count || 0} candidates</p>
                        </div>
                        <Link href={`/company/campaigns/${campaign.id}/pipeline`}>
                          <Button size="sm">Manage</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="🎯"
                  title="No active campaigns"
                  description="Create your first hiring campaign"
                  action={
                    <Link href="/company/campaigns">
                      <Button variant="primary">Create Campaign</Button>
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
            <Link href="/company/campaigns" className="block">
              <Button variant="primary" className="w-full justify-center">
                Create Campaign
              </Button>
            </Link>
            <Link href="/company/candidates" className="block">
              <Button variant="outline" className="w-full justify-center">
                Search Talent
              </Button>
            </Link>
            <Link href="/company/inbox" className="block">
              <Button variant="outline" className="w-full justify-center">
                View Inbox
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Recent Candidates */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">👥 Recent Candidates</h2>
        </CardHeader>
        <CardBody>
          {recentCandidates.length > 0 ? (
            <div className="space-y-3">
              {recentCandidates.map((candidate: any) => (
                <div key={candidate.id} className="p-4 border border-gray-200 rounded-btn">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{candidate.job_role}</p>
                      <Badge variant="primary" className="text-xs mt-2">
                        {candidate.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-purple-600">{candidate.xp} XP</p>
                      <p className="text-xs text-gray-500">Level {candidate.level}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="👥"
              title="No candidates yet"
              description="Start searching for talent or wait for applications"
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default function CompanyDashboard() {
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
          <CompanyDashboardContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockStats(): DashboardStats {
  return {
    active_campaigns: 3,
    total_candidates: 24,
    interviews_conducted: 8,
    hire_rate: 33,
    kyc_status: 'verified',
  };
}

function getMockCampaigns() {
  return [
    { id: 1, title: 'Senior Backend Engineer', job_role: 'Backend', candidate_count: 12 },
    { id: 2, title: 'Frontend Developer', job_role: 'Frontend', candidate_count: 8 },
    { id: 3, title: 'DevOps Engineer', job_role: 'DevOps', candidate_count: 4 },
  ];
}

function getMockCandidates() {
  return [
    { id: 1, name: 'Arjun Kumar', job_role: 'Backend Engineer', status: 'Interviewed', xp: 12500, level: 5 },
    { id: 2, name: 'Priya Sharma', job_role: 'Frontend Developer', status: 'Shortlisted', xp: 10200, level: 4 },
    { id: 3, name: 'Rahul Singh', job_role: 'DevOps Engineer', status: 'Applied', xp: 8900, level: 3 },
  ];
}

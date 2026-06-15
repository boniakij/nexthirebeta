'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import PackageStatsCards from '@/components/trainer/packages/PackageStatsCards';
import PackageFilters from '@/components/trainer/packages/PackageFilters';
import PackageTable from '@/components/trainer/packages/PackageTable';
import { trainerPackagesApi } from '@/lib/api/trainerPackages';
import { TrainerPackage } from '@/types/trainerPackage';

const MOCK_PACKAGES: TrainerPackage[] = [
  {
    id: 1,
    trainer_id: 1,
    title: 'HR Mock Interview',
    slug: 'hr-mock-interview',
    category: 'HR Interview',
    target_level: 'Fresher',
    package_type: '1:1 Live Session',
    short_description: '45-minute structured HR interview with feedback',
    description: 'Student will receive realistic HR interview practice, communication feedback, confidence score, and improvement tips.',
    tags: ['HR', 'Fresher', 'Communication'],
    duration_minutes: 45,
    session_mode: 'Video Interview',
    language: 'Bangla + English',
    difficulty: 'beginner',
    session_count: 1,
    includes_cv_review: false,
    includes_written_feedback: true,
    preparation_instructions: 'Upload your latest CV before the session',
    price: 800,
    discount_price: 650,
    currency: 'BDT',
    required_documents: {
      resume: true,
      linkedin_url: false,
      github_url: false,
      portfolio_url: false,
      job_description: false,
      cover_letter: false,
    },
    custom_questions: [],
    availability_scope: 'all_slots',
    status: 'active',
    is_featured: false,
    total_bookings: 45,
    total_revenue: 28800,
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-14T00:00:00Z',
  },
  {
    id: 2,
    trainer_id: 1,
    title: 'Frontend Technical Interview',
    slug: 'frontend-technical-interview',
    category: 'Technical Interview',
    target_level: 'Junior',
    package_type: '1:1 Live Session',
    short_description: 'React & JavaScript focused technical interview prep',
    description: 'Deep dive into frontend technologies with real coding problems',
    tags: ['Frontend', 'React', 'JavaScript'],
    duration_minutes: 60,
    session_mode: 'Video Interview',
    language: 'English',
    difficulty: 'intermediate',
    session_count: 1,
    includes_cv_review: true,
    includes_written_feedback: true,
    preparation_instructions: 'Have your IDE ready',
    price: 1200,
    currency: 'BDT',
    required_documents: {
      resume: true,
      linkedin_url: true,
      github_url: true,
      portfolio_url: false,
      job_description: false,
      cover_letter: false,
    },
    custom_questions: [],
    availability_scope: 'all_slots',
    status: 'active',
    is_featured: true,
    total_bookings: 31,
    total_revenue: 33600,
    created_at: '2026-06-02T00:00:00Z',
    updated_at: '2026-06-14T00:00:00Z',
  },
  {
    id: 3,
    trainer_id: 1,
    title: 'CV Review for Freshers',
    slug: 'cv-review-freshers',
    category: 'CV Review',
    target_level: 'Fresher',
    package_type: 'CV Review',
    short_description: 'Comprehensive CV review and optimization',
    description: 'Get your CV reviewed by an industry expert with actionable feedback',
    tags: ['CV', 'Resume', 'Freshers'],
    duration_minutes: 30,
    session_mode: 'Document Review',
    language: 'Bangla + English',
    difficulty: 'beginner',
    session_count: 1,
    includes_cv_review: true,
    includes_written_feedback: true,
    preparation_instructions: 'Send your CV in advance',
    price: 500,
    currency: 'BDT',
    required_documents: {
      resume: true,
      linkedin_url: false,
      github_url: false,
      portfolio_url: false,
      job_description: false,
      cover_letter: false,
    },
    custom_questions: [],
    availability_scope: 'all_slots',
    status: 'draft',
    is_featured: false,
    total_bookings: 0,
    total_revenue: 0,
    created_at: '2026-06-10T00:00:00Z',
    updated_at: '2026-06-14T00:00:00Z',
  },
];

export default function TrainerPackagesPage() {
  const [packages, setPackages] = useState<TrainerPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    sort: 'latest',
  });

  useEffect(() => {
    fetchPackages();
  }, [filters]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await trainerPackagesApi.listPackages({
        search: filters.search,
        status: filters.status,
        sort: filters.sort,
      });
      setPackages(response.data.data.packages || []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      setPackages(MOCK_PACKAGES);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      const response = await trainerPackagesApi.duplicatePackage(id);
      if (response.data.success) {
        fetchPackages();
      }
    } catch (error) {
      console.error('Failed to duplicate package:', error);
    }
  };

  const stats = {
    active: packages.filter((p) => p.status === 'active').length,
    draft: packages.filter((p) => p.status === 'draft').length,
    bookings: packages.reduce((sum, p) => sum + p.total_bookings, 0),
    revenue: packages.reduce((sum, p) => sum + p.total_revenue, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainer Packages</h1>
          <p className="text-gray-600 mt-1">
            Create, manage, publish, hide, or deactivate your interview packages.
          </p>
        </div>
        <Link href="/trainer/packages/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Package
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <PackageStatsCards
        activeCount={stats.active}
        draftCount={stats.draft}
        totalBookings={stats.bookings}
        revenue={stats.revenue}
      />

      {/* Filters */}
      <PackageFilters
        onSearch={(search) => setFilters({ ...filters, search })}
        onStatusChange={(status) => setFilters({ ...filters, status })}
        onCategoryChange={(category) => setFilters({ ...filters, category })}
        onSortChange={(sort) => setFilters({ ...filters, sort })}
      />

      {/* Package List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Packages</h2>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading packages...</p>
          </div>
        ) : (
          <PackageTable packages={packages} onDuplicate={handleDuplicate} onHide={() => {}} />
        )}
      </div>
    </div>
  );
}

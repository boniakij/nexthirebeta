'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Badge, Button } from '@/components/ui';
import { Edit2, Copy, Eye, EyeOff, MoreVertical } from 'lucide-react';
import { useParams } from 'next/navigation';

const MOCK_PACKAGES: Record<number, any> = {
  1: {
    id: 1,
    title: 'HR Mock Interview',
    category: 'HR Interview',
    target_level: 'Fresher',
    duration_minutes: 45,
    language: 'Bangla + English',
    session_mode: 'Video Interview',
    difficulty: 'beginner',
    price: 800,
    discount_price: 650,
    currency: 'BDT',
    session_count: 1,
    short_description: '45-minute structured HR interview with feedback',
    description: 'Student will receive realistic HR interview practice, communication feedback, confidence score, and improvement tips. Perfect for freshers preparing for their first interview.',
    includes_cv_review: false,
    includes_written_feedback: true,
    status: 'active',
    is_featured: false,
    total_bookings: 45,
    total_revenue: 28800,
    tags: ['HR', 'Fresher', 'Communication'],
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-14T00:00:00Z',
  },
  2: {
    id: 2,
    title: 'Frontend Technical Interview',
    category: 'Technical Interview',
    target_level: 'Junior',
    duration_minutes: 60,
    language: 'English',
    session_mode: 'Video Interview',
    difficulty: 'intermediate',
    price: 1200,
    currency: 'BDT',
    session_count: 1,
    short_description: 'React & JavaScript focused technical interview prep',
    description: 'Deep dive into frontend technologies with real coding problems. Covers React concepts, JavaScript fundamentals, CSS, and system design for frontend.',
    includes_cv_review: true,
    includes_written_feedback: true,
    status: 'active',
    is_featured: true,
    total_bookings: 31,
    total_revenue: 33600,
    tags: ['Frontend', 'React', 'JavaScript'],
    created_at: '2026-06-02T00:00:00Z',
    updated_at: '2026-06-14T00:00:00Z',
  },
};

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'success';
    case 'draft':
      return 'primary';
    case 'pending_review':
      return 'warning';
    case 'hidden':
      return 'gray';
    case 'deactivated':
      return 'gray';
    case 'rejected':
      return 'danger';
    default:
      return 'primary';
  }
}

function formatStatus(status: string) {
  return status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1);
}

export default function PackageDetailPage() {
  const params = useParams();
  const packageId = parseInt(params.id as string);
  const pkg = MOCK_PACKAGES[packageId];
  const [showMenu, setShowMenu] = useState(false);

  if (!pkg) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Package not found</p>
        <Link href="/trainer/packages">
          <Button>Back to Packages</Button>
        </Link>
      </div>
    );
  }

  const commissionRate = 20;
  const commissionAmount = (pkg.price * commissionRate) / 100;
  const trainerReceivable = pkg.price - commissionAmount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{pkg.title}</h1>
            {pkg.is_featured && <Badge variant="warning">Featured</Badge>}
          </div>
          <p className="text-gray-600">{pkg.short_description}</p>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Link href={`/trainer/packages/${pkg.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded transition"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  {pkg.status === 'active' ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide from Feed
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Unhide
                    </>
                  )}
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 flex items-center gap-2">
                  Deactivate Package
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status and Info */}
      <Card className="border-0 shadow-sm">
        <CardBody className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Status</p>
              <div className="mt-2">
                <Badge variant={getStatusColor(pkg.status) as any}>
                  {formatStatus(pkg.status)}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Category</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">{pkg.category}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Target Level</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">{pkg.target_level}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Total Bookings</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">{pkg.total_bookings}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Package Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Description</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
            </CardBody>
          </Card>

          {/* Session Details */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Session Details</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{pkg.duration_minutes} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Session Mode</p>
                  <p className="font-semibold text-gray-900">{pkg.session_mode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Language</p>
                  <p className="font-semibold text-gray-900">{pkg.language}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Difficulty</p>
                  <p className="font-semibold text-gray-900 capitalize">{pkg.difficulty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sessions Included</p>
                  <p className="font-semibold text-gray-900">{pkg.session_count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">CV Review</p>
                  <p className="font-semibold text-gray-900">{pkg.includes_cv_review ? '✓ Yes' : '✗ No'}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Includes Written Feedback</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${pkg.includes_written_feedback ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="font-medium text-gray-900">
                    {pkg.includes_written_feedback ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Tags */}
          {pkg.tags && pkg.tags.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Tags</h2>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {pkg.tags.map((tag: string) => (
                    <Badge key={tag} variant="primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Pricing Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="border-0 shadow-sm bg-primary-50 border border-primary-200">
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 mb-2">Regular Price</p>
              <p className="text-3xl font-bold text-primary-600 mb-4">
                {pkg.currency} {pkg.price.toLocaleString()}
              </p>

              {pkg.discount_price && (
                <div className="mb-4 pb-4 border-b border-primary-200">
                  <p className="text-sm text-gray-600 mb-1">Discount Price</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {pkg.currency} {pkg.discount_price.toLocaleString()}
                  </p>
                  <p className="text-xs text-primary-600 mt-1">
                    Save {pkg.currency} {(pkg.price - pkg.discount_price).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Commission (20%)</span>
                  <span className="font-medium">{pkg.currency} {commissionAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-primary-200">
                  <span className="font-semibold text-gray-900">You Receive</span>
                  <span className="font-bold text-primary-600">{pkg.currency} {trainerReceivable.toLocaleString()}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Revenue Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Revenue</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold text-gray-900">{pkg.total_bookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold text-gray-900">
                    {pkg.currency} {pkg.total_revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Metadata */}
          <Card className="border-0 shadow-sm">
            <CardBody className="p-6">
              <div className="text-xs space-y-2 text-gray-600">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Created</p>
                  <p>{new Date(pkg.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Updated</p>
                  <p>{new Date(pkg.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

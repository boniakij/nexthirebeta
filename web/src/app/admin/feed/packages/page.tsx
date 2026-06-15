'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Badge, Spinner } from '@/components/ui';
import { Search, Filter, Eye, EyeOff, Star, CheckCircle, XCircle } from 'lucide-react';

interface FeedPackage {
  id: number;
  title: string;
  trainer: {
    name: string;
    country_code: string;
    country_flag: string;
    rating: number;
  };
  category: string;
  price: number;
  status: 'pending_review' | 'active' | 'featured' | 'hidden' | 'rejected' | 'suspended';
  is_featured: boolean;
  published_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'success',
  pending_review: 'warning',
  featured: 'primary',
  hidden: 'secondary',
  rejected: 'danger',
  suspended: 'danger',
};

const MOCK_PACKAGES: FeedPackage[] = [
  {
    id: 1,
    title: 'HR Mock Interview for Fresh Graduates',
    trainer: { name: 'Rahim Uddin', country_code: 'BD', country_flag: '🇧🇩', rating: 4.8 },
    category: 'HR Interview',
    price: 800,
    status: 'active',
    is_featured: false,
    published_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'Frontend Interview Prep',
    trainer: { name: 'Hasan Ali', country_code: 'BD', country_flag: '🇧🇩', rating: 4.7 },
    category: 'Technical Interview',
    price: 1200,
    status: 'active',
    is_featured: false,
    published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: 'CV Review for Freshers',
    trainer: { name: 'Nusrat Jahan', country_code: 'BD', country_flag: '🇧🇩', rating: 4.6 },
    category: 'CV Review',
    price: 600,
    status: 'pending_review',
    is_featured: false,
    published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    title: 'System Design Mastery',
    trainer: { name: 'Arjun Kumar', country_code: 'IN', country_flag: '🇮🇳', rating: 4.9 },
    category: 'Technical Interview',
    price: 1500,
    status: 'featured',
    is_featured: true,
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    title: 'LinkedIn Profile Optimization',
    trainer: { name: 'Shantanu Roy', country_code: 'BD', country_flag: '🇧🇩', rating: 4.5 },
    category: 'LinkedIn Review',
    price: 400,
    status: 'active',
    is_featured: false,
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    title: 'AWS Solutions Architecture',
    trainer: { name: 'Priya Singh', country_code: 'US', country_flag: '🇺🇸', rating: 4.8 },
    category: 'Technical Interview',
    price: 1800,
    status: 'active',
    is_featured: false,
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AdminFeedPackages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [packages, setPackages] = useState<FeedPackage[]>(MOCK_PACKAGES);
  const [selectedPackage, setSelectedPackage] = useState<FeedPackage | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredPackages = packages.filter(pkg => {
    if (searchQuery && !pkg.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter && pkg.status !== statusFilter) return false;
    if (categoryFilter && pkg.category !== categoryFilter) return false;
    return true;
  });

  const handleApprove = (pkg: FeedPackage) => {
    setPackages(packages.map(p =>
      p.id === pkg.id ? { ...p, status: 'active' as const } : p
    ));
  };

  const handleReject = (pkg: FeedPackage) => {
    setPackages(packages.map(p =>
      p.id === pkg.id ? { ...p, status: 'rejected' as const } : p
    ));
  };

  const handleHide = (pkg: FeedPackage) => {
    setPackages(packages.map(p =>
      p.id === pkg.id ? { ...p, status: 'hidden' as const } : p
    ));
  };

  const handleFeature = (pkg: FeedPackage) => {
    setPackages(packages.map(p =>
      p.id === pkg.id ? { ...p, status: 'featured' as const, is_featured: true } : p
    ));
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Latest Feed Packages</h1>
        <p className="text-gray-600 mt-1">Monitor and manage interview packages on the public feed</p>
      </div>

      {/* Search & Filters */}
      <Card className="border-0 shadow-sm">
        <CardBody className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by package, trainer, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending_review">Pending Review</option>
                <option value="featured">Featured</option>
                <option value="hidden">Hidden</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                <option value="HR Interview">HR Interview</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="CV Review">CV Review</option>
                <option value="LinkedIn Review">LinkedIn Review</option>
                <option value="Career Counseling">Career Counseling</option>
              </select>

              {(searchQuery || statusFilter || categoryFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('');
                    setCategoryFilter('');
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Packages Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        {filteredPackages.length === 0 ? (
          <CardBody className="p-12 text-center">
            <p className="text-gray-500">No packages found</p>
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trainer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{pkg.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{pkg.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{pkg.trainer.name}</p>
                        <div className="flex items-center gap-1 mt-1 text-sm">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-600">{pkg.trainer.rating}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg">{pkg.trainer.country_flag}</span>
                      <p className="text-sm text-gray-600">{pkg.trainer.country_code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={STATUS_COLORS[pkg.status] as any} className="capitalize">
                        {pkg.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setShowDetailsModal(true);
                          }}
                          className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded transition"
                        >
                          View
                        </button>

                        {pkg.status === 'pending_review' && (
                          <>
                            <button
                              onClick={() => handleApprove(pkg)}
                              className="px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded transition"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(pkg)}
                              className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {pkg.status === 'active' && !pkg.is_featured && (
                          <button
                            onClick={() => handleFeature(pkg)}
                            className="px-3 py-1 text-sm font-medium text-yellow-600 hover:bg-yellow-50 rounded transition"
                            title="Feature"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}

                        {pkg.status === 'active' && (
                          <button
                            onClick={() => handleHide(pkg)}
                            className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded transition"
                            title="Hide"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Details Modal - Simplified */}
      {showDetailsModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Package Review</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </CardHeader>
            <CardBody className="p-6 space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Package Title</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedPackage.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Trainer</p>
                    <p className="text-gray-900 font-semibold">{selectedPackage.trainer.name}</p>
                    <p className="text-sm text-gray-600">{selectedPackage.trainer.country_flag} {selectedPackage.trainer.country_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Category</p>
                    <p className="text-gray-900 font-semibold">{selectedPackage.category}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Price</p>
                    <p className="text-gray-900 font-semibold">৳{selectedPackage.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Status</p>
                    <Badge variant={STATUS_COLORS[selectedPackage.status] as any} className="capitalize mt-1">
                      {selectedPackage.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedPackage.status === 'pending_review' && (
                  <>
                    <Button
                      onClick={() => {
                        handleApprove(selectedPackage);
                        setShowDetailsModal(false);
                      }}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        handleReject(selectedPackage);
                        setShowDetailsModal(false);
                      }}
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                  </>
                )}

                {selectedPackage.status === 'active' && (
                  <>
                    {!selectedPackage.is_featured && (
                      <Button
                        onClick={() => {
                          handleFeature(selectedPackage);
                          setShowDetailsModal(false);
                        }}
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Feature
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        handleHide(selectedPackage);
                        setShowDetailsModal(false);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Hide
                    </Button>
                  </>
                )}

                <Button
                  onClick={() => setShowDetailsModal(false)}
                  size="sm"
                  variant="outline"
                  className="ml-auto"
                >
                  Close
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

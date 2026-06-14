'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { Search, Download, Eye, Edit, Trash2, Star } from 'lucide-react';

interface Review {
  id: number;
  trainer_name: string;
  reviewer_name: string;
  rating: number;
  feedback: string;
  created_at: string;
  status: 'approved' | 'pending' | 'flagged';
}

const mockReviews: Review[] = [
  {
    id: 1,
    trainer_name: 'John Smith',
    reviewer_name: 'Ahmed Hassan',
    rating: 5,
    feedback: 'Excellent trainer! Very patient and knowledgeable.',
    created_at: '2026-06-01',
    status: 'approved',
  },
  {
    id: 2,
    trainer_name: 'Sarah Johnson',
    reviewer_name: 'Maria Garcia',
    rating: 4,
    feedback: 'Good sessions, could improve communication.',
    created_at: '2026-05-28',
    status: 'approved',
  },
  {
    id: 3,
    trainer_name: 'Alex Williams',
    reviewer_name: 'John Doe',
    rating: 2,
    feedback: 'Not meeting expectations. Very rushed sessions.',
    created_at: '2026-05-20',
    status: 'flagged',
  },
];

export default function TrainerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.trainer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || review.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'flagged': return 'danger';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainer Reviews & Ratings</h1>
          <p className="text-gray-600 mt-2">Manage trainer feedback and reviews</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by trainer or reviewer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <div className="flex gap-2">
              {['all', 'approved', 'pending', 'flagged'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900">
            Reviews ({filteredReviews.length})
          </h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reviews found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map(review => (
                <div
                  key={review.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.trainer_name}</p>
                          <p className="text-sm text-gray-600">Reviewed by {review.reviewer_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className={`ml-2 font-semibold ${getRatingColor(review.rating)}`}>
                          {review.rating}/5
                        </span>
                      </div>

                      <p className="text-gray-700 mb-3">{review.feedback}</p>

                      <p className="text-sm text-gray-500">
                        Submitted on {review.created_at}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant={getStatusColor(review.status) as any}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" className="text-sm">
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    <Button variant="outline" className="text-sm">
                      <Edit className="w-4 h-4" />
                      Edit Status
                    </Button>
                    {review.status === 'flagged' && (
                      <Button variant="outline" className="text-sm text-red-600">
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

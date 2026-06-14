'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { Search, Download, Eye, Edit, Lock, TrendingUp } from 'lucide-react';

interface ApprovedTrainer {
  id: number;
  name: string;
  email: string;
  expertise: string[];
  rating: number;
  total_reviews: number;
  approved_at: string;
  total_earnings: number;
  total_sessions: number;
  status: 'active' | 'suspended';
}

const mockApprovedTrainers: ApprovedTrainer[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'ielts.john@nexthire.com',
    expertise: ['IELTS', 'English'],
    rating: 4.8,
    total_reviews: 145,
    approved_at: '2026-03-15',
    total_earnings: 12500,
    total_sessions: 250,
    status: 'active',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'toefl.sarah@nexthire.com',
    expertise: ['TOEFL', 'English'],
    rating: 4.6,
    total_reviews: 98,
    approved_at: '2026-02-20',
    total_earnings: 9800,
    total_sessions: 186,
    status: 'active',
  },
];

export default function ApprovedTrainersPage() {
  const [trainers, setTrainers] = useState<ApprovedTrainer[]>(mockApprovedTrainers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trainer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    return 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approved Trainers</h1>
          <p className="text-gray-600 mt-2">Monitor and manage approved trainers</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-gray-600 text-sm">Total Approved</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{trainers.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {trainers.filter(t => t.status === 'active').length}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-gray-600 text-sm">Total Earnings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              ${trainers.reduce((sum, t) => sum + t.total_earnings, 0).toLocaleString()}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-gray-600 text-sm">Avg Rating</p>
            <p className={`text-3xl font-bold mt-2 ${getRatingColor(4.7)}`}>
              4.7/5
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'active', 'suspended'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Trainers List */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900">
            Trainers ({filteredTrainers.length})
          </h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredTrainers.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No trainers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Sessions</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Earnings</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Approved</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrainers.map(trainer => (
                    <tr key={trainer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-gray-900">{trainer.name}</p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {trainer.expertise.map(exp => (
                              <Badge key={exp} variant="primary" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{trainer.email}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${getRatingColor(trainer.rating)}`}>
                          {trainer.rating.toFixed(1)}/5
                        </span>
                        <span className="text-xs text-gray-500 ml-1">({trainer.total_reviews})</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {trainer.total_sessions}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        ${trainer.total_earnings.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{trainer.approved_at}</td>
                      <td className="py-3 px-4">
                        <Badge variant={trainer.status === 'active' ? 'success' : 'danger'}>
                          {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-yellow-600" />
                          </button>
                          {trainer.status === 'active' && (
                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Suspend">
                              <Lock className="w-4 h-4 text-red-600" />
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
        </CardBody>
      </Card>
    </div>
  );
}

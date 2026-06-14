'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { Search, Download, Eye, Edit, Trash2, CheckCircle, AlertCircle, Star, Briefcase } from 'lucide-react';

interface Trainer {
  id: number;
  uuid: string;
  user_email: string;
  expertise: string[];
  rating: number;
  total_reviews: number;
  approved_at: string | null;
  status: 'pending' | 'approved' | 'suspended';
  hourly_rate: number;
  total_earnings: number;
  created_at: string;
}

const FILTERS = {
  status: ['all', 'pending', 'approved', 'suspended'],
  expertise: ['all', 'IELTS', 'TOEFL', 'English', 'Math', 'Physics'],
};

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedTrainers, setSelectedTrainers] = useState<number[]>([]);

  useEffect(() => {
    fetchTrainers();
  }, [selectedStatus, selectedExpertise, searchTerm]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const { data } = await adminApi.getTrainers({ status: selectedStatus, expertise: selectedExpertise });

      setTimeout(() => {
        const mockTrainers: Trainer[] = [
          {
            id: 1,
            uuid: 'trainer-uuid-1',
            user_email: 'ielts.john@nexthire.com',
            expertise: ['IELTS', 'English'],
            rating: 4.8,
            total_reviews: 145,
            approved_at: '2026-03-15',
            status: 'approved',
            hourly_rate: 50,
            total_earnings: 12500,
            created_at: '2026-02-01',
          },
          {
            id: 2,
            uuid: 'trainer-uuid-2',
            user_email: 'toefl.sarah@nexthire.com',
            expertise: ['TOEFL', 'English'],
            rating: 4.6,
            total_reviews: 98,
            approved_at: '2026-02-20',
            status: 'approved',
            hourly_rate: 55,
            total_earnings: 9800,
            created_at: '2026-01-15',
          },
          {
            id: 3,
            uuid: 'trainer-uuid-3',
            user_email: 'pending.mike@nexthire.com',
            expertise: ['IELTS'],
            rating: 0,
            total_reviews: 0,
            approved_at: null,
            status: 'pending',
            hourly_rate: 45,
            total_earnings: 0,
            created_at: '2026-06-01',
          },
          {
            id: 4,
            uuid: 'trainer-uuid-4',
            user_email: 'suspended.alex@nexthire.com',
            expertise: ['English', 'TOEFL'],
            rating: 2.1,
            total_reviews: 52,
            approved_at: '2025-12-01',
            status: 'suspended',
            hourly_rate: 40,
            total_earnings: 3200,
            created_at: '2025-11-01',
          },
        ];

        let filtered = mockTrainers;
        if (selectedStatus !== 'all') {
          filtered = filtered.filter(t => t.status === selectedStatus);
        }
        if (selectedExpertise !== 'all') {
          filtered = filtered.filter(t => t.expertise.includes(selectedExpertise));
        }
        if (searchTerm) {
          filtered = filtered.filter(t =>
            t.user_email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setTrainers(filtered);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedTrainers.length === trainers.length) {
      setSelectedTrainers([]);
    } else {
      setSelectedTrainers(trainers.map(t => t.id));
    }
  };

  const handleSelectTrainer = (id: number) => {
    setSelectedTrainers(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'danger';
      default: return 'gray';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainer Management</h1>
          <p className="text-gray-600 mt-2">Manage all platform trainers</p>
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
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <div className="flex gap-2">
              {FILTERS.status.map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === status
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

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Expertise:</span>
            <div className="flex gap-2">
              {FILTERS.expertise.map(exp => (
                <button
                  key={exp}
                  onClick={() => setSelectedExpertise(exp)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedExpertise === exp
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trainers Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">
            Trainers ({trainers.length})
          </h2>
          {selectedTrainers.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {selectedTrainers.length} selected
              </span>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Delete Selected
              </Button>
            </div>
          )}
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No trainers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedTrainers.length === trainers.length && trainers.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Expertise</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Earnings</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map(trainer => (
                    <tr key={trainer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedTrainers.includes(trainer.id)}
                          onChange={() => handleSelectTrainer(trainer.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-gray-900">{trainer.user_email}</p>
                          <p className="text-sm text-gray-500">ID: {trainer.uuid.slice(0, 8)}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {trainer.expertise.map(exp => (
                            <Badge key={exp} variant="primary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Star className={`w-4 h-4 fill-yellow-400 text-yellow-400`} />
                          <span className={`font-semibold ${getRatingColor(trainer.rating)}`}>
                            {trainer.rating > 0 ? trainer.rating.toFixed(1) : 'N/A'}
                          </span>
                          <span className="text-sm text-gray-500">({trainer.total_reviews})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(trainer.status) as any}>
                          {trainer.status === 'approved' && <CheckCircle className="w-4 h-4 mr-1" />}
                          {trainer.status === 'pending' && <AlertCircle className="w-4 h-4 mr-1" />}
                          {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        ${trainer.total_earnings.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-yellow-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
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

      {/* Pagination */}
      {trainers.length > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Showing <strong>1</strong> to <strong>{trainers.length}</strong> of <strong>{trainers.length}</strong> trainers
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled>Previous</Button>
            <Button variant="outline" disabled>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}

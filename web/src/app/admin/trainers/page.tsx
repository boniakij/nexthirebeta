'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { adminApi } from '@/lib/api/admin';
import { Search, CheckCircle2, Clock, X } from 'lucide-react';

interface Trainer {
  id: number;
  name: string;
  email: string;
  expertise: string[];
  status: 'approved' | 'pending' | 'rejected';
  kyc_status: 'verified' | 'pending' | 'rejected';
  rating: number;
  sessions_count: number;
  created_at: string;
}

function TrainersContent() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const { data } = await adminApi.getTrainers();
        setTrainers(data.data || []);
        setFilteredTrainers(data.data || []);
      } catch (error) {
        console.error('Failed to fetch trainers:', error);
        const mockTrainers = getMockTrainers();
        setTrainers(mockTrainers);
        setFilteredTrainers(mockTrainers);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  useEffect(() => {
    let filtered = trainers;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((t) => t.status === selectedStatus);
    }

    setFilteredTrainers(filtered);
  }, [searchQuery, selectedStatus, trainers]);

  const handleApprove = async (trainerId: number) => {
    try {
      await adminApi.approveTrainer(trainerId);
      setTrainers(trainers.map((t) => (t.id === trainerId ? { ...t, status: 'approved' as const } : t)));
    } catch (error) {
      console.error('Failed to approve trainer:', error);
    }
  };

  const handleReject = async (trainerId: number) => {
    if (confirm('Are you sure you want to reject this trainer?')) {
      try {
        await adminApi.rejectTrainer(trainerId);
        setTrainers(trainers.map((t) => (t.id === trainerId ? { ...t, status: 'rejected' as const } : t)));
      } catch (error) {
        console.error('Failed to reject trainer:', error);
      }
    }
  };

  const handleVerifyKYC = async (trainerId: number) => {
    try {
      await adminApi.verifyTrainerKYC(trainerId);
      setTrainers(trainers.map((t) => (t.id === trainerId ? { ...t, kyc_status: 'verified' as const } : t)));
    } catch (error) {
      console.error('Failed to verify KYC:', error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const pendingCount = trainers.filter((t) => t.status === 'pending').length;
  const kycPendingCount = trainers.filter((t) => t.kyc_status === 'pending').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">👨‍🏫 Trainers Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Trainers</p>
            <p className="text-2xl font-bold text-gray-900">{trainers.length}</p>
          </CardBody>
        </Card>
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardBody className="text-center">
            <p className="text-sm text-yellow-900 mb-1">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </CardBody>
        </Card>
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardBody className="text-center">
            <p className="text-sm text-orange-900 mb-1">KYC Pending</p>
            <p className="text-2xl font-bold text-orange-600">{kycPendingCount}</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Trainers Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">Trainers ({filteredTrainers.length})</h2>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Expertise</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">KYC</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Rating</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Sessions</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainers.map((trainer) => (
                  <tr key={trainer.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-gray-900">{trainer.name}</td>
                    <td className="py-3 px-4 text-gray-600">{trainer.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {trainer.expertise.slice(0, 2).map((exp) => (
                          <Badge key={exp} variant="primary" className="text-xs">
                            {exp}
                          </Badge>
                        ))}
                        {trainer.expertise.length > 2 && (
                          <span className="text-xs text-gray-500">+{trainer.expertise.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={getStatusBadgeColor(trainer.status)}>
                        {trainer.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          trainer.kyc_status === 'verified'
                            ? 'success'
                            : trainer.kyc_status === 'pending'
                              ? 'warning'
                              : 'danger'
                        }
                      >
                        {trainer.kyc_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-gray-900">
                      ⭐ {trainer.rating}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-900">
                      {trainer.sessions_count}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        {trainer.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleApprove(trainer.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleReject(trainer.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {trainer.kyc_status === 'pending' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleVerifyKYC(trainer.id)}
                          >
                            Verify KYC
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function TrainersPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <TrainersContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockTrainers(): Trainer[] {
  return [
    { id: 1, name: 'Arjun Kumar', email: 'arjun@example.com', expertise: ['System Design', 'Backend'], status: 'approved', kyc_status: 'verified', rating: 4.8, sessions_count: 45, created_at: '2026-01-15' },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', expertise: ['React', 'Frontend', 'CSS'], status: 'approved', kyc_status: 'verified', rating: 4.6, sessions_count: 38, created_at: '2026-02-10' },
    { id: 3, name: 'Rahul Singh', email: 'rahul@example.com', expertise: ['DevOps', 'Docker', 'Kubernetes'], status: 'pending', kyc_status: 'pending', rating: 4.3, sessions_count: 12, created_at: '2026-05-20' },
    { id: 4, name: 'Fatima Ahmed', email: 'fatima@example.com', expertise: ['Data Science', 'Python', 'ML'], status: 'approved', kyc_status: 'verified', rating: 4.9, sessions_count: 52, created_at: '2026-03-08' },
    { id: 5, name: 'Vikram Patel', email: 'vikram@example.com', expertise: ['Java', 'Spring', 'Microservices'], status: 'pending', kyc_status: 'rejected', rating: 4.2, sessions_count: 8, created_at: '2026-05-25' },
  ];
}

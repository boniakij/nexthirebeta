'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input } from '@/components/ui';
import { CheckCircle, X, AlertCircle, Loader } from 'lucide-react';

interface Trainer {
  id: number;
  full_name: string;
  professional_title: string;
  profile_photo_url: string;
  bio: string;
  years_experience: number;
  profile_submitted_at: string;
  average_rating: number;
}

export default function TrainerReviewPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const response = await fetch('/api/v1/admin/trainers/pending-review', {
        headers: {'Authorization': `Bearer ${localStorage.getItem('auth_token')}`}
      });
      const data = await response.json();
      if (response.ok) setTrainers(data.data);
      else throw new Error(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (trainerId: number) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/trainers/${trainerId}/approve`, {
        method: 'PATCH',
        headers: {'Authorization': `Bearer ${localStorage.getItem('auth_token')}`}
      });
      if (response.ok) {
        setTrainers(trainers.filter(t => t.id !== trainerId));
        alert('Trainer approved');
      }
    } catch (err) {
      alert('Failed to approve trainer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (trainerId: number) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    setActionLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/trainers/${trainerId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({reason: rejectReason})
      });
      if (response.ok) {
        setTrainers(trainers.filter(t => t.id !== trainerId));
        setSelectedTrainer(null);
        setRejectReason('');
        alert('Trainer rejected');
      }
    } catch (err) {
      alert('Failed to reject trainer');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Trainer Profile Reviews</h1>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">{error}</div>}

      {trainers.length === 0 ? (
        <Card>
          <CardBody className="text-center text-gray-600">No pending reviews</CardBody>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="space-y-4">
              {trainers.map(trainer => (
                <Card key={trainer.id} className={selectedTrainer?.id === trainer.id ? 'ring-2 ring-blue-600' : ''}>
                  <CardBody className="flex gap-4 cursor-pointer" onClick={() => setSelectedTrainer(trainer)}>
                    {trainer.profile_photo_url && (
                      <img src={trainer.profile_photo_url} alt={trainer.full_name} className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{trainer.full_name}</h3>
                      <p className="text-gray-600">{trainer.professional_title}</p>
                      <p className="text-sm text-gray-500">{trainer.years_experience}+ years experience</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Submitted: {new Date(trainer.profile_submitted_at).toLocaleDateString()}</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {selectedTrainer && (
            <Card>
              <CardHeader><h2 className="font-bold text-lg">Review</h2></CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{selectedTrainer.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Title</p>
                  <p className="font-semibold">{selectedTrainer.professional_title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bio</p>
                  <p className="text-sm">{selectedTrainer.bio}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Rejection Reason (if rejecting)</label>
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg" placeholder="Why are you rejecting this profile?" />
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" className="flex-1 flex gap-2" onClick={() => handleApprove(selectedTrainer.id)} loading={actionLoading}>
                    <CheckCircle className="w-4 h-4" />Approve
                  </Button>
                  <Button variant="outline" className="flex-1 flex gap-2 text-red-600" onClick={() => handleReject(selectedTrainer.id)} loading={actionLoading}>
                    <X className="w-4 h-4" />Reject
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

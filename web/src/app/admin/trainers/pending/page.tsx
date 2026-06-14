'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner, Modal } from '@/components/ui';
import { Search, CheckCircle, XCircle, Eye, Clock, FileText } from 'lucide-react';

interface PendingTrainer {
  id: number;
  user_email: string;
  full_name: string;
  expertise: string[];
  qualifications: string[];
  bio: string;
  profile_photo?: string;
  documents: {
    certificate: string;
    degree: string;
    id_proof: string;
  };
  submitted_at: string;
  review_status: 'pending_review' | 'under_review' | 'needs_revision';
}

export default function PendingTrainersPage() {
  const [trainers, setTrainers] = useState<PendingTrainer[]>([
    {
      id: 1,
      user_email: 'newtrainer.john@nexthire.com',
      full_name: 'John Smith',
      expertise: ['IELTS', 'English'],
      qualifications: ['Bachelor in English', 'IELTS Certified', 'TEFL'],
      bio: 'Experienced IELTS trainer with 10 years of teaching experience.',
      submitted_at: '2026-06-01',
      review_status: 'pending_review',
      documents: {
        certificate: 'ielts_cert.pdf',
        degree: 'bachelor_degree.pdf',
        id_proof: 'passport_scan.pdf',
      },
    },
    {
      id: 2,
      user_email: 'newtrainer.sarah@nexthire.com',
      full_name: 'Sarah Johnson',
      expertise: ['TOEFL', 'English', 'Grammar'],
      qualifications: ['Master in Linguistics', 'TOEFL Certified'],
      bio: 'Specialized in TOEFL preparation for international students.',
      submitted_at: '2026-05-28',
      review_status: 'under_review',
      documents: {
        certificate: 'toefl_cert.pdf',
        degree: 'masters_degree.pdf',
        id_proof: 'id_card_scan.pdf',
      },
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<PendingTrainer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | 'review'>('approve');
  const [comments, setComments] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrainers = trainers.filter(t =>
    t.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (trainer: PendingTrainer) => {
    setSelectedTrainer(trainer);
    setAction('approve');
    setShowModal(true);
  };

  const handleReject = async (trainer: PendingTrainer) => {
    setSelectedTrainer(trainer);
    setAction('reject');
    setShowModal(true);
  };

  const handleSendForReview = async (trainer: PendingTrainer) => {
    setSelectedTrainer(trainer);
    setAction('review');
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedTrainer) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      // if (action === 'approve') {
      //   await adminApi.approveTrainer(selectedTrainer.id, { comments });
      // } else if (action === 'reject') {
      //   await adminApi.rejectTrainer(selectedTrainer.id, { reason: comments });
      // }

      // Simulate API call
      setTimeout(() => {
        setTrainers(prev => prev.filter(t => t.id !== selectedTrainer.id));
        setShowModal(false);
        setComments('');
        setLoading(false);
        alert(`Trainer ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent for review'}!`);
      }, 1000);
    } catch (error) {
      console.error(`Failed to ${action} trainer:`, error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'warning';
      case 'under_review': return 'info';
      case 'needs_revision': return 'danger';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Trainer Approvals</h1>
          <p className="text-gray-600 mt-2">Review and approve new trainers</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Pending Trainers Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTrainers.map(trainer => (
          <Card key={trainer.id}>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Trainer Info */}
                <div className="md:col-span-2">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {trainer.full_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{trainer.full_name}</h3>
                      <p className="text-sm text-gray-600">{trainer.user_email}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {trainer.expertise.map(exp => (
                          <Badge key={exp} variant="primary" className="text-xs">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{trainer.bio}</p>
                  </div>

                  {/* Qualifications */}
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Qualifications:</h4>
                    <ul className="space-y-1">
                      {trainer.qualifications.map((qual, idx) => (
                        <li key={idx} className="text-sm text-gray-600">✓ {qual}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Status & Documents */}
                <div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 uppercase mb-1">Status</p>
                      <Badge variant={getStatusColor(trainer.review_status) as any} className="w-fit">
                        {trainer.review_status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase mb-1">Submitted</p>
                      <p className="text-sm font-semibold text-gray-900">{trainer.submitted_at}</p>
                    </div>

                    {/* Documents */}
                    <div>
                      <p className="text-xs text-gray-600 uppercase mb-2">Documents</p>
                      <div className="space-y-2">
                        <button className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100">
                          <FileText className="w-4 h-4" />
                          Certificate
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100">
                          <FileText className="w-4 h-4" />
                          Degree
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100">
                          <FileText className="w-4 h-4" />
                          ID Proof
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white w-full justify-center"
                    onClick={() => handleApprove(trainer)}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-blue-600 border-blue-200 w-full justify-center"
                    onClick={() => handleSendForReview(trainer)}
                  >
                    <Clock className="w-5 h-5" />
                    Send Review
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 w-full justify-center"
                    onClick={() => handleReject(trainer)}
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full justify-center"
                  >
                    <Eye className="w-5 h-5" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredTrainers.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No pending trainers found</p>
          </CardBody>
        </Card>
      )}

      {/* Modal */}
      {showModal && selectedTrainer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="font-bold text-gray-900">
                {action === 'approve'
                  ? 'Approve Trainer'
                  : action === 'reject'
                  ? 'Reject Trainer'
                  : 'Send for Review'}
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Trainer: {selectedTrainer.full_name}</p>
                <p className="text-sm text-gray-600">{selectedTrainer.user_email}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {action === 'reject' ? 'Rejection Reason' : 'Comments (optional)'}
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={action === 'reject' ? 'Explain why you are rejecting...' : 'Add any comments...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmAction}
                  className={`flex-1 ${
                    action === 'reject'
                      ? 'bg-red-600 hover:bg-red-700'
                      : action === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                  loading={loading}
                  disabled={loading}
                >
                  {action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Send for Review'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Badge, Spinner, Input, Modal } from '@/components/ui';
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import apiClient from '@/lib/api/client';

interface Withdrawal {
  id: number;
  withdrawal_id: number;
  trainer_id: number;
  trainer_name: string;
  amount: number;
  currency: string;
  method: string;
  account_number: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'paid';
  requested_at: string;
  admin_note?: string;
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'all'>('pending');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'approve' | 'reject' | 'mark-paid'>('approve');
  const [formData, setFormData] = useState({
    admin_note: '',
    transaction_reference: '',
    rejection_reason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, [selectedTab]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const endpoint = selectedTab === 'pending' ? '/admin/withdrawals/pending' : '/admin/withdrawals';
      const response = await apiClient.get(endpoint);

      if (response.data?.success) {
        setWithdrawals(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (withdrawal: Withdrawal, mode: 'approve' | 'reject' | 'mark-paid') => {
    setSelectedWithdrawal(withdrawal);
    setModalMode(mode);
    setFormData({ admin_note: '', transaction_reference: '', rejection_reason: '' });
    setShowModal(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedWithdrawal) return;

    setSubmitting(true);

    try {
      let endpoint = '';
      let payload: any = {};

      switch (modalMode) {
        case 'approve':
          endpoint = `/admin/withdrawals/${selectedWithdrawal.id}/approve`;
          payload = { admin_note: formData.admin_note };
          break;
        case 'reject':
          endpoint = `/admin/withdrawals/${selectedWithdrawal.id}/reject`;
          payload = {
            rejection_reason: formData.rejection_reason,
            admin_note: formData.admin_note,
          };
          break;
        case 'mark-paid':
          endpoint = `/admin/withdrawals/${selectedWithdrawal.id}/mark-paid`;
          payload = {
            transaction_reference: formData.transaction_reference,
            admin_note: formData.admin_note,
          };
          break;
      }

      const response = await apiClient.patch(endpoint, payload);

      if (response.data?.success) {
        setShowModal(false);
        fetchWithdrawals();
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'approved':
      case 'processing':
        return 'warning';
      case 'pending':
        return 'gray';
      case 'rejected':
        return 'danger';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Withdrawal Requests</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 font-semibold ${
            selectedTab === 'pending'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({withdrawals.filter((w) => w.status === 'pending').length})
        </button>
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 font-semibold ${
            selectedTab === 'all'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Withdrawals
        </button>
      </div>

      {/* Withdrawals List */}
      <div className="space-y-3">
        {withdrawals.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600">No withdrawals to display</p>
            </CardBody>
          </Card>
        ) : (
          withdrawals.map((withdrawal) => (
            <Card key={withdrawal.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-900">{withdrawal.trainer_name}</p>
                      <Badge variant={getStatusColor(withdrawal.status)}>
                        {withdrawal.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Amount</p>
                        <p className="font-semibold text-lg text-gray-900">
                          {withdrawal.currency} {withdrawal.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Method</p>
                        <p className="font-semibold text-gray-900">{withdrawal.method}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Requested Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(withdrawal.requested_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Account</p>
                        <p className="font-semibold text-gray-900">{withdrawal.account_number}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-4 flex flex-col gap-2">
                    {withdrawal.status === 'pending' && (
                      <>
                        <Button
                          variant="primary"
                          className="text-xs py-2"
                          onClick={() => openModal(withdrawal, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="text-xs py-2"
                          onClick={() => openModal(withdrawal, 'reject')}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {withdrawal.status === 'approved' && (
                      <Button
                        variant="primary"
                        className="text-xs py-2"
                        onClick={() => openModal(withdrawal, 'mark-paid')}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && selectedWithdrawal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-lg w-full space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {modalMode === 'approve' && 'Approve Withdrawal'}
              {modalMode === 'reject' && 'Reject Withdrawal'}
              {modalMode === 'mark-paid' && 'Mark Withdrawal as Paid'}
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                {selectedWithdrawal.trainer_name} - {selectedWithdrawal.currency}{' '}
                {selectedWithdrawal.amount.toLocaleString()}
              </p>
            </div>

            {modalMode === 'reject' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={formData.rejection_reason}
                  onChange={(e) =>
                    setFormData({ ...formData, rejection_reason: e.target.value })
                  }
                  placeholder="Explain why this withdrawal is being rejected"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  rows={3}
                />
              </div>
            )}

            {modalMode === 'mark-paid' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Transaction Reference *
                </label>
                <Input
                  value={formData.transaction_reference}
                  onChange={(e) =>
                    setFormData({ ...formData, transaction_reference: e.target.value })
                  }
                  placeholder="e.g., BKASH-TXN-12345"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Admin Note
              </label>
              <textarea
                value={formData.admin_note}
                onChange={(e) =>
                  setFormData({ ...formData, admin_note: e.target.value })
                }
                placeholder="Internal note (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                rows={2}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSubmitAction}
                loading={submitting}
              >
                {modalMode === 'approve' && 'Approve'}
                {modalMode === 'reject' && 'Reject'}
                {modalMode === 'mark-paid' && 'Mark Paid'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

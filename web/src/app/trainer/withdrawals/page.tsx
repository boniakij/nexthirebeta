'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Badge, Spinner } from '@/components/ui';
import { TrendingDown, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api/client';

interface Withdrawal {
  id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'processing' | 'paid' | 'rejected';
  requested_at: string;
  approved_at?: string;
  paid_at?: string;
  transaction_reference?: string;
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, withdrawalsRes] = await Promise.all([
        apiClient.get('/trainers/me/wallet'),
        apiClient.get('/trainers/me/withdrawals'),
      ]);

      if (walletRes.data?.success) setWallet(walletRes.data.data);
      if (withdrawalsRes.data?.success) setWithdrawals(withdrawalsRes.data.data);
    } catch (err) {
      setError('Failed to load withdrawal data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestWithdrawal = async () => {
    if (!amount || parseFloat(amount) < 1000) {
      setError('Minimum withdrawal amount is 1000 BDT');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.post('/trainers/me/withdrawals', {
        amount: parseFloat(amount),
        payout_method_id: 1, // TODO: get from user selection
        note: note || null,
      });

      if (response.data?.success) {
        setSuccess('Withdrawal request submitted successfully!');
        setAmount('');
        setNote('');
        setShowForm(false);
        fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'approved':
      case 'processing':
        return 'warning';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Withdrawals</h1>
        {!showForm && (
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setShowForm(true)}
            disabled={!wallet || wallet.available_balance < 1000}
          >
            <Plus className="w-5 h-5" />
            Request Withdrawal
          </Button>
        )}
      </div>

      {/* Wallet Summary */}
      {wallet && (
        <>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">💰 Wallet Summary</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {wallet.currency} {wallet.available_balance?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Ready to withdraw</p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-600">Pending Balance</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {wallet.currency} {wallet.pending_balance?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Available after session completion and refund window</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Total Earned</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {wallet.currency} {wallet.total_earned?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All time earnings</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Withdrawn</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {wallet.currency} {wallet.withdrawn_amount?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total paid out</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}

      {/* Request Withdrawal Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">📤 Withdrawal Request</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Minimum withdrawal:</strong> {wallet?.currency} {wallet?.minimum_withdraw_amount?.toLocaleString()}
              </p>
              <p className="text-sm text-blue-900 mt-2">
                <strong>Estimated processing time:</strong> 1-3 business days
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Withdrawal Amount * ({wallet?.currency})
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min={wallet?.minimum_withdraw_amount || 1000}
              />
              <p className="text-xs text-gray-500 mt-2">
                Available balance: {wallet?.currency} {wallet?.available_balance?.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Payout Method *
              </label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Default Method:</strong> bKash - 01XXXXXXXXX
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <a href="/trainer/payout-methods" className="text-primary-600 hover:underline">
                    Manage payout methods →
                  </a>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Trainer Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Monthly withdrawal request"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                rows={3}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowForm(false);
                  setAmount('');
                  setNote('');
                  setError('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleRequestWithdrawal}
                loading={submitting}
              >
                Submit Withdrawal Request
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Withdrawal History */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">📜 Withdrawal History</h2>

        {withdrawals.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No withdrawals yet</p>
              <p className="text-sm text-gray-500 mt-2">Your withdrawal history will appear here</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <Card key={withdrawal.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div>
                          <p className="font-semibold text-lg text-gray-900">
                            {withdrawal.currency} {withdrawal.amount.toLocaleString()}
                          </p>
                          <Badge variant={getStatusColor(withdrawal.status)} className="mt-2">
                            {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Requested Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(withdrawal.requested_at).toLocaleDateString()}
                          </p>
                        </div>
                        {withdrawal.paid_at && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Paid Date</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(withdrawal.paid_at).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {withdrawal.transaction_reference && (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500 uppercase">Transaction Reference</p>
                            <p className="font-semibold text-gray-900 font-mono text-sm">
                              {withdrawal.transaction_reference}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {getStatusIcon(withdrawal.status)}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

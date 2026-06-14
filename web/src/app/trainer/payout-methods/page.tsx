'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Select, Modal, Badge, Spinner } from '@/components/ui';
import { Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import apiClient from '@/lib/api/client';

interface PayoutMethod {
  id: number;
  method: string;
  bank_name?: string;
  account_number: string;
  holder_name: string;
  status: 'verified' | 'pending_verification';
  is_default: boolean;
}

export default function PayoutMethodsPage() {
  const [methods, setMethods] = useState<PayoutMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    method: 'bank_transfer' as 'bank_transfer' | 'bkash' | 'nagad',
    bank_name: '',
    account_number: '',
    holder_name: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPayoutMethods();
  }, []);

  const fetchPayoutMethods = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/trainers/me/payout-methods');

      if (response.data?.success) {
        setMethods(response.data.data);
      }
    } catch (err) {
      setError('Failed to load payout methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.account_number || !formData.holder_name) {
      setError('Account number and holder name are required');
      return;
    }

    if (formData.method === 'bank_transfer' && !formData.bank_name) {
      setError('Bank name is required for bank transfers');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        const response = await apiClient.put(`/trainers/me/payout-methods/${editingId}`, {
          holder_name: formData.holder_name,
          is_default: false,
        });

        if (response.data?.success) {
          setSuccess('Payout method updated successfully!');
          fetchPayoutMethods();
          resetForm();
        }
      } else {
        const response = await apiClient.post('/trainers/me/payout-methods', formData);

        if (response.data?.success) {
          setSuccess('Payout method added successfully!');
          fetchPayoutMethods();
          resetForm();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save payout method');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payout method?')) return;

    try {
      const response = await apiClient.delete(`/trainers/me/payout-methods/${id}`);

      if (response.data?.success) {
        setSuccess('Payout method deleted');
        fetchPayoutMethods();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete payout method');
    }
  };

  const resetForm = () => {
    setFormData({
      method: 'bank_transfer',
      bank_name: '',
      account_number: '',
      holder_name: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'bkash':
        return 'bKash';
      case 'nagad':
        return 'Nagad';
      default:
        return method;
    }
  };

  const maskAccountNumber = (account: string) => {
    if (account.length <= 4) return account;
    return '*'.repeat(account.length - 4) + account.slice(-4);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Payout Methods</h1>
        {!showForm && (
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-5 h-5" />
            Add Method
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? 'Edit Payout Method' : 'Add Payout Method'}
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Method Type *
              </label>
              <Select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                disabled={!!editingId}
                className="w-full"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
              </Select>
            </div>

            {formData.method === 'bank_transfer' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bank Name *
                </label>
                <Input
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  placeholder="e.g., Dhaka Bank"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {formData.method === 'bank_transfer' ? 'Account Number' : 'Mobile Number'} *
              </label>
              <Input
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                placeholder={formData.method === 'bank_transfer' ? '1234567890' : '01XXXXXXXXX'}
                disabled={!!editingId}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Account Holder Name *
              </label>
              <Input
                value={formData.holder_name}
                onChange={(e) => setFormData({ ...formData, holder_name: e.target.value })}
                placeholder="e.g., Ahmed Rahman"
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
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSubmit}
                loading={submitting}
              >
                {editingId ? 'Update' : 'Add'} Method
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Methods List */}
      <div className="space-y-3">
        {methods.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600">No payout methods added yet.</p>
              <Button
                variant="primary"
                className="mt-4 inline-flex items-center gap-2"
                onClick={() => setShowForm(true)}
              >
                <Plus className="w-5 h-5" />
                Add First Method
              </Button>
            </CardBody>
          </Card>
        ) : (
          methods.map((method) => (
            <Card key={method.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{getMethodLabel(method.method)}</h3>
                      {method.is_default && (
                        <Badge variant="success">Default</Badge>
                      )}
                      {method.status === 'verified' && (
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                      {method.status === 'pending_verification' && (
                        <Badge variant="warning">Pending Verification</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                      {method.bank_name && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Bank</p>
                          <p className="font-semibold text-gray-900">{method.bank_name}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          {method.method === 'bank_transfer' ? 'Account' : 'Number'}
                        </p>
                        <p className="font-semibold text-gray-900">{maskAccountNumber(method.account_number)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 uppercase">Holder Name</p>
                        <p className="font-semibold text-gray-900">{method.holder_name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(method.id);
                        setFormData({
                          method: method.method as any,
                          bank_name: method.bank_name || '',
                          account_number: method.account_number,
                          holder_name: method.holder_name,
                        });
                        setShowForm(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

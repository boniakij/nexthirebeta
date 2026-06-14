'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Spinner, Tabs } from '@/components/ui';
import { Save, ShieldAlert, CheckCircle, CreditCard, Landmark, Smartphone, RefreshCw } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';

export default function PaymentGatewayPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState('bkash');

  // Form State
  const [paymentSettings, setPaymentSettings] = useState({
    sslcommerz: { store_id: '', store_password: '', sandbox: true, enabled: false },
    bkash: { app_key: '', app_secret: '', username: '', password: '', webhook_token: '', enabled: false },
    nagad: { merchant_id: '', merchant_number: '', public_key: '', private_key: '', enabled: false },
    stripe: { client_id: '', secret_key: '', enabled: false },
    paypal: { client_id: '', client_secret: '', enabled: false },
    bank: { bank_name: '', account_name: '', account_number: '', routing_number: '', branch: '', enabled: false },
  });

  const tabs = [
    { id: 'bkash', label: 'bKash MFS' },
    { id: 'nagad', label: 'Nagad MFS' },
    { id: 'sslcommerz', label: 'SSLCommerz (Local)' },
    { id: 'stripe', label: 'Stripe (Intl)' },
    { id: 'paypal', label: 'PayPal (Intl)' },
    { id: 'bank', label: 'Bank Account' },
  ];

  // Fetch Settings
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const { data } = await adminApi.getSettings();
        if (data.success && data.data?.payment) {
          // Merge fetched settings with default structure to prevent missing keys
          setPaymentSettings((prev) => ({
            ...prev,
            ...data.data.payment,
          }));
        }
      } catch (err: any) {
        console.error('Failed to load settings:', err);
        setError('Failed to fetch settings from server.');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Save Settings
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess(false);

      const res = await adminApi.updatePaymentSettings(paymentSettings);
      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(res.data?.message || 'Failed to save settings');
      }
    } catch (err: any) {
      console.error('Save failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const updateGatewayField = (gateway: string, field: string, value: any) => {
    setPaymentSettings((prev: any) => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner className="w-10 h-10 text-primary-600 mb-3" />
        <p className="text-gray-500 text-sm">Loading gateway credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payment Gateways Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure Sandbox/Production merchant keys for Student & Company payments</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 shadow-md shadow-primary-100"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span>All payment settings have been saved and applied successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* bKash Form */}
          {activeTab === 'bkash' && (
            <Card className="border border-orange-100 shadow-sm">
              <CardHeader className="bg-orange-50/50 flex flex-row items-center justify-between py-4 px-6 border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📱</span>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">bKash Merchant Details</h2>
                    <p className="text-xs text-orange-600 font-semibold">Direct Mobile Financial Service (MFS)</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.bkash.enabled}
                    onChange={(e) => updateGatewayField('bkash', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">App Key</label>
                    <Input
                      placeholder="Enter App Key"
                      value={paymentSettings.bkash.app_key || ''}
                      onChange={(e) => updateGatewayField('bkash', 'app_key', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">App Secret</label>
                    <Input
                      type="password"
                      placeholder="Enter App Secret"
                      value={paymentSettings.bkash.app_secret || ''}
                      onChange={(e) => updateGatewayField('bkash', 'app_secret', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Username</label>
                    <Input
                      placeholder="Merchant Username"
                      value={paymentSettings.bkash.username || ''}
                      onChange={(e) => updateGatewayField('bkash', 'username', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Password</label>
                    <Input
                      type="password"
                      placeholder="Merchant Password"
                      value={paymentSettings.bkash.password || ''}
                      onChange={(e) => updateGatewayField('bkash', 'password', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Webhook Verification Token</label>
                    <Input
                      placeholder="Webhook Secret Token"
                      value={paymentSettings.bkash.webhook_token || ''}
                      onChange={(e) => updateGatewayField('bkash', 'webhook_token', e.target.value)}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Nagad Form */}
          {activeTab === 'nagad' && (
            <Card className="border border-red-100 shadow-sm">
              <CardHeader className="bg-red-50/50 flex flex-row items-center justify-between py-4 px-6 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📱</span>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Nagad Merchant Details</h2>
                    <p className="text-xs text-red-600 font-semibold">Nagad Wallet Integration</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.nagad.enabled}
                    onChange={(e) => updateGatewayField('nagad', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Merchant ID</label>
                    <Input
                      placeholder="Enter Merchant ID"
                      value={paymentSettings.nagad.merchant_id || ''}
                      onChange={(e) => updateGatewayField('nagad', 'merchant_id', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Merchant Account No</label>
                    <Input
                      placeholder="e.g. +88017XXXXXXXX"
                      value={paymentSettings.nagad.merchant_number || ''}
                      onChange={(e) => updateGatewayField('nagad', 'merchant_number', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Merchant Public Key</label>
                    <Input
                      placeholder="Paste Public Key here"
                      value={paymentSettings.nagad.public_key || ''}
                      onChange={(e) => updateGatewayField('nagad', 'public_key', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Merchant Private Key (PGP)</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm font-mono text-gray-700 bg-white"
                      rows={4}
                      placeholder="-----BEGIN RSA PRIVATE KEY-----"
                      value={paymentSettings.nagad.private_key || ''}
                      onChange={(e) => updateGatewayField('nagad', 'private_key', e.target.value)}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* SSLCommerz Form */}
          {activeTab === 'sslcommerz' && (
            <Card className="border border-blue-100 shadow-sm">
              <CardHeader className="bg-blue-50/50 flex flex-row items-center justify-between py-4 px-6 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🇧🇩</span>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">SSLCommerz Credentials</h2>
                    <p className="text-xs text-blue-600 font-semibold">Bangladesh Payment Gateway Handoff</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.sslcommerz.enabled}
                    onChange={(e) => updateGatewayField('sslcommerz', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Store ID</label>
                    <Input
                      placeholder="Enter Store ID"
                      value={paymentSettings.sslcommerz.store_id || ''}
                      onChange={(e) => updateGatewayField('sslcommerz', 'store_id', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Store Password</label>
                    <Input
                      type="password"
                      placeholder="Enter Store Password"
                      value={paymentSettings.sslcommerz.store_password || ''}
                      onChange={(e) => updateGatewayField('sslcommerz', 'store_password', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Sandbox / Test Mode</h4>
                      <p className="text-xs text-gray-500">Run gateway in simulation mode for local verification</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentSettings.sslcommerz.sandbox}
                        onChange={(e) => updateGatewayField('sslcommerz', 'sandbox', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Stripe Form */}
          {activeTab === 'stripe' && (
            <Card className="border border-purple-100 shadow-sm">
              <CardHeader className="bg-purple-50/50 flex flex-row items-center justify-between py-4 px-6 border-b border-purple-100">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-purple-600" />
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Stripe International</h2>
                    <p className="text-xs text-purple-600 font-semibold">Credit/Debit Cards & Web Wallet Integration</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.stripe.enabled}
                    onChange={(e) => updateGatewayField('stripe', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Publishable Key</label>
                    <Input
                      placeholder="pk_test_..."
                      value={paymentSettings.stripe.client_id || ''}
                      onChange={(e) => updateGatewayField('stripe', 'client_id', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Secret Key</label>
                    <Input
                      type="password"
                      placeholder="sk_test_..."
                      value={paymentSettings.stripe.secret_key || ''}
                      onChange={(e) => updateGatewayField('stripe', 'secret_key', e.target.value)}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* PayPal Form */}
          {activeTab === 'paypal' && (
            <Card className="border border-indigo-100 shadow-sm">
              <CardHeader className="bg-indigo-50/50 flex flex-row items-center justify-between py-4 px-6 border-b border-indigo-100">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-indigo-600" />
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">PayPal Merchant</h2>
                    <p className="text-xs text-indigo-600 font-semibold">International Checkout & Web Portal</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.paypal.enabled}
                    onChange={(e) => updateGatewayField('paypal', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Client ID</label>
                    <Input
                      placeholder="PayPal REST App Client ID"
                      value={paymentSettings.paypal.client_id || ''}
                      onChange={(e) => updateGatewayField('paypal', 'client_id', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Client Secret</label>
                    <Input
                      type="password"
                      placeholder="PayPal REST App Client Secret"
                      value={paymentSettings.paypal.client_secret || ''}
                      onChange={(e) => updateGatewayField('paypal', 'client_secret', e.target.value)}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Bank Form */}
          {activeTab === 'bank' && (
            <Card className="border border-emerald-100 shadow-sm">
              <CardHeader className="bg-emerald-50/50 flex flex-row items-center justify-between py-4 px-6 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                  <Landmark className="w-8 h-8 text-emerald-600" />
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Bank Transfer Details</h2>
                    <p className="text-xs text-emerald-600 font-semibold">Manual Deposit & Bank Handoff Instructions</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.bank.enabled}
                    onChange={(e) => updateGatewayField('bank', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Bank Name</label>
                    <Input
                      placeholder="e.g. Sonali Bank PLC"
                      value={paymentSettings.bank.bank_name || ''}
                      onChange={(e) => updateGatewayField('bank', 'bank_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Branch Name</label>
                    <Input
                      placeholder="e.g. Dhaka Main Branch"
                      value={paymentSettings.bank.branch || ''}
                      onChange={(e) => updateGatewayField('bank', 'branch', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Account Holder Name</label>
                    <Input
                      placeholder="e.g. NextHire Ltd."
                      value={paymentSettings.bank.account_name || ''}
                      onChange={(e) => updateGatewayField('bank', 'account_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Account Number</label>
                    <Input
                      placeholder="e.g. 1234567890123"
                      value={paymentSettings.bank.account_number || ''}
                      onChange={(e) => updateGatewayField('bank', 'account_number', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Routing Number</label>
                    <Input
                      placeholder="9-digit Routing Number"
                      value={paymentSettings.bank.routing_number || ''}
                      onChange={(e) => updateGatewayField('bank', 'routing_number', e.target.value)}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-tr from-gray-900 to-primary-950 text-white shadow-xl border-0">
            <CardBody className="p-6 space-y-4">
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Multi-Gateway Config</h3>
                <p className="text-xs text-primary-200 mt-1 leading-relaxed">
                  Super Admin has centralized access control over all payment streams.
                  You can enable, disable, or transition active channels instantly.
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-primary-200">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  Active gateways show dynamically to users.
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                  Sandbox credentials prevent live debiting.
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border border-gray-100 bg-gray-50/50 shadow-sm">
            <CardHeader className="py-4 px-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">System Webhook Urn</h3>
            </CardHeader>
            <CardBody className="p-6 space-y-3">
              <div>
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">bKash Webhook Callback</span>
                <code className="block p-2 bg-white border border-gray-200 rounded text-xs font-mono break-all text-gray-700">
                  http://localhost:8001/api/v1/payments/bkash/callback
                </code>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">SSLCommerz Instant IPN</span>
                <code className="block p-2 bg-white border border-gray-200 rounded text-xs font-mono break-all text-gray-700">
                  http://localhost:8001/api/v1/payments/sslcommerz/callback
                </code>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
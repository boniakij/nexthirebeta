'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

interface Interview {
  id: number;
  trainer_id: number;
  student_id: number;
  package_id: number;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
}

interface Package {
  id: number;
  title: string;
  price: number;
  domain: string;
}

interface Trainer {
  id: number;
  full_name: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const interviewId = searchParams.get('interview_id');

  const [interview, setInterview] = useState<Interview | null>(null);
  const [package_, setPackage] = useState<Package | null>(null);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'sslcommerz' | 'bkash' | 'stripe'>('sslcommerz');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/auth/login');
      return;
    }

    if (!interviewId) {
      router.push('/student');
      return;
    }

    // TODO: Fetch interview and package details from API
    setLoading(false);
  }, [isAuthenticated, user, router, interviewId]);

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      if (!interview || !package_) {
        setError('Missing interview or package details');
        return;
      }

      // TODO: Call payment initiation API
      // The API will return a payment URL from the gateway
      // We then redirect to that URL for payment processing

      alert(`Initiating payment with ${selectedGateway}...`);
      // Example: window.location.href = paymentUrl;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Payment failed';
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading payment details...</div>
      </div>
    );
  }

  if (!interview || !package_) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">Interview details not found</p>
            <Link href="/student" className="text-blue-600 hover:underline">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-blue-600">Complete Payment</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Payment Steps */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">Booking Confirmed</span>
          </div>

          <div className="flex-1 h-1 mx-4 bg-blue-600"></div>

          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">Payment</span>
          </div>

          <div className="flex-1 h-1 mx-4 bg-gray-300"></div>

          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
              3
            </div>
            <span className="ml-3 text-sm font-medium text-gray-500">Confirmed</span>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h2>

          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600">Package</span>
              <span className="font-medium text-gray-900">{package_.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Domain</span>
              <span className="font-medium text-gray-900">{package_.domain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium text-gray-900">{interview.duration_minutes} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Scheduled</span>
              <span className="font-medium text-gray-900">
                {new Date(interview.scheduled_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">₹{package_.price}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3 mb-6">
            {[
              { id: 'sslcommerz', name: 'SSLCommerz', icon: '💳', desc: 'Credit/Debit Card, Mobile Banking (BD)' },
              { id: 'bkash', name: 'bKash', icon: '📱', desc: 'Mobile Wallet (Bangladesh)' },
              { id: 'stripe', name: 'Stripe', icon: '💰', desc: 'International Credit/Debit Card' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedGateway(method.id as any)}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  selectedGateway === method.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.desc}</p>
                  </div>
                  {selectedGateway === method.id && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You will be redirected to {selectedGateway} to complete the payment securely.
              Your interview slot will be confirmed once payment is successful.
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-lg"
          >
            {processing ? 'Processing...' : `Pay ₹${package_.price} Now`}
          </button>
        </div>

        {/* Security Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">🔒 Secure Payment</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ All payments are encrypted and secure</li>
            <li>✓ Your financial information is never stored on our servers</li>
            <li>✓ PCI DSS compliant payment processing</li>
            <li>✓ 100% safe and trusted payment gateways</li>
          </ul>
        </div>

        {/* Cancel Link */}
        <div className="text-center mt-8">
          <Link href="/student" className="text-gray-600 hover:text-gray-900 underline">
            Cancel and return to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    // Auto-redirect to interview in 5 seconds
    const timer = setTimeout(() => {
      if (paymentId) {
        router.push(`/student/interviews?payment_id=${paymentId}`);
      } else {
        router.push('/student');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, paymentId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-4xl">✓</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your interview booking has been confirmed. Check your email for confirmation details.
        </p>

        {/* Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Payment ID</p>
              <p className="font-mono font-semibold text-gray-900">{paymentId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-semibold text-green-600">Confirmed</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href="/student"
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/student/interviews"
            className="block w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            View Your Interviews
          </Link>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-xs text-gray-500 mt-6">
          Redirecting in 5 seconds...
        </p>
      </div>
    </div>
  );
}

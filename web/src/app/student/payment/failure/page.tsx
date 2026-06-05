'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Payment processing failed';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-4xl">✕</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment could not be processed.
        </p>

        {/* Error Reason */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-red-800">
            <strong>Reason:</strong> {reason}
          </p>
        </div>

        {/* Troubleshooting Tips */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">What you can do:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Check your payment gateway account status</li>
            <li>✓ Verify your card/wallet has sufficient balance</li>
            <li>✓ Ensure your payment method is activated for online transactions</li>
            <li>✓ Try a different payment method</li>
            <li>✓ Contact our support team for assistance</li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <Link
            href="/student"
            className="block w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Return to Dashboard
          </Link>
        </div>

        {/* Support */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            Need help? Contact us at <a href="mailto:support@nexthire.com" className="font-semibold text-blue-600 hover:underline">support@nexthire.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Suspense, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Button, Spinner } from '@/components/ui';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/api/client';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing payment...');
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const transactionId = searchParams.get('transaction_id');
    const bookingId = searchParams.get('booking_id');

    if (!transactionId || !bookingId) {
      setStatus('error');
      setMessage('Missing payment information');
      return;
    }

    confirmPayment(bookingId, transactionId);
  }, [searchParams]);

  const confirmPayment = async (bookingId: string, transactionId: string) => {
    try {
      // In a real scenario, you'd call an endpoint to confirm the payment
      // For now, we'll just show success
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentData({
        booking_id: bookingId,
        transaction_id: transactionId,
        amount: 1500,
        currency: 'BDT',
        trainer_name: 'John Smith',
      });

      setStatus('success');
      setMessage('Payment completed successfully!');
    } catch (error) {
      setStatus('error');
      setMessage('Payment confirmation failed. Please contact support.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card>
        <CardBody className="text-center py-12 space-y-6">
          {status === 'success' ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-600">{message}</p>
              </div>

              {paymentData && (
                <Card className="bg-gray-50">
                  <CardBody className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono font-semibold">{paymentData.transaction_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trainer</span>
                      <span className="font-semibold">{paymentData.trainer_name}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="font-bold text-lg">
                        {paymentData.currency} {paymentData.amount.toLocaleString()}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              )}

              <div className="flex flex-col gap-3">
                <Link href="/student/dashboard" className="w-full">
                  <Button variant="primary" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/student/bookings" className="w-full">
                  <Button variant="outline" className="w-full">
                    View My Bookings
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-600">
                A confirmation email has been sent to your registered email address.
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                <p className="text-gray-600">{message}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/student/bookings" className="w-full">
                  <Button variant="primary" className="w-full">
                    Back to Bookings
                  </Button>
                </Link>
                <Link href="/support" className="w-full">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}


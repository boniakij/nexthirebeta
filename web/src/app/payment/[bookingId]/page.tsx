'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Spinner, Badge } from '@/components/ui';
import { CreditCard, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';

interface PaymentData {
  booking_id: number;
  amount: number;
  currency: string;
  payment_status: string;
  trainer_name: string;
  package_title: string;
}

interface PaymentGateway {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const gateways: PaymentGateway[] = [
  {
    id: 'bkash',
    name: 'bKash',
    icon: '📱',
    description: 'Mobile payment service',
  },
  {
    id: 'nagad',
    name: 'Nagad',
    icon: '💳',
    description: 'Digital payment platform',
  },
  {
    id: 'sslcommerz',
    name: 'Credit/Debit Card',
    icon: '🏦',
    description: 'Visa, Mastercard via SSLCommerz',
  },
];

export default function PaymentPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string>('bkash');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaymentData();
  }, [params.bookingId]);

  const fetchPaymentData = async () => {
    try {
      const response = await apiClient.get(`/bookings/${params.bookingId}`);
      if (response.data?.success) {
        setPaymentData(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async () => {
    if (!paymentData) return;

    setProcessing(true);
    setError('');

    try {
      const response = await apiClient.post('/payments/initiate', {
        booking_id: paymentData.booking_id,
        payment_method: selectedGateway,
      });

      if (response.data?.success) {
        // Redirect to payment gateway
        const gateway_url = response.data.data.gateway_url;
        window.location.href = gateway_url;
      } else {
        setError(response.data?.message || 'Failed to initiate payment');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment initiation failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardBody className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error || 'Payment data not found'}</p>
            <Link href="/student/bookings">
              <Button variant="primary" className="mt-4">
                Back to Bookings
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      <div>
        <Link href={`/bookings/${paymentData.booking_id}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Booking
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
      </div>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">Payment Summary</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Trainer</span>
            <span className="font-semibold text-gray-900">{paymentData.trainer_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Package</span>
            <span className="font-semibold text-gray-900">{paymentData.package_title}</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-primary-600">
              {paymentData.currency} {paymentData.amount.toLocaleString()}
            </span>
          </div>
          <Badge variant={paymentData.payment_status === 'completed' ? 'success' : 'warning'}>
            {paymentData.payment_status.toUpperCase()}
          </Badge>
        </CardBody>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">Select Payment Method</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {gateways.map((gateway) => (
            <div
              key={gateway.id}
              onClick={() => setSelectedGateway(gateway.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedGateway === gateway.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{gateway.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{gateway.name}</p>
                  <p className="text-sm text-gray-600">{gateway.description}</p>
                </div>
                {selectedGateway === gateway.id && (
                  <Check className="w-5 h-5 text-primary-600" />
                )}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Payment Button */}
      <div className="flex gap-3">
        <Link href={`/bookings/${paymentData.booking_id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
        </Link>
        <Button
          variant="primary"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={handleInitiatePayment}
          loading={processing}
        >
          <CreditCard className="w-5 h-5" />
          Proceed to Payment
        </Button>
      </div>

      {/* Security Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          🔒 Your payment is secure and encrypted. We never store your card details.
        </p>
      </div>
    </div>
  );
}

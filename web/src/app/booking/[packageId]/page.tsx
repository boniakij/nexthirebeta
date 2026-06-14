'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody, Button, Badge, Spinner, Input } from '@/components/ui';
import { ArrowLeft, Check, Calendar, CreditCard, FileText, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';

type Step = 'package' | 'slot' | 'payment' | 'confirmation';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.packageId;

  const [currentStep, setCurrentStep] = useState<Step>('package');
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [availableSlots, setAvailableSlots] = useState<any[]>([
    { id: 1, date: '2026-06-20', time: '14:00', available: true },
    { id: 2, date: '2026-06-20', time: '15:00', available: true },
    { id: 3, date: '2026-06-20', time: '16:00', available: false },
    { id: 4, date: '2026-06-21', time: '14:00', available: true },
    { id: 5, date: '2026-06-21', time: '15:00', available: true },
    { id: 6, date: '2026-06-22', time: '14:00', available: false },
    { id: 7, date: '2026-06-22', time: '16:00', available: true },
  ]);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axios.get(`/api/interview-packages/${packageId}`);
        setPkg(res.data?.data || getMockPackage());
      } catch (err) {
        setPkg(getMockPackage());
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackage();
    }
  }, [packageId]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      const res = await axios.post(
        `/api/interview-bookings`,
        {
          package_id: packageId,
          slot_id: selectedSlot?.id,
          payment_method: paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.data?.id) {
        setBookingId(res.data.data.id);
        setCurrentStep('confirmation');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !pkg) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Package Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href={`/packages/${packageId}`} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Package
        </Link>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex justify-between mb-8">
            {(['package', 'slot', 'payment', 'confirmation'] as Step[]).map((step, idx) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                    currentStep === step
                      ? 'bg-primary-600 text-white'
                      : ['package', 'slot', 'payment', 'confirmation'].indexOf(currentStep) > idx
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {['package', 'slot', 'payment', 'confirmation'].indexOf(currentStep) > idx ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-700 text-center capitalize">
                  {step === 'package' && 'Select Package'}
                  {step === 'slot' && 'Pick Time Slot'}
                  {step === 'payment' && 'Payment'}
                  {step === 'confirmation' && 'Confirmed'}
                </p>
                {idx < 3 && <div className="absolute w-12 h-1 bg-gray-200 ml-5 -z-10" style={{ width: '100%', marginLeft: '2.5rem', top: '20px' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Package Selection */}
        {currentStep === 'package' && (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Select Package</h2>
              <Card className="mb-6">
                <CardBody>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge className="mb-3 capitalize">{pkg.difficulty_level}</Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                      <p className="text-gray-600">{pkg.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-lg font-bold text-gray-900">{pkg.session_duration}m</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sessions</p>
                      <p className="text-lg font-bold text-gray-900">{pkg.number_of_sessions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Validity</p>
                      <p className="text-lg font-bold text-gray-900">{pkg.package_validity}d</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">What's Included</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Mock Interviews', included: pkg.includes_mock_interview },
                    { name: 'CV Review', included: pkg.includes_cv_review },
                    { name: 'Career Guidance', included: pkg.includes_career_guideline },
                  ].map(item => (
                    <div key={item.name} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 ${item.included ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={item.included ? 'text-gray-900' : 'text-gray-400'}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardBody>
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 mb-2">Total Price</p>
                    <div className="text-4xl font-bold text-gray-900">৳{pkg.price?.toLocaleString()}</div>
                    <p className="text-sm text-gray-600 mt-2">One-time payment</p>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setCurrentStep('slot')}
                  >
                    Next: Pick Time Slot
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Time Slot Selection */}
        {currentStep === 'slot' && (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Pick Time Slot</h2>
              <div className="space-y-4">
                {availableSlots.map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => slot.available && setSelectedSlot(slot)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSlot?.id === slot.id
                        ? 'border-primary-600 bg-primary-50'
                        : slot.available
                        ? 'border-gray-200 hover:border-primary-300'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-sm text-gray-600">{slot.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={slot.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {slot.available ? 'Available' : 'Taken'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardBody>
                  <h4 className="font-bold text-gray-900 mb-4">Selected Slot</h4>
                  {selectedSlot ? (
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Date & Time</p>
                      <p className="font-bold text-gray-900 mb-6">
                        {new Date(selectedSlot.date).toLocaleDateString()} at {selectedSlot.time}
                      </p>
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={() => setCurrentStep('payment')}
                      >
                        Next: Payment
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Select a time slot to continue</p>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full mt-3"
                    onClick={() => setCurrentStep('package')}
                  >
                    Back
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 'payment' && (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Payment</h2>

              <Card className="mb-6">
                <CardBody>
                  <h4 className="font-bold text-gray-900 mb-4">Select Payment Method</h4>
                  <div className="space-y-3">
                    {[
                      { id: 'bkash', name: 'bKash', icon: '📱' },
                      { id: 'sslcommerz', name: 'SSLCommerz', icon: '🔒' },
                      { id: 'nagad', name: 'Nagad', icon: '💳' },
                    ].map(method => (
                      <label
                        key={method.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-4 ${
                          paymentMethod === method.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-semibold text-gray-900">{method.name}</span>
                      </label>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h4 className="font-bold text-gray-900 mb-4">Order Summary</h4>
                  <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between text-gray-700">
                      <span>{pkg.title}</span>
                      <span className="font-semibold">৳{pkg.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Slot: {selectedSlot?.date} {selectedSlot?.time}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>৳{pkg.price?.toLocaleString()}</span>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Payment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardBody>
                  <CreditCard className="w-8 h-8 text-primary-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-4">Confirm Payment</h4>
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Method</p>
                    <p className="font-bold text-gray-900 capitalize">{paymentMethod}</p>
                  </div>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <Button
                    size="lg"
                    className="w-full mb-3"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setCurrentStep('slot')}
                  >
                    Back
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 'confirmation' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600">Your interview session has been successfully booked</p>
            </div>

            <Card className="mb-6">
              <CardBody>
                <h4 className="font-bold text-gray-900 mb-4">Booking Details</h4>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-mono font-bold text-gray-900">{bookingId}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Package</span>
                    <span className="font-bold text-gray-900">{pkg.title}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-bold text-gray-900">{selectedSlot?.date} {selectedSlot?.time}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-bold text-green-600">৳{pkg.price?.toLocaleString()}</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardBody className="text-center">
                  <FileText className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">Download Invoice</h4>
                  <Button variant="outline" size="sm" className="w-full">
                    Download PDF
                  </Button>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="text-center">
                  <LinkIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">Session Link</h4>
                  <Button variant="outline" size="sm" className="w-full">
                    Copy Link
                  </Button>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="text-center">
                  <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">Add to Calendar</h4>
                  <Button variant="outline" size="sm" className="w-full">
                    Add Event
                  </Button>
                </CardBody>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/student/interview-sessions">
                <Button size="lg" className="mb-4">
                  View My Bookings
                </Button>
              </Link>
              <p className="text-gray-600">
                Check your email for confirmation details and session instructions
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getMockPackage() {
  return {
    id: 1,
    title: 'Beginner Interview Prep',
    category: 'Technical',
    difficulty_level: 'beginner',
    description: 'Get started with interview preparation basics',
    price: 2000,
    session_duration: 30,
    number_of_sessions: 3,
    package_validity: 90,
    includes_mock_interview: true,
    includes_cv_review: true,
    includes_career_guideline: false,
  };
}

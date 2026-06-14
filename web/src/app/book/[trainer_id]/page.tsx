'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody, CardHeader, Button, Badge } from '@/components/ui';
import { trainerApi } from '@/lib/api/trainer';
import { bookingApi } from '@/lib/api/booking';
import { paymentApi } from '@/lib/api/payment';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

type BookingStep = 1 | 2 | 3;

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const trainerId = parseInt(params.trainer_id as string);
  const packageId = parseInt(searchParams.get('package') || '1');

  const [step, setStep] = useState<BookingStep>(1);
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('sslcommerz');
  const [loading, setLoading] = useState(true);

  // Set default selectedDate to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    setSelectedDate(dateString);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await trainerApi.getTrainer(trainerId);
        setPackages(data.data?.packages || []);
        setSelectedPackage(data.data?.packages?.[0]);
      } catch (error) {
        // Use mock data
        setPackages(getMockPackages());
        setSelectedPackage(getMockPackages()[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trainerId]);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailability = async () => {
      try {
        const { data } = await trainerApi.getAvailability(trainerId, selectedDate);
        setAvailabilitySlots(data.data || []);
      } catch (error) {
        console.error('Failed to fetch availability:', error);
        setAvailabilitySlots([]);
      }
    };

    fetchAvailability();
  }, [trainerId, selectedDate]);

  const formatTimeSlot = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedPackage) {
      alert('Please select a package');
      return;
    }
    if (step === 2 && (!selectedDate || !selectedTime)) {
      alert('Please select a date and time');
      return;
    }
    if (step < 3) {
      setStep((step + 1) as BookingStep);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as BookingStep);
    }
  };

  const handleConfirmBooking = async () => {
    // This would call the booking API
    router.push('/booking/confirmed');
  };

  const paymentMethods = [
    { id: 'sslcommerz', name: 'SSLCommerz', icon: '🇧🇩', color: 'text-primary-600' },
    { id: 'bkash', name: 'bKash', icon: '📱', color: 'text-orange-600' },
    { id: 'nagad', name: 'Nagad', icon: '📱', color: 'text-red-600' },
    { id: 'stripe', name: 'Stripe (USD)', icon: '💳', color: 'text-blue-600' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', color: 'text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    stepNum <= step
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNum < step ? '✓' : stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      stepNum < step ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Select Package</span>
            <span>Choose Date & Time</span>
            <span>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody className="space-y-6">
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Package</h2>
                    <div className="space-y-3">
                      {packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`p-4 border-2 rounded-btn cursor-pointer transition ${
                            selectedPackage?.id === pkg.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">{pkg.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <Badge variant="primary" className="text-xs">
                                  {pkg.session_count} sessions
                                </Badge>
                                <Badge variant="success" className="text-xs">
                                  {pkg.duration_minutes}m each
                                </Badge>
                                {pkg.includes_cv_review && (
                                  <Badge variant="purple" className="text-xs">
                                    CV Review
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-2xl font-bold text-primary-600">৳{pkg.price}</p>
                              <p className="text-xs text-gray-500">total</p>
                            </div>
                          </div>
                          {selectedPackage?.id === pkg.id && (
                            <div className="flex items-center justify-end mt-3 text-primary-600">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Date & Time</h2>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Select a Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600 mb-6"
                      />

                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {availableTimeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 border-2 rounded-btn transition ${
                              selectedTime === time
                                ? 'border-primary-600 bg-primary-50 text-primary-600 font-semibold'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`p-4 border-2 rounded-btn cursor-pointer transition ${
                            paymentMethod === method.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="payment"
                              value={method.id}
                              checked={paymentMethod === method.id}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-4 h-4"
                            />
                            <span className={`text-2xl ${method.color}`}>{method.icon}</span>
                            <span className="font-semibold text-gray-900">{method.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={step === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {step < 3 ? (
                    <Button onClick={handleNextStep} className="flex items-center gap-2">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleConfirmBooking} variant="primary">
                      Pay Now
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <h3 className="font-bold text-gray-900">Order Summary</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {selectedPackage && (
                  <>
                    <div className="space-y-3 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Package</p>
                        <p className="font-semibold text-gray-900">{selectedPackage.title}</p>
                      </div>
                      {selectedDate && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Date & Time</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {selectedDate} {selectedTime}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Trainer</p>
                        <p className="font-semibold text-gray-900">Expert Trainer</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-900">৳{selectedPackage.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Commission</span>
                        <span className="font-semibold text-gray-900">-৳{Math.round(selectedPackage.price * 0.1)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-primary-600 text-lg">
                          ৳{Math.round(selectedPackage.price * 0.9)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-btn p-3 text-xs text-blue-700">
                      <p className="font-semibold mb-1">Payment Note</p>
                      <p>You will be redirected to the payment gateway after clicking "Pay Now".</p>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function getMockPackages() {
  return [
    {
      id: 1,
      title: 'System Design Mastery (3 Sessions)',
      description: 'Deep dive into system design patterns',
      price: 1500,
      session_count: 3,
      duration_minutes: 60,
      includes_cv_review: true,
    },
    {
      id: 2,
      title: 'Technical Interview Prep (5 Sessions)',
      description: 'Comprehensive technical interview prep',
      price: 2000,
      session_count: 5,
      duration_minutes: 45,
      includes_cv_review: true,
    },
  ];
}

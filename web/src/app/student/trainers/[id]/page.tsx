'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

interface TrainerPackage {
  id: number;
  title: string;
  description: string;
  price: number;
  duration_minutes: number;
  interview_type: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface AvailabilitySlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface Trainer {
  id: number;
  full_name: string;
  bio: string;
  expertise_domains: string[];
  years_experience: number;
  average_rating: number;
  total_reviews: number;
  total_sessions: number;
  packages: TrainerPackage[];
}

export default function TrainerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const trainerId = params.id as string;

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/auth/login');
      return;
    }

    // TODO: Fetch trainer details and availability from API
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const handleBooking = async () => {
    if (!selectedPackage || !selectedSlot) {
      alert('Please select a package and time slot');
      return;
    }

    // TODO: Call booking API
    alert('Booking initiated! Redirecting to payment...');
    // router.push(`/student/payment?interview_id=${interviewId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading trainer details...</div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/student" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Trainers
          </Link>
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">Trainer not found</p>
          </div>
        </div>
      </div>
    );
  }

  const pkg = trainer.packages.find((p) => p.id === selectedPackage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/student" className="text-blue-600 hover:underline">
            ← Back to Trainers
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trainer Profile Card */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trainer.full_name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.round(trainer.average_rating))}
                </div>
                <span className="text-gray-600">
                  {trainer.average_rating.toFixed(1)} ({trainer.total_reviews} reviews)
                </span>
              </div>

              {trainer.bio && (
                <p className="text-gray-700 mb-4">{trainer.bio}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="text-xl font-semibold text-blue-600">{trainer.years_experience || 'N/A'} years</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Sessions</p>
                  <p className="text-xl font-semibold text-green-600">{trainer.total_sessions}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {trainer.expertise_domains.map((domain) => (
                    <span
                      key={domain}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Interview</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Packages */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Package</h3>
              <div className="space-y-3">
                {trainer.packages.map((package_) => (
                  <button
                    key={package_.id}
                    onClick={() => {
                      setSelectedPackage(package_.id);
                      setSelectedSlot(null);
                    }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition ${
                      selectedPackage === package_.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{package_.title}</h4>
                        <p className="text-sm text-gray-600">{package_.domain}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {package_.duration_minutes} mins • {package_.difficulty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">₹{package_.price}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability & Summary */}
            <div>
              {selectedPackage ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time Slot</h3>
                  <div className="space-y-2 mb-6">
                    {availability.length > 0 ? (
                      availability
                        .filter((slot) => !slot.is_booked)
                        .map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot.id)}
                            className={`w-full p-3 text-left rounded-lg border-2 transition ${
                              selectedSlot === slot.id
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <p className="font-medium text-gray-900">{slot.date}</p>
                            <p className="text-sm text-gray-600">
                              {slot.start_time} - {slot.end_time}
                            </p>
                          </button>
                        ))
                    ) : (
                      <p className="text-gray-500 text-center py-6">No availability found</p>
                    )}
                  </div>

                  {/* Summary */}
                  {pkg && selectedSlot && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Package</span>
                          <span className="font-medium text-gray-900">{pkg.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium text-gray-900">{pkg.duration_minutes} min</span>
                        </div>
                        <div className="border-t border-gray-300 my-2"></div>
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="font-bold text-blue-600">₹{pkg.price}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowConfirm(true)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Select a package to continue</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Booking</h3>
              <p className="text-gray-600 mb-6">
                {pkg?.title} with {trainer.full_name} for ₹{pkg?.price}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

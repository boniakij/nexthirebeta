'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody, CardHeader, Button, Badge, Spinner } from '@/components/ui';
import { ArrowLeft, Clock, Users, Award, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface PackageContentProps {
  packageId: string;
}

export default function PackageContent({ packageId }: PackageContentProps) {
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axios.get(`/api/interview-packages/${packageId}`);
        setPkg(res.data?.data || getMockPackage());
        setError(null);
      } catch (err) {
        console.error('Failed to fetch package:', err);
        setPkg(getMockPackage());
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackage();
    }
  }, [packageId]);

  const handleBooking = () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      window.location.href = '/auth/login?redirect=/booking/' + packageId;
      return;
    }

    window.location.href = '/booking/' + packageId;
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Package Not Found</h1>
          <Link href="/packages">
            <Button>Back to Packages</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/packages" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Packages
        </Link>

        {/* Package Header */}
        <div className="grid lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge className="mb-3 capitalize">{pkg.difficulty_level}</Badge>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{pkg.title}</h1>
              </div>
            </div>

            <p className="text-xl text-gray-600 mb-8">
              {pkg.description || 'Professional interview preparation with personalized feedback and practice sessions.'}
            </p>

            {/* Key Features */}
            <div className="space-y-4 mb-12">
              <h3 className="text-2xl font-bold text-gray-900">What You'll Get</h3>
              <div className="grid gap-4">
                {[
                  { icon: Clock, label: 'Session Duration', value: pkg.session_duration ? `${pkg.session_duration} minutes` : '45 minutes' },
                  { icon: Users, label: 'Session Type', value: pkg.session_type === 'one_to_one' ? 'One-on-One' : 'Group Sessions' },
                  { icon: Award, label: 'Number of Sessions', value: `${pkg.number_of_sessions || 5} sessions included` },
                  { icon: CheckCircle2, label: 'Validity', value: `${pkg.package_validity || 90} days` },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">{feature.label}</p>
                      <p className="font-semibold text-gray-900">{feature.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Includes */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Package Includes</h3>
              <div className="grid gap-3">
                {[
                  { included: pkg.includes_mock_interview !== false, label: 'Mock Interview Sessions' },
                  { included: pkg.includes_cv_review !== false, label: 'CV/Resume Review' },
                  { included: pkg.includes_career_guideline !== false, label: 'Career Guidance' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${item.included ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={item.included ? 'text-gray-900 font-medium' : 'text-gray-400'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            {pkg.days_of_week && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Session Schedule</h3>
                <div className="p-6 bg-blue-50 rounded-lg">
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold">Days:</span> {typeof pkg.days_of_week === 'string' ? pkg.days_of_week : JSON.stringify(pkg.days_of_week).replace(/[\[\]"]/g, '').replace(/,/g, ', ')}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Time:</span> {pkg.session_time} ({pkg.timezone || 'UTC'})
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardBody>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ৳{pkg.price?.toLocaleString() || '0'}
                  </div>
                  {pkg.discount_price && (
                    <p className="text-sm text-gray-500 line-through">
                      ৳{pkg.discount_price.toLocaleString()}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">per {pkg.session_type === 'one_to_one' ? 'session' : 'month'}</p>
                </div>

                <Button
                  size="lg"
                  className="w-full mb-4"
                  onClick={handleBooking}
                >
                  Book Now
                </Button>

                <Button variant="outline" size="lg" className="w-full mb-6">
                  Chat with Trainer
                </Button>

                <div className="p-4 bg-gray-50 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Valid until:</span> {pkg.end_date ? new Date(pkg.end_date).toLocaleDateString() : 'Ongoing'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Enrollments are auto-renewed unless cancelled
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Money-back guarantee</p>
                  <p>✓ Flexible scheduling</p>
                  <p>✓ Expert trainers</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Trainer Info */}
        {pkg.trainer && (
          <div className="border-t border-gray-200 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">About Your Trainer</h3>
            <Card>
              <CardBody className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{pkg.trainer.full_name}</h4>
                  <p className="text-gray-600 mb-4">
                    {pkg.trainer.bio || 'Expert trainer with years of experience in interview preparation.'}
                  </p>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-bold text-gray-900">{pkg.trainer.years_of_experience || 5}+ years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="font-bold text-gray-900">⭐ {pkg.trainer.rating || 5.0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Students</p>
                      <p className="font-bold text-gray-900">{pkg.trainer.total_students || 100}+</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function getMockPackage() {
  return {
    id: 2,
    uuid: 'uuid-2',
    title: 'Intermediate Interview Prep',
    category: 'Technical',
    interview_type: 'mock_interview',
    difficulty_level: 'intermediate',
    language: 'English',
    description: 'Intermediate level interview preparation course with comprehensive mock interviews and personalized feedback.',
    short_description: 'Intermediate level interview preparation',
    number_of_sessions: 5,
    price: 3500,
    discount_price: null,
    session_duration: 45,
    package_validity: 90,
    max_students: 10,
    session_type: 'one_to_one',
    days_of_week: ['monday', 'wednesday', 'friday'],
    session_time: '14:00',
    timezone: 'Asia/Dhaka',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    repeat_weekly: true,
    includes_cv_review: true,
    includes_career_guideline: true,
    includes_mock_interview: true,
    status: 'active',
    total_bookings: 0,
    trainer: {
      id: 1,
      full_name: 'Dr. Arjun Kumar',
      bio: 'Senior Software Engineer with 8+ years of experience in system design and backend development.',
      years_of_experience: 8,
      rating: 4.9,
      total_students: 150,
    },
  };
}

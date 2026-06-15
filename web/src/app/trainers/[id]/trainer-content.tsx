'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Badge, Button, StarRating, Skeleton } from '@/components/ui';
import { trainerApi } from '@/lib/api/trainer';
import { Share2, Briefcase, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

interface TrainerContentProps {
  trainerId: string;
}

export default function TrainerProfileContent({ trainerId }: TrainerContentProps) {
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const { data } = await trainerApi.getTrainer(parseInt(trainerId));
        setTrainer(data.data);
      } catch (error) {
        console.error('Failed to fetch trainer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [trainerId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton height={300} className="w-full" />
        <Skeleton height={200} className="w-full" />
        <Skeleton height={200} className="w-full" />
      </div>
    );
  }

  const mockTrainer = {
    id: parseInt(trainerId),
    full_name: 'Arjun Kumar',
    bio: 'Expert software architect with 12+ years of experience in system design and backend development. Trained 500+ candidates, 85% success rate in FAANG interviews.',
    expertise_domains: ['System Design', 'Backend', 'Architecture'],
    years_experience: 12,
    average_rating: 4.9,
    total_reviews: 142,
    total_sessions: 245,
    is_approved: true,
    certifications: [
      { name: 'AWS Solutions Architect', issuer: 'Amazon', year: 2021 },
      { name: 'Google Cloud Professional', issuer: 'Google', year: 2022 },
    ],
    packages: [
      {
        id: 1,
        title: 'System Design Mastery (3 Sessions)',
        description: 'Deep dive into system design patterns and real-world scenarios',
        price: 1500,
        session_count: 3,
        duration_minutes: 60,
        difficulty: 'advanced',
        includes_cv_review: true,
      },
      {
        id: 2,
        title: 'Technical Interview Prep (5 Sessions)',
        description: 'Comprehensive technical interview preparation',
        price: 2000,
        session_count: 5,
        duration_minutes: 45,
        difficulty: 'intermediate',
        includes_cv_review: true,
      },
    ],
  };

  const displayTrainer = trainer ? {
    ...mockTrainer,
    ...trainer,
    certifications: trainer.certifications && Array.isArray(trainer.certifications) ? trainer.certifications : [],
    packages: trainer.packages && Array.isArray(trainer.packages) ? trainer.packages : mockTrainer.packages,
    expertise_domains: trainer.expertise_domains && Array.isArray(trainer.expertise_domains) ? trainer.expertise_domains : mockTrainer.expertise_domains,
  } : mockTrainer;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-purple-400 rounded-full flex-shrink-0 flex items-center justify-center text-white text-4xl">
              {displayTrainer.full_name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{displayTrainer.full_name}</h1>
                  {displayTrainer.is_approved && (
                    <Badge variant="success" className="mt-2">
                      ✓ Verified Trainer
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <StarRating rating={displayTrainer.average_rating || 5} />
                  <p className="text-sm text-gray-600 mt-1">
                    {displayTrainer.total_reviews || 0} reviews
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase className="w-5 h-5 text-primary-600" />
                  <span>{displayTrainer.years_experience || 10}+ years experience</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <span>{displayTrainer.total_sessions || 200}+ sessions</span>
                </div>
              </div>

              {displayTrainer.expertise_domains && (
                <div className="flex flex-wrap gap-2">
                  {displayTrainer.expertise_domains.map((domain: string) => (
                    <Badge key={domain} variant="primary">
                      {domain}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">About</h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700 leading-relaxed">{displayTrainer.bio}</p>
        </CardBody>
      </Card>

      {/* Certifications */}
      {displayTrainer.certifications && displayTrainer.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Certifications & Experience</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {displayTrainer.certifications.map((cert: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{cert.name}</p>
                    <p className="text-sm text-gray-600">
                      {cert.issuer} • {cert.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Packages */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">Interview Packages</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {displayTrainer.packages?.map((pkg: any) => (
              <div
                key={pkg.id}
                className="p-4 border border-gray-200 rounded-btn hover:shadow-card-hover transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{pkg.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                  </div>
                  <Badge variant={pkg.difficulty === 'advanced' ? 'danger' : 'primary'}>
                    {pkg.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-t border-b border-gray-100 mb-3">
                  <div>
                    <p className="text-xs text-gray-600">Sessions</p>
                    <p className="font-semibold text-gray-900">{pkg.session_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">{pkg.duration_minutes}m</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">CV Review</p>
                    <p className="font-semibold text-gray-900">{pkg.includes_cv_review ? '✓' : '✗'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Price</p>
                    <p className="font-semibold text-primary-600">৳{pkg.price.toLocaleString()}</p>
                  </div>
                </div>

                <Link href={`/book/${displayTrainer.id}?package=${pkg.id}`}>
                  <Button variant="primary" className="w-full sm:w-auto">
                    Book This Package
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Student {i}</p>
                  <StarRating rating={4.5 + i * 0.1} size="sm" />
                </div>
                <p className="text-gray-700 text-sm">
                  Excellent trainer! Very knowledgeable and patient. Helped me crack the system design interview at Google.
                </p>
                <p className="text-xs text-gray-500 mt-2">{i} months ago</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

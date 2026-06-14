'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Button } from '@/components/ui';
import { Star, MapPin, Globe, Mail, Loader } from 'lucide-react';

interface Trainer {
  id: number;
  full_name: string;
  display_name: string;
  profile_photo_url: string;
  professional_title: string;
  location: string;
  languages: any[];
  bio: string;
  booking_value_statement: string;
  years_experience: number;
  current_company: string;
  expertise_domains: string[];
  target_student_levels: string[];
  social_links: any[];
  average_rating: number;
  total_sessions: number;
  hourly_rate: number;
  experiences: any[];
  certifications: any[];
  packages: any[];
}

export default function TrainerPublicProfile({ params }: { params: { id: string } }) {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await fetch(`/api/v1/trainers/${params.id}/profile`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to load profile');

        setTrainer(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [params.id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader className="w-8 h-8 animate-spin" /></div>;
  if (error) return <div className="max-w-4xl mx-auto py-8"><div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div></div>;
  if (!trainer) return <div className="max-w-4xl mx-auto py-8"><div className="text-center text-gray-600">Trainer not found</div></div>;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex gap-6">
            {trainer.profile_photo_url && (
              <img src={trainer.profile_photo_url} alt={trainer.display_name} className="w-32 h-32 rounded-full object-cover" />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{trainer.display_name}</h1>
              <p className="text-xl text-gray-600">{trainer.professional_title}</p>

              <div className="flex gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{trainer.average_rating.toFixed(1)} ({trainer.total_sessions} sessions)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{trainer.location}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-700">
                  {trainer.languages?.map(l => l.name).join(', ')}
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  Starting from ৳{trainer.hourly_rate}
                </p>
              </div>

              <Button variant="primary" className="mt-4">Book Session</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* About */}
      <Card>
        <CardHeader><h2 className="font-bold text-lg">About</h2></CardHeader>
        <CardBody className="space-y-4">
          <div>
            <p className="text-gray-700">{trainer.bio}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Why book a session with me?</h3>
            <p className="text-gray-700">{trainer.booking_value_statement}</p>
          </div>
        </CardBody>
      </Card>

      {/* Expertise */}
      <Card>
        <CardHeader><h2 className="font-bold text-lg">Expertise</h2></CardHeader>
        <CardBody className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {trainer.expertise_domains?.map((domain, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{domain}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Target Student Levels</h3>
            <p className="text-gray-700">{trainer.target_student_levels?.join(', ')}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Experience</h3>
            <p className="text-gray-700">{trainer.years_experience}+ years at {trainer.current_company}</p>
          </div>
        </CardBody>
      </Card>

      {/* Experience */}
      {trainer.experiences?.length > 0 && (
        <Card>
          <CardHeader><h2 className="font-bold text-lg">Work Experience</h2></CardHeader>
          <CardBody className="space-y-4">
            {trainer.experiences.map((exp, i) => (
              <div key={i} className="border-b pb-3 last:border-b-0">
                <h3 className="font-semibold">{exp.job_title}</h3>
                <p className="text-gray-600">{exp.company_name}</p>
                <p className="text-sm text-gray-500">{exp.start_date} - {exp.end_date || 'Present'}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Certifications */}
      {trainer.certifications?.length > 0 && (
        <Card>
          <CardHeader><h2 className="font-bold text-lg">Certifications</h2></CardHeader>
          <CardBody className="space-y-4">
            {trainer.certifications.map((cert, i) => (
              <div key={i} className="border-b pb-3 last:border-b-0">
                <h3 className="font-semibold">{cert.certification_name}</h3>
                <p className="text-gray-600">{cert.issuing_organization}</p>
                <p className="text-sm text-gray-500">Issued: {cert.issue_date}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Packages */}
      {trainer.packages?.length > 0 && (
        <Card>
          <CardHeader><h2 className="font-bold text-lg">Available Packages</h2></CardHeader>
          <CardBody className="space-y-4">
            {trainer.packages.map((pkg, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-semibold">{pkg.title}</h3>
                <p className="text-gray-600">{pkg.session_duration} minutes</p>
                <p className="text-lg font-bold text-blue-600 mt-2">৳{pkg.price}</p>
                <Button variant="outline" className="mt-3 w-full">View & Book</Button>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

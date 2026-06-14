'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { Edit, Save, X, Download, Upload, FileText, Star, Users, TrendingUp, Award } from 'lucide-react';

interface TrainerProfile {
  id: number;
  user_email: string;
  full_name: string;
  bio: string;
  expertise: string[];
  qualifications: string[];
  hourly_rate: number;
  experience_years: number;
  total_sessions: number;
  average_rating: number;
  total_reviews: number;
  total_earnings: number;
  resume_url?: string;
  profile_photo?: string;
  certifications?: string[];
  languages?: string[];
  created_at: string;
}

const mockTrainerProfile: TrainerProfile = {
  id: 1,
  user_email: 'john.smith@nexthire.com',
  full_name: 'John Smith',
  bio: 'Experienced IELTS trainer with 10+ years of teaching English to international students.',
  expertise: ['IELTS', 'English', 'Writing', 'Speaking'],
  qualifications: ['Bachelor in English Literature', 'IELTS Certified', 'TEFL Certified'],
  hourly_rate: 50,
  experience_years: 10,
  total_sessions: 250,
  average_rating: 4.8,
  total_reviews: 145,
  total_earnings: 12500,
  resume_url: 'john_smith_resume.pdf',
  profile_photo: 'https://via.placeholder.com/150',
  certifications: ['IELTS', 'TEFL', 'CELTA'],
  languages: ['English', 'Spanish', 'French'],
  created_at: '2026-03-15',
};

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<TrainerProfile>>({});

  useEffect(() => {
    // TODO: Replace with actual API call
    // const { data } = await trainerApi.getProfile();

    // Mock data
    setTimeout(() => {
      setProfile(mockTrainerProfile);
      setEditData(mockTrainerProfile);
      setLoading(false);
    }, 500);
  }, []);

  const handleEdit = () => {
    setIsEditMode(true);
    setEditData(profile || {});
  };

  const handleSave = async () => {
    // TODO: Call API to save profile
    if (profile) {
      setProfile({ ...profile, ...editData });
    }
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditData(profile || {});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{profile.full_name}</h1>
          <p className="text-gray-600 mt-2">{profile.user_email}</p>
        </div>
        <div className="flex gap-2">
          {!isEditMode ? (
            <Button variant="primary" className="flex items-center gap-2" onClick={handleEdit}>
              <Edit className="w-5 h-5" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="primary" className="flex items-center gap-2 bg-green-600 hover:bg-green-700" onClick={handleSave}>
                <Save className="w-5 h-5" />
                Save
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleCancel}>
                <X className="w-5 h-5" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Resume Section (Prominent) */}
      <Card className="border-2 border-primary-200 bg-primary-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary-600" />
              Resume
            </h2>
            {!isEditMode && (
              <Button variant="primary" className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Resume
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {profile.resume_url ? (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{profile.resume_url}</p>
                    <p className="text-sm text-gray-600">PDF Document</p>
                    <Button variant="outline" className="mt-2 text-sm flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {!isEditMode && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Resume Preview</h3>
                  <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-2" />
                      <p>PDF Preview</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No resume uploaded yet</p>
              <Button variant="primary" className="mt-4 flex items-center gap-2 mx-auto">
                <Upload className="w-5 h-5" />
                Upload Resume
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 flex items-center gap-1">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  {profile.average_rating}
                </p>
                <p className="text-xs text-gray-500 mt-1">({profile.total_reviews} reviews)</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div>
              <p className="text-gray-600 text-sm">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{profile.total_sessions}</p>
              <p className="text-xs text-gray-500 mt-1">Students trained</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div>
              <p className="text-gray-600 text-sm">Experience</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{profile.experience_years}+</p>
              <p className="text-xs text-gray-500 mt-1">Years teaching</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div>
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${profile.total_earnings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bio */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-gray-900">About Me</h3>
          </CardHeader>
          <CardBody>
            {isEditMode ? (
              <textarea
                value={editData.bio || ''}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                rows={4}
              />
            ) : (
              <p className="text-gray-700">{profile.bio}</p>
            )}
          </CardBody>
        </Card>

        {/* Expertise */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Expertise
            </h3>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {profile.expertise.map((exp, idx) => (
                <Badge key={idx} variant="primary">
                  {exp}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Qualifications */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Qualifications
            </h3>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2">
              {profile.qualifications.map((qual, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <span className="text-primary-600">✓</span>
                  {qual}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications
            </h3>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {profile.certifications?.map((cert, idx) => (
                <Badge key={idx} variant="success">
                  {cert}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Languages
            </h3>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {profile.languages?.map((lang, idx) => (
                <Badge key={idx} variant="purple">
                  {lang}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Hourly Rate */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-gray-900">Hourly Rate</h3>
          </CardHeader>
          <CardBody>
            {isEditMode ? (
              <Input
                type="number"
                value={editData.hourly_rate || ''}
                onChange={(e) => setEditData({ ...editData, hourly_rate: parseFloat(e.target.value) })}
                className="w-full"
              />
            ) : (
              <p className="text-3xl font-bold text-primary-600">${profile.hourly_rate}/hour</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Member Since */}
      <Card>
        <CardBody>
          <p className="text-gray-600">
            Member since <span className="font-semibold text-gray-900">{profile.created_at}</span>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

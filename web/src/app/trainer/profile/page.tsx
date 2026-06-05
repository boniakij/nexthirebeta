'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { trainerApi } from '@/lib/api/trainer';
import { X, Plus } from 'lucide-react';

interface Certification {
  name: string;
  issuer: string;
  year: number;
}

interface Experience {
  company: string;
  role: string;
  years: number;
}

interface TrainerProfile {
  full_name: string;
  bio: string;
  expertise_domains: string[];
  years_experience: number;
  certifications: Certification[];
  experience: Experience[];
  hourly_rate: number;
  language: string;
}

const DOMAINS = [
  'Software Engineering',
  'Cybersecurity',
  'DevOps',
  'Data & AI',
  'HR/Behavioral',
  'Business/Finance',
  'Design',
  'Government/Viva',
];

function ProfileContent() {
  const [formData, setFormData] = useState<TrainerProfile>({
    full_name: 'Arjun Kumar',
    bio: 'Expert software architect with 12+ years of experience',
    expertise_domains: ['System Design', 'Backend'],
    years_experience: 12,
    certifications: [
      { name: 'AWS Solutions Architect', issuer: 'Amazon', year: 2021 },
    ],
    experience: [
      { company: 'Tech Corp', role: 'Senior Engineer', years: 5 },
    ],
    hourly_rate: 500,
    language: 'English',
  });

  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: new Date().getFullYear() });
  const [newExp, setNewExp] = useState({ company: '', role: '', years: 1 });
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await trainerApi.updateProfile(formData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const addCertification = () => {
    if (newCert.name && newCert.issuer) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCert],
      });
      setNewCert({ name: '', issuer: '', year: new Date().getFullYear() });
    }
  };

  const removeCertification = (idx: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== idx),
    });
  };

  const addExperience = () => {
    if (newExp.company && newExp.role) {
      setFormData({
        ...formData,
        experience: [...formData.experience, newExp],
      });
      setNewExp({ company: '', role: '', years: 1 });
    }
  };

  const removeExperience = (idx: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== idx),
    });
  };

  const toggleDomain = (domain: string) => {
    const isSelected = formData.expertise_domains.includes(domain);
    setFormData({
      ...formData,
      expertise_domains: isSelected
        ? formData.expertise_domains.filter((d) => d !== domain)
        : [...formData.expertise_domains, domain],
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900">👤 My Profile</h1>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900">Basic Information</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell students about yourself..."
              className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
              rows={4}
            />
          </div>

          <Input
            label="Years of Experience"
            type="number"
            value={formData.years_experience}
            onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) })}
          />

          <Input
            label="Hourly Rate (BDT)"
            type="number"
            value={formData.hourly_rate}
            onChange={(e) => setFormData({ ...formData, hourly_rate: parseInt(e.target.value) })}
          />

          <Input
            label="Language"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          />
        </CardBody>
      </Card>

      {/* Expertise Domains */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900">Expertise Domains</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {DOMAINS.map((domain) => (
              <label key={domain} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.expertise_domains.includes(domain)}
                  onChange={() => toggleDomain(domain)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">{domain}</span>
              </label>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900">Certifications</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {formData.certifications.map((cert, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-btn flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{cert.name}</p>
                <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
              </div>
              <button
                onClick={() => removeCertification(idx)}
                className="p-1 hover:bg-red-100 rounded transition"
              >
                <X className="w-4 h-4 text-danger-600" />
              </button>
            </div>
          ))}

          <div className="space-y-2 pt-4 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700 block">Add Certification</label>
            <Input
              placeholder="Certification name"
              value={newCert.name}
              onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
            />
            <Input
              placeholder="Issuing organization"
              value={newCert.issuer}
              onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Year"
              value={newCert.year}
              onChange={(e) => setNewCert({ ...newCert, year: parseInt(e.target.value) })}
            />
            <Button onClick={addCertification} variant="outline" className="w-full flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add Certification
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900">Work Experience</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {formData.experience.map((exp, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-btn flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{exp.role} at {exp.company}</p>
                <p className="text-sm text-gray-600">{exp.years} {exp.years === 1 ? 'year' : 'years'}</p>
              </div>
              <button
                onClick={() => removeExperience(idx)}
                className="p-1 hover:bg-red-100 rounded transition"
              >
                <X className="w-4 h-4 text-danger-600" />
              </button>
            </div>
          ))}

          <div className="space-y-2 pt-4 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700 block">Add Experience</label>
            <Input
              placeholder="Company name"
              value={newExp.company}
              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
            />
            <Input
              placeholder="Job role"
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Years"
              min="1"
              value={newExp.years}
              onChange={(e) => setNewExp({ ...newExp, years: parseInt(e.target.value) })}
            />
            <Button onClick={addExperience} variant="outline" className="w-full flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={handleSaveProfile} loading={loading} className="flex-1">
          Save Profile
        </Button>
      </div>
    </div>
  );
}

export default function TrainerProfilePage() {
  return (
    <RoleGuard allowedRoles={['trainer']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <ProfileContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

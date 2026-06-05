'use client';

import { useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Button, Input, Badge, Spinner } from '@/components/ui';
import { ProgressBar } from '@/components/ui';
import { Upload, X } from 'lucide-react';
import Link from 'next/link';

function ProfileContent() {
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    university: 'MIT',
    department: 'Computer Science',
    graduationYear: 2024,
    preferredJobRole: 'Software Engineer',
    country: 'United States',
    linkedIn: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    resume: 'resume.pdf',
  });

  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSave = () => {
    // Save profile
    alert('Profile saved!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900">Profile Completion</h2>
        </CardHeader>
        <CardBody>
          <ProgressBar value={profileCompletion} max={100} label={`${profileCompletion}% Complete`} />
          <p className="text-sm text-gray-600 mt-3">Missing: Resume, LinkedIn URL</p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h2 className="font-bold text-gray-900">Basic Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  disabled
                />
              </div>
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </CardBody>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <h2 className="font-bold text-gray-900">Education</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="University"
                value={formData.university}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, university: e.target.value }))
                }
              />
              <Input
                label="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
              />
              <Input
                label="Graduation Year"
                type="number"
                value={formData.graduationYear}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    graduationYear: parseInt(e.target.value),
                  }))
                }
              />
            </CardBody>
          </Card>

          {/* Career Information */}
          <Card>
            <CardHeader>
              <h2 className="font-bold text-gray-900">Career Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Preferred Job Role"
                value={formData.preferredJobRole}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preferredJobRole: e.target.value,
                  }))
                }
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, country: e.target.value }))
                }
              />
              <Input
                label="LinkedIn URL"
                placeholder="linkedin.com/in/yourprofile"
                value={formData.linkedIn}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, linkedIn: e.target.value }))
                }
              />
              <Input
                label="GitHub URL"
                placeholder="github.com/yourprofile"
                value={formData.github}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, github: e.target.value }))
                }
              />
            </CardBody>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <h2 className="font-bold text-gray-900">Skills</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g., React, Python)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="primary" className="flex items-center gap-1">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Resume */}
          <Card>
            <CardHeader>
              <h2 className="font-bold text-gray-900">Resume</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-btn p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">Drag and drop your resume</p>
                <p className="text-sm text-gray-600">or click to browse (PDF, max 5MB)</p>
              </div>
              {formData.resume && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-btn">
                  <span className="text-sm font-medium text-gray-900">{formData.resume}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, resume: '' }))
                    }
                  >
                    Remove
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full">
            Save Profile
          </Button>
        </div>

        {/* Avatar Card */}
        <div>
          <Card>
            <CardBody className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-purple-400 rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-4">
                JD
              </div>
              <p className="font-semibold text-gray-900 mb-1">John Doe</p>
              <p className="text-sm text-gray-600 mb-4">Student</p>
              <Button variant="outline" className="w-full">
                Change Photo
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <RoleGuard allowedRoles={['student']}>
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

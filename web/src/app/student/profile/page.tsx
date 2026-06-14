'use client';

import { useEffect, useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Spinner, Button, Input } from '@/components/ui';
import { studentApi } from '@/lib/api/student';
import { ResumeDisplay } from './resume-display';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Zap, Trophy, Award, Edit2, Check, X } from 'lucide-react';

function StudentProfileContent() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await studentApi.getProfile();
      setStudent(data.data);
      setEditData(data.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editData) return;
    setIsSaving(true);
    try {
      await studentApi.updateProfile({
        full_name: editData.full_name,
        university: editData.university,
        department: editData.department,
        graduation_year: editData.graduation_year,
        skills: editData.skills,
        preferred_job_role: editData.preferred_job_role,
        linkedin_url: editData.linkedin_url,
        github_url: editData.github_url,
        country_code: editData.country_code,
      });
      setStudent(editData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await studentApi.uploadResume(formData);
      fetchProfile();
    } catch (error) {
      console.error('Failed to upload resume:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View your profile and resume</p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'primary'}
          className="h-11 flex items-center gap-2"
          onClick={() => {
            if (isEditing) {
              setEditData(student);
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? (
            <>
              <X className="w-5 h-5" />
              Cancel
            </>
          ) : (
            <>
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Resume (Main Focus) */}
        <div className="lg:col-span-2">
          <ResumeDisplay
            resumePath={student?.resume_path}
            fullName={student?.full_name || 'Student'}
            isOwnProfile={true}
            onUploadResume={handleResumeUpload}
          />
        </div>

        {/* Right Column - Profile Info */}
        <div className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-900">Basic Information</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
                    <Input
                      value={editData.full_name}
                      onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Email</label>
                    <Input
                      value={editData.email}
                      disabled
                      className="opacity-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-bold">
                        {student?.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{student?.full_name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Mail className="w-4 h-4" />
                        {student?.email}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          {/* Education Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-gray-900">Education</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">University</label>
                    <Input
                      value={editData.university || ''}
                      onChange={(e) => setEditData({ ...editData, university: e.target.value })}
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Department</label>
                    <Input
                      value={editData.department || ''}
                      onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                      placeholder="Department"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Graduation Year</label>
                    <Input
                      type="number"
                      value={editData.graduation_year || new Date().getFullYear()}
                      onChange={(e) => setEditData({ ...editData, graduation_year: parseInt(e.target.value) })}
                      placeholder="Year"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-600">University</p>
                    <p className="font-semibold text-gray-900">{student?.university || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold text-gray-900">{student?.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Graduation Year</p>
                    <p className="font-semibold text-gray-900">{student?.graduation_year || 'Not specified'}</p>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          {/* Career Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-gray-900">Career</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Preferred Job Role</label>
                    <Input
                      value={editData.preferred_job_role || ''}
                      onChange={(e) => setEditData({ ...editData, preferred_job_role: e.target.value })}
                      placeholder="e.g., Backend Developer"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">LinkedIn URL</label>
                    <Input
                      value={editData.linkedin_url || ''}
                      onChange={(e) => setEditData({ ...editData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">GitHub URL</label>
                    <Input
                      value={editData.github_url || ''}
                      onChange={(e) => setEditData({ ...editData, github_url: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Preferred Job Role</p>
                    <p className="font-semibold text-gray-900">{student?.preferred_job_role || 'Not specified'}</p>
                  </div>
                  {student?.linkedin_url && (
                    <div>
                      <p className="text-sm text-gray-600">LinkedIn</p>
                      <a href={student.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        View Profile →
                      </a>
                    </div>
                  )}
                  {student?.github_url && (
                    <div>
                      <p className="text-sm text-gray-600">GitHub</p>
                      <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        View Profile →
                      </a>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-900">Performance</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <p className="text-sm text-gray-600">Total XP</p>
                </div>
                <p className="font-bold text-gray-900">{student?.total_xp || 0}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-500" />
                  <p className="text-sm text-gray-600">Level</p>
                </div>
                <Badge variant="primary">Level {student?.current_level || 1}</Badge>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-gray-900">Skills</h3>
        </CardHeader>
        <CardBody>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {editData.skills?.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="primary">
                    {skill}
                    <button
                      onClick={() => {
                        setEditData({
                          ...editData,
                          skills: editData.skills.filter((_: string, i: number) => i !== idx)
                        });
                      }}
                      className="ml-2 hover:text-white"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="newSkill"
                  placeholder="Add a skill (e.g., React)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      const skill = e.currentTarget.value;
                      if (!editData.skills?.includes(skill)) {
                        setEditData({
                          ...editData,
                          skills: [...(editData.skills || []), skill]
                        });
                      }
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {student?.skills && student.skills.length > 0 ? (
                student.skills.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="primary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-600">No skills added yet</p>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Save Button (Edit Mode) */}
      {isEditing && (
        <div className="flex gap-3">
          <Button
            variant="primary"
            className="flex-1 h-11 flex items-center justify-center gap-2"
            onClick={handleSaveProfile}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner size="sm" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <RoleGuard allowedRoles={['student']}>
      <DashboardLayout>
        <Suspense fallback={<Spinner size="lg" />}>
          <StudentProfileContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

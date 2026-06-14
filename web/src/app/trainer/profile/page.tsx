'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { Edit, Save, X, Star, Users, Award, CheckCircle, Download, Upload, Camera, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api/client';

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
  profile_photo: 'https://via.placeholder.com/200',
  certifications: ['IELTS', 'TEFL', 'CELTA'],
  languages: ['English', 'Spanish', 'French'],
  created_at: '2026-03-15',
};

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState<TrainerProfile | null>(mockTrainerProfile);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<TrainerProfile>>(mockTrainerProfile);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(mockTrainerProfile.profile_photo || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Skills
  const [skills, setSkills] = useState<any[]>([
    { id: 1, skill_name: 'IELTS', skill_category: 'Language', skill_level: 'Expert', years_experience: 10, is_featured: true },
  ]);
  const [newSkill, setNewSkill] = useState({ skill_name: '', skill_category: '', skill_level: 'Intermediate', years_experience: 0, is_featured: false });

  // Work Experience
  const [experience, setExperience] = useState<any[]>([
    { id: 1, company_name: 'Language Academy', job_title: 'Senior IELTS Trainer', employment_type: 'full_time', location: 'Dhaka, Bangladesh', start_date: '2020-01', end_date: '2026-06', is_current: true, description: 'Train IELTS students for speaking and writing', key_responsibilities: '' },
  ]);
  const [newExperience, setNewExperience] = useState({ company_name: '', job_title: '', employment_type: 'full_time', location: '', start_date: '', end_date: '', is_current: false, description: '', key_responsibilities: '' });

  // Education
  const [education, setEducation] = useState<any[]>([
    { id: 1, degree: 'Bachelor of Arts', institution_name: 'University of London', field_of_study: 'English Literature', start_year: 2015, graduation_year: 2018, grade: '3.7', description: '' },
  ]);
  const [newEducation, setNewEducation] = useState({ degree: '', institution_name: '', field_of_study: '', start_year: new Date().getFullYear(), graduation_year: new Date().getFullYear(), grade: '', description: '' });

  // Certifications
  const [certifications, setCertifications] = useState<any[]>([
    { id: 1, certification_name: 'IELTS Certified', issuing_organization: 'British Council', certificate_id: 'IELTS-2024-001', issue_date: '2024-01', expiry_date: '2027-01', does_not_expire: false, verification_status: 'verified' },
    { id: 2, certification_name: 'TEFL Certified', issuing_organization: 'TEFL Academy', certificate_id: 'TEFL-2023-001', issue_date: '2023-01', expiry_date: '', does_not_expire: true, verification_status: 'verified' },
  ]);
  const [newCertification, setNewCertification] = useState({ certification_name: '', issuing_organization: '', certificate_id: '', certificate_url: '', issue_date: '', expiry_date: '', does_not_expire: false });

  // Projects / Achievements
  const [projects, setProjects] = useState<any[]>([
    { id: 1, title: 'Campus Recruitment Program 2025', type: 'Project', organization: 'Language Academy', role: 'Lead Trainer', achievement_date: '2025-03', description: 'Led IELTS training for 200+ students', result_impact: '150 students got 7+ band score', project_url: '', is_public: true },
  ]);
  const [newProject, setNewProject] = useState({ title: '', type: 'Project', organization: '', role: '', achievement_date: '', description: '', result_impact: '', project_url: '', is_public: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Fetch profile
        const profileResponse = await fetch('/api/v1/trainers/me/profile', {
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (profileResponse.ok) {
          const data = await profileResponse.json();
          if (data?.success && data?.data) {
            setProfile(data.data);
            setEditData(data.data);
          }
        }

        clearTimeout(timeoutId);

        // Fetch sections in parallel
        const skillsPromise = apiClient.get('/trainers/me/skills').catch(() => ({ data: { success: false } }));
        const educationsPromise = apiClient.get('/trainers/me/educations').catch(() => ({ data: { success: false } }));
        const achievementsPromise = apiClient.get('/trainers/me/achievements').catch(() => ({ data: { success: false } }));

        const [skillsRes, educationsRes, achievementsRes] = await Promise.all([skillsPromise, educationsPromise, achievementsPromise]);

        if (skillsRes.data?.success && skillsRes.data?.data?.length > 0) {
          setSkills(skillsRes.data.data);
        }

        if (educationsRes.data?.success && educationsRes.data?.data?.length > 0) {
          setEducation(educationsRes.data.data);
        }

        if (achievementsRes.data?.success && achievementsRes.data?.data?.length > 0) {
          setProjects(achievementsRes.data.data);
        }
      } catch (err: any) {
        console.log('Using mock data:', err.message);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => {
    setIsEditMode(true);
    setEditData(profile || {});
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.post('/trainers/me/profile', editData);
      if (data.success) {
        setProfile(data.data);
        setIsEditMode(false);
      }
    } catch (err: any) {
      setError('Failed to save profile');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditData(profile || {});
  };

  // Skill handlers
  const addSkill = async () => {
    if (newSkill.skill_name && newSkill.skill_category && newSkill.skill_level) {
      try {
        const response = await apiClient.post('/trainers/me/skills', newSkill);
        if (response.data?.success) {
          setSkills([...skills, response.data.data]);
          setNewSkill({ skill_name: '', skill_category: '', skill_level: 'Intermediate', years_experience: 0, is_featured: false });
        }
      } catch (err) {
        console.error('Add skill error:', err);
        // Fallback to local state
        setSkills([...skills, { ...newSkill, id: Date.now() }]);
        setNewSkill({ skill_name: '', skill_category: '', skill_level: 'Intermediate', years_experience: 0, is_featured: false });
      }
    }
  };

  const removeSkill = async (id: number) => {
    try {
      const response = await apiClient.delete(`/trainers/me/skills/${id}`);
      if (response.data?.success) {
        setSkills(skills.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Delete skill error:', err);
      // Fallback to local state
      setSkills(skills.filter((item) => item.id !== id));
    }
  };

  // Experience handlers
  const addExperience = async () => {
    if (newExperience.company_name && newExperience.job_title && newExperience.start_date) {
      try {
        const response = await apiClient.post('/trainers/me/experiences', newExperience);
        if (response.data?.success) {
          setExperience([...experience, response.data.data]);
          setNewExperience({ company_name: '', job_title: '', employment_type: 'full_time', location: '', start_date: '', end_date: '', is_current: false, description: '', key_responsibilities: '' });
        }
      } catch (err) {
        console.error('Add experience error:', err);
        // Fallback to local state
        setExperience([...experience, { ...newExperience, id: Date.now() }]);
        setNewExperience({ company_name: '', job_title: '', employment_type: 'full_time', location: '', start_date: '', end_date: '', is_current: false, description: '', key_responsibilities: '' });
      }
    }
  };

  const removeExperience = async (id: number) => {
    try {
      const response = await apiClient.delete(`/trainers/me/experiences/${id}`);
      if (response.data?.success) {
        setExperience(experience.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Delete experience error:', err);
      // Fallback to local state
      setExperience(experience.filter((item) => item.id !== id));
    }
  };

  // Education handlers
  const addEducation = async () => {
    if (newEducation.degree && newEducation.institution_name && newEducation.graduation_year) {
      try {
        const response = await apiClient.post('/trainers/me/educations', newEducation);
        if (response.data?.success) {
          setEducation([...education, response.data.data]);
          setNewEducation({ degree: '', institution_name: '', field_of_study: '', start_year: new Date().getFullYear(), graduation_year: new Date().getFullYear(), grade: '', description: '' });
        }
      } catch (err) {
        console.error('Add education error:', err);
        // Fallback to local state
        setEducation([...education, { ...newEducation, id: Date.now() }]);
        setNewEducation({ degree: '', institution_name: '', field_of_study: '', start_year: new Date().getFullYear(), graduation_year: new Date().getFullYear(), grade: '', description: '' });
      }
    }
  };

  const removeEducation = async (id: number) => {
    try {
      const response = await apiClient.delete(`/trainers/me/educations/${id}`);
      if (response.data?.success) {
        setEducation(education.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Delete education error:', err);
      // Fallback to local state
      setEducation(education.filter((item) => item.id !== id));
    }
  };

  // Certification handlers
  const addCertification = async () => {
    if (newCertification.certification_name && newCertification.issuing_organization && newCertification.issue_date) {
      try {
        const response = await apiClient.post('/trainers/me/certifications', newCertification);
        if (response.data?.success) {
          setCertifications([...certifications, response.data.data]);
          setNewCertification({ certification_name: '', issuing_organization: '', certificate_id: '', certificate_url: '', issue_date: '', expiry_date: '', does_not_expire: false });
        }
      } catch (err) {
        console.error('Add certification error:', err);
        // Fallback to local state
        setCertifications([...certifications, { ...newCertification, id: Date.now(), verification_status: 'pending_verification' }]);
        setNewCertification({ certification_name: '', issuing_organization: '', certificate_id: '', certificate_url: '', issue_date: '', expiry_date: '', does_not_expire: false });
      }
    }
  };

  const removeCertification = async (id: number) => {
    try {
      const response = await apiClient.delete(`/trainers/me/certifications/${id}`);
      if (response.data?.success) {
        setCertifications(certifications.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Delete certification error:', err);
      // Fallback to local state
      setCertifications(certifications.filter((item) => item.id !== id));
    }
  };

  // Project handlers
  const addProject = async () => {
    if (newProject.title && newProject.type && newProject.achievement_date && newProject.description) {
      try {
        const response = await apiClient.post('/trainers/me/achievements', newProject);
        if (response.data?.success) {
          setProjects([...projects, response.data.data]);
          setNewProject({ title: '', type: 'Project', organization: '', role: '', achievement_date: '', description: '', result_impact: '', project_url: '', is_public: true });
        }
      } catch (err) {
        console.error('Add achievement error:', err);
        // Fallback to local state
        setProjects([...projects, { ...newProject, id: Date.now() }]);
        setNewProject({ title: '', type: 'Project', organization: '', role: '', achievement_date: '', description: '', result_impact: '', project_url: '', is_public: true });
      }
    }
  };

  const removeProject = async (id: number) => {
    try {
      const response = await apiClient.delete(`/trainers/me/achievements/${id}`);
      if (response.data?.success) {
        setProjects(projects.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Delete achievement error:', err);
      // Fallback to local state
      setProjects(projects.filter((item) => item.id !== id));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, GIF, etc.)');
      return;
    }

    // Validate file size (max 2MB for API, 5MB local)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        setImagePreview(base64Data);
      };
      reader.readAsDataURL(file);

      // Upload to API
      const formData = new FormData();
      formData.append('photo', file);

      const token = localStorage.getItem('auth_token');
      console.log('Upload starting. Auth token:', token ? 'Present' : 'Missing');

      const response = await fetch('/api/v1/trainers/me/profile/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', {
        contentType: response.headers.get('content-type'),
      });

      const contentType = response.headers.get('content-type');
      let data;

      try {
        const responseText = await response.text();
        console.log('Raw response:', responseText.substring(0, 300));

        if (!contentType?.includes('application/json')) {
          console.error('Non-JSON content-type:', contentType);
          console.error('Response body:', responseText);
          setError(`Server error (${response.status}): Expected JSON response. ${responseText.substring(0, 100)}`);
          setImagePreview(profile?.profile_photo || null);
          return;
        }

        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (parseErr) {
        console.error('Response parsing error:', parseErr);
        setError('Server error: Invalid response format. Please try again.');
        setImagePreview(profile?.profile_photo || null);
        return;
      }

      if (response.ok && data?.success) {
        const photoUrl = data.photo_url || data.data?.profile_photo || data.data?.profile_photo_url;
        console.log('Photo URL:', photoUrl);

        if (profile) {
          setProfile({ ...profile, profile_photo: photoUrl });
        }
        setEditData({ ...editData, profile_photo: photoUrl });
      } else {
        const errorMsg = data?.message || `Upload failed (${response.status})`;
        console.error('Upload error response:', data);
        setError(errorMsg);
        setImagePreview(profile?.profile_photo || null);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Network error. Please check your connection and try again.');
      // Reset preview on error
      setImagePreview(profile?.profile_photo || null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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

  const profileCompletion = 92;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Hero Section - Enterprise Grade */}
      <div className="relative -mx-8 -mt-6 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-8 py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Photo with Upload */}
            <div className="flex-shrink-0 relative group">
              <div className="relative">
                <img
                  src={imagePreview || profile.profile_photo}
                  alt={profile.full_name}
                  className="w-48 h-48 rounded-2xl border-4 border-white object-cover shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-3 right-3 bg-white text-blue-600 rounded-full p-3 shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all disabled:opacity-50 duration-300"
                title="Upload photo"
              >
                {uploading ? (
                  <Spinner size="sm" />
                ) : (
                  <Camera className="w-6 h-6" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-white">
              <div className="mb-6">
                <h1 className="text-5xl font-bold mb-2">{profile.full_name}</h1>
                <p className="text-blue-200 text-lg opacity-90">{profile.user_email}</p>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Rating</p>
                  <p className="text-3xl font-bold mt-2 flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    {profile.average_rating}
                  </p>
                  <p className="text-blue-300 text-xs mt-1">({profile.total_reviews} reviews)</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Sessions</p>
                  <p className="text-3xl font-bold mt-2">{profile.total_sessions}</p>
                  <p className="text-blue-300 text-xs mt-1">Completed</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Experience</p>
                  <p className="text-3xl font-bold mt-2">{profile.experience_years}+</p>
                  <p className="text-blue-300 text-xs mt-1">Years</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Earnings</p>
                  <p className="text-3xl font-bold mt-2">৳{(profile.total_earnings / 1000).toFixed(1)}k</p>
                  <p className="text-blue-300 text-xs mt-1">Total earned</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {!isEditMode ? (
                  <>
                    <Button
                      onClick={handleEdit}
                      className="bg-white text-blue-700 hover:bg-blue-50 font-semibold flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                    <Link href="/trainer/profile/setup">
                      <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
                        <CheckCircle className="w-4 h-4" />
                        Complete Profile
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg transition-all"
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/20 text-white border border-white hover:bg-white/30 font-semibold flex items-center gap-2 px-6 py-3 rounded-lg transition-all"
                      onClick={handleCancel}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Completion - Enterprise Grade */}
        <Card className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 border-0 shadow-xl">
          <CardBody className="flex flex-col md:flex-row justify-between items-center gap-8 text-white">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Profile Completion</h3>
              <p className="text-emerald-50 text-lg">Complete your profile to increase visibility and attract more students</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeDasharray={`${profileCompletion * 2.83} 283`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{profileCompletion}%</span>
                  <span className="text-xs text-emerald-50">Complete</span>
                </div>
              </div>
              <Link href="/trainer/profile/setup">
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
                  Complete Profile →
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* About Me Section */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
            </div>
          </CardHeader>
          <CardBody className="pt-6">
            {isEditMode ? (
              <textarea
                value={editData.bio || ''}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={5}
                placeholder="Write your professional bio..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed text-lg">{profile.bio}</p>
            )}
          </CardBody>
        </Card>

        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💵</span>
                </div>
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Hourly Rate</p>
                <p className="text-4xl font-bold text-blue-600 mt-3">${profile.hourly_rate}</p>
                <p className="text-sm text-gray-600 mt-2">per session hour</p>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Total Earnings</p>
                <p className="text-4xl font-bold text-emerald-600 mt-3">৳{(profile.total_earnings / 1000).toFixed(1)}k</p>
                <p className="text-sm text-gray-600 mt-2">lifetime earnings</p>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Member Since</p>
                <p className="text-2xl font-bold text-purple-600 mt-3">{new Date(profile.created_at).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 mt-2">joined platform</p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Resume Section */}
        {profile.resume_url && (
          <Card className="bg-blue-50 border-blue-200">
            <CardBody className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-5xl">📄</span>
                <div>
                  <p className="font-bold text-gray-900">Resume</p>
                  <p className="text-sm text-gray-600 mt-1">{profile.resume_url}</p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Skills & Certifications Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">🏆 Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expertise */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Expertise</h3>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {profile.expertise.map((exp) => (
                    <Badge key={exp} variant="primary" className="text-sm px-3 py-1">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Languages</h3>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {profile.languages?.map((lang) => (
                    <Badge key={lang} variant="purple" className="text-sm px-3 py-1">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Qualifications Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">📜 Qualifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Degrees */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Degrees & Certifications</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                {profile.qualifications.map((qual, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-primary-600 font-bold text-lg mt-0.5">✓</span>
                    <span className="text-gray-700">{qual}</span>
                  </div>
                ))}
              </CardBody>
            </Card>

            {/* Certified By */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Certifications</h3>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {profile.certifications?.map((cert) => (
                    <Badge key={cert} variant="success" className="text-sm px-3 py-1">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
          </div>
          <Card className="shadow-lg border-0">
            <CardBody className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <Input placeholder="Skill Name *" value={newSkill.skill_name} onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })} className="border-gray-300 focus:ring-blue-500" />
                  <Input placeholder="Category" value={newSkill.skill_category} onChange={(e) => setNewSkill({ ...newSkill, skill_category: e.target.value })} className="border-gray-300 focus:ring-blue-500" />
                  <select value={newSkill.skill_level} onChange={(e) => setNewSkill({ ...newSkill, skill_level: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <Input type="number" placeholder="Years" value={newSkill.years_experience} onChange={(e) => setNewSkill({ ...newSkill, years_experience: parseInt(e.target.value) })} className="border-gray-300 focus:ring-blue-500" />
                  <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input type="checkbox" checked={newSkill.is_featured} onChange={(e) => setNewSkill({ ...newSkill, is_featured: e.target.checked })} className="rounded" />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                </div>
                <Button onClick={addSkill} className="bg-blue-600 hover:bg-blue-700 w-full mt-3 rounded-lg py-2">
                  <Plus className="w-4 h-4 mr-2" /> Add Skill
                </Button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <div key={skill.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{skill.skill_name}</p>
                          {skill.is_featured && <Badge variant="success" className="text-xs">⭐ Featured</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{skill.skill_category} • <Badge variant="gray" className="text-xs inline">{skill.skill_level}</Badge> • {skill.years_experience} {skill.years_experience === 1 ? 'year' : 'years'}</p>
                      </div>
                      <button onClick={() => removeSkill(skill.id)} className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No skills added yet. Add your first skill above.</p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Work Experience */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">💼 Work Experience</h2>
          <Card>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input placeholder="Company Name *" value={newExperience.company_name} onChange={(e) => setNewExperience({ ...newExperience, company_name: e.target.value })} />
                <Input placeholder="Job Title *" value={newExperience.job_title} onChange={(e) => setNewExperience({ ...newExperience, job_title: e.target.value })} />
                <Input placeholder="Location" value={newExperience.location} onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })} />
                <select value={newExperience.employment_type} onChange={(e) => setNewExperience({ ...newExperience, employment_type: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600">
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
                <Input type="month" placeholder="Start Date *" value={newExperience.start_date} onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })} />
                <Input type="month" placeholder="End Date" value={newExperience.end_date} onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })} disabled={newExperience.is_current} />
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-300 md:col-span-2">
                  <input type="checkbox" checked={newExperience.is_current} onChange={(e) => setNewExperience({ ...newExperience, is_current: e.target.checked, end_date: e.target.checked ? '' : newExperience.end_date })} />
                  <span className="text-sm">Currently working here</span>
                </label>
              </div>
              <textarea placeholder="Description" value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600" rows={2} />
              <Button onClick={addExperience} className="bg-blue-600 hover:bg-blue-700 w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Experience
              </Button>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {experience.map((exp) => (
                  <div key={exp.id} className="p-3 bg-gray-50 rounded flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{exp.job_title}</p>
                      <p className="text-xs text-gray-600">{exp.company_name} • {exp.employment_type === 'full_time' ? 'FT' : exp.employment_type === 'part_time' ? 'PT' : exp.employment_type.charAt(0).toUpperCase() + exp.employment_type.slice(1)}</p>
                      {exp.location && <p className="text-xs text-gray-600">{exp.location}</p>}
                      {exp.description && <p className="text-xs text-gray-700 mt-1">{exp.description}</p>}
                    </div>
                    <button onClick={() => removeExperience(exp.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Education */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">🎓 Education</h2>
          <Card>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input placeholder="Degree / Qualification *" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />
                <Input placeholder="Institution Name *" value={newEducation.institution_name} onChange={(e) => setNewEducation({ ...newEducation, institution_name: e.target.value })} />
                <Input placeholder="Field of Study" value={newEducation.field_of_study} onChange={(e) => setNewEducation({ ...newEducation, field_of_study: e.target.value })} />
                <Input placeholder="Grade / CGPA" value={newEducation.grade} onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })} />
                <Input type="number" placeholder="Start Year" value={newEducation.start_year} onChange={(e) => setNewEducation({ ...newEducation, start_year: parseInt(e.target.value) })} />
                <Input type="number" placeholder="Graduation Year *" value={newEducation.graduation_year} onChange={(e) => setNewEducation({ ...newEducation, graduation_year: parseInt(e.target.value) })} />
              </div>
              <textarea placeholder="Description" value={newEducation.description} onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600" rows={2} />
              <Button onClick={addEducation} className="bg-blue-600 hover:bg-blue-700 w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Education
              </Button>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {education.map((edu) => (
                  <div key={edu.id} className="p-3 bg-gray-50 rounded flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{edu.degree}</p>
                      <p className="text-xs text-gray-600">{edu.institution_name}</p>
                      {edu.field_of_study && <p className="text-xs text-gray-600">{edu.field_of_study}</p>}
                      <p className="text-xs text-gray-600">{edu.start_year} - {edu.graduation_year}</p>
                      {edu.grade && <p className="text-xs text-gray-600">Grade: {edu.grade}</p>}
                    </div>
                    <button onClick={() => removeEducation(edu.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">🏅 Certifications</h2>
          <Card>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input placeholder="Certification Name *" value={newCertification.certification_name} onChange={(e) => setNewCertification({ ...newCertification, certification_name: e.target.value })} />
                <Input placeholder="Issuing Organization *" value={newCertification.issuing_organization} onChange={(e) => setNewCertification({ ...newCertification, issuing_organization: e.target.value })} />
                <Input placeholder="Certificate ID" value={newCertification.certificate_id} onChange={(e) => setNewCertification({ ...newCertification, certificate_id: e.target.value })} />
                <Input placeholder="Certificate URL" value={newCertification.certificate_url} onChange={(e) => setNewCertification({ ...newCertification, certificate_url: e.target.value })} />
                <Input type="month" placeholder="Issue Date *" value={newCertification.issue_date} onChange={(e) => setNewCertification({ ...newCertification, issue_date: e.target.value })} />
                <Input type="month" placeholder="Expiry Date" value={newCertification.expiry_date} onChange={(e) => setNewCertification({ ...newCertification, expiry_date: e.target.value })} disabled={newCertification.does_not_expire} />
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-300 md:col-span-2">
                  <input type="checkbox" checked={newCertification.does_not_expire} onChange={(e) => setNewCertification({ ...newCertification, does_not_expire: e.target.checked, expiry_date: e.target.checked ? '' : newCertification.expiry_date })} />
                  <span className="text-sm">Does not expire</span>
                </label>
              </div>
              <Button onClick={addCertification} className="bg-blue-600 hover:bg-blue-700 w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Certification
              </Button>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-3 bg-gray-50 rounded flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{cert.certification_name}</p>
                      <p className="text-xs text-gray-600">{cert.issuing_organization}</p>
                      {cert.certificate_id && <p className="text-xs text-gray-600">ID: {cert.certificate_id}</p>}
                      <p className="text-xs text-gray-600">Issued: {cert.issue_date} {cert.expiry_date && `| Expires: ${cert.expiry_date}`} {cert.does_not_expire && '| No expiry'}</p>
                      <Badge variant={cert.verification_status === 'verified' ? 'success' : 'gray'} className="mt-1 text-xs">
                        {cert.verification_status === 'verified' ? '✓ Verified' : '⏳ Pending Review'}
                      </Badge>
                    </div>
                    <button onClick={() => removeCertification(cert.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Projects / Achievements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">🚀 Projects & Achievements</h2>
          <Card>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input placeholder="Title *" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
                <select value={newProject.type} onChange={(e) => setNewProject({ ...newProject, type: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600">
                  <option value="Project">Project</option>
                  <option value="Achievement">Achievement</option>
                  <option value="Award">Award</option>
                  <option value="Publication">Publication</option>
                  <option value="Training Program">Training Program</option>
                </select>
                <Input placeholder="Organization" value={newProject.organization} onChange={(e) => setNewProject({ ...newProject, organization: e.target.value })} />
                <Input placeholder="Your Role" value={newProject.role} onChange={(e) => setNewProject({ ...newProject, role: e.target.value })} />
                <Input type="month" placeholder="Date *" value={newProject.achievement_date} onChange={(e) => setNewProject({ ...newProject, achievement_date: e.target.value })} />
                <Input placeholder="Project URL" value={newProject.project_url} onChange={(e) => setNewProject({ ...newProject, project_url: e.target.value })} />
              </div>
              <textarea placeholder="Description *" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600" rows={2} />
              <textarea placeholder="Result / Impact" value={newProject.result_impact} onChange={(e) => setNewProject({ ...newProject, result_impact: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600" rows={2} />
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-300">
                <input type="checkbox" checked={newProject.is_public} onChange={(e) => setNewProject({ ...newProject, is_public: e.target.checked })} />
                <span className="text-sm">Show on public profile</span>
              </label>
              <Button onClick={addProject} className="bg-blue-600 hover:bg-blue-700 w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Project / Achievement
              </Button>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-gray-50 rounded flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{proj.title}</p>
                        <Badge variant="gray" className="text-xs">{proj.type}</Badge>
                        {proj.is_public && <Badge variant="success" className="text-xs">Public</Badge>}
                      </div>
                      {proj.organization && <p className="text-xs text-gray-600">{proj.organization}</p>}
                      {proj.role && <p className="text-xs text-gray-600">Role: {proj.role}</p>}
                      <p className="text-xs text-gray-700 mt-1">{proj.description}</p>
                      {proj.result_impact && <p className="text-xs text-green-700 mt-1 font-semibold">Impact: {proj.result_impact}</p>}
                    </div>
                    <button onClick={() => removeProject(proj.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

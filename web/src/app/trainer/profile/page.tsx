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

  // Skills, Experience, Education, Certifications, Projects
  const [skills, setSkills] = useState<string[]>(mockTrainerProfile.expertise || []);
  const [newSkill, setNewSkill] = useState('');

  const [experience, setExperience] = useState<any[]>([
    { id: 1, title: 'Senior IELTS Trainer', company: 'Language Academy', years: '5 years' },
  ]);
  const [newExperience, setNewExperience] = useState({ title: '', company: '', years: '' });

  const [education, setEducation] = useState<any[]>([
    { id: 1, degree: 'Bachelor in English Literature', institution: 'University of London' },
  ]);
  const [newEducation, setNewEducation] = useState({ degree: '', institution: '' });

  const [certifications, setCertifications] = useState<any[]>([
    { id: 1, name: 'IELTS Certified' },
    { id: 2, name: 'TEFL Certified' },
    { id: 3, name: 'CELTA Certified' },
  ]);
  const [newCertification, setNewCertification] = useState('');

  const [projects, setProjects] = useState<any[]>([
    { id: 1, title: 'Developed IELTS Learning Platform', description: 'Created interactive platform with 1000+ students' },
  ]);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('/api/v1/trainers/me/profile', {
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data?.success && data?.data) {
            setProfile(data.data);
            setEditData(data.data);
          }
        }
      } catch (err: any) {
        console.log('Using mock data:', err.message);
      }
    };

    fetchProfile();
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
  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Experience handlers
  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      setExperience([...experience, { ...newExperience, id: Date.now() }]);
      setNewExperience({ title: '', company: '', years: '' });
    }
  };

  const removeExperience = (id: number) => {
    setExperience(experience.filter((item) => item.id !== id));
  };

  // Education handlers
  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setEducation([...education, { ...newEducation, id: Date.now() }]);
      setNewEducation({ degree: '', institution: '' });
    }
  };

  const removeEducation = (id: number) => {
    setEducation(education.filter((item) => item.id !== id));
  };

  // Certification handlers
  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, { id: Date.now(), name: newCertification }]);
      setNewCertification('');
    }
  };

  const removeCertification = (id: number) => {
    setCertifications(certifications.filter((item) => item.id !== id));
  };

  // Project handlers
  const addProject = () => {
    if (newProject.title && newProject.description) {
      setProjects([...projects, { ...newProject, id: Date.now() }]);
      setNewProject({ title: '', description: '' });
    }
  };

  const removeProject = (id: number) => {
    setProjects(projects.filter((item) => item.id !== id));
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

      {/* Hero Section */}
      <div className="relative -mx-8 -mt-6 bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-12">
        <div className="max-w-6xl mx-auto flex items-start gap-8">
          {/* Profile Photo with Upload */}
          <div className="flex-shrink-0 relative group">
            <img
              src={imagePreview || profile.profile_photo}
              alt={profile.full_name}
              className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition disabled:opacity-50"
              title="Upload photo"
            >
              {uploading ? (
                <Spinner size="sm" />
              ) : (
                <Camera className="w-5 h-5 text-blue-600" />
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
            <h1 className="text-5xl font-bold">{profile.full_name}</h1>
            <p className="text-blue-100 mt-2 text-lg">{profile.user_email}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-blue-100 text-sm uppercase">Rating</p>
                <p className="text-3xl font-bold mt-1 flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                  {profile.average_rating}
                </p>
                <p className="text-blue-200 text-xs mt-1">({profile.total_reviews} reviews)</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm uppercase">Sessions</p>
                <p className="text-3xl font-bold mt-1">{profile.total_sessions}</p>
                <p className="text-blue-200 text-xs mt-1">Completed</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm uppercase">Experience</p>
                <p className="text-3xl font-bold mt-1">{profile.experience_years}+</p>
                <p className="text-blue-200 text-xs mt-1">Years</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              {!isEditMode ? (
                <>
                  <Button variant="primary" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  <Link href="/trainer/profile/setup">
                    <Button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Complete Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center gap-2" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold flex items-center gap-2" onClick={handleCancel}>
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Completion */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardBody className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Profile Completion</p>
              <p className="text-gray-700 mt-1">Complete missing information to boost visibility</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${profileCompletion * 2.83} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">{profileCompletion}%</span>
                </div>
              </div>
              <Link href="/trainer/profile/setup">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Complete Missing Info →
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* About Me Section */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">👤 About Me</h2>
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
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            )}
          </CardBody>
        </Card>

        {/* Personal Information Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">💰 Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardBody>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Hourly Rate</p>
                <p className="text-4xl font-bold text-primary-600 mt-3">${profile.hourly_rate}</p>
                <p className="text-xs text-gray-500 mt-2">per hour</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Earnings</p>
                <p className="text-4xl font-bold text-green-600 mt-3">${profile.total_earnings.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">lifetime</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
                <p className="text-2xl font-bold text-gray-900 mt-3">{new Date(profile.created_at).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500 mt-2">joined</p>
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
          <h2 className="text-2xl font-bold flex items-center gap-2">💡 Skills</h2>
          <Card>
            <CardBody className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <Badge key={idx} variant="primary">
                    {skill}
                    <button onClick={() => removeSkill(idx)} className="ml-1">✕</button>
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Work Experience */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">💼 Work Experience</h2>
          <Card>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input placeholder="Title" value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} />
                <Input placeholder="Company" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} />
                <Input placeholder="Years" value={newExperience.years} onChange={(e) => setNewExperience({ ...newExperience, years: e.target.value })} />
                <Button onClick={addExperience} className="bg-blue-600 col-span-1 md:col-span-3">
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {experience.map((exp) => (
                  <div key={exp.id} className="p-3 bg-gray-50 rounded flex justify-between">
                    <div>
                      <p className="font-semibold text-sm">{exp.title}</p>
                      <p className="text-xs text-gray-600">{exp.company} • {exp.years}</p>
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
                <Input placeholder="Degree" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />
                <Input placeholder="Institution" value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} />
                <Button onClick={addEducation} className="bg-blue-600 col-span-1 md:col-span-2">
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="p-3 bg-gray-50 rounded flex justify-between">
                    <div>
                      <p className="font-semibold text-sm">{edu.degree}</p>
                      <p className="text-xs text-gray-600">{edu.institution}</p>
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
          <h2 className="text-2xl font-bold flex items-center gap-2">🏅 Additional Certifications</h2>
          <Card>
            <CardBody className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Add certification"
                  onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                />
                <Button onClick={addCertification} className="bg-blue-600">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <Badge key={cert.id} variant="success">
                    {cert.name}
                    <button onClick={() => removeCertification(cert.id)} className="ml-1">✕</button>
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">🚀 Projects & Achievements</h2>
          <Card>
            <CardBody className="space-y-4">
              <Input placeholder="Project title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
              <textarea placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="w-full p-2 border rounded" rows={3} />
              <Button onClick={addProject} className="bg-blue-600 w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">{proj.title}</p>
                      <button onClick={() => removeProject(proj.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{proj.description}</p>
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

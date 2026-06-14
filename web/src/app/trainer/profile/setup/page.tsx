'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input } from '@/components/ui';
import { Save, X, AlertCircle, ChevronRight, ChevronLeft, Upload } from 'lucide-react';

const INDUSTRIES = ['Tech', 'Finance', 'Healthcare', 'Education', 'HR', 'Marketing', 'Sales', 'FMCG'];
const TRAINER_TYPES = ['HR Trainer', 'Technical Trainer', 'Career Coach', 'CV Reviewer', 'Interview Specialist'];
const TARGET_LEVELS = ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Executive'];
const SESSION_MODES = ['Video', 'Audio', 'Chat', 'Document Review'];
const TIMEZONES = ['UTC', 'EST', 'CST', 'PST', 'IST', 'GMT', 'CET'];
const EMPLOYMENT_TYPES = ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'];
const DEGREES = ['High School', 'Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

type ProfileData = {
  full_name: string;
  display_name: string;
  profile_photo_url: string;
  phone_number: string;
  location: string;
  preferred_language: string;
  professional_title: string;
  current_company: string;
  current_designation: string;
  years_experience: number;
  industry: string;
  trainer_type: string;
  headline: string;
  bio: string;
  booking_value_statement: string;
  target_student_levels: string[];
  preferred_session_modes: string[];
  highest_degree: string;
  institution_name: string;
  graduation_year: number;
  field_of_study: string;
  languages: {name: string; proficiency: string}[];
  social_links: {platform: string; url: string}[];
};

export default function TrainerProfileSetup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    display_name: '',
    profile_photo_url: '',
    phone_number: '',
    location: '',
    preferred_language: 'English',
    professional_title: '',
    current_company: '',
    current_designation: '',
    years_experience: 0,
    industry: '',
    trainer_type: '',
    headline: '',
    bio: '',
    booking_value_statement: '',
    target_student_levels: [],
    preferred_session_modes: [],
    highest_degree: '',
    institution_name: '',
    graduation_year: new Date().getFullYear(),
    field_of_study: '',
    languages: [{name: 'English', proficiency: 'Fluent'}],
    social_links: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'years_experience' || name === 'graduation_year' ? Number(value) : value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({...prev, profile_photo_url: reader.result as string}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayToggle = (field: keyof Pick<ProfileData, 'target_student_levels' | 'preferred_session_modes'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value],
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.full_name && formData.display_name && formData.phone_number && formData.location);
      case 2:
        return !!(formData.professional_title && formData.years_experience >= 0 && formData.industry && formData.trainer_type);
      case 3:
        return !!(formData.headline && formData.bio && formData.bio.length >= 100 && formData.booking_value_statement);
      case 4:
        return formData.target_student_levels.length > 0 && formData.preferred_session_modes.length > 0;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      setError('Please fill all required fields');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handlePrev = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/trainers/me/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save profile');
      }

      alert('Profile saved successfully!');
      window.location.href = '/trainer/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
      setLoading(false);
    }
  };

  const stepLabels = ['Basic Info', 'Professional', 'About', 'Expertise', 'Review'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
        <div className="flex gap-1 text-sm">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className={`px-3 py-1 rounded-full font-medium ${i + 1 <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {i + 1}
              </span>
              <span className="text-gray-600">{label}</span>
              {i < stepLabels.length - 1 && <span className="mx-1 text-gray-400">&gt;</span>}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {step === 1 && (
        <Card>
          <CardHeader><h2 className="font-bold text-lg">Basic Information</h2></CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Profile Photo *</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {formData.profile_photo_url ? (
                  <img src={formData.profile_photo_url} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-2" />
                ) : (
                  <div className="text-gray-400 mb-2"><Upload className="w-8 h-8 mx-auto" /></div>
                )}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo" />
                <label htmlFor="photo" className="text-blue-600 cursor-pointer">Upload Photo</label>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <Input name="full_name" value={formData.full_name} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Display Name *</label>
                <Input name="display_name" value={formData.display_name} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <Input name="phone_number" type="tel" value={formData.phone_number} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Location *</label>
                <Input name="location" value={formData.location} onChange={handleInputChange} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Preferred Language *</label>
              <Input name="preferred_language" value={formData.preferred_language} onChange={handleInputChange} />
            </div>
          </CardBody>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><h2 className="font-bold text-lg">Professional Information</h2></CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Professional Title *</label>
              <Input name="professional_title" placeholder="e.g., Senior HR Manager" value={formData.professional_title} onChange={handleInputChange} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Current Company</label>
                <Input name="current_company" value={formData.current_company} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Current Designation</label>
                <Input name="current_designation" value={formData.current_designation} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Years of Experience *</label>
                <Input type="number" name="years_experience" value={formData.years_experience} onChange={handleInputChange} min="0" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Industry *</label>
                <select name="industry" value={formData.industry} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" required>
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Trainer Type *</label>
                <select name="trainer_type" value={formData.trainer_type} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" required>
                  <option value="">Select Type</option>
                  {TRAINER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><h2 className="font-bold text-lg">About You</h2></CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Headline *</label>
              <Input name="headline" placeholder="e.g., Helping fresh graduates succeed in HR interviews" value={formData.headline} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Bio / About Me * (min 100 chars)</label>
              <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" placeholder="Write a detailed introduction..." required />
              <p className="text-sm text-gray-500 mt-1">{formData.bio.length} characters</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Why book a session with me? *</label>
              <textarea name="booking_value_statement" value={formData.booking_value_statement} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" required />
            </div>
          </CardBody>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader><h2 className="font-bold text-lg">Expertise & Skills</h2></CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-3">Target Student Levels *</label>
              <div className="grid grid-cols-3 gap-2">
                {TARGET_LEVELS.map(level => (
                  <button key={level} type="button" onClick={() => handleArrayToggle('target_student_levels', level)} className={`px-3 py-2 rounded-lg font-medium transition ${formData.target_student_levels.includes(level) ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">Preferred Session Modes *</label>
              <div className="grid grid-cols-2 gap-2">
                {SESSION_MODES.map(mode => (
                  <button key={mode} type="button" onClick={() => handleArrayToggle('preferred_session_modes', mode)} className={`px-3 py-2 rounded-lg font-medium transition ${formData.preferred_session_modes.includes(mode) ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {step === 5 && (
        <Card>
          <CardHeader><h2 className="font-bold text-lg">Review Your Profile</h2></CardHeader>
          <CardBody className="space-y-4 text-sm">
            {formData.profile_photo_url && <img src={formData.profile_photo_url} alt="Profile" className="w-24 h-24 rounded-full" />}
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-gray-600">Name</p><p className="font-semibold">{formData.full_name}</p></div>
              <div><p className="text-gray-600">Title</p><p className="font-semibold">{formData.professional_title}</p></div>
              <div><p className="text-gray-600">Experience</p><p className="font-semibold">{formData.years_experience} years</p></div>
              <div><p className="text-gray-600">Industry</p><p className="font-semibold">{formData.industry}</p></div>
              <div><p className="text-gray-600">Type</p><p className="font-semibold">{formData.trainer_type}</p></div>
              <div><p className="text-gray-600">Location</p><p className="font-semibold">{formData.location}</p></div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex gap-3 justify-between">
        {step > 1 && (
          <Button variant="outline" className="flex gap-2" onClick={handlePrev}><ChevronLeft className="w-5 h-5" />Back</Button>
        )}
        <div className="flex-1" />
        {step < 5 ? (
          <Button variant="primary" className="flex gap-2" onClick={handleNext}>Next<ChevronRight className="w-5 h-5" /></Button>
        ) : (
          <Button variant="primary" type="submit" className="flex gap-2" loading={loading} onClick={handleSubmit}><Save className="w-5 h-5" />Save Profile</Button>
        )}
      </div>
    </div>
  );
}

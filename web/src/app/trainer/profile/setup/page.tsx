'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input } from '@/components/ui';
import { Save, X, AlertCircle, ChevronRight, ChevronLeft, Upload, CheckCircle2 } from 'lucide-react';
import apiClient from '@/lib/api/client';

const INDUSTRIES = ['Tech', 'Finance', 'Healthcare', 'Education', 'HR', 'Marketing', 'Sales', 'FMCG'];
const TRAINER_TYPES = ['HR Trainer', 'Technical Trainer', 'Career Coach', 'CV Reviewer', 'Interview Specialist'];
const TARGET_LEVELS = ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Executive'];
const SESSION_MODES = ['Video', 'Audio', 'Chat', 'Document Review'];
const LANGUAGES = ['Bangla', 'English', 'Bangla + English'];

type ProfileData = {
  full_name: string;
  display_name: string;
  profile_photo_url: string;
  phone_number: string;
  location: string;
  preferred_language: string;
  resume_url: string;
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

const StepIndicator = ({ step, totalSteps }: { step: number; totalSteps: number }) => {
  const steps = ['Basic Info', 'Professional', 'About', 'Expertise', 'Review'];

  return (
    <div className="bg-white rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
              i + 1 <= step
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {i + 1 <= step - 1 ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
            </div>
            <div className="ml-3">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</p>
              {i + 1 <= step - 1 && <p className="text-xs text-green-600 font-medium">Completed</p>}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                i + 1 < step ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FormSection = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {description && <p className="text-gray-600 mt-2">{description}</p>}
    </div>
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
      {children}
    </div>
  </div>
);

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="mb-6 last:mb-0">
    <label className="block text-sm font-semibold text-gray-900 mb-3">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

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
    resume_url: '',
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

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({...prev, resume_url: reader.result as string}));
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
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setError('');
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSave = async (completeProfile: boolean = false) => {
    const currentStepValid = completeProfile ? validateStep(5) : validateStep(step);

    if (!currentStepValid) {
      setError('Please fill all required fields in this step');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await apiClient.post('/trainers/me/profile', formData);

      if (data.success) {
        if (completeProfile) {
          alert('Profile saved successfully!');
          window.location.href = '/trainer/profile';
        } else {
          alert('Progress saved!');
          if (step < 5) {
            handleNext();
          }
        }
      } else {
        throw new Error(data.message || 'Failed to save profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save profile');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await handleSave(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-lg text-gray-600">Build your trainer profile to start accepting bookings</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator step={step} totalSteps={5} />

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-8 flex gap-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Validation Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <>
            <FormSection
              title="Basic Information"
              description="Let's start with your profile photo and basic details"
            >
              <FormField label="Profile Photo" required>
                <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:bg-blue-50 transition-colors cursor-pointer relative overflow-hidden" onClick={() => document.getElementById('photo')?.click()}>
                  {formData.profile_photo_url ? (
                    <div className="space-y-3">
                      <img src={formData.profile_photo_url} alt="Profile" className="w-32 h-32 rounded-2xl mx-auto object-cover border-4 border-white shadow-lg" />
                      <p className="text-sm text-blue-600 font-medium">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="space-y-3 py-4">
                      <div className="flex justify-center">
                        <div className="bg-blue-100 rounded-full p-4">
                          <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900">Upload Profile Photo</p>
                        <p className="text-sm text-gray-600 mt-1">JPG, PNG or GIF (Max 2MB)</p>
                      </div>
                    </div>
                  )}
                  <input type="file" id="photo" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </div>
              </FormField>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <FormField label="Full Name" required>
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Md. Rahim Uddin"
                    className="text-lg"
                  />
                </FormField>
                <FormField label="Display Name" required>
                  <Input
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleInputChange}
                    placeholder="Rahim Uddin"
                  />
                </FormField>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Phone Number" required>
                  <Input
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="+8801XXXXXXXXX"
                  />
                </FormField>
                <FormField label="Location" required>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Dhaka, Bangladesh"
                  />
                </FormField>
              </div>

              <FormField label="Preferred Language" required>
                <select
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </FormField>

              <FormField label="Resume / CV">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => document.getElementById('resume')?.click()}>
                  {formData.resume_url ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900">✓ Resume uploaded</p>
                      <p className="text-xs text-gray-600">Click to change resume</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <p className="text-base font-semibold text-gray-900">Upload Your Resume</p>
                      <p className="text-sm text-gray-600">PDF or DOC (Max 5MB)</p>
                    </div>
                  )}
                  <input type="file" id="resume" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                </div>
              </FormField>
            </FormSection>
          </>
        )}

        {/* Step 2: Professional Information */}
        {step === 2 && (
          <>
            <FormSection
              title="Professional Information"
              description="Tell us about your professional background"
            >
              <FormField label="Professional Title" required>
                <Input
                  name="professional_title"
                  value={formData.professional_title}
                  onChange={handleInputChange}
                  placeholder="Senior HR Manager"
                />
              </FormField>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Current Company">
                  <Input
                    name="current_company"
                    value={formData.current_company}
                    onChange={handleInputChange}
                    placeholder="Company name"
                  />
                </FormField>
                <FormField label="Current Designation">
                  <Input
                    name="current_designation"
                    value={formData.current_designation}
                    onChange={handleInputChange}
                    placeholder="Job title"
                  />
                </FormField>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FormField label="Years of Experience" required>
                  <Input
                    type="number"
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleInputChange}
                    min="0"
                  />
                </FormField>
                <FormField label="Industry" required>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </FormField>
                <FormField label="Trainer Type" required>
                  <select
                    name="trainer_type"
                    value={formData.trainer_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Type</option>
                    {TRAINER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </FormField>
              </div>
            </FormSection>
          </>
        )}

        {/* Step 3: About You */}
        {step === 3 && (
          <>
            <FormSection
              title="About You"
              description="Help students understand why they should book with you"
            >
              <FormField label="Headline" required>
                <Input
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  placeholder="Helping fresh graduates succeed in HR interviews"
                  maxLength={255}
                />
                <p className="text-xs text-gray-500 mt-2">{formData.headline.length}/255</p>
              </FormField>

              <FormField label="Bio / About Me" required>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Write a detailed introduction about your experience, expertise, and teaching style..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className={`text-xs ${formData.bio.length >= 100 ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.bio.length} characters (minimum 100 required)
                  </p>
                  {formData.bio.length >= 100 && <span className="text-green-600 text-xs font-medium">✓ Good</span>}
                </div>
              </FormField>

              <FormField label="Why Book a Session With Me?" required>
                <textarea
                  name="booking_value_statement"
                  value={formData.booking_value_statement}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Explain the specific value and benefits students will receive from your sessions..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">This helps students decide if you're the right fit</p>
              </FormField>
            </FormSection>
          </>
        )}

        {/* Step 4: Expertise */}
        {step === 4 && (
          <>
            <FormSection
              title="Your Expertise"
              description="Tell students what you specialize in"
            >
              <FormField label="Target Student Levels" required>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TARGET_LEVELS.map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleArrayToggle('target_student_levels', level)}
                      className={`px-4 py-3 rounded-lg font-medium border-2 transition-all ${
                        formData.target_student_levels.includes(level)
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </FormField>

              <FormField label="Preferred Session Modes" required>
                <div className="grid grid-cols-2 gap-3">
                  {SESSION_MODES.map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleArrayToggle('preferred_session_modes', mode)}
                      className={`px-4 py-3 rounded-lg font-medium border-2 transition-all ${
                        formData.preferred_session_modes.includes(mode)
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </FormField>
            </FormSection>
          </>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <>
            <FormSection title="Review Your Profile">
              <div className="space-y-8">
                {formData.profile_photo_url && (
                  <div className="flex gap-6">
                    <img src={formData.profile_photo_url} alt="Profile" className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{formData.display_name}</h3>
                      <p className="text-lg text-gray-600 mt-1">{formData.professional_title}</p>
                      <p className="text-sm text-gray-500 mt-2">{formData.location} • {formData.years_experience}+ years</p>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</p>
                    <p className="text-gray-900 font-medium mt-2">{formData.current_company || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Industry</p>
                    <p className="text-gray-900 font-medium mt-2">{formData.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</p>
                    <p className="text-gray-900 font-medium mt-2">{formData.trainer_type}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Languages</p>
                    <p className="text-gray-900 font-medium mt-2">{formData.preferred_language}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Headline</p>
                  <p className="text-gray-900">{formData.headline}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900"><strong>Bio:</strong> {formData.bio}</p>
                </div>
              </div>
            </FormSection>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between mt-12 pb-8">
          {step > 1 && (
            <Button
              variant="outline"
              className="flex gap-2 px-6"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>
          )}
          <div className="flex-1" />
          <div className="flex gap-3">
            {step < 5 && (
              <Button
                variant="outline"
                className="flex gap-2 px-6"
                onClick={() => handleSave(false)}
                loading={loading}
              >
                <Save className="w-5 h-5" />
                Save Progress
              </Button>
            )}
            {step < 5 ? (
              <Button
                variant="primary"
                className="flex gap-2 px-8"
                onClick={handleNext}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                className="flex gap-2 px-8"
                onClick={handleSubmit}
                loading={loading}
              >
                <Save className="w-5 h-5" />
                Complete & Save
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

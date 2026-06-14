'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input } from '@/components/ui';
import { Save, X, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const CATEGORIES = ['HR Interview', 'Technical Interview', 'CV Review', 'Career Counseling', 'Company Interview Prep'];
const TARGET_LEVELS = ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Executive'];
const SESSION_DURATIONS = [30, 45, 60];
const SESSION_MODES = ['Video Interview', 'Audio Only', 'Document Review', 'Chat + Feedback'];
const LANGUAGES = ['Bangla', 'English', 'Bangla + English'];
const RESCHEDULE_OPTIONS = [0, 1, 2];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMEZONES = ['UTC', 'EST', 'CST', 'PST', 'IST', 'GMT', 'CET'];
const STATUS_OPTIONS = ['Draft', 'Active', 'Hidden'];

type FormData = {
  title: string;
  category: string;
  difficulty_level: string;
  short_description: string;
  description: string;
  session_duration: number;
  session_type: string;
  language: string;
  max_reschedule: number;
  preparation_instructions: string;
  price: string;
  discount_price: string;
  number_of_sessions: number;
  availability_mode: 'existing' | 'create';
  days_of_week: string[];
  session_time: string;
  timezone: string;
  start_date: string;
  status: string;
  is_featured: boolean;
  requires_resume: boolean;
  requires_linkedin: boolean;
  requires_portfolio: boolean;
  requires_job_description: boolean;
  tags: string;
  includes_cv_review: boolean;
  includes_career_guideline: boolean;
  includes_mock_interview: boolean;
};

export default function CreateInterviewPackagePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    difficulty_level: 'Fresher',
    short_description: '',
    description: '',
    session_duration: 45,
    session_type: 'Video Interview',
    language: 'English',
    max_reschedule: 1,
    preparation_instructions: '',
    price: '',
    discount_price: '',
    number_of_sessions: 1,
    availability_mode: 'create',
    days_of_week: [],
    session_time: '18:00',
    timezone: 'UTC',
    start_date: '',
    status: 'Draft',
    is_featured: false,
    requires_resume: false,
    requires_linkedin: false,
    requires_portfolio: false,
    requires_job_description: false,
    tags: '',
    includes_cv_review: false,
    includes_career_guideline: false,
    includes_mock_interview: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'session_duration' || name === 'max_reschedule' || name === 'number_of_sessions' ? Number(value) : value,
      }));
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day],
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.title && formData.category && formData.difficulty_level && formData.short_description && formData.description);
      case 2:
        return !!(formData.session_duration && formData.session_type && formData.language);
      case 3:
        return !!(formData.price && Number(formData.price) > 0);
      case 4:
        return !!(formData.availability_mode === 'existing' || (formData.days_of_week.length > 0 && formData.start_date));
      case 5:
        return !!formData.status;
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

  const submitPackage = async (asDraft = false) => {
    if (!validateStep(5)) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        interview_type: formData.session_type,
        difficulty_level: formData.difficulty_level.toLowerCase(),
        language: formData.language,
        short_description: formData.short_description,
        description: formData.description,
        number_of_sessions: formData.number_of_sessions,
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : null,
        session_duration: formData.session_duration,
        package_validity: 30,
        max_students: 10,
        session_type: 'one_to_one',
        days_of_week: formData.days_of_week,
        session_time: formData.session_time,
        timezone: formData.timezone,
        start_date: formData.start_date,
        end_date: null,
        repeat_weekly: true,
        includes_cv_review: formData.includes_cv_review,
        includes_career_guideline: formData.includes_career_guideline,
        includes_mock_interview: formData.includes_mock_interview,
        status: asDraft ? 'draft' : formData.status.toLowerCase(),
      };

      const response = await fetch('/api/v1/trainers/interview-packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create package');
      }

      alert(`Package ${asDraft ? 'saved as draft' : 'published'} successfully!`);
      window.location.href = '/trainer/interview-packages';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create package');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPackage(false);
  };

  const stepLabels = ['Basic Info', 'Session', 'Pricing', 'Availability', 'Publish'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Package</h1>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <Card>
            <CardHeader><h2 className="font-bold text-lg">Basic Information</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Package Title *</label>
                <Input name="title" placeholder="e.g., HR Mock Interview for Fresh Graduates" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" required>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Target Level *</label>
                  <select name="difficulty_level" value={formData.difficulty_level} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" required>
                    {TARGET_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Short Description *</label>
                <Input name="short_description" placeholder="45-minute structured mock interview with feedback." value={formData.short_description} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Detailed Description *</label>
                <textarea name="description" placeholder="What student will get, session style, preparation tips..." value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" required />
              </div>
            </CardBody>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader><h2 className="font-bold text-lg">Session Details</h2></CardHeader>
            <CardBody className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Session Duration *</label>
                  <select name="session_duration" value={formData.session_duration} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" required>
                    {SESSION_DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Session Mode *</label>
                  <select name="session_type" value={formData.session_type} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" required>
                    {SESSION_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Language *</label>
                  <select name="language" value={formData.language} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" required>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Maximum Reschedule Allowed</label>
                  <select name="max_reschedule" value={formData.max_reschedule} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600">
                    {RESCHEDULE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Number of Sessions</label>
                  <Input type="number" name="number_of_sessions" value={formData.number_of_sessions} onChange={handleInputChange} min="1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Preparation Instructions</label>
                <textarea name="preparation_instructions" placeholder="What student should prepare before joining..." value={formData.preparation_instructions} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              </div>
            </CardBody>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader><h2 className="font-bold text-lg">Pricing</h2></CardHeader>
            <CardBody className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Price *</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 bg-gray-100 rounded-lg">৳</span>
                    <Input type="number" name="price" placeholder="800" value={formData.price} onChange={handleInputChange} step="0.01" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Discount Price (Optional)</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 bg-gray-100 rounded-lg">৳</span>
                    <Input type="number" name="discount_price" placeholder="Optional" value={formData.discount_price} onChange={handleInputChange} step="0.01" />
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700"><strong>Trainer Receivable:</strong> ৳{formData.price ? (Number(formData.price) * 0.8).toFixed(2) : '0'} (80%)</p>
              </div>
            </CardBody>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader><h2 className="font-bold text-lg">Availability</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-3">Availability Mode</label>
                <div className="space-y-2">
                  <label className="flex gap-3 p-3 border rounded-lg cursor-pointer" style={{backgroundColor: formData.availability_mode === 'existing' ? '#f0f9ff' : ''}}>
                    <input type="radio" name="availability_mode" value="existing" checked={formData.availability_mode === 'existing'} onChange={handleInputChange} />
                    <span>Use Existing Availability Calendar</span>
                  </label>
                  <label className="flex gap-3 p-3 border rounded-lg cursor-pointer" style={{backgroundColor: formData.availability_mode === 'create' ? '#f0f9ff' : ''}}>
                    <input type="radio" name="availability_mode" value="create" checked={formData.availability_mode === 'create'} onChange={handleInputChange} />
                    <span>Create Availability Now</span>
                  </label>
                </div>
              </div>

              {formData.availability_mode === 'create' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Select Days *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {DAYS.map(day => (
                        <button key={day} type="button" onClick={() => handleDayToggle(day)} className={`px-3 py-2 rounded-lg font-medium transition ${formData.days_of_week.includes(day) ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Time *</label>
                      <Input type="time" name="session_time" value={formData.session_time} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Start Date *</label>
                      <Input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Timezone</label>
                      <select name="timezone" value={formData.timezone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600">
                        {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        )}

        {step === 5 && (
          <>
            <Card>
              <CardHeader><h2 className="font-bold text-lg">Package Visibility</h2></CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Package Status *</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600" required>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <label className="flex gap-3 p-3 border rounded-lg cursor-pointer">
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} />
                  <span className="font-semibold">Featured Package?</span>
                </label>
                <div>
                  <label className="block text-sm font-semibold mb-3">Student Requirements</label>
                  <div className="space-y-2">
                    <label className="flex gap-3"><input type="checkbox" name="requires_resume" checked={formData.requires_resume} onChange={handleInputChange} /><span>Resume Required</span></label>
                    <label className="flex gap-3"><input type="checkbox" name="requires_linkedin" checked={formData.requires_linkedin} onChange={handleInputChange} /><span>LinkedIn Required</span></label>
                    <label className="flex gap-3"><input type="checkbox" name="requires_portfolio" checked={formData.requires_portfolio} onChange={handleInputChange} /><span>Portfolio/GitHub Required</span></label>
                    <label className="flex gap-3"><input type="checkbox" name="requires_job_description" checked={formData.requires_job_description} onChange={handleInputChange} /><span>Job Description Required</span></label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tags (comma separated)</label>
                  <Input name="tags" placeholder="e.g., HR, Fresh Graduate, Communication" value={formData.tags} onChange={handleInputChange} />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h2 className="font-bold text-lg">Review & Summary</h2></CardHeader>
              <CardBody className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Package</p>
                    <p className="font-semibold">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold">{formData.session_duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Price</p>
                    <p className="font-semibold">৳{formData.price || '0'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mode</p>
                    <p className="font-semibold">{formData.session_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Language</p>
                    <p className="font-semibold">{formData.language}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-semibold">{formData.status}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}

        <div className="flex gap-3 justify-between">
          {step > 1 && (
            <Button variant="outline" className="flex gap-2" onClick={handlePrev}><ChevronLeft className="w-5 h-5" />Back</Button>
          )}
          <div className="flex-1" />
          {step < 5 ? (
            <Button variant="primary" className="flex gap-2" onClick={handleNext}>Next<ChevronRight className="w-5 h-5" /></Button>
          ) : (
            <>
              <Button variant="outline" className="flex gap-2" onClick={() => submitPackage(true)} loading={loading}>Save as Draft</Button>
              <Button variant="primary" type="submit" className="flex gap-2" loading={loading}><Save className="w-5 h-5" />Publish Package</Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

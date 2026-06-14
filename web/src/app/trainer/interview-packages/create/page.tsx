'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input } from '@/components/ui';
import { Save, X, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Cybersecurity', 'Web Development', 'Cloud Computing', 'Data Science', 'AI/ML'];
const INTERVIEW_TYPES = ['Mock Interview', 'Real Interview', 'Technical Assessment'];
const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMEZONES = ['UTC', 'EST', 'CST', 'PST', 'IST', 'GMT', 'CET'];

export default function CreateInterviewPackagePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    interview_type: '',
    difficulty_level: '',
    language: 'English',
    short_description: '',
    description: '',
    number_of_sessions: 3,
    price: '',
    discount_price: '',
    session_duration: 40,
    package_validity: 30,
    max_students: 10,
    session_type: 'one_to_one',
    days_of_week: [] as string[],
    session_time: '18:30',
    timezone: 'UTC',
    start_date: '',
    end_date: '',
    repeat_weekly: true,
    includes_cv_review: true,
    includes_career_guideline: true,
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
        [name]: value,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Call API trainerApi.createInterviewPackage(formData)
      setTimeout(() => {
        alert('Interview package created successfully!');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to create package');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Create Interview Package</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><h2 className="font-bold text-lg">Basic Information</h2></CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Interview Session Title *</label>
              <Input name="title" placeholder="e.g., Cybersecurity Mock Interview" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-600" required>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Difficulty Level *</label>
                <select name="difficulty_level" value={formData.difficulty_level} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-600" required>
                  <option value="">Select Level</option>
                  {DIFFICULTY_LEVELS.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-600" required />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-bold text-lg">Package Info</h2></CardHeader>
          <CardBody className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Number of Sessions *</label>
                <Input type="number" name="number_of_sessions" value={formData.number_of_sessions} onChange={handleInputChange} min="1" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Duration (min) *</label>
                <Input type="number" name="session_duration" value={formData.session_duration} onChange={handleInputChange} min="15" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price ($) *</label>
                <Input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" required />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-bold text-lg">Schedule</h2></CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Select Days *</label>
              <div className="grid grid-cols-4 gap-2">
                {DAYS.map(day => (
                  <button key={day} type="button" onClick={() => handleDayToggle(day)} className={`px-3 py-2 rounded-lg font-medium ${formData.days_of_week.includes(day) ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Time *</label>
                <Input type="time" name="session_time" value={formData.session_time} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Start Date *</label>
                <Input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-bold text-lg">Package Includes</h2></CardHeader>
          <CardBody className="space-y-3">
            <label className="flex gap-3"><input type="checkbox" name="includes_cv_review" checked={formData.includes_cv_review} onChange={handleInputChange} /><span>CV Review</span></label>
            <label className="flex gap-3"><input type="checkbox" name="includes_career_guideline" checked={formData.includes_career_guideline} onChange={handleInputChange} /><span>Career Guideline</span></label>
            <label className="flex gap-3"><input type="checkbox" name="includes_mock_interview" checked={formData.includes_mock_interview} onChange={handleInputChange} /><span>Mock Interview</span></label>
          </CardBody>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" className="flex gap-2" onClick={() => window.history.back()}><X className="w-5 h-5" />Cancel</Button>
          <Button variant="primary" type="submit" className="flex gap-2" loading={loading}><Save className="w-5 h-5" />Create</Button>
        </div>
      </form>
    </div>
  );
}

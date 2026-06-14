'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Spinner } from '@/components/ui';
import { Edit, Save, AlertCircle, Building2, Mail, MapPin, Globe, Phone } from 'lucide-react';

interface CompanyProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  industry: string;
  company_size: string;
  description: string;
  logo_url: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/v1/companies/me/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setProfile(null);
          return;
        }
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      setProfile(data.data);
      setFormData(data.data);
    } catch (err) {
      setProfile(getMockProfile());
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/v1/companies/me/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save profile');

      const data = await response.json();
      setProfile(data.data);
      setEditing(false);
      alert('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          {!editing && profile && (
            <Button variant="primary" className="flex gap-2" onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!profile ? (
          <Card>
            <CardBody className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No profile yet</p>
              <p className="text-sm text-gray-500 mt-2">Sign in to create your company profile</p>
            </CardBody>
          </Card>
        ) : (
          <>
            {/* KYC Status */}
            {profile.kyc_status === 'verified' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-700 font-medium">✓ Your company profile is verified</p>
              </div>
            )}
            {profile.kyc_status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 font-medium">✗ Your profile was rejected. Please update and resubmit.</p>
              </div>
            )}
            {profile.kyc_status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-700 font-medium">⏳ Your profile is pending verification</p>
              </div>
            )}

            {/* Profile Card */}
            <Card>
              <CardHeader>
                <h2 className="font-bold text-lg">Company Information</h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {editing ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name *</label>
                        <Input name="name" value={formData.name || ''} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                        <Input name="email" type="email" value={formData.email || ''} onChange={handleInputChange} required />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                        <Input name="phone" type="tel" value={formData.phone || ''} onChange={handleInputChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Website</label>
                        <Input name="website" type="url" value={formData.website || ''} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
                        <Input name="location" value={formData.location || ''} onChange={handleInputChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Industry</label>
                        <Input name="industry" value={formData.industry || ''} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Company Size</label>
                      <select name="company_size" value={formData.company_size || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                        <option value="">Select Size</option>
                        <option value="1-50">1-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                      <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                      <Button variant="primary" className="flex gap-2" onClick={handleSave} loading={saving}>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Company Name</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Industry</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.industry || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Company Size</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.company_size || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {profile.location || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 space-y-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Contact Information</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${profile.email}`}>{profile.email}</a>
                        </div>
                        {profile.phone && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                          </div>
                        )}
                        {profile.website && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a>
                          </div>
                        )}
                      </div>
                    </div>

                    {profile.description && (
                      <div className="pt-6 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">About</p>
                        <p className="text-gray-700">{profile.description}</p>
                      </div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function getMockProfile(): CompanyProfile {
  return {
    id: 1,
    name: 'Sample Company',
    email: 'contact@company.com',
    phone: '+1234567890',
    website: 'https://company.com',
    location: 'New York, USA',
    industry: 'Technology',
    company_size: '201-500',
    description: 'We are a leading technology company dedicated to innovation...',
    logo_url: '',
    kyc_status: 'pending',
    created_at: new Date().toISOString()
  };
}

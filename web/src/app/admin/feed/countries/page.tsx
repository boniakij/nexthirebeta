'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Badge } from '@/components/ui';
import { Settings } from 'lucide-react';

interface CountrySetting {
  id: number;
  country_code: string;
  country_name: string;
  country_flag: string;
  default_currency: string;
  show_flag: boolean;
  allow_trainers: boolean;
  allow_booking: boolean;
  status: 'active' | 'inactive';
  package_count: number;
}

const MOCK_COUNTRIES: CountrySetting[] = [
  {
    id: 1,
    country_code: 'BD',
    country_name: 'Bangladesh',
    country_flag: '🇧🇩',
    default_currency: 'BDT',
    show_flag: true,
    allow_trainers: true,
    allow_booking: true,
    status: 'active',
    package_count: 850,
  },
  {
    id: 2,
    country_code: 'IN',
    country_name: 'India',
    country_flag: '🇮🇳',
    default_currency: 'INR',
    show_flag: true,
    allow_trainers: true,
    allow_booking: true,
    status: 'active',
    package_count: 210,
  },
  {
    id: 3,
    country_code: 'US',
    country_name: 'United States',
    country_flag: '🇺🇸',
    default_currency: 'USD',
    show_flag: true,
    allow_trainers: true,
    allow_booking: true,
    status: 'active',
    package_count: 156,
  },
  {
    id: 4,
    country_code: 'GB',
    country_name: 'United Kingdom',
    country_flag: '🇬🇧',
    default_currency: 'GBP',
    show_flag: true,
    allow_trainers: true,
    allow_booking: true,
    status: 'active',
    package_count: 98,
  },
  {
    id: 5,
    country_code: 'PK',
    country_name: 'Pakistan',
    country_flag: '🇵🇰',
    default_currency: 'PKR',
    show_flag: true,
    allow_trainers: false,
    allow_booking: false,
    status: 'inactive',
    package_count: 0,
  },
];

export default function AdminFeedCountries() {
  const [countries, setCountries] = useState<CountrySetting[]>(MOCK_COUNTRIES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CountrySetting>>({});

  const handleToggleStatus = (id: number) => {
    setCountries(countries.map(c =>
      c.id === id
        ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
        : c
    ));
  };

  const handleEditClick = (country: CountrySetting) => {
    setEditingId(country.id);
    setFormData(country);
  };

  const handleSave = () => {
    if (editingId) {
      setCountries(countries.map(c =>
        c.id === editingId ? { ...c, ...formData } : c
      ));
      setEditingId(null);
      setFormData({});
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Country Feed Settings</h1>
        <p className="text-gray-600 mt-1">Control feed visibility and trainer access by country</p>
      </div>

      {/* Countries Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Packages</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trainers</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {countries.map((country) => (
                <tr key={country.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.country_flag}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{country.country_name}</p>
                        <p className="text-xs text-gray-500">{country.country_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {country.default_currency}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{country.package_count}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={country.allow_trainers ? 'success' : 'gray'}>
                      {country.allow_trainers ? 'Allowed' : 'Blocked'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={country.allow_booking ? 'success' : 'gray'}>
                      {country.allow_booking ? 'Allowed' : 'Blocked'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={country.status === 'active' ? 'success' : 'gray'} className="capitalize">
                      {country.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditClick(country)}
                      className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded transition flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {formData.country_flag} {formData.country_name} Settings
              </h2>
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({});
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </CardHeader>
            <CardBody className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency
                </label>
                <input
                  type="text"
                  value={formData.default_currency || ''}
                  onChange={(e) => setFormData({ ...formData, default_currency: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="e.g., BDT"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    checked={formData.show_flag ?? true}
                    onChange={(e) => setFormData({ ...formData, show_flag: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Country Flag on Feed?</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    checked={formData.allow_trainers ?? true}
                    onChange={(e) => setFormData({ ...formData, allow_trainers: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Allow Trainers From This Country?</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    checked={formData.allow_booking ?? true}
                    onChange={(e) => setFormData({ ...formData, allow_booking: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Allow Students To Book From This Country?</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button onClick={handleSave} className="flex-1">
                  Save Settings
                </Button>
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setFormData({});
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

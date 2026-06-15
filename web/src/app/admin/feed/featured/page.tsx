'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Badge } from '@/components/ui';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface FeaturedPackage {
  id: number;
  title: string;
  trainer: string;
  priority: number;
  status: 'active' | 'scheduled' | 'expired';
  starts_at: string;
  ends_at: string;
}

const MOCK_FEATURED: FeaturedPackage[] = [
  {
    id: 1,
    title: 'HR Mock Interview',
    trainer: 'Rahim Uddin',
    priority: 1,
    status: 'active',
    starts_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'Technical Interview Prep',
    trainer: 'Hasan Ali',
    priority: 2,
    status: 'active',
    starts_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: 'CV Review Package',
    trainer: 'Nusrat Jahan',
    priority: 3,
    status: 'active',
    starts_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AdminFeaturedPackages() {
  const [featured, setFeatured] = useState<FeaturedPackage[]>(MOCK_FEATURED);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    package: '',
    position: 'top-feed',
    priority: '1',
    startDate: '',
    endDate: '',
    status: 'active',
  });

  const handleRemove = (id: number) => {
    setFeatured(featured.filter(f => f.id !== id));
  };

  const handleAddFeatured = () => {
    if (formData.package && formData.startDate && formData.endDate) {
      const newFeatured: FeaturedPackage = {
        id: Math.max(...featured.map(f => f.id), 0) + 1,
        title: formData.package,
        trainer: 'New Trainer',
        priority: parseInt(formData.priority),
        status: formData.status as any,
        starts_at: formData.startDate,
        ends_at: formData.endDate,
      };
      setFeatured([...featured, newFeatured]);
      setFormData({
        package: '',
        position: 'top-feed',
        priority: '1',
        startDate: '',
        endDate: '',
        status: 'active',
      });
      setShowAddModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'expired':
        return 'gray';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Featured Packages</h1>
          <p className="text-gray-600 mt-1">Packages featured on the public feed appear higher in rankings</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Featured Package
        </Button>
      </div>

      {/* Featured List */}
      <Card className="border-0 shadow-sm overflow-hidden">
        {featured.length === 0 ? (
          <CardBody className="p-12 text-center">
            <p className="text-gray-500">No featured packages yet</p>
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trainer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {featured.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {pkg.priority}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{pkg.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{pkg.trainer}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(pkg.starts_at)} → {formatDate(pkg.ends_at)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(pkg.status)} className="capitalize">
                        {pkg.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded transition" title="Edit">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleRemove(pkg.id)}
                        className="p-2 hover:bg-red-50 rounded transition"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Featured Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Featured Package</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </CardHeader>
            <CardBody className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Package *
                </label>
                <input
                  type="text"
                  placeholder="Search package..."
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feature Position
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="top-feed">Top Feed</option>
                  <option value="category-feed">Category Feed</option>
                  <option value="country-feed">Country Feed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button onClick={handleAddFeatured} className="flex-1">
                  Save Featured Package
                </Button>
                <Button
                  onClick={() => setShowAddModal(false)}
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

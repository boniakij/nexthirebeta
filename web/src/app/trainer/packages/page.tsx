'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Modal, Input, Spinner } from '@/components/ui';
import { trainerApi } from '@/lib/api/trainer';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Package {
  id: number;
  title: string;
  description: string;
  price: number;
  session_count: number;
  duration_minutes: number;
  interview_type: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_live: boolean;
  includes_cv_review: boolean;
  is_active: boolean;
  total_bookings?: number;
}

function PackagesContent() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    session_count: 1,
    duration_minutes: 45,
    interview_type: 'Technical',
    domain: 'Software Engineering',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    is_live: true,
    includes_cv_review: false,
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await trainerApi.getPackages();
        setPackages(data.data || []);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
        setPackages(getMockPackages());
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleCreate = () => {
    setEditingPackage(null);
    setFormData({
      title: '',
      description: '',
      price: 0,
      session_count: 1,
      duration_minutes: 45,
      interview_type: 'Technical',
      domain: 'Software Engineering',
      difficulty: 'intermediate',
      is_live: true,
      includes_cv_review: false,
    });
    setShowModal(true);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      session_count: pkg.session_count,
      duration_minutes: pkg.duration_minutes,
      interview_type: pkg.interview_type,
      domain: pkg.domain,
      difficulty: pkg.difficulty,
      is_live: pkg.is_live,
      includes_cv_review: pkg.includes_cv_review,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingPackage) {
        // Update existing package
        await trainerApi.updatePackage(editingPackage.id, formData);
      } else {
        // Create new package
        await trainerApi.createPackage(formData);
      }
      setShowModal(false);
      // Refresh packages
    } catch (error) {
      console.error('Failed to save package:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        await trainerApi.deletePackage(id);
        setPackages(packages.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Failed to delete package:', error);
      }
    }
  };

  const handleToggleActive = async (pkg: Package) => {
    try {
      await trainerApi.updatePackage(pkg.id, { is_active: !pkg.is_active });
      setPackages(
        packages.map((p) => (p.id === pkg.id ? { ...p, is_active: !p.is_active } : p))
      );
    } catch (error) {
      console.error('Failed to toggle package:', error);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">📦 My Packages</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Package
        </Button>
      </div>

      {packages.length > 0 ? (
        <div className="space-y-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={!pkg.is_active ? 'opacity-60' : ''}>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                    <p className="text-gray-600 mt-1">{pkg.description}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="primary">{pkg.interview_type}</Badge>
                      <Badge variant="purple">{pkg.domain}</Badge>
                      <Badge
                        variant={
                          pkg.difficulty === 'advanced'
                            ? 'danger'
                            : pkg.difficulty === 'intermediate'
                              ? 'warning'
                              : 'success'
                        }
                      >
                        {pkg.difficulty}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600">Sessions</p>
                        <p className="font-bold text-gray-900">{pkg.session_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Duration</p>
                        <p className="font-bold text-gray-900">{pkg.duration_minutes}m</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">CV Review</p>
                        <p className="font-bold text-gray-900">{pkg.includes_cv_review ? '✓' : '✗'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Bookings</p>
                        <p className="font-bold text-gray-900">{pkg.total_bookings || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <p className="text-2xl font-bold text-primary-600">৳{pkg.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(pkg)}
                        className="p-2 hover:bg-gray-100 rounded-btn transition"
                      >
                        {pkg.is_active ? (
                          <ToggleRight className="w-5 h-5 text-success-500" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="p-2 hover:bg-gray-100 rounded-btn transition"
                      >
                        <Edit2 className="w-5 h-5 text-primary-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 hover:bg-gray-100 rounded-btn transition"
                      >
                        <Trash2 className="w-5 h-5 text-danger-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-600 mb-4">No packages yet. Create your first package!</p>
            <Button onClick={handleCreate}>Create Package</Button>
          </CardBody>
        </Card>
      )}

      {/* Package Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPackage ? 'Edit Package' : 'Create Package'}
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., System Design Mastery"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what students will learn..."
              className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
              rows={3}
            />
          </div>
          <Input
            label="Price (BDT)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
          />
          <Input
            label="Number of Sessions"
            type="number"
            min="1"
            max="10"
            value={formData.session_count}
            onChange={(e) => setFormData({ ...formData, session_count: parseInt(e.target.value) })}
          />
          <select
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_live}
                onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Live Sessions</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includes_cv_review}
                onChange={(e) => setFormData({ ...formData, includes_cv_review: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Includes CV Review</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} variant="primary" className="flex-1">
              {editingPackage ? 'Update' : 'Create'} Package
            </Button>
            <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <RoleGuard allowedRoles={['trainer']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <PackagesContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockPackages(): Package[] {
  return [
    {
      id: 1,
      title: 'System Design Mastery (3 Sessions)',
      description: 'Deep dive into system design patterns and real-world scenarios',
      price: 1500,
      session_count: 3,
      duration_minutes: 60,
      interview_type: 'System Design',
      domain: 'Software Engineering',
      difficulty: 'advanced',
      is_live: true,
      includes_cv_review: true,
      is_active: true,
      total_bookings: 45,
    },
    {
      id: 2,
      title: 'Technical Interview Prep (5 Sessions)',
      description: 'Comprehensive technical interview preparation',
      price: 2000,
      session_count: 5,
      duration_minutes: 45,
      interview_type: 'Technical',
      domain: 'Software Engineering',
      difficulty: 'intermediate',
      is_live: true,
      includes_cv_review: true,
      is_active: true,
      total_bookings: 67,
    },
  ];
}

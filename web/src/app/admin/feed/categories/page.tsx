'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Badge } from '@/components/ui';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';

interface FeedCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'inactive';
  sort_order: number;
  package_count: number;
}

const MOCK_CATEGORIES: FeedCategory[] = [
  {
    id: 1,
    name: 'HR Interview',
    slug: 'hr-interview',
    description: 'Mock HR interview and behavioral interview preparation',
    status: 'active',
    sort_order: 1,
    package_count: 145,
  },
  {
    id: 2,
    name: 'Technical Interview',
    slug: 'technical-interview',
    description: 'DSA, system design, coding problems for tech roles',
    status: 'active',
    sort_order: 2,
    package_count: 287,
  },
  {
    id: 3,
    name: 'CV Review',
    slug: 'cv-review',
    description: 'Resume review, optimization, and ATS-friendly formatting',
    status: 'active',
    sort_order: 3,
    package_count: 98,
  },
  {
    id: 4,
    name: 'Career Counseling',
    slug: 'career-counseling',
    description: 'Career guidance and job search strategies',
    status: 'active',
    sort_order: 4,
    package_count: 67,
  },
  {
    id: 5,
    name: 'LinkedIn Review',
    slug: 'linkedin-review',
    description: 'LinkedIn profile optimization for job search',
    status: 'active',
    sort_order: 5,
    package_count: 54,
  },
];

export default function AdminFeedCategories() {
  const [categories, setCategories] = useState<FeedCategory[]>(MOCK_CATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'active',
    sort_order: '',
  });

  const handleAddCategory = () => {
    if (formData.name && formData.slug) {
      const newCategory: FeedCategory = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        status: formData.status as any,
        sort_order: parseInt(formData.sort_order) || categories.length + 1,
        package_count: 0,
      };
      setCategories([...categories, newCategory]);
      resetForm();
    }
  };

  const handleUpdateCategory = (id: number) => {
    setCategories(categories.map(c =>
      c.id === id
        ? {
            ...c,
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            status: formData.status as any,
            sort_order: parseInt(formData.sort_order) || c.sort_order,
          }
        : c
    ));
    setEditingId(null);
    resetForm();
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      status: 'active',
      sort_order: '',
    });
  };

  const startEdit = (category: FeedCategory) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      status: category.status,
      sort_order: category.sort_order.toString(),
    });
    setEditingId(category.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feed Categories</h1>
          <p className="text-gray-600 mt-1">Manage package categories shown in feed filters</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <CardBody className="p-12 text-center">
            <p className="text-gray-500">No categories yet</p>
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-8"></th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Packages</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-center">
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-500">{category.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 line-clamp-2">
                        {category.description}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {category.package_count}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={category.status === 'active' ? 'success' : 'gray'} className="capitalize">
                          {category.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-semibold text-sm">
                          {category.sort_order}
                        </div>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <button
                          onClick={() => startEdit(category)}
                          className="p-2 hover:bg-gray-100 rounded transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 hover:bg-red-50 rounded transition"
                          title="Delete"
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

      {/* Add/Edit Modal */}
      {(showAddModal || editingId) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </CardHeader>
            <CardBody className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="e.g., HR Interview"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="e.g., hr-interview"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="Category description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    if (editingId) {
                      handleUpdateCategory(editingId);
                    } else {
                      handleAddCategory();
                    }
                  }}
                  className="flex-1"
                >
                  {editingId ? 'Update' : 'Add'} Category
                </Button>
                <Button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                    resetForm();
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

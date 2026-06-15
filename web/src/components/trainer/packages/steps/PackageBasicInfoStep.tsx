'use client';

import { PackageFormState } from '@/types/trainerPackage';

interface PackageBasicInfoStepProps {
  formData: PackageFormState;
  setFormData: (data: PackageFormState) => void;
  errors: Record<string, string>;
}

const CATEGORIES = [
  'HR Interview',
  'Technical Interview',
  'CV Review',
  'Career Counseling',
  'LinkedIn Review',
  'Company Interview Prep',
  'Communication Practice',
  'Leadership Interview',
];

const TARGET_LEVELS = ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Executive'];

const PACKAGE_TYPES = [
  '1:1 Live Session',
  'CV Review',
  'Document Review',
  'Career Counseling',
  'Mock Interview',
  'Bundle Package',
];

export default function PackageBasicInfoStep({
  formData,
  setFormData,
  errors,
}: PackageBasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Package Title <span className="text-danger-600">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="HR Mock Interview for Fresh Graduates"
          className={`w-full px-4 py-2 rounded-lg border focus:ring-1 focus:ring-primary-500 ${
            errors.title ? 'border-danger-500' : 'border-gray-300 focus:border-primary-500'
          }`}
        />
        {errors.title && <p className="text-danger-600 text-sm mt-1">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-danger-600">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-1 focus:ring-primary-500 ${
              errors.category ? 'border-danger-500' : 'border-gray-300 focus:border-primary-500'
            }`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-danger-600 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Level <span className="text-danger-600">*</span>
          </label>
          <select
            value={formData.target_level}
            onChange={(e) => setFormData({ ...formData, target_level: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-1 focus:ring-primary-500 ${
              errors.target_level ? 'border-danger-500' : 'border-gray-300 focus:border-primary-500'
            }`}
          >
            {TARGET_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.target_level && (
            <p className="text-danger-600 text-sm mt-1">{errors.target_level}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Package Type <span className="text-danger-600">*</span>
        </label>
        <select
          value={formData.package_type}
          onChange={(e) => setFormData({ ...formData, package_type: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          {PACKAGE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description <span className="text-danger-600">*</span>
        </label>
        <textarea
          value={formData.short_description}
          onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
          placeholder="45-minute structured HR interview with feedback"
          rows={2}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-1 focus:ring-primary-500 ${
            errors.short_description ? 'border-danger-500' : 'border-gray-300 focus:border-primary-500'
          }`}
        />
        {errors.short_description && (
          <p className="text-danger-600 text-sm mt-1">{errors.short_description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Description <span className="text-danger-600">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Explain what the student will receive from this session..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, idx) => (
            <div key={idx} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {tag}
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    tags: formData.tags.filter((_, i) => i !== idx),
                  })
                }
                className="hover:text-primary-900"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add tag and press Enter"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              setFormData({
                ...formData,
                tags: [...formData.tags, e.currentTarget.value],
              });
              e.currentTarget.value = '';
            }
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}

'use client';

import { PackageFormState } from '@/types/trainerPackage';

interface PackageSessionStepProps {
  formData: PackageFormState;
  setFormData: (data: PackageFormState) => void;
  errors: Record<string, string>;
}

const SESSION_MODES = [
  'Video Interview',
  'Audio Only',
  'Chat Session',
  'Document Review',
  'Video + Written Feedback',
];

const LANGUAGES = ['Bangla', 'English', 'Bangla + English'];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function PackageSessionStep({
  formData,
  setFormData,
  errors,
}: PackageSessionStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Session Details</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Duration <span className="text-danger-600">*</span>
        </label>
        <div className="flex gap-2">
          {[30, 45, 60].map((duration) => (
            <button
              key={duration}
              onClick={() => setFormData({ ...formData, duration_minutes: duration })}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                formData.duration_minutes === duration
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {duration} min
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Mode <span className="text-danger-600">*</span>
        </label>
        <select
          value={formData.session_mode}
          onChange={(e) => setFormData({ ...formData, session_mode: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          {SESSION_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language <span className="text-danger-600">*</span>
        </label>
        <select
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty <span className="text-danger-600">*</span>
        </label>
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          {DIFFICULTIES.map((diff) => (
            <option key={diff} value={diff.toLowerCase()}>
              {diff}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Sessions <span className="text-danger-600">*</span>
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={formData.session_count}
          onChange={(e) =>
            setFormData({ ...formData, session_count: parseInt(e.target.value) || 1 })
          }
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
          <input
            type="checkbox"
            checked={formData.includes_cv_review}
            onChange={(e) => setFormData({ ...formData, includes_cv_review: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Includes CV Review?</span>
        </label>

        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
          <input
            type="checkbox"
            checked={formData.includes_written_feedback}
            onChange={(e) =>
              setFormData({ ...formData, includes_written_feedback: e.target.checked })
            }
            className="w-4 h-4 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Includes Written Feedback?</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preparation Instructions
        </label>
        <textarea
          value={formData.preparation_instructions}
          onChange={(e) =>
            setFormData({ ...formData, preparation_instructions: e.target.value })
          }
          placeholder="Tell students what they need to prepare before the session..."
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}

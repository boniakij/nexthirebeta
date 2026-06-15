'use client';

import { PackageFormState } from '@/types/trainerPackage';

interface PackageRequirementsStepProps {
  formData: PackageFormState;
  setFormData: (data: PackageFormState) => void;
  errors: Record<string, string>;
}

const DOCUMENT_OPTIONS = [
  { key: 'resume', label: 'Resume / CV' },
  { key: 'linkedin_url', label: 'LinkedIn URL' },
  { key: 'github_url', label: 'GitHub URL' },
  { key: 'portfolio_url', label: 'Portfolio URL' },
  { key: 'job_description', label: 'Job Description' },
  { key: 'cover_letter', label: 'Cover Letter' },
];

export default function PackageRequirementsStep({
  formData,
  setFormData,
  errors,
}: PackageRequirementsStepProps) {
  const toggleDocument = (key: keyof typeof formData.required_documents) => {
    setFormData({
      ...formData,
      required_documents: {
        ...formData.required_documents,
        [key]: !formData.required_documents[key],
      },
    });
  };

  const addQuestion = (question: string) => {
    if (question.trim()) {
      setFormData({
        ...formData,
        custom_questions: [...formData.custom_questions, question],
      });
    }
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      custom_questions: formData.custom_questions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Student Requirements</h2>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Required Before Booking</h3>
        <div className="space-y-3">
          {DOCUMENT_OPTIONS.map((doc) => (
            <label
              key={doc.key}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <input
                type="checkbox"
                checked={formData.required_documents[doc.key as keyof typeof formData.required_documents]}
                onChange={() => toggleDocument(doc.key as keyof typeof formData.required_documents)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">{doc.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3">Custom Questions</h3>
        <div className="space-y-3 mb-3">
          {formData.custom_questions.map((question, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700 flex-1">{question}</span>
              <button
                onClick={() => removeQuestion(idx)}
                className="text-danger-600 hover:text-danger-700 px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="Add custom question..."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              addQuestion(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <p className="text-xs text-gray-500 mt-2">Examples: "What job role are you preparing for?", "What company are you targeting?"</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Special Instructions</h3>
        <textarea
          placeholder="Please upload your latest CV before the session..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}

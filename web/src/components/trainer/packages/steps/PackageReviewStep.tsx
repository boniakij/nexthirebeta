'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { PackageFormState } from '@/types/trainerPackage';

interface PackageReviewStepProps {
  formData: PackageFormState;
  onPublish: () => void;
  onSaveDraft: () => void;
}

const COMMISSION_RATE = 20;

export default function PackageReviewStep({
  formData,
  onPublish,
  onSaveDraft,
}: PackageReviewStepProps) {
  const commissionAmount = (formData.price * COMMISSION_RATE) / 100;
  const trainerReceivable = formData.price - commissionAmount;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Review Package</h2>

      {/* Package Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Package Title</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{formData.title}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Category</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{formData.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Target Level</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{formData.target_level}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Duration</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{formData.duration_minutes} minutes</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Language</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{formData.language}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Price</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {formData.currency} {formData.price.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Trainer Receivable</p>
            <p className="text-lg font-semibold text-primary-600 mt-1">
              {formData.currency} {trainerReceivable.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Requirements</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {Object.values(formData.required_documents).some((v) => v)
                ? 'Multiple requirements'
                : 'No requirements'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Availability</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {formData.availability_scope === 'all_slots' ? 'All active slots' : formData.availability_scope}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Status</p>
            <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">{formData.status}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
        <p className="text-gray-700">{formData.description}</p>
      </div>

      {/* Pricing Summary */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Pricing Summary</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Student Pays</span>
            <span className="font-semibold text-gray-900">
              {formData.currency} {formData.price.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform Commission ({COMMISSION_RATE}%)</span>
            <span className="font-semibold text-gray-900">
              {formData.currency} {commissionAmount.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="font-semibold text-gray-900">Trainer Receives</span>
            <span className="font-bold text-primary-600 text-lg">
              {formData.currency} {trainerReceivable.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Publishing Options */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Publishing Options</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> If admin approval is required, your package will appear on the Feed after admin review and approval.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/trainer/packages" className="flex-1">
            <Button variant="outline" className="w-full">
              Back
            </Button>
          </Link>
          <Button onClick={onSaveDraft} variant="outline" className="flex-1">
            Save as Draft
          </Button>
          <Button onClick={onPublish} className="flex-1">
            Submit for Review
          </Button>
        </div>
      </div>
    </div>
  );
}

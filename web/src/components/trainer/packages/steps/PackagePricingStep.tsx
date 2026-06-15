'use client';

import { PackageFormState } from '@/types/trainerPackage';

interface PackagePricingStepProps {
  formData: PackageFormState;
  setFormData: (data: PackageFormState) => void;
  errors: Record<string, string>;
}

const COMMISSION_RATE = 20; // 20% platform commission

export default function PackagePricingStep({
  formData,
  setFormData,
  errors,
}: PackagePricingStepProps) {
  const commissionAmount = (formData.price * COMMISSION_RATE) / 100;
  const trainerReceivable = formData.price - commissionAmount;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regular Price <span className="text-danger-600">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-700">{formData.currency}</span>
            <input
              type="number"
              min="0"
              step="100"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className={`flex-1 px-4 py-2 rounded-lg border focus:ring-1 focus:ring-primary-500 ${
                errors.price ? 'border-danger-500' : 'border-gray-300 focus:border-primary-500'
              }`}
            />
          </div>
          {errors.price && <p className="text-danger-600 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price</label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-700">{formData.currency}</span>
            <input
              type="number"
              min="0"
              step="100"
              value={formData.discount_price || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount_price: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className={`flex-1 px-4 py-2 rounded-lg border focus:ring-1 focus:ring-primary-500 ${
                errors.discount_price ? 'border-danger-500' : 'border-gray-300 focus:border-primary-500'
              }`}
              placeholder="Optional"
            />
          </div>
          {errors.discount_price && (
            <p className="text-danger-600 text-sm mt-1">{errors.discount_price}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency <span className="text-danger-600">*</span>
        </label>
        <select
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="BDT">BDT</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Admin Platform Commission</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Commission Rate</span>
            <span className="font-medium">{COMMISSION_RATE}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Commission Amount</span>
            <span className="font-medium">
              {formData.currency} {commissionAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-900 font-medium">Trainer Receivable</span>
            <span className="font-bold text-primary-600 text-lg">
              {formData.currency} {trainerReceivable.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> The platform commission is calculated based on the admin settings.
          The final commission amount is locked at the time of payment/session completion.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy</label>
        <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
          <option>Default Platform Policy</option>
          <option>No Refund</option>
          <option>Refund Before Session</option>
          <option>Custom Policy</option>
        </select>
      </div>
    </div>
  );
}

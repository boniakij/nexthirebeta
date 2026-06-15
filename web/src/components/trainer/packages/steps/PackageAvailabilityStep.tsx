'use client';

import { PackageFormState } from '@/types/trainerPackage';
import { Button } from '@/components/ui';
import { Calendar } from 'lucide-react';

interface PackageAvailabilityStepProps {
  formData: PackageFormState;
  setFormData: (data: PackageFormState) => void;
  errors: Record<string, string>;
}

const AVAILABILITY_OPTIONS = [
  { value: 'all_slots', label: 'Use All Available Slots' },
  { value: 'specific_schedule', label: 'Use Specific Weekly Schedule' },
  { value: 'package_specific', label: 'Use Package-Specific Slots' },
  { value: 'none', label: 'No Availability Yet' },
];

export default function PackageAvailabilityStep({
  formData,
  setFormData,
  errors,
}: PackageAvailabilityStepProps) {
  const hasAvailability = formData.availability_scope !== 'none';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Availability</h2>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Connect this package with your availability calendar.</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose how students will find available slots for this package.
        </p>

        <div className="space-y-3">
          {AVAILABILITY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:border-primary-300"
              style={{
                borderColor:
                  formData.availability_scope === option.value ? '#2563eb' : '#e5e7eb',
              }}
            >
              <input
                type="radio"
                name="availability_scope"
                value={option.value}
                checked={formData.availability_scope === option.value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability_scope: e.target.value as any,
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {hasAvailability && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3">Available Slot Preview</h4>
          <div className="space-y-2 text-sm text-green-800">
            <div className="flex justify-between">
              <span>Monday</span>
              <span>7:00 PM - 10:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Tuesday</span>
              <span>8:00 PM - 11:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Friday</span>
              <span>4:00 PM - 8:00 PM</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-4 gap-2 w-full">
            <Calendar className="w-4 h-4" />
            Manage Availability
          </Button>
        </div>
      )}

      {!hasAvailability && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-900 font-medium mb-4">
            You have no available time slots.
          </p>
          <p className="text-sm text-yellow-800 mb-4">
            Students cannot book this package until you add availability.
          </p>
          <Button className="gap-2">
            <Calendar className="w-4 h-4" />
            Add Availability
          </Button>
        </div>
      )}
    </div>
  );
}

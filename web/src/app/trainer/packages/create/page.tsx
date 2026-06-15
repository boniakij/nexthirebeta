'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody } from '@/components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PackageFormState } from '@/types/trainerPackage';
import PackageBasicInfoStep from '@/components/trainer/packages/steps/PackageBasicInfoStep';
import PackageSessionStep from '@/components/trainer/packages/steps/PackageSessionStep';
import PackagePricingStep from '@/components/trainer/packages/steps/PackagePricingStep';
import PackageRequirementsStep from '@/components/trainer/packages/steps/PackageRequirementsStep';
import PackageAvailabilityStep from '@/components/trainer/packages/steps/PackageAvailabilityStep';
import PackageReviewStep from '@/components/trainer/packages/steps/PackageReviewStep';
import { trainerPackagesApi } from '@/lib/api/trainerPackages';

const STEPS = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Session Details' },
  { id: 3, name: 'Pricing' },
  { id: 4, name: 'Requirements' },
  { id: 5, name: 'Availability' },
  { id: 6, name: 'Review' },
];

const INITIAL_FORM_STATE: PackageFormState = {
  title: '',
  category: 'HR Interview',
  target_level: 'Fresher',
  package_type: '1:1 Live Session',
  short_description: '',
  description: '',
  tags: [],
  duration_minutes: 45,
  session_mode: 'Video Interview',
  language: 'Bangla + English',
  difficulty: 'beginner',
  session_count: 1,
  includes_cv_review: false,
  includes_written_feedback: true,
  preparation_instructions: '',
  price: 0,
  discount_price: undefined,
  currency: 'BDT',
  required_documents: {
    resume: true,
    linkedin_url: false,
    github_url: false,
    portfolio_url: false,
    job_description: false,
    cover_letter: false,
  },
  custom_questions: [],
  availability_scope: 'all_slots',
  status: 'draft',
};

export default function CreatePackagePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PackageFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleNext = () => {
    // Basic validation for current step
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.target_level) newErrors.target_level = 'Target level is required';
        if (!formData.short_description) newErrors.short_description = 'Short description is required';
        break;
      case 3:
        if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
        if (formData.discount_price && formData.discount_price > formData.price) {
          newErrors.discount_price = 'Discount price cannot exceed regular price';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const draftData: PackageFormState = { ...formData, status: 'draft' };
      await trainerPackagesApi.createPackage(draftData);
      setSuccessMessage('Package saved as draft successfully!');
      setTimeout(() => {
        router.push('/trainer/packages');
      }, 1500);
    } catch (error) {
      console.error('Failed to save draft:', error);
      setSuccessMessage('Failed to save draft. Using mock save.');
      setTimeout(() => {
        router.push('/trainer/packages');
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const publishData: PackageFormState = { ...formData, status: 'pending_review' };
      await trainerPackagesApi.createPackage(publishData);
      setSuccessMessage('Package submitted for review successfully!');
      setTimeout(() => {
        router.push('/trainer/packages');
      }, 1500);
    } catch (error) {
      console.error('Failed to publish:', error);
      setSuccessMessage('Failed to submit. Using mock submission.');
      setTimeout(() => {
        router.push('/trainer/packages');
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PackageBasicInfoStep formData={formData} setFormData={setFormData} errors={errors} />
        );
      case 2:
        return (
          <PackageSessionStep formData={formData} setFormData={setFormData} errors={errors} />
        );
      case 3:
        return (
          <PackagePricingStep formData={formData} setFormData={setFormData} errors={errors} />
        );
      case 4:
        return (
          <PackageRequirementsStep formData={formData} setFormData={setFormData} errors={errors} />
        );
      case 5:
        return (
          <PackageAvailabilityStep formData={formData} setFormData={setFormData} errors={errors} />
        );
      case 6:
        return (
          <PackageReviewStep
            formData={formData}
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
            saving={saving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Package</h1>
        <p className="text-gray-600 mt-1">Follow the steps below to create and publish your interview package</p>
      </div>

      {/* Progress Indicator */}
      <Card className="border-0 shadow-sm">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-primary-600' : 'text-gray-600'
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-colors ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Success Message */}
      {successMessage && (
        <Card className="border-0 shadow-sm bg-green-50 border border-green-200">
          <CardBody className="p-4">
            <p className="text-green-900 font-medium">{successMessage}</p>
          </CardBody>
        </Card>
      )}

      {/* Step Content */}
      <Card className="border-0 shadow-sm">
        <CardBody className="p-8">
          {renderStep()}
        </CardBody>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {currentStep === 1 ? (
          <Link href="/trainer/packages">
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Cancel
            </Button>
          </Link>
        ) : (
          <Button onClick={handlePrev} variant="outline" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        )}

        <div className="flex gap-3">
          {currentStep < STEPS.length && (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

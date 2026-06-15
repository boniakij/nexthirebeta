export type PackageStatus = 'draft' | 'pending_review' | 'active' | 'hidden' | 'deactivated' | 'rejected';
export type AvailabilityScope = 'all_slots' | 'specific_schedule' | 'package_specific' | 'none';
export type Currency = 'BDT' | 'USD';

export interface RequiredDocuments {
  resume: boolean;
  linkedin_url: boolean;
  github_url: boolean;
  portfolio_url: boolean;
  job_description: boolean;
  cover_letter: boolean;
}

export interface CommissionPreview {
  commission_type: 'percentage' | 'fixed';
  commission_value: number;
  commission_amount: number;
  trainer_receivable: number;
}

export interface TrainerPackage {
  id: number;
  trainer_id: number;
  title: string;
  slug: string;
  category: string;
  target_level: string;
  package_type: string;
  short_description: string;
  description: string;
  tags: string[];
  duration_minutes: number;
  session_mode: string;
  language: string;
  difficulty: string;
  session_count: number;
  includes_cv_review: boolean;
  includes_written_feedback: boolean;
  preparation_instructions: string;
  price: number;
  discount_price?: number;
  currency: Currency;
  required_documents: RequiredDocuments;
  custom_questions: string[];
  availability_scope: AvailabilityScope;
  status: PackageStatus;
  is_featured: boolean;
  total_bookings: number;
  total_revenue: number;
  published_at?: string;
  approved_at?: string;
  rejected_reason?: string;
  created_at: string;
  updated_at: string;
  commission_preview?: CommissionPreview;
}

export interface PackageFormState {
  title: string;
  category: string;
  target_level: string;
  package_type: string;
  short_description: string;
  description: string;
  tags: string[];
  duration_minutes: number;
  session_mode: string;
  language: string;
  difficulty: string;
  session_count: number;
  includes_cv_review: boolean;
  includes_written_feedback: boolean;
  preparation_instructions: string;
  price: number;
  discount_price?: number;
  currency: Currency;
  required_documents: RequiredDocuments;
  custom_questions: string[];
  availability_scope: AvailabilityScope;
  status: PackageStatus;
}

export interface PackageListResponse {
  success: boolean;
  data: {
    packages: TrainerPackage[];
    total: number;
    page: number;
    per_page: number;
    pages: number;
  };
}

export interface CreatePackageResponse {
  success: boolean;
  message: string;
  data: {
    package_id: number;
    title: string;
    status: PackageStatus;
    price: number;
    currency: Currency;
    commission_preview: CommissionPreview;
    created_at: string;
  };
}

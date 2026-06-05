export type UserRole = 'student' | 'trainer' | 'company' | 'admin';

export interface User {
  id: number;
  uuid: string;
  email: string;
  role: UserRole;
  profile_photo: string | null;
  status: 'active' | 'suspended' | 'pending';
  email_verified_at: string | null;
  created_at: string;
}

export interface Student {
  id: number;
  user: User;
  full_name: string;
  university: string | null;
  department: string | null;
  graduation_year: number | null;
  skills: string[];
  preferred_job_role: string | null;
  resume_path: string | null;
  profile_completion: number;
  total_xp: number;
  current_level: number;
  streak_days: number;
  country_code: string;
}

export interface Trainer {
  id: number;
  user: User;
  full_name: string;
  bio: string | null;
  expertise_domains: string[];
  years_experience: number | null;
  average_rating: number;
  total_reviews: number;
  total_sessions: number;
  is_approved: boolean;
  packages: Package[];
}

export interface Package {
  id: number;
  trainer_id: number;
  trainer?: Trainer;
  title: string;
  description: string | null;
  price: number;
  session_count: number;
  duration_minutes: number;
  interview_type: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  is_live: boolean;
  includes_cv_review: boolean;
  is_active: boolean;
}

export interface Interview {
  id: number;
  student: Student;
  trainer: Trainer;
  package: Package;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meeting_link: string | null;
  agora_channel: string | null;
  xp_awarded: number;
}

export interface Evaluation {
  id: number;
  interview_id: number;
  communication_score: number;
  technical_score: number;
  confidence_score: number;
  problem_solving_score: number;
  english_score: number;
  hr_readiness_score: number;
  overall_level: 'not_ready' | 'beginner' | 'intermediate' | 'advanced' | 'industry_ready';
  feedback_text: string | null;
}

export interface Badge {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon_path: string | null;
  xp_reward: number;
  category: 'achievement' | 'skill' | 'milestone' | 'special';
  unlocked_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  student_id: number;
  name: string;
  avatar: string | null;
  xp: number;
  level: number;
  badges_count: number;
  country: string;
}

export interface Payment {
  id: number;
  amount: number;
  commission: number;
  currency: string;
  gateway: string;
  status: string;
  invoice_path: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    per_page: number;
    next_cursor: string | null;
    total?: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface XPLevel {
  level: number;
  name: string;
  xp_required: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

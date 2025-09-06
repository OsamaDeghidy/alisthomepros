export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'client' | 'home_pro' | 'specialist' | 'crew_member';
  phone?: string;
  location?: string;
  avatar?: string;
  is_verified: boolean;
  verification_status: string;
  company_name?: string;
  bio?: string;
  website?: string;
  experience_years?: number;
  hourly_rate?: number;
  skills: string[];
  rating_average?: number;
  rating_count: number;
  is_available: boolean;
  last_activity?: string;
  license_number?: string;
  insurance_verified: boolean;
  background_check_verified: boolean;
  notification_preferences: Record<string, any>;
  projects_completed: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  user_type: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserProfile extends Omit<User, 'username' | 'user_type' | 'skills'> {
  username?: string;
  user_type?: 'client' | 'home_pro' | 'specialist' | 'crew_member';
  skills?: string[];
}

export interface PortfolioItem {
  id: number;
  professional: User;
  title: string;
  description: string;
  category: string;
  project_duration: string;
  project_cost: string;
  completion_date: string;
  featured: boolean;
  likes: number;
  views: number;
  images: any[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  slug: string;
  client: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  avatar?: string;
  is_verified?: boolean;
  insurance_verified?: boolean;
  rating_average?: number;
  rating_count?: number;
  location?: string;
};
  category?: Category;
  location: string;
  budget_type: 'fixed' | 'hourly' | 'estimate';
  budget_min?: number;
  budget_max?: number;
  budget_display?: string;
  timeline: string;
  required_skills: string[];
  required_roles: string[];
  urgency: 'urgent' | 'normal' | 'low';
  is_remote_allowed: boolean;
  requires_license: boolean;
  requires_insurance: boolean;
  is_paid: boolean;
  additional_requirements?: string;
  start_date?: string;
  end_date?: string;
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  assigned_professional?: User;
  images?: Array<{
    id: number;
    file: string;
    caption?: string;
    is_primary: boolean;
    order: number;
  }>;
  completion_percentage?: number;
  views_count?: number;
  favorites_count?: number;
  proposals_count?: number;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}
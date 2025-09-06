import api from '../lib/api';

export interface Professional {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  display_name: string;
  email: string;
  avatar: string | null;
  user_type: 'home_pro' | 'specialist' | 'crew_member';
  is_verified: boolean;
  company_name: string | null;
  location: string | null;
  bio: string | null;
  skills: string[] | null;
  rating_average: number;
  rating_count: number;
  hourly_rate: number | null;
  experience_years: number | null;
  is_available: boolean;
  projects_completed: number;
  total_earnings: number;
  verification_badges: string[];
  completion_rate: number;
  portfolio_images: string[];
  recent_reviews: Review[];
  response_time: string;
  created_at: string;
  website: string | null;
  phone: string | null;
  license_number: string | null;
  insurance_verified: boolean;
  background_check_verified: boolean;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  client_name: string;
  created_at: string;
}

export interface ProfessionalsFilters {
  search?: string;
  location?: string;
  user_type?: 'home_pro' | 'specialist' | 'crew_member';
  is_verified?: boolean;
  is_available?: boolean;
  min_rating?: number;
  max_rating?: number;
  min_hourly_rate?: number;
  max_hourly_rate?: number;
  min_experience?: number;
  max_experience?: number;
  skills?: string;
  category?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface ProfessionalsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Professional[];
}

class ProfessionalsApiService {
  private baseUrl = '/auth/professionals';

  async getProfessionals(filters: ProfessionalsFilters = {}): Promise<ProfessionalsResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`${this.baseUrl}/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching professionals:', error);
      throw error;
    }
  }

  async getProfessional(id: number): Promise<Professional> {
    try {
      const response = await api.get(`/api/auth/users/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching professional:', error);
      throw error;
    }
  }

  async searchProfessionals(query: string, filters: Omit<ProfessionalsFilters, 'search'> = {}): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ ...filters, search: query });
  }

  async getProfessionalsByLocation(location: string, filters: Omit<ProfessionalsFilters, 'location'> = {}): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ ...filters, location });
  }

  async getProfessionalsByCategory(category: string, filters: Omit<ProfessionalsFilters, 'category'> = {}): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ ...filters, category });
  }

  async getProfessionalsBySkills(skills: string[], filters: Omit<ProfessionalsFilters, 'skills'> = {}): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ ...filters, skills: skills.join(',') });
  }

  async getVerifiedProfessionals(filters: Omit<ProfessionalsFilters, 'is_verified'> = {}): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ ...filters, is_verified: true });
  }

  async getAvailableProfessionals(filters: Omit<ProfessionalsFilters, 'is_available'> = {}): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ ...filters, is_available: true });
  }

  async getProfessionalsByRating(minRating: number, filters: Omit<ProfessionalsFilters, 'min_rating'> = {}): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ ...filters, min_rating: minRating });
  }

  async getProfessionalsByPriceRange(
    minPrice: number, 
    maxPrice: number, 
    filters: Omit<ProfessionalsFilters, 'min_hourly_rate' | 'max_hourly_rate'> = {}
  ): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ 
      ...filters, 
      min_hourly_rate: minPrice, 
      max_hourly_rate: maxPrice 
    });
  }

  // Helper methods for common filter combinations
  async getTopRatedProfessionals(limit: number = 10): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ 
      ordering: '-rating_average',
      page_size: limit,
      min_rating: 4.0
    });
  }

  async getRecentlyJoinedProfessionals(limit: number = 10): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ 
      ordering: '-created_at',
      page_size: limit
    });
  }

  async getMostExperiencedProfessionals(limit: number = 10): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ 
      ordering: '-experience_years',
      page_size: limit,
      min_experience: 5
    });
  }

  async getBudgetFriendlyProfessionals(maxBudget: number = 50): Promise<ProfessionalsResponse> {
    return this.getProfessionals({ 
      max_hourly_rate: maxBudget,
      ordering: 'hourly_rate'
    });
  }
}

export const professionalsApi = new ProfessionalsApiService();
export default professionalsApi;
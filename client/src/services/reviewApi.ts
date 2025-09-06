import { apiClient as api } from './api';

export interface Review {
  id: number;
  project_info?: {
    id: number;
    title: string;
    slug: string;
    status: string;
  };
  contract_info?: {
    id: number;
    title: string;
    status: string;
  };
  reviewer: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    user_type: string;
    is_verified: boolean;
  };
  reviewee: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    user_type: string;
    is_verified: boolean;
  };
  review_type: 'client_to_professional' | 'professional_to_client';
  rating: number;
  comment: string;
  
  // Client to Professional ratings
  quality_rating?: number;
  communication_rating?: number;
  timeliness_rating?: number;
  professionalism_rating?: number;
  
  // Professional to Client ratings
  cooperation_rating?: number;
  payment_timeliness_rating?: number;
  clarity_rating?: number;
  
  would_recommend: boolean;
  is_public: boolean;
  helpful_count: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  project?: number;
  contract?: number;
  reviewee: number;
  review_type: 'client_to_professional' | 'professional_to_client';
  rating: number;
  comment: string;
  
  // Client to Professional ratings
  quality_rating?: number;
  communication_rating?: number;
  timeliness_rating?: number;
  professionalism_rating?: number;
  
  // Professional to Client ratings
  cooperation_rating?: number;
  payment_timeliness_rating?: number;
  clarity_rating?: number;
  
  would_recommend?: boolean;
  is_public?: boolean;
}

export interface ReviewFilters {
  reviewee_id?: number;
  reviewer_id?: number;
  review_type?: 'client_to_professional' | 'professional_to_client';
  rating?: number;
  rating_min?: number;
  rating_max?: number;
  search?: string;
  ordering?: string;
}

// Get all reviews with filters
export const getReviews = async (filters?: ReviewFilters): Promise<{ results: Review[]; count: number }> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get(`/reviews/?${params.toString()}`);
  return response.data;
};

// Get reviews for a specific professional
export const getProfessionalReviews = async (professionalId: number, filters?: Omit<ReviewFilters, 'reviewee_id'>): Promise<{ results: Review[]; count: number }> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get(`/reviews/professional/${professionalId}/?${params.toString()}`);
  return response.data;
};

// Get reviews for a specific client
export const getClientReviews = async (clientId: number, filters?: Omit<ReviewFilters, 'reviewee_id'>): Promise<{ results: Review[]; count: number }> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get(`/reviews/client/${clientId}/?${params.toString()}`);
  return response.data;
};

// Get current user's reviews (given and received)
export const getMyReviews = async (filter?: 'all' | 'given' | 'received', additionalFilters?: Omit<ReviewFilters, 'reviewer_id' | 'reviewee_id'>): Promise<{ results: Review[]; count: number }> => {
  const params = new URLSearchParams();
  
  if (filter && filter !== 'all') {
    params.append('filter', filter);
  }
  
  if (additionalFilters) {
    Object.entries(additionalFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get(`/reviews/my/?${params.toString()}`);
  return response.data;
};

// Get a specific review
export const getReview = async (reviewId: number): Promise<Review> => {
  const response = await api.get(`/reviews/${reviewId}/`);
  return response.data;
};

// Create a new review
export const createReview = async (reviewData: CreateReviewData): Promise<Review> => {
  const response = await api.post('/reviews/create/', reviewData);
  return response.data;
};

// Update a review (within 24 hours)
export const updateReview = async (reviewId: number, reviewData: Partial<CreateReviewData>): Promise<Review> => {
  const response = await api.patch(`/reviews/${reviewId}/update/`, reviewData);
  return response.data;
};

// Delete a review (within 24 hours)
export const deleteReview = async (reviewId: number): Promise<void> => {
  await api.delete(`/reviews/${reviewId}/delete/`);
};

// Get review statistics for a professional
export const getProfessionalReviewStats = async (professionalId: number) => {
  const response = await api.get(`/reviews/professional/${professionalId}/stats/`);
  return response.data;
};

// Check if user can review a specific project/contract
export const canReviewProject = async (projectId: number, reviewType: 'client_to_professional' | 'professional_to_client'): Promise<boolean> => {
  try {
    const response = await api.get(`/projects/${projectId}/can-review/?review_type=${reviewType}`);
    return response.data.can_review;
  } catch (error) {
    return false;
  }
};

export const canReviewContract = async (contractId: number, reviewType: 'client_to_professional' | 'professional_to_client'): Promise<boolean> => {
  try {
    const response = await api.get(`/reviews/can-review-contract/${contractId}/?review_type=${reviewType}`);
    return response.data.can_review;
  } catch (error) {
    return false;
  }
};

export interface ReviewEligibility {
  can_review: boolean;
  reason?: string;
  review_type?: 'client_to_professional' | 'professional_to_client';
  reviewee?: {
    id: number;
    name: string;
    user_type: string;
  };
  contract?: {
    id: number;
    title: string;
    contract_number: string;
  };
}

export const checkReviewEligibility = async (contractId: number): Promise<ReviewEligibility> => {
  try {
    const response = await api.get(`/reviews/check-eligibility/${contractId}/`);
    return response.data;
  } catch (error) {
    return {
      can_review: false,
      reason: 'Error checking review eligibility'
    };
  }
};
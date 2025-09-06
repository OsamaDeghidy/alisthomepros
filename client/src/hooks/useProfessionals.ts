import { useState, useEffect, useCallback } from 'react';
import { professionalsApi, Professional, ProfessionalsFilters, ProfessionalsResponse } from '../services/professionalsApi';

export interface UseProfessionalsState {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
}

export interface UseProfessionalsActions {
  fetchProfessionals: (filters?: ProfessionalsFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
  resetProfessionals: () => void;
}

export interface UseProfessionalsReturn extends UseProfessionalsState, UseProfessionalsActions {}

export const useProfessionals = (initialFilters: ProfessionalsFilters = {}) => {
  const [state, setState] = useState<UseProfessionalsState>({
    professionals: [],
    loading: false,
    error: null,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1,
  });

  const [currentFilters, setCurrentFilters] = useState<ProfessionalsFilters>(initialFilters);

  const fetchProfessionals = useCallback(async (filters: ProfessionalsFilters = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const mergedFilters = { ...filters };
      setCurrentFilters(mergedFilters);
      
      const response: ProfessionalsResponse = await professionalsApi.getProfessionals(mergedFilters);
      
      setState(prev => ({
        ...prev,
        professionals: response.results,
        totalCount: response.count,
        hasNextPage: !!response.next,
        hasPreviousPage: !!response.previous,
        currentPage: mergedFilters.page || 1,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch professionals',
        loading: false,
      }));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!state.hasNextPage || state.loading) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const nextPage = state.currentPage + 1;
      const response: ProfessionalsResponse = await professionalsApi.getProfessionals({
        ...currentFilters,
        page: nextPage,
      });
      
      setState(prev => ({
        ...prev,
        professionals: [...prev.professionals, ...response.results],
        hasNextPage: !!response.next,
        hasPreviousPage: !!response.previous,
        currentPage: nextPage,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load more professionals',
        loading: false,
      }));
    }
  }, [state.hasNextPage, state.loading, state.currentPage, currentFilters]);

  const refresh = useCallback(async () => {
    await fetchProfessionals({ ...currentFilters, page: 1 });
  }, [fetchProfessionals, currentFilters]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetProfessionals = useCallback(() => {
    setState({
      professionals: [],
      loading: false,
      error: null,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
    });
    setCurrentFilters(initialFilters);
  }, [initialFilters]);

  // Initial fetch
  useEffect(() => {
    fetchProfessionals(initialFilters);
  }, []); // Only run on mount

  return {
    ...state,
    fetchProfessionals,
    loadMore,
    refresh,
    clearError,
    resetProfessionals,
  };
};

// Specialized hooks for common use cases
export const useTopRatedProfessionals = (limit: number = 10) => {
  return useProfessionals({
    ordering: '-rating_average',
    page_size: limit,
    min_rating: 4.0,
  });
};

export const useAvailableProfessionals = (filters: ProfessionalsFilters = {}) => {
  return useProfessionals({
    ...filters,
    is_available: true,
  });
};

export const useVerifiedProfessionals = (filters: ProfessionalsFilters = {}) => {
  return useProfessionals({
    ...filters,
    is_verified: true,
  });
};

export const useProfessionalsByLocation = (location: string, filters: ProfessionalsFilters = {}) => {
  return useProfessionals({
    ...filters,
    location,
  });
};

export const useProfessionalsByCategory = (category: string, filters: ProfessionalsFilters = {}) => {
  return useProfessionals({
    ...filters,
    category,
  });
};

export default useProfessionals;
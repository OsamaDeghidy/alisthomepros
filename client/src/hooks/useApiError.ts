'use client';

import { useState, useCallback } from 'react';
import { ErrorInfo } from '../components/ErrorDisplay';

export interface UseApiErrorReturn {
  error: ErrorInfo | null;
  setError: (error: ErrorInfo | string | null) => void;
  clearError: () => void;
  handleApiError: (error: any) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useApiError = (): UseApiErrorReturn => {
  const [error, setErrorState] = useState<ErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setError = useCallback((error: ErrorInfo | string | null) => {
    if (!error) {
      setErrorState(null);
      return;
    }

    if (typeof error === 'string') {
      setErrorState({
        message: error,
        type: 'unknown'
      });
    } else {
      setErrorState(error);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleApiError = useCallback((error: any) => {
    console.error('API Error:', error);
    
    // Use enhanced error info if available
    if (error.errorInfo) {
      setErrorState(error.errorInfo);
    } else if (error.response) {
      // Fallback for errors without enhanced info
      const { status, data } = error.response;
      setErrorState({
        message: data?.error || data?.message || `Request failed with status ${status}`,
        type: status >= 500 ? 'server_error' : 'unknown',
        details: data
      });
    } else if (error.request) {
      setErrorState({
        message: 'Network error. Please check your internet connection.',
        type: 'network'
      });
    } else {
      setErrorState({
        message: error.message || 'An unexpected error occurred.',
        type: 'unknown'
      });
    }
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      clearError(); // Clear errors when starting new request
    }
  }, [clearError]);

  return {
    error,
    setError,
    clearError,
    handleApiError,
    isLoading,
    setLoading
  };
};

// Higher-order function to wrap API calls with error handling
export const withErrorHandling = <T extends any[], R>(
  apiCall: (...args: T) => Promise<R>,
  errorHandler: (error: any) => void
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await apiCall(...args);
    } catch (error) {
      errorHandler(error);
      return null;
    }
  };
};

// Hook for API calls with built-in error handling and loading states
export const useApiCall = <T extends any[], R>(
  apiCall: (...args: T) => Promise<R>
) => {
  const { error, handleApiError, isLoading, setLoading, clearError } = useApiError();

  const execute = useCallback(async (...args: T): Promise<R | null> => {
    setLoading(true);
    try {
      const result = await apiCall(...args);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      handleApiError(error);
      return null;
    }
  }, [apiCall, handleApiError, setLoading]);

  return {
    execute,
    error,
    isLoading,
    clearError
  };
};

export default useApiError;
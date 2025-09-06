import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced error handling utility
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          message: data?.error || data?.message || 'Invalid request. Please check your input.',
          type: 'validation',
          details: data?.details || data
        };
      case 401:
        return {
          message: 'Authentication required. Please log in again.',
          type: 'auth',
          details: data
        };
      case 403:
        return {
          message: 'You do not have permission to perform this action.',
          type: 'permission',
          details: data
        };
      case 404:
        return {
          message: 'The requested resource was not found.',
          type: 'not_found',
          details: data
        };
      case 409:
        return {
          message: data?.error || 'A conflict occurred. The resource may already exist.',
          type: 'conflict',
          details: data
        };
      case 422:
        return {
          message: 'Validation failed. Please check your input.',
          type: 'validation',
          details: data?.errors || data
        };
      case 429:
        return {
          message: 'Too many requests. Please try again later.',
          type: 'rate_limit',
          details: data
        };
      case 500:
        return {
          message: 'Internal server error. Please try again later.',
          type: 'server_error',
          details: data
        };
      case 502:
      case 503:
      case 504:
        return {
          message: 'Service temporarily unavailable. Please try again later.',
          type: 'service_unavailable',
          details: data
        };
      default:
        return {
          message: data?.error || data?.message || `Request failed with status ${status}`,
          type: 'unknown',
          details: data
        };
    }
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your internet connection.',
      type: 'network',
      details: error.request
    };
  } else {
    // Other error
    return {
      message: error.message || 'An unexpected error occurred.',
      type: 'unknown',
      details: error
    };
  }
};

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorInfo = handleApiError(error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      
      // Only redirect if we're in the browser and not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Show a user-friendly message before redirecting
        console.warn('Session expired. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }
    
    // Attach enhanced error info to the error object
    error.errorInfo = errorInfo;
    
    return Promise.reject(error);
  }
);

export default apiClient;
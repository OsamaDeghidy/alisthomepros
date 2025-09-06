import axios from 'axios';
import Cookies from 'js-cookie';

// Setup API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle different types of errors
    if (!error.response) {
      // Network error
      console.error('Network error:', error.message);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('network-error'));
      }
    } else if (error.response.status >= 500) {
      // Server error
      console.error('Server error:', error.response.status, error.response.data);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('server-error'));
      }
    }

    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          console.log('Attempting to refresh token...');
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          Cookies.set('access_token', access, { expires: 1 }); // expires in 1 day
          console.log('Token refreshed successfully');

          // Retry with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } else {
          console.log('No refresh token available');
          // No refresh token available, clear everything and redirect
          handleAuthFailure();
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Check if refresh token is invalid/expired
        if (refreshError && typeof refreshError === 'object' && 'response' in refreshError) {
          const axiosError = refreshError as any;
          if (axiosError.response?.status === 400 || axiosError.response?.status === 401) {
            console.log('Refresh token is invalid or expired');
          }
        }
        // Failed to refresh token, clear everything and redirect
        handleAuthFailure();
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle authentication failures
function handleAuthFailure() {
  console.log('Handling authentication failure...');
  
  // Clear all authentication data
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  
  // Clear localStorage auth data
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('user-preferences');
    
    // Dispatch custom events
    window.dispatchEvent(new CustomEvent('session-expired'));
    window.dispatchEvent(new CustomEvent('auth-error'));
    
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
      console.log('Redirecting to login page...');
      // Add a small delay to allow components to handle the event
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
  }
}

export default api;

// تصدير الـ base URL للاستخدام في أماكن أخرى
export { API_BASE_URL };
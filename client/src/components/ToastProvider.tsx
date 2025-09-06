'use client';

import React, { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Listen for custom events and show appropriate toasts
    const handleSessionExpired = () => {
      toast.error('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى');
    };

    const handleAuthError = () => {
      toast.error('خطأ في المصادقة');
    };

    const handleNetworkError = () => {
      toast.error('خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت');
    };

    const handleServerError = () => {
      toast.error('خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً');
    };

    // Add event listeners
    window.addEventListener('session-expired', handleSessionExpired);
    window.addEventListener('auth-error', handleAuthError);
    window.addEventListener('network-error', handleNetworkError);
    window.addEventListener('server-error', handleServerError);

    // Cleanup
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
      window.removeEventListener('auth-error', handleAuthError);
      window.removeEventListener('network-error', handleNetworkError);
      window.removeEventListener('server-error', handleServerError);
    };
  }, []);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            direction: 'ltr',
            fontFamily: 'inherit',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#EF4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: '#3B82F6',
              color: '#fff',
            },
          },
        }}
      />
    </>
  );
}

// Utility functions for common toast messages
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  promise: <T,>(promise: Promise<T>, messages: {
    loading: string;
    success: string;
    error: string;
  }) => toast.promise(promise, messages),
  
  // Auth-specific toasts
  authSuccess: () => toast.success('Login successful'),
  authError: () => toast.error('Login failed. Please check your credentials'),
  logoutSuccess: () => toast.success('Logout successful'),
  sessionExpired: () => toast.error('Session expired. Please login again'),
  
  // Network-specific toasts
  networkError: () => toast.error('Network connection error'),
  serverError: () => toast.error('Server error'),
  
  // Data-specific toasts
  dataLoadError: () => toast.error('Failed to load data'),
  dataSaveSuccess: () => toast.success('Data saved successfully'),
  dataSaveError: () => toast.error('Failed to save data'),
};

// Custom hook for toast management
export function useToast() {
  return {
    toast,
    showToast,
  };
}
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/lib/auth';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading, logout } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = Cookies.get('access_token');
        const refreshToken = Cookies.get('refresh_token');

        if (accessToken || refreshToken) {
          // Try to get current user
          try {
            const user = await authService.getCurrentUser();
            setUser(user);
          } catch (error: any) {
            console.log('Failed to get current user:', error.message);
            // If getting user fails, clear auth data
            logout();
          }
        } else {
          // No tokens available
          logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [setUser, setLoading, logout]);

  // Listen for session expired events
  useEffect(() => {
    const handleSessionExpired = () => {
      toast.error('Session expired. Please log in again.');
      logout();
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [logout]);

  // Show loading spinner while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook to check if user is authenticated
export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isLoggedIn: isAuthenticated && !!user
  };
}

// Hook to require authentication
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShouldRedirect(true);
    }
  }, [isAuthenticated, isLoading]);

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect
  };
}
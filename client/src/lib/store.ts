import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User, AuthTokens } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        });
      },

      setTokens: (tokens) => {
        // حفظ الـ tokens في الـ cookies
        Cookies.set('access_token', tokens.access, { expires: 1 }); // expires in 1 day
        Cookies.set('refresh_token', tokens.refresh, { expires: 7 }); // expires in 1 week
      },

      logout: () => {
        // إزالة الـ tokens من الـ cookies
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        
        // Clear localStorage completely
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          
          // Clear any other auth-related data
          localStorage.removeItem('user-preferences');
          localStorage.removeItem('app-storage');
        }
        
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
        
        console.log('User logged out successfully');
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Store للإعدادات العامة
interface AppState {
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  notifications: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'ar' | 'en') => void;
  setNotifications: (notifications: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      notifications: true,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setNotifications: (notifications) => set({ notifications }),
    }),
    {
      name: 'app-storage',
    }
  )
);
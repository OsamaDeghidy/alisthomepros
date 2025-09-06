import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User, UserProfile } from './types';

// خدمات المصادقة
export const authService = {
  // تسجيل الدخول
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  // تسجيل حساب جديد
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  // تسجيل الخروج
  async logout(): Promise<void> {
    await api.post('/auth/logout/');
  },

  // الحصول على بيانات المستخدم الحالي
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/user/');
    return response.data;
  },

  // تحديث بيانات المستخدم
  async updateUser(data: Partial<User>): Promise<User> {
    const response = await api.patch('/auth/user/', data);
    return response.data;
  },

  // الحصول على الملف الشخصي
  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await api.get('/auth/user/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      
      // Re-throw authentication errors to be handled by interceptor
      if (error.response?.status === 401) {
        throw error;
      }
      
      // For other errors, throw with more context
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user profile';
      throw new Error(errorMessage);
    }
  },

  // تحديث الملف الشخصي
  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.patch('/auth/user/', data);
    return response.data;
  },

  // تغيير كلمة المرور
  async changePassword(data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<{ message: string }> {
    const response = await api.post('/auth/change-password/', data);
    return response.data;
  },

  // إرسال رمز إعادة تعيين كلمة المرور
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/password-reset/', { email });
    return response.data;
  },

  // إعادة تعيين كلمة المرور
  async resetPassword(data: {
    token: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<{ message: string }> {
    const response = await api.post('/auth/password-reset-confirm/', data);
    return response.data;
  },

  // تحديث الصورة الشخصية
  async updateAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.patch('/auth/user/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // التحقق من البريد الإلكتروني
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.post('/auth/verify-email/', { token });
    return response.data;
  },

  // إعادة إرسال رمز التحقق
  async resendVerification(): Promise<{ message: string }> {
    const response = await api.post('/auth/resend-verification/');
    return response.data;
  },

  // تحديث إعدادات الإشعارات
  async updateNotificationSettings(settings: Record<string, any>): Promise<User> {
    const response = await api.patch('/auth/user/', {
      notification_preferences: settings
    });
    return response.data;
  },

  // حذف الحساب
  async deleteAccount(password: string): Promise<{ message: string }> {
    const response = await api.delete('/auth/user/', {
      data: { password }
    });
    return response.data;
  },
};
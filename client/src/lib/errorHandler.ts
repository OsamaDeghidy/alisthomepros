import { toast } from 'react-hot-toast';

// Types for different error scenarios
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface NetworkError {
  message: string;
  type: 'network';
}

export interface AuthError {
  message: string;
  type: 'auth';
  status: 401 | 403;
}

// Error handler class
export class ErrorHandler {
  static handle(error: any): void {
    console.error('Error caught by ErrorHandler:', error);

    if (this.isNetworkError(error)) {
      this.handleNetworkError(error);
    } else if (this.isAuthError(error)) {
      this.handleAuthError(error);
    } else if (this.isValidationError(error)) {
      this.handleValidationError(error);
    } else if (this.isServerError(error)) {
      this.handleServerError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  private static isNetworkError(error: any): boolean {
    return !error.response && error.request;
  }

  private static isAuthError(error: any): boolean {
    return error.response?.status === 401 || error.response?.status === 403;
  }

  private static isValidationError(error: any): boolean {
    return error.response?.status === 400;
  }

  private static isServerError(error: any): boolean {
    return error.response?.status >= 500;
  }

  private static handleNetworkError(error: any): void {
    toast.error('خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.');
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('network-error', { detail: error }));
    }
  }

  private static handleAuthError(error: any): void {
    const message = error.response?.data?.message || 'فشل في المصادقة';
    
    if (error.response?.status === 401) {
      // Don't show toast for 401 errors as they're handled by the interceptor
      console.log('Authentication required');
    } else if (error.response?.status === 403) {
      toast.error('ليس لديك صلاحية للوصول إلى هذا المورد');
    }
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-error', { detail: error }));
    }
  }

  private static handleValidationError(error: any): void {
    const errors = error.response?.data;
    
    if (typeof errors === 'object' && errors !== null) {
      // Handle field-specific validation errors
      Object.keys(errors).forEach(field => {
        const fieldErrors = errors[field];
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach(errorMsg => {
            toast.error(`${field}: ${errorMsg}`);
          });
        } else {
          toast.error(`${field}: ${fieldErrors}`);
        }
      });
    } else {
      toast.error('بيانات غير صحيحة. يرجى التحقق من المدخلات.');
    }
  }

  private static handleServerError(error: any): void {
    const message = error.response?.data?.message || 'خطأ في الخادم';
    toast.error(`خطأ في الخادم: ${message}`);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('server-error', { detail: error }));
    }
  }

  private static handleGenericError(error: any): void {
    const message = error.message || 'حدث خطأ غير متوقع';
    toast.error(message);
  }
}

// Utility functions for common error scenarios
export const errorUtils = {
  // Handle API errors with custom messages
  handleApiError: (error: any, customMessage?: string) => {
    if (customMessage) {
      toast.error(customMessage);
    } else {
      ErrorHandler.handle(error);
    }
  },

  // Handle form submission errors
  handleFormError: (error: any, formName?: string) => {
    const prefix = formName ? `خطأ في ${formName}: ` : 'خطأ في النموذج: ';
    
    if (error.response?.status === 400) {
      ErrorHandler.handle(error);
    } else {
      toast.error(prefix + (error.message || 'فشل في إرسال البيانات'));
    }
  },

  // Handle data loading errors
  handleLoadError: (error: any, dataType?: string) => {
    const message = dataType ? `فشل في تحميل ${dataType}` : 'فشل في تحميل البيانات';
    
    if (error.response?.status !== 401) {
      toast.error(message);
    }
  },

  // Handle file upload errors
  handleUploadError: (error: any) => {
    if (error.response?.status === 413) {
      toast.error('حجم الملف كبير جداً');
    } else if (error.response?.status === 415) {
      toast.error('نوع الملف غير مدعوم');
    } else {
      toast.error('فشل في رفع الملف');
    }
  },

  // Create custom error
  createError: (message: string, status?: number, code?: string): ApiError => {
    return {
      message,
      status,
      code
    };
  }
};

// Hook for error handling in components
export function useErrorHandler() {
  const handleError = (error: any, context?: string) => {
    if (context) {
      console.error(`Error in ${context}:`, error);
    }
    ErrorHandler.handle(error);
  };

  return {
    handleError,
    handleApiError: errorUtils.handleApiError,
    handleFormError: errorUtils.handleFormError,
    handleLoadError: errorUtils.handleLoadError,
    handleUploadError: errorUtils.handleUploadError
  };
}
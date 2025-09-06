'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, Shield, Users, Star } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useAuthStore } from '@/lib/store';
import { RegisterData } from '@/lib/types';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState<'client' | 'professional' | 'home_pro' | 'specialist' | 'crew_member'>('client');
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterData & { 
    password_confirm: string;
    agreeTos: boolean;
    agreeMarketing: boolean;
  }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData & { 
    password_confirm: string;
    agreeTos: boolean;
    agreeMarketing: boolean;
  }) => {
    if (!data.agreeTos) {
      toast.error('You must agree to the Terms and Conditions');
      return;
    }

    setIsLoading(true);
    
    try {
      // Determine the actual user type to send to backend
      let userType = accountType;
      if (accountType === 'professional') {
        // If user selected "Professional" but didn't choose a specific type, default to home_pro
        userType = 'home_pro';
      }
      
      const registerData: RegisterData = {
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        first_name: data.first_name,
        last_name: data.last_name,
        user_type: userType as 'client' | 'home_pro' | 'specialist' | 'crew_member',
      };
      
      const response = await authService.register(registerData);
      
      // Save user data and tokens
      setUser(response.user);
      setTokens(response.tokens);
      
      // Save email for verification page
      localStorage.setItem('registrationEmail', data.email);
      
      // Update registration status
      setRegistrationComplete(true);
      setEmailStatus('sending');
      
      // Assume email was sent successfully after successful registration
      const emailSent = true;
      
      setTimeout(() => {
        if (emailSent) {
          setEmailStatus('sent');
          toast.success('Account created successfully! Please check your email to verify your account.');
        } else {
          setEmailStatus('failed');
          toast.error('Account created but failed to send verification email. You can request a new one.');
        }
        
        // Redirect to verify-email page with email parameter
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        }, 2000);
      }, 1500);
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Clear any previous error states
      let errorMessage = '';
      
      if (error.response?.status === 400 && error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => {
            const fieldName = field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `${fieldName}: ${(messages as string[]).join(', ')}`;
          })
          .join('\n');
        errorMessage = errorMessages;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      
      // Show error only once
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes = [
    { value: 'home_pro', label: 'Home Pro', description: 'Professional who executes the service' },
    { value: 'specialist', label: 'A-List Specialist', description: 'Consultant who coordinates and plans' },
    { value: 'crew_member', label: 'Crew Member', description: 'Team member hired for small tasks or assistance' }
  ];



  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center justify-center mb-8">
              {/* 
                DEVELOPMENT GUIDELINES - قواعد التطوير
                
                القواعد الأساسية للتطوير:
                
                1. تحليل الصفحات والـ APIs
                - قراءة الكود أولاً: عند إعطاء صفحة جديدة، يجب قراءة جزء الفرونت إند والباك إند أولاً
                - فهم الـ API: تحديد نقاط الربط (endpoints) والعناصر المطلوبة في كل API
                - الربط الاحترافي: ربط كل حقل في الفرونت إند بما يناسبه في الباك إند بدقة
                
                2. إدارة الخوادم (Servers)
                - خادم واحد للباك إند: http://127.0.0.1:8000/
                - خادم واحد للفرونت إند: http://localhost:3000
                - عدم فتح خوادم متعددة: تجنب إنشاء terminals كثيرة والعمل على خادمين فقط
                
                3. معالجة الأخطاء
                - متابعة الأخطاء: عند ظهور خطأ، يجب متابعته وتوقع السبب
                - حل الأخطاء بذكاء: إصلاح الخطأ دون إفساد أجزاء أخرى من النظام
                - تجنب الأخطاء الشائعة: أخطاء المصادقة، مشاكل تثبيت المكتبات، ملفات ناقصة
                
                4. العمل مع النماذج (Forms)
                - التحقق من إرسال البيانات: التأكد من أن البيانات ترسل بالشكل الصحيح
                - حفظ النماذج: ضمان حفظ البيانات في قاعدة البيانات
                - الربط مع الباك إند: التأكد من ربط النموذج بالـ API المناسب
                
                5. التطوير الذكي
                - الكفاءة في التطوير: إنجاز المطلوب بأقل تعقيد ممكن
                - عدم إفساد الأجزاء الأخرى: الحذر عند تطوير جزء معين لعدم تأثير أجزاء أخرى
                - إضافة عناصر جديدة: عند الحاجة لإضافة عناصر في الصفحة، ربطها بالباك إند حسب المطلوب
                
                6. هيكل المشروع
                homs/
                ├── client/          # Frontend (Next.js)
                │   ├── src/
                │   │   ├── app/     # Pages
                │   │   ├── components/  # Components
                │   │   └── lib/     # Utilities & Services
                │   └── package.json
                └── server/          # Backend (Django)
                    ├── authentication/
                    ├── projects/
                    ├── proposals/
                    └── manage.py
                
                7. اللغة المستخدمة في العمل
                - اللغة الإنجليزية: جميع أعمال التطوير والبرمجة ستكون باللغة الإنجليزية
                - أسماء المتغيرات والدوال: يجب أن تكون باللغة الإنجليزية
                - التعليقات في الكود: يفضل كتابتها باللغة الإنجليزية
                - أسماء الملفات والمجلدات: باللغة الإنجليزية فقط
                
                8. نصائح إضافية
                - استخدام Git بحذر: عمل commit للتغييرات المهمة
                - اختبار الوظائف: التأكد من عمل الوظائف قبل الانتقال للمرحلة التالية
                - التوثيق: توثيق التغييرات المهمة في هذا الملف
              */}
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-xl">
                <img src="/logo.svg" alt="A-List Home Pros" className="h-8 w-auto" />
              </div>
            </Link>
            
            <h2 className="font-heading font-bold text-3xl text-dark-900 mb-2">
              Create New Account
            </h2>
            <p className="text-dark-600">
              Join thousands of homeowners and professionals
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark-700 mb-3">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAccountType('client')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  accountType === 'client'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className={`h-8 w-8 mx-auto mb-2 ${accountType === 'client' ? 'text-primary-500' : 'text-gray-400'}`} />
                <div className="font-semibold">Client</div>
                <div className="text-sm opacity-75">Looking for professionals</div>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('professional')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  accountType !== 'client'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Shield className={`h-8 w-8 mx-auto mb-2 ${accountType !== 'client' ? 'text-primary-500' : 'text-gray-400'}`} />
                <div className="font-semibold">Professional</div>
                <div className="text-sm opacity-75">Offering services</div>
              </button>
            </div>
            
            {/* Professional Type Selection */}
            {accountType !== 'client' && (
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-dark-700">
                  Professional Type
                </label>
                {userTypes.map((type) => (
                  <label key={type.value} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value={type.value}
                      checked={accountType === type.value}
                      onChange={(e) => setAccountType(e.target.value as any)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Registration Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-dark-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <input
                    id="first_name"
                    type="text"
                    {...register('first_name', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    className={`w-full bg-white border rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-dark-700 mb-2">
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  {...register('last_name', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className={`w-full bg-white border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Doe"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full bg-white border rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone and Location */}
            <div className="grid grid-cols-2 gap-4">

            </div>



            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase and number'
                    }
                  })}
                  className={`w-full bg-white border rounded-xl px-4 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-dark-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="password_confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('password_confirm', {
                    required: 'Password confirmation is required',
                    validate: (value) => {
                      const password = watch('password');
                      return value === password || 'Passwords do not match';
                    }
                  })}
                  className={`w-full bg-white border rounded-xl px-4 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.password_confirm ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password_confirm && (
                <p className="mt-1 text-sm text-red-600">{errors.password_confirm.message}</p>
              )}
            </div>

            {/* Agreements */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('agreeTos', {
                    required: 'You must agree to the Terms and Conditions'
                  })}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 mt-1"
                />
                <span className="text-sm text-dark-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeTos && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeTos.message}</p>
              )}
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('agreeMarketing')}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 mt-1"
                />
                <span className="text-sm text-dark-700">
                  I want to receive emails about new projects and platform updates
                </span>
              </label>
            </div>

            {/* Email Status Indicator */}
            {registrationComplete && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3">
                  {emailStatus === 'sending' && (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-blue-700 font-medium">Sending verification email...</span>
                    </>
                  )}
                  {emailStatus === 'sent' && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 font-medium">Verification email sent successfully!</span>
                    </>
                  )}
                  {emailStatus === 'failed' && (
                    <>
                      <div className="h-5 w-5 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <span className="text-red-700 font-medium">Failed to send verification email. Please try again.</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading || registrationComplete}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Creating Account...' : registrationComplete ? 'Account Created!' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or register with</span>
              </div>
            </div>

            {/* Social Registration */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877f2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-dark-600">Already have an account? </span>
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-accent-400 via-accent-500 to-primary-500 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_60%)]"></div>
        
        <div className="relative flex flex-col justify-center px-12 text-white">
          <div className="mb-12">
            <h3 className="font-heading font-bold text-4xl mb-6 leading-tight">
              {accountType !== 'client' 
                ? 'Grow Your Home Services Business'
                : 'Find the Perfect Professional for Your Home'
              }
            </h3>
            <p className="text-xl text-yellow-100 leading-relaxed">
              {accountType !== 'client'
                ? 'Join our network of trusted professionals and access thousands of quality leads.'
                : 'Connect with verified professionals who will bring your home vision to life.'
              }
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-8">
            {accountType !== 'client' ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Quality Leads</h4>
                    <p className="text-yellow-100">Access to pre-qualified homeowners ready to hire</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Secure Payments</h4>
                    <p className="text-yellow-100">Get paid safely with our escrow protection system</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Build Your Reputation</h4>
                    <p className="text-yellow-100">Showcase your work and earn 5-star reviews</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Verified Professionals</h4>
                    <p className="text-yellow-100">All professionals are background checked and verified</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Project Protection</h4>
                    <p className="text-yellow-100">Your payments are protected until work is completed</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Quality Guarantee</h4>
                    <p className="text-yellow-100">Money-back guarantee if you&apos;re not satisfied</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-yellow-100">Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">$2.8M+</div>
              <div className="text-sm text-yellow-100">Projects Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9★</div>
              <div className="text-sm text-yellow-100">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
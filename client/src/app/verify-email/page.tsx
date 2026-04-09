'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Mail, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

interface VerificationResponse {
  success: boolean;
  message: string;
}

function VerifyEmailContent() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('pending');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');

  useEffect(() => {
    if (!token) {
      // No token means user came here after registration
      setVerificationStatus('pending');
      setMessage('Please check your email and click the verification link to activate your account.');
      return;
    }

    // Token exists, proceed with verification
    setVerificationStatus('loading');
    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data: VerificationResponse = await response.json();

      if (response.ok && data.success) {
        setVerificationStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setMessage(data.message || 'Email verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
      setMessage('An error occurred during email verification. Please try again.');
    }
  };

  const resendVerificationEmail = async () => {
    const email = searchParams?.get('email') || localStorage.getItem('registrationEmail');
    
    if (!email) {
      setResendMessage('Email address not found. Please register again.');
      return;
    }
    
    setIsResending(true);
    setResendMessage('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage('Verification email sent successfully! Please check your inbox and spam folder.');
      } else if (response.status === 429) {
        setResendMessage('Too many requests. Please wait before requesting another verification email.');
      } else {
        setResendMessage(data.error || data.message || 'Failed to resend verification email. Please try again.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setResendMessage('An error occurred while resending the email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <BrandLogo className="h-16 w-auto" />
          </Link>
        </div>
        
        <div className="bg-white dark:bg-dark-900 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-dark-800">
          <div className="text-center">
            {verificationStatus === 'loading' && (
              <>
                <Loader2 className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Verifying Email</h2>
                <p className="text-dark-600 dark:text-dark-400">Please wait while we verify your email address...</p>
              </>
            )}

            {verificationStatus === 'success' && (
              <>
                <div className="w-16 h-16 bg-success-50 dark:bg-success-900/20 text-success-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Email Verified!</h2>
                <p className="text-dark-600 dark:text-dark-400 mb-4">{message}</p>
                <p className="text-sm text-dark-500 dark:text-dark-500 mb-6">
                  You will be redirected to the login page in a few seconds...
                </p>
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105"
                >
                  Go to Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </>
            )}

            {verificationStatus === 'pending' && (
              <>
                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Mail className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Check Your Email</h2>
                <p className="text-dark-600 dark:text-dark-400 mb-6">{message}</p>
                
                {/* Email Address Display */}
                {(searchParams?.get('email') || localStorage.getItem('registrationEmail')) && (
                  <div className="bg-dark-50 dark:bg-dark-800/50 border border-gray-100 dark:border-dark-700 rounded-xl p-4 mb-6">
                    <p className="text-sm text-dark-500 dark:text-dark-400 mb-1">
                      Verification email sent to:
                    </p>
                    <p className="text-base font-semibold text-dark-900 dark:text-white">
                      {searchParams?.get('email') || localStorage.getItem('registrationEmail')}
                    </p>
                  </div>
                )}
                
                <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 rounded-xl p-5 mb-8 text-left">
                  <h3 className="text-sm font-bold text-primary-800 dark:text-primary-400 mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    Next Steps:
                  </h3>
                  <ul className="text-sm text-primary-700 dark:text-primary-300 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 text-primary-500">•</span>
                      Check your email inbox
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary-500">•</span>
                      Look for an email from A-List Home Pros
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary-500">•</span>
                      Click the verification link in the email
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary-500">•</span>
                      Check your spam folder if missing
                    </li>
                  </ul>
                </div>
                
                {/* Resend Email Section */}
                <div className="bg-white dark:bg-dark-900 border border-gray-100 dark:border-dark-800 rounded-xl p-5 mb-8 shadow-sm">
                  <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-2">Didn't receive the email?</h3>
                  <p className="text-xs text-dark-500 dark:text-dark-400 mb-4 leading-relaxed">
                    Wait a few minutes and check your spam folder. You can request a new verification email up to 3 times per hour.
                  </p>
                  {resendMessage && (
                    <div className={`mb-4 p-3 rounded-lg text-sm border ${
                      resendMessage.includes('successfully') 
                        ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border-success-100 dark:border-success-800' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800'
                    }`}>
                      {resendMessage}
                    </div>
                  )}
                  <button
                    onClick={resendVerificationEmail}
                    disabled={isResending || resendMessage.includes('Too many')}
                    className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-200 dark:border-dark-700 text-sm font-semibold rounded-xl text-dark-700 dark:text-white bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isResending ? (
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    ) : null}
                    {isResending ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <Link
                    href="/login"
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md transition-all duration-200"
                  >
                    Back to Login
                  </Link>
                  <Link
                    href="/register"
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-200 dark:border-dark-700 text-sm font-bold rounded-xl text-dark-700 dark:text-white bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200"
                  >
                    Create New Account
                  </Link>
                </div>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <XCircle className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Verification Failed</h2>
                <p className="text-dark-600 dark:text-dark-400 mb-6">{message}</p>
                
                {/* Error Details */}
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-5 mb-8 text-left">
                  <h3 className="text-sm font-bold text-red-800 dark:text-red-400 mb-3">Common Issues:</h3>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">•</span>
                      Link expired (24 hours)
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">•</span>
                      Link already used
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">•</span>
                      Link is corrupted
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <Link
                    href="/register"
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md transition-all duration-200"
                  >
                    Register Again
                  </Link>
                  <Link
                    href="/login"
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-200 dark:border-dark-700 text-sm font-bold rounded-xl text-dark-700 dark:text-white bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200"
                  >
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 px-4">
        <div className="max-w-md w-full text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary-600 mx-auto" />
          <p className="mt-4 text-dark-600 dark:text-dark-400 font-medium">Loading verification...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
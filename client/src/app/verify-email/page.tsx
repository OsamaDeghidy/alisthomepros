'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {verificationStatus === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
                <p className="text-gray-600">Please wait while we verify your email address...</p>
              </>
            )}

            {verificationStatus === 'success' && (
              <>
                <div className="w-16 h-16 text-green-500 mx-auto mb-4 flex items-center justify-center text-6xl">✓</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <p className="text-sm text-gray-500 mb-6">
                  You will be redirected to the login page in a few seconds...
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Login
                </Link>
              </>
            )}

            {verificationStatus === 'pending' && (
              <>
                <div className="w-16 h-16 text-blue-500 mx-auto mb-4 flex items-center justify-center text-6xl">📧</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                
                {/* Email Address Display */}
                {(searchParams?.get('email') || localStorage.getItem('registrationEmail')) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">
                      Verification email sent to:
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {searchParams?.get('email') || localStorage.getItem('registrationEmail')}
                    </p>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Next Steps:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Check your email inbox</li>
                    <li>• Look for an email from A-List Home Pros</li>
                    <li>• Click the verification link in the email</li>
                    <li>• If you don't see the email, check your spam folder</li>
                    <li>• The verification link expires in 24 hours</li>
                  </ul>
                </div>
                
                {/* Resend Email Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Didn't receive the email?</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Wait a few minutes and check your spam folder. You can request a new verification email up to 3 times per hour.
                  </p>
                  {resendMessage && (
                    <div className={`mb-3 p-3 rounded text-sm ${
                      resendMessage.includes('successfully') 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : resendMessage.includes('Too many')
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {resendMessage.includes('successfully') ? '✓' : 
                           resendMessage.includes('Too many') ? '⚠️' : '✗'}
                        </div>
                        <div className="ml-2">
                          {resendMessage}
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={resendVerificationEmail}
                    disabled={isResending || resendMessage.includes('Too many')}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                </div>
                
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Login
                  </Link>
                  <Link
                    href="/register"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create New Account
                  </Link>
                </div>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <div className="w-16 h-16 text-red-500 mx-auto mb-4 flex items-center justify-center text-6xl">✗</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                
                {/* Error Details */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">Common Issues:</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• The verification link may have expired (24 hours)</li>
                    <li>• The link may have been used already</li>
                    <li>• The link may be corrupted or incomplete</li>
                  </ul>
                </div>
                
                {/* Resend Option for Error State */}
                {(searchParams?.get('email') || localStorage.getItem('registrationEmail')) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Need a new verification link?</h3>
                    {resendMessage && (
                      <div className={`mb-3 p-3 rounded text-sm ${
                        resendMessage.includes('successfully') 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : resendMessage.includes('Too many')
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {resendMessage}
                      </div>
                    )}
                    <button
                      onClick={resendVerificationEmail}
                      disabled={isResending || resendMessage.includes('Too many')}
                      className="w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                    >
                      {isResending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        'Request New Verification Email'
                      )}
                    </button>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Link
                    href="/register"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Register Again
                  </Link>
                  <Link
                    href="/login"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
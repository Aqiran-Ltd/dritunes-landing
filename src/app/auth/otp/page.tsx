'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
    ChatBubbleLeftRightIcon, 
    EnvelopeIcon, 
    ArrowPathIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';



function OtpContent() {
  const { verifyOtp, resendOtp, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize with URL param or default to phone
  const [activeMethod, setActiveMethod] = useState<'phone' | 'email'>(() => {
      const paramArgs = searchParams.get('type') as 'phone' | 'email';
      return paramArgs || 'phone';
  });

  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Clean error when switching methods
  useEffect(() => {
    setError('');
    setToken('');
  }, [activeMethod]);

  // Derived state for verified status
  const isPhoneVerified = !!user?.phone_verified_at;
  const isEmailVerified = !!user?.email_verified_at;

  const methods = [
      { 
          id: 'phone', 
          label: 'SMS Code', 
          icon: ChatBubbleLeftRightIcon,
          verified: isPhoneVerified
      },
      { 
          id: 'email', 
          label: 'Email Code', 
          icon: EnvelopeIcon, 
          verified: isEmailVerified
      },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create a temporary variable to hold the updated user
      // We know verifyOtp now returns the user object (or void)
      const updatedUser: any = await verifyOtp(token, activeMethod);
      
      // Success! Move to next step or dashboard using the FRESH user data
      handleNextStep(activeMethod, updatedUser);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      setIsLoading(false);
    }
  };

  const handleNextStep = (currentMethod: 'phone' | 'email', freshUser?: any) => {
      // Logic after successful verification of currentMethod
      // Use freshUser if available, otherwise fall back to context user (which might be stale in this tight loop)
      const currentUser = freshUser || user;

      const phoneVerified = !!currentUser?.phone_verified_at;
      const emailVerified = !!currentUser?.email_verified_at;
      
      if (currentMethod === 'phone') {
           // Phone Verified. 
           // If Email is NOT verified, go to Email.
           if (!emailVerified) { 
               setActiveMethod('email');
               setIsLoading(false);
               return;
           }
      } else if (currentMethod === 'email') {
          // Email Verified.
          // If Phone is NOT verified, go to Phone.
          if (!phoneVerified) {
              setActiveMethod('phone');
              setIsLoading(false);
              return;
          }
      }

      // If we are here, either the other method is newly verified too, 
      // or we just want to proceed.
             
      router.push('/dashboard');
  };

  // Trigger content resend if needed
  useEffect(() => {
     if (!user) return;
     if (resendCooldown === 0) {
         const isVerified = activeMethod === 'phone' ? user.phone_verified_at : user.email_verified_at;
         if (!isVerified) {
            // Optional: Auto-send logic if desired. Kept minimal to avoid spam as per previous thought.
         }
     }
  }, [activeMethod, user]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
       await resendOtp(activeMethod);
       setResendCooldown(60); 
    } catch (err) {
       console.error("Failed to resend");
    }
  };

  const isCurrentApprovied = activeMethod === 'phone' ? isPhoneVerified : isEmailVerified;

  return (
    <div className="space-y-8 animate-slide-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Verify Your Account
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Complete the steps below to fully activate your account.
        </p>
      </div>

      <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Verification Method</p>
      </div>

      {/* Method Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {methods.map((method) => (
              <button
                  key={method.id}
                  onClick={() => !method.verified && setActiveMethod(method.id as 'phone' | 'email')}
                  disabled={method.verified}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      activeMethod === method.id 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  } ${method.verified ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                  <method.icon className="w-4 h-4" />
                  {method.label}
                  {method.verified && (
                      <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full text-[10px]">✓</span>
                  )}
              </button>
          ))}
      </div>

      <div className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          {isCurrentApprovied ? (
              <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verified!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Your {activeMethod} has been successfully verified.
                  </p>
                  {/* If we are here, it means we are waiting for the next step logic or manual action. 
                      Ideally should have auto-transitioned, but if not: */}
                  <Button onClick={() => handleNextStep(activeMethod)} fullWidth>
                      Continue
                  </Button>
              </div>
          ) : (
              <>
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 mb-3">
                            {activeMethod === 'phone' ? <ChatBubbleLeftRightIcon className="w-6 h-6" /> : <EnvelopeIcon className="w-6 h-6" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activeMethod === 'phone' 
                            ? 'Enter the 6-digit code sent to your phone number.' 
                            : 'Enter the verification code sent to your email.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/50 text-center animate-pulse">
                        {error}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <Input
                            className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                            placeholder="••••••"
                            value={token}
                            onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            maxLength={6}
                            required
                            autoFocus
                        />
                    </div>

                    <Button 
                    type="submit" 
                    fullWidth 
                    isLoading={isLoading}
                    disabled={token.length < 4}
                    >
                    Verify {activeMethod === 'phone' ? 'Phone' : 'Email'}
                    </Button>
                </form>

                <button
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="mt-4 w-full text-xs font-medium text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
                    >
                    <ArrowPathIcon className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "I didn't receive a code"}
                </button>
              </>
          )}
      </div>

      <div className="flex flex-col items-center gap-3 text-center pt-2">
         {/* Navigation Logic */}
         {activeMethod === 'phone' && (
             !isEmailVerified ? (
                 <button 
                    onClick={() => setActiveMethod('email')}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors group"
                 >
                     Skip to confirm email <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                 </button>
             ) : (
                 <Link 
                    href="/dashboard" 
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors group"
                 >
                     Skip to Dashboard <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                 </Link>
             )
         )}

         {activeMethod === 'email' && (
             <>
                 <Link 
                    href="/dashboard" 
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors group"
                 >
                     Skip to Dashboard <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                 </Link>
                 
                 {!isPhoneVerified && (
                     <button 
                        onClick={() => setActiveMethod('phone')}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                     >
                         Back to verify Phone
                     </button>
                 )}
             </>
         )}
      </div>
    </div>
  );
}

export default function OtpPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><span className="loading-dots text-xl">Loading...</span></div>}>
            <OtpContent />
        </Suspense>
    )
}

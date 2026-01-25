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
  const searchParams = useSearchParams();
  
  const [activeMethod, setActiveMethod] = useState<'phone' | 'email'>((searchParams.get('type') as 'phone' | 'email') || 'phone');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await verifyOtp(token, activeMethod);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      setIsLoading(false);
    }
  };

  // Trigger OTP on mount if coming from a verification link
  useEffect(() => {
     if (!user) return;
     // If the active method matches the URL type, trigger a send
     // But we should ensure we don't spam. The cooldown handles UI spam, but backend might rate limit.
     // However, the requirement is "clicking ... should trigger ... since the next page is gonna be the page to enter".
     // So we must fire it.
     
     // Only trigger if we haven't triggered it recently (cooldown is 0)
     if (resendCooldown === 0) {
         // Verify we haven't just verified it
         if (activeMethod === 'phone' && !user.phone_verified_at) {
             resendOtp('phone').catch(console.error);
             setResendCooldown(60);
         } else if (activeMethod === 'email' && !user.email_verified_at) {
             resendOtp('email').catch(console.error);
             setResendCooldown(60);
         }
     }
  }, [activeMethod]); // When activeMethod changes (initially or by tab switch), we trigger send.

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
       await resendOtp(activeMethod);
       setResendCooldown(60); // 60s cooldown
    } catch (err) {
       console.error("Failed to resend");
    }
  };

  /* 
    Send OTP on load or when method changes.
    Exceptions:
    - If user asks for 'email' but 'phone' is selected initially due to logic override?
    - If verifying for first time or requested.
    The safest bet is to rely on user clicking "I didn't receive a code" OR
    auto-send if it's the first time landing here for that method.
    However, triggering resendOtp on mount might be aggressive if the user just registered (which sends OTP).
    Let's respect the user request: "all verify should hit the appropriate endpoints to send otp".
    If we assume registration sends OTP, we might not need to auto-send for the initial method.
    But switching tabs implies "I want to verify X now", so maybe we should send?
    
    Actually, let's keep it manual (resend) to avoid spam, unless the user specifically requests "send otp AND verify". 
    Re-reading: "In the whole project, all verify should hit the appropriate endpoints to send otp and verify."
    This likely refers to the API logic I fixed in AuthContext (endpoint selection).
    For the UI behavior: "If phone has been verified... don't show tabs"
  */

  const methods = [
      { id: 'phone', label: 'SMS Code', icon: ChatBubbleLeftRightIcon },
      { id: 'email', label: 'Email Code', icon: EnvelopeIcon },
  ].filter(m => {
      if (m.id === 'phone' && user?.phone_verified_at) return false;
      if (m.id === 'email' && user?.email_verified_at) return false;
      return true;
  });

  // Effect to ensure activeMethod is valid
  useEffect(() => {
      if (!user) return;
      
      const isPhoneVerified = !!user.phone_verified_at;
      const isEmailVerified = !!user.email_verified_at;

      // If active method is verified, switch to the other if available
      if (activeMethod === 'phone' && isPhoneVerified) {
          if (!isEmailVerified) setActiveMethod('email');
      } else if (activeMethod === 'email' && isEmailVerified) {
          if (!isPhoneVerified) setActiveMethod('phone');
      }
      
  }, [user, activeMethod]);

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
      {methods.length > 1 && (
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {methods.map((method) => (
              <button
                  key={method.id}
                  onClick={() => setActiveMethod(method.id as 'phone' | 'email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      activeMethod === method.id 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                  <method.icon className="w-4 h-4" />
                  {method.label}
              </button>
          ))}
      </div>
      )}

      <div className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
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
      </div>

      <div className="text-center pt-2">
         <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors group"
         >
             Skip for now <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
         </Link>
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

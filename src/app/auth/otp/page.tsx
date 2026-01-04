'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChatBubbleLeftRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

function OtpContent() {
  const { verifyOtp, resendOtp } = useAuth();
  const searchParams = useSearchParams();
  const type = (searchParams.get('type') as 'phone' | 'email') || 'phone';
  
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const hasSentRef = React.useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Auto-send OTP on mount if not sent recently
  useEffect(() => {
    if (!hasSentRef.current) {
        hasSentRef.current = true;
        handleResend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await verifyOtp(token, type);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
       await resendOtp(type);
       setResendCooldown(60); // 60s cooldown
    } catch (err) {
       console.error("Failed to resend");
    }
  };

  const title = type === 'phone' ? 'Verify Phone Number' : 'Verify Email Address';
  const desc = type === 'phone' 
     ? 'We sent a 6-digit code to your phone number.' 
     : 'We sent a verification code to your email address.';

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 mb-4 animate-bounce-gentle">
            <ChatBubbleLeftRightIcon className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {desc} Please enter it below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50 text-center animate-pulse">
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
          Verify Code
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowPathIcon className={`w-4 h-4 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
          {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "I didn't receive a code"}
        </button>
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

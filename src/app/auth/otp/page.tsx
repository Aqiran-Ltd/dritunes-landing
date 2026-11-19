'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
    ChatBubbleLeftRightIcon, 
    EnvelopeIcon, 
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';



function OtpContent() {
  const { user, isLoading: authLoading, pendingRegistration, verifyOtp, resendOtp, verifyRegistration, resendRegistrationOtp, cancelRegistration, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // A sign-up in progress (no account yet) or an existing account that still has an
  // unverified contact. Nobody gets past this page until both are confirmed.
  const mode: 'registration' | 'account' | null = pendingRegistration ? 'registration' : user ? 'account' : null;

  const isPhoneVerified = pendingRegistration ? pendingRegistration.verified.phone : !!user?.phone_verified_at;
  const isEmailVerified = pendingRegistration ? pendingRegistration.verified.email : !!user?.email_verified_at;
  const allVerified = isPhoneVerified && isEmailVerified;

  const [chosenMethod, setActiveMethod] = useState<'phone' | 'email'>(() => {
      const param = searchParams.get('type');
      return param === 'email' ? 'email' : 'phone';
  });
  // Land on whichever contact is still unverified.
  const activeMethod: 'phone' | 'email' =
      chosenMethod === 'phone' && isPhoneVerified && !isEmailVerified ? 'email'
      : chosenMethod === 'email' && isEmailVerified && !isPhoneVerified ? 'phone'
      : chosenMethod;

  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldowns, setCooldowns] = useState<Record<'phone' | 'email', number>>(() => (pendingRegistration ? { phone: 60, email: 60 } : { phone: 0, email: 0 })); // codes were just sent
  const resendCooldown = cooldowns[activeMethod];
  const startedFor = useRef<string | null>(null);

  // Clear error/token when switching methods — adjusted during render (not an
  // effect) by detecting the change directly, per React's guidance on resetting
  // state in response to a prop change.
  const [prevMethod, setPrevMethod] = useState(activeMethod);
  if (activeMethod !== prevMethod) {
    setPrevMethod(activeMethod);
    setError('');
    setToken('');
  }

  useEffect(() => {
    if (cooldowns.phone <= 0 && cooldowns.email <= 0) return;
    const interval = setInterval(() => {
      setCooldowns((c) => ({ phone: Math.max(0, c.phone - 1), email: Math.max(0, c.email - 1) }));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldowns.phone > 0, cooldowns.email > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // Entry: a fresh sign-up already has codes on the way (the backend rate-limits resends),
  // an existing unverified account gets its first code sent now.
  useEffect(() => {
    if (!mode || startedFor.current === mode) return;
    startedFor.current = mode;

    if (mode === 'registration') return;

    const first = !isPhoneVerified ? 'phone' : !isEmailVerified ? 'email' : null;
    if (first) {
      resendOtp(first).then(() => setCooldowns((c) => ({ ...c, [first]: 60 })));
    }
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Leave once there is nothing left to verify, or nothing to verify at all.
  useEffect(() => {
    if (authLoading) return;
    if (!mode) router.replace('/auth/register');
    else if (mode === 'account' && allVerified) router.replace('/dashboard');
  }, [authLoading, mode, allVerified, router]);

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
      if (mode === 'registration') {
        await verifyRegistration(activeMethod, token);
      } else {
        await verifyOtp(token, activeMethod);
      }
      // When both are done the account/registration flow redirects to the dashboard on
      // its own; otherwise the tab above moves to the contact that is still unverified.
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
       if (mode === 'registration') {
         await resendRegistrationOtp(activeMethod);
       } else {
         await resendOtp(activeMethod);
       }
       setCooldowns((c) => ({ ...c, [activeMethod]: 60 }));
    } catch (err: any) {
       setError(err?.message || 'Failed to resend the code');
    }
  };

  const isCurrentApprovied = activeMethod === 'phone' ? isPhoneVerified : isEmailVerified;
  const destination = mode === 'registration'
    ? (activeMethod === 'phone' ? pendingRegistration?.phone_number : pendingRegistration?.email)
    : (activeMethod === 'phone' ? user?.phone_number : user?.email);

  if (!mode) {
    return <div className="flex justify-center p-8"><span className="loading-dots text-xl">Loading...</span></div>;
  }

  return (
    <div className="space-y-8 animate-slide-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Verify Your Account
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {mode === 'registration'
            ? 'Confirm your phone number and email to create your account.'
            : 'Confirm your phone number and email to continue.'}
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
                  <p className="text-gray-500 dark:text-gray-400">
                      Your {activeMethod === 'phone' ? 'phone number' : 'email'} has been successfully verified.
                  </p>
                  {!allVerified && (
                      <Button onClick={() => setActiveMethod(activeMethod === 'phone' ? 'email' : 'phone')} fullWidth className="mt-6">
                          Verify {activeMethod === 'phone' ? 'Email' : 'Phone'}
                      </Button>
                  )}
              </div>
          ) : (
              <>
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 mb-3">
                            {activeMethod === 'phone' ? <ChatBubbleLeftRightIcon className="w-6 h-6" /> : <EnvelopeIcon className="w-6 h-6" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activeMethod === 'phone' 
                            ? 'Enter the 6-digit code sent to'
                            : 'Enter the 6-digit code sent to'}
                        {destination && <span className="block font-medium text-gray-900 dark:text-white break-all">{destination}</span>}
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
                    disabled={token.length !== 6}
                    >
                    Verify {activeMethod === 'phone' ? 'Phone' : 'Email'}
                    </Button>
                </form>

                <button
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="mt-4 w-full text-xs font-medium text-gray-400 hover:text-gold-700 dark:hover:text-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
                    >
                    <ArrowPathIcon className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "I didn't receive a code"}
                </button>
              </>
          )}
      </div>

      <div className="flex flex-col items-center gap-3 text-center pt-2">
         {mode === 'registration' ? (
             <button
                onClick={() => { cancelRegistration(); router.push('/auth/register'); }}
                className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
             >
                 Wrong email or phone number? Start over
             </button>
         ) : (
             <button
                onClick={() => logout()}
                className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
             >
                 Sign out
             </button>
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

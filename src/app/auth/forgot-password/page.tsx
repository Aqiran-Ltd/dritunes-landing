'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EnvelopeIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import GuestGuard from '@/components/auth/GuestGuard';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await forgotPassword(email);
      // Redirect to Reset Password page with email as query param for convenience
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
      setIsLoading(false);
    }
  };

  return (
    <GuestGuard>
    <div className="space-y-6 animate-slide-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Forgot Password?
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2 animate-pulse">
               {error}
            </div>
        )}

        <Input
            type="email"
            label="Email Address"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<EnvelopeIcon className="w-5 h-5" />}
            required
        />

        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
        >
          Send Code <ArrowRightIcon className="w-4 h-4 ml-1" />
        </Button>
      </form>

      <div className="text-center">
        <Link 
            href="/auth/login" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
    </GuestGuard>
  );
}

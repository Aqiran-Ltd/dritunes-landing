'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LockClosedIcon, KeyIcon } from '@heroicons/react/24/outline';
import GuestGuard from '@/components/auth/GuestGuard';

function ResetPasswordContent() {
  const { resetPassword } = useAuth();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get('email') || '';
  
  const [formData, setFormData] = useState({
    email: defaultEmail,
    token: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      setIsLoading(false);
    }
  };

  return (
    <GuestGuard>
    <div className="space-y-6 animate-slide-in-up">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-100 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 mb-4 animate-bounce-gentle">
            <KeyIcon className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Set New Password
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Must be at least 8 characters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2 animate-pulse">
               {error}
            </div>
        )}

        {/* Hidden email field if passed, or visible if needed to confirm */}
        <Input
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            readOnly={!!defaultEmail}
            className={defaultEmail ? "opacity-75 cursor-not-allowed" : ""}
        />

        <Input
            name="token"
            label="Verification Code (OTP)"
            placeholder="Enter code from email"
            value={formData.token}
            onChange={handleChange}
            maxLength={6}
            required
            className="tracking-widest font-mono"
        />

        <Input
            name="password"
            type="password"
            label="New Password"
            placeholder="New password"
            value={formData.password}
            onChange={handleChange}
            icon={<LockClosedIcon className="w-5 h-5" />}
            required
        />

        <Input
            name="password_confirmation"
            type="password"
            label="Confirm Password"
            placeholder="Confirm new password"
            value={formData.password_confirmation}
            onChange={handleChange}
            icon={<LockClosedIcon className="w-5 h-5" />}
            required
        />

        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
          className="mt-4"
        >
          Reset Password
        </Button>
      </form>
    </div>
    </GuestGuard>
  );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}

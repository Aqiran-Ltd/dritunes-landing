'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import GuestGuard from '@/components/auth/GuestGuard';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const loadingToast = toast.loading('Logging in...');

    try {
      await login(formData);
      toast.success('Logged in successfully!', { id: loadingToast });
    } catch (err: any) {
      const msg = err.message || 'Failed to login';
      setError(msg);
      toast.error(msg, { id: loadingToast });
      setIsLoading(false);
    }
  };

  return (
    <GuestGuard>
    <div className="space-y-6 animate-slide-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please enter your details to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2 animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
               {error}
            </div>
        )}

        <div className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<EnvelopeIcon className="w-5 h-5" />}
            required
          />
          
          <div className="space-y-1">
             <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={<LockClosedIcon className="w-5 h-5" />}
                required
              />
              <div className="flex justify-end">
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
                  >
                    Forgot Password?
                  </Link>
              </div>
          </div>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
          className="mt-2"
        >
          Sign In <ArrowRightIcon className="w-4 h-4 ml-1" />
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-black px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

       <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button">
             Google
          </Button>
          <Button variant="outline" type="button">
             Apple
          </Button>
       </div>

      <div className="text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
        <Link href="/auth/register" className="font-semibold text-red-600 hover:text-red-500 transition-colors">
          Sign up for free
        </Link>
      </div>
    </div>
    </GuestGuard>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import GuestGuard from '@/components/auth/GuestGuard';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    country: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (fieldErrors[e.target.name]) {
        const newErrors = { ...fieldErrors };
        delete newErrors[e.target.name];
        setFieldErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    if (formData.password !== formData.password_confirmation) {
      const msg = "Passwords do not match";
      setError(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    const loadingToast = toast.loading('Creating your account...');
    try {
      await register(formData);
      toast.success('Account created successfully!', { id: loadingToast });
    } catch (err: any) {
      const msg = err.message || 'Failed to register';
      setError(msg);
      toast.error(msg, { id: loadingToast });
      if (err.data && err.data.errors) {
          setFieldErrors(err.data.errors);
      } else if (err.data) {
          setFieldErrors(err.data);
      }
      setIsLoading(false);
    }
  };

  return (
    <GuestGuard>
    <div className="space-y-6 animate-slide-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create an Account
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Start your trading journey with Aqiran Xchange today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && !Object.keys(fieldErrors).length && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2 animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
               {error}
            </div>
        )}

        <Input
            name="name"
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            icon={<UserIcon className="w-5 h-5" />}
            required
            error={fieldErrors.name?.[0]}
        />

        <Input
            name="email"
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            icon={<EnvelopeIcon className="w-5 h-5" />}
            required
            error={fieldErrors.email?.[0]}
        />

        <div className="grid grid-cols-2 gap-4">
            <Input
                name="phone_number"
                label="Phone Number"
                placeholder="024XXXXXXX"
                value={formData.phone_number}
                onChange={handleChange}
                icon={<PhoneIcon className="w-5 h-5" />}
                required
                error={fieldErrors.phone_number?.[0]}
            />
            
            <div className="w-full space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                    Country
                </label>
                <div className="relative group">
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`
                          w-full px-4 py-3 rounded-xl
                          bg-gray-50 dark:bg-gray-900 
                          border-2 
                          ${fieldErrors.country 
                            ? 'border-red-500 focus:border-red-600' 
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:border-red-600'
                          }
                          focus:ring-4 focus:ring-gold-500/10
                          transition-all duration-300 ease-out
                          text-gray-900 dark:text-gray-100
                          focus:outline-none focus:bg-white dark:focus:bg-black
                          pl-11 appearance-none cursor-pointer
                        `}
                        required
                    >
                        <option value="" disabled>Select</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Nigeria">Nigeria</option>
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-700 transition-colors duration-300">
                        <GlobeAltIcon className="w-5 h-5" />
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </div>
                {fieldErrors.country && (
                  <p className="text-xs text-red-500 ml-1 animate-slide-in-up">
                    {fieldErrors.country[0]}
                  </p>
                )}
            </div>
        </div>

        <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            icon={<LockClosedIcon className="w-5 h-5" />}
            required
            error={fieldErrors.password?.[0]}
        />

        <Input
            name="password_confirmation"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
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
          Create Account <ArrowRightIcon className="w-4 h-4 ml-1" />
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
        <Link href="/auth/login" className="font-semibold text-gold-700 dark:text-gold-400 hover:text-gold-800 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
    </GuestGuard>
  );
}

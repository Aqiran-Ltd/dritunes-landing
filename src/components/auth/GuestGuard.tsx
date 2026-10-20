'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, needsVerification } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (needsVerification) {
         router.push('/auth/otp?type=phone');
      } else {
         router.push('/dashboard');
      }
    }
  }, [user, isLoading, needsVerification, router]);

  if (isLoading || user) { // Show loading until redirect happens
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
        </div>
      );
  }

  return <>{children}</>;
}

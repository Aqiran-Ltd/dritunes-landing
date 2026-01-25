'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExclamationTriangleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function VerificationBanner() {
  const { user, needsVerification, kycStatus, resendOtp } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Phone Verification Banner */}
      {!user.phone_verified_at && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/10 via-red-500/10 to-purple-500/10 border border-orange-500/20 shadow-lg backdrop-blur-sm">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-orange-500/10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 rounded-full bg-red-500/10 blur-xl"></div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shrink-0">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  Phone Verification Required
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl">
                  To access all features including trading and withdrawals, please verify your phone number.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                  // Trigger OTP send
                  resendOtp('phone').catch(console.error);
                  router.push('/auth/otp?type=phone');
              }}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-300 hover:shadow-orange-500/25 w-full sm:w-auto justify-center"
            >
              Verify Phone
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}

      {/* Email Verification Banner */}
      {user.phone_verified_at && !user.email_verified_at && (
         <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border border-blue-500/20 shadow-lg backdrop-blur-sm">
           <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
             <div className="flex items-start gap-4">
               <div className="p-2 sm:p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shrink-0">
                 <ExclamationTriangleIcon className="w-6 h-6" />
               </div>
               <div className="space-y-1">
                 <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                   Email Verification Required
                 </h3>
                 <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl">
                   Please verify your email address to secure your account and receive important notifications.
                 </p>
               </div>
             </div>
 
             <button
               onClick={() => {
                   // Trigger OTP send
                   resendOtp('email').catch(console.error);
                   router.push('/auth/otp?type=email');
               }}
               className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-300 w-full sm:w-auto justify-center"
             >
               Verify Email
               <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
             </button>
           </div>
         </div>
      )}

      {/* KYC Verification Banner */}
      {user.phone_verified_at && user.email_verified_at && (!kycStatus || kycStatus === 'unsubmitted' || kycStatus === 'rejected') && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 shadow-lg backdrop-blur-sm">
           <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
             <div className="flex items-start gap-4">
               <div className="p-2 sm:p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                 <ExclamationTriangleIcon className="w-6 h-6" />
               </div>
               <div className="space-y-1">
                 <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                   {kycStatus === 'rejected' ? 'KYC Verification Rejected' : 'Complete Verification'}
                 </h3>
                 <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl">
                   {kycStatus === 'rejected' 
                      ? 'Your previous verification was rejected. Please resubmit your documents.'
                      : 'To unlock higher limits and withdrawal features, please complete your identity verification.'}
                 </p>
               </div>
             </div>
 
             <Link
               href="/dashboard/kyc"
               className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-300 w-full sm:w-auto justify-center"
             >
               {kycStatus === 'rejected' ? 'Resubmit KYC' : 'Verify Identity'}
               <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
             </Link>
           </div>
         </div>
      )}
    </div>
  );
}

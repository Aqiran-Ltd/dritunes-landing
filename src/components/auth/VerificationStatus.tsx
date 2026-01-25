import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
    ChatBubbleLeftRightIcon, 
    EnvelopeIcon
} from '@heroicons/react/24/outline';

interface VerificationStatusProps {
    onMethodSelect?: (method: 'phone' | 'email') => void;
}

export const VerificationStatus = ({ onMethodSelect }: VerificationStatusProps) => {
    const { user, resendOtp, kycStatus } = useAuth();
    const router = useRouter();

    const verifications = [
        {
            id: 'email',
            label: 'Email Verification',
            status: user?.email_verified_at ? 'verified' : 'pending',
            icon: EnvelopeIcon
        },
        {
            id: 'phone',
            label: 'Phone Verification',
            status: user?.phone_verified_at ? 'verified' : 'pending',
            icon: ChatBubbleLeftRightIcon
        },
        {
            id: 'kyc',
            label: 'KYC Document',
            status: (kycStatus === 'verified' || kycStatus === 'approved') ? 'verified' : 'pending',
            icon: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {verifications.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col items-start justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-3 w-full">
                    <div className={`p-2.5 rounded-xl ${
                        item.status === 'verified' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 dark:group-hover:bg-red-900/10 dark:group-hover:text-red-400 transition-colors'
                    }`}>
                        <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                        <p className={`text-xs capitalize font-medium ${
                            item.status === 'verified' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                            {item.status}
                        </p>
                    </div>
                    {item.status === 'verified' && (
                        <div className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-1.5 rounded-full">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                               <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                             </svg>
                        </div>
                    )}
                </div>
                
                {item.status !== 'verified' && (
                    <button 
                        onClick={() => {
                            if (item.id === 'kyc') {
                                router.push('/dashboard/kyc');
                            } else {
                                if (onMethodSelect) {
                                    onMethodSelect(item.id as 'phone' | 'email');
                                } else {
                                    // Trigger OTP send before navigation
                                    if (item.id === 'phone' || item.id === 'email') {
                                        resendOtp(item.id).catch(console.error);
                                    }
                                    router.push(`/auth/otp?type=${item.id}`);
                                }
                            }
                        }}
                        className="w-full py-2.5 text-sm font-semibold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-2"
                    >
                        Verify Now
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                )}
            </div>
            ))}
        </div>
    );
};

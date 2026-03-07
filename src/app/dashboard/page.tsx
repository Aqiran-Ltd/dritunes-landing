'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ClockIcon, 
  ShieldCheckIcon,
  WalletIcon,
  CurrencyDollarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import RatesTicker from '@/components/dashboard/RatesTicker';
import QuickActions from '@/components/dashboard/QuickActions';
import { VerificationStatus } from '@/components/auth/VerificationStatus';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Check if all verifications are complete
  const allVerified = React.useMemo(() => {
      if (!user) return false;
      const isPhoneVerified = !!user.phone_verified_at;
      const isEmailVerified = !!user.email_verified_at;
      
      return isPhoneVerified && isEmailVerified;
  }, [user]);

  useEffect(() => {
      const loadDashboardData = async () => {
          try {
             const token = localStorage.getItem('access_token');
             if (!token) return;
             
             const response: any = await api.get('/dashboard/stats', token);
             if (response.success) {
                 setDashboardData(response.data);
             }
          } catch (e) {
              console.error("Failed to load dashboard data", e);
          } finally {
              setIsLoading(false);
          }
      };
      
      if (user) {
        loadDashboardData();
      }
  }, [user]);

  return (
    <div className="space-y-8 animate-slide-in-up pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hello, {user?.name.split(' ')[0]} 👋
         </h1>
         <p className="text-gray-500 dark:text-gray-400">
            Let's make some profit today.
         </p>
      </div>

      {/* Main Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Earnings Card */}
         <div className="md:col-span-3 bg-gray-900 dark:bg-black rounded-[2.5rem] p-8 text-white relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col justify-between h-full gap-8">
                 <div className="flex items-start justify-between">
                     <div>
                         <p className="text-gray-400 font-medium mb-1 uppercase tracking-widest text-[10px] font-bold">Wallet Balance</p>
                         <h2 className="text-5xl font-black italic tracking-tighter italic">₵{parseFloat(dashboardData?.wallet_balance || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                     </div>
                    <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                        <WalletIcon className="w-6 h-6 text-white" />
                    </div>
                 </div>

                  <div className="flex flex-wrap items-center gap-6 sm:gap-12">
                      <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Total Volume</p>
                          <p className="text-xl font-black text-green-400 italic">₵{parseFloat(dashboardData?.total_volume || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-700/50"></div>
                      <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Pending Payouts</p>
                          <p className="text-xl font-black text-amber-500 italic">₵{parseFloat(dashboardData?.pending_withdrawals || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-700/50"></div>
                      <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Trades</p>
                          <p className="text-xl font-black text-white italic">
                            {dashboardData?.total_trades || 0}
                            <span className="text-[10px] text-gray-400 ml-2 font-bold not-italic">({dashboardData?.completed_trades || 0} Approved)</span>
                          </p>
                      </div>
                  </div>
             </div>
         </div>

      {/* Verification Status - Hide if all verified */}
      {!allVerified && (
          <div className="md:col-span-3">
             <VerificationStatus />
          </div>
      )}
      </div>

      {/* Live Rates */}
      <RatesTicker />

      {/* Quick Actions */}
      <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          <QuickActions />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8">
         <div className="flex items-center justify-between mb-8">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Activity
             </h2>
             <Link href="/dashboard/history" className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                 View All
                 <ChevronRightIcon className="w-4 h-4" />
             </Link>
         </div>
         
         {isLoading ? (
             <div className="py-12 flex justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
             </div>
          ) : dashboardData?.recent_transactions?.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-12 text-center">
                 <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                 <ClockIcon className="w-8 h-8 text-gray-400" />
                 </div>
                 <h3 className="text-gray-900 dark:text-white font-medium mb-1">No activities found</h3>
                 <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                 You haven't made any transactions yet. Start your first trade to see activity here.
                 </p>
             </div>
          ) : (
              <div className="space-y-3">
                  {dashboardData?.recent_transactions?.map((tx: any) => (
                      <Link 
                        key={tx.id} 
                        href={tx.trade ? `/dashboard/history/${tx.trade.id}` : '/dashboard/wallet'}
                        className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
                    >
                          <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl ${
                                  tx.type === 'credit' 
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                  {tx.type === 'credit' ? <ArrowTrendingUpIcon className="w-6 h-6" /> : <ArrowTrendingDownIcon className="w-6 h-6" />}
                              </div>
                              <div>
                                  <p className="font-bold text-gray-900 dark:text-white">
                                      {tx.description || (tx.type === 'credit' ? 'Trade Payout' : 'Withdrawal')}
                                  </p>
                                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                      {new Date(tx.created_at).toLocaleDateString()} • {tx.trade?.trade_number || tx.reference || `TXN-${tx.id.toString().padStart(5, '0')}`}
                                  </p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className={`font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                                  {tx.type === 'credit' ? '+' : '-'}₵{parseFloat(tx.amount).toFixed(2)}
                              </p>
                              <div className="flex items-center justify-end gap-1.5 mt-1">
                                  <span className={`w-2 h-2 rounded-full ${
                                      tx.status === 'completed' ? 'bg-green-500' : 
                                      tx.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                                  }`}></span>
                                  <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400 italic">
                                      {tx.status}
                                  </p>
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
}

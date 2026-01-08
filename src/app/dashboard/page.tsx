'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ClockIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();

  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  React.useEffect(() => {
      const loadRecentActivity = async () => {
          try {
             const token = localStorage.getItem('access_token');
             if (!token) return;
             const response: any = await api.get('/trades', token);
             
             let trades = [];
             if (response.status && response.data) {
                 trades = response.data;
             } else if (Array.isArray(response.data)) {
                 trades = response.data;
             } else if (Array.isArray(response)) {
                 trades = response;
             }
             // Take top 5
             setRecentTrades(trades.slice(0, 5));
          } catch (e) {
              console.error("Failed to load activity", e);
          } finally {
              setLoadingActivity(false);
          }
      };
      loadRecentActivity();
  }, []);

  const stats = [
    { name: 'Total Trades', value: recentTrades.length.toString(), change: '+0%', changeType: 'neutral', icon: ArrowTrendingUpIcon },
    { name: 'Pending', value: recentTrades.filter(t => t.status === 'pending').length.toString(), change: 'Processing', changeType: 'neutral', icon: ClockIcon },
    { name: 'Verified', value: user?.kyc_status === 'verified' ? 'Level 2' : 'Level 1', change: user?.kyc_status === 'verified' ? 'Verified' : 'Basic', changeType: 'positive', icon: ShieldCheckIcon },
  ];

  return (
    <div className="space-y-8 animate-slide-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
               Welcome back, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
               Here's what's happening with your account today.
            </p>
         </div>
         <Button onClick={() => window.location.href = '/dashboard/trade'}>
            Start New Trade
         </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.map((stat) => (
             <div key={stat.name} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-red-100 dark:hover:border-red-900/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                   <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600">
                      <stat.icon className="w-6 h-6" />
                   </div>
                   <span className={`text-sm font-medium ${
                       stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-500'
                   }`}>
                      {stat.change}
                   </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                   {stat.value}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                   {stat.name}
                </p>
             </div>
         ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
         <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Recent Activity
             </h2>
             <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/history'}>
                 View All
             </Button>
         </div>
         
         {loadingActivity ? (
             <div className="py-12 flex justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
             </div>
         ) : recentTrades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <ClockIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-medium mb-1">No activities found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                You haven't made any trades yet. Start your first trade to see activity here.
                </p>
            </div>
         ) : (
             <div className="space-y-4">
                 {recentTrades.map((trade: any) => (
                     <div key={trade.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                         <div className="flex items-center gap-4">
                             <div className={`p-2 rounded-full ${trade.trade_type === 'buy' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                 {trade.trade_type === 'buy' ? <ArrowTrendingUpIcon className="w-5 h-5" /> : <ArrowTrendingDownIcon className="w-5 h-5" />}
                             </div>
                             <div>
                                 <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                     {trade.trade_type === 'buy' ? 'Bought' : 'Sold'} Crypto
                                 </p>
                                 <p className="text-xs text-gray-500">
                                     {new Date(trade.created_at).toLocaleDateString()}
                                 </p>
                             </div>
                         </div>
                         <div className="text-right">
                             <p className="font-bold text-gray-900 dark:text-white text-sm">
                                 ${parseFloat(trade.amount).toFixed(2)}
                             </p>
                             <p className={`text-xs capitalize ${
                                 trade.status === 'completed' ? 'text-green-600' : 
                                 trade.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                             }`}>
                                 {trade.status}
                             </p>
                         </div>
                     </div>
                 ))}
             </div>
         )}
      </div>
    </div>
  );
}

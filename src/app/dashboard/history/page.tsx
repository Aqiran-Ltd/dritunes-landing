'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';

interface Trade {
  id: number;
  trade_type: 'buy' | 'sell';
  amount: string; // API often returns string for decimals
  rate: string;
  total_ghs: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  reference?: string;
}

export default function HistoryPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const response: any = await api.get('/trades', token);
        
        if (response.status && response.data) {
            setTrades(response.data);
        } else if (Array.isArray(response.data)) {
             setTrades(response.data);
        } else if (Array.isArray(response)) {
             setTrades(response); // Fallback if direct array
        }
      } catch (error) {
        console.error('Failed to fetch trades', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrades();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/50';
      case 'failed': 
      case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/50';
      default: return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'failed': 
      case 'cancelled': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const filteredTrades = trades.filter(trade => 
      trade.amount.toString().includes(searchTerm) || 
      trade.status.includes(searchTerm.toLowerCase()) ||
      (trade.reference && trade.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trade History</h1>
           <p className="text-gray-500 dark:text-gray-400">View and track all your past transactions.</p>
        </div>
        <div className="w-full sm:w-72">
           <Input 
              placeholder="Search trades..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<MagnifyingGlassIcon className="w-5 h-5" />}
           />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
         {isLoading ? (
             <div className="p-12 flex justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
             </div>
         ) : filteredTrades.length === 0 ? (
             <div className="p-12 text-center text-gray-500">
                 <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                 <p>No trades found.</p>
             </div>
         ) : (
             <div className="overflow-x-auto">
                <table className="w-full">
                   <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                      <tr>
                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total (GHS)</th>
                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filteredTrades.map((trade) => (
                         <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {format(new Date(trade.created_at), 'MMM d, yyyy HH:mm')}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                    trade.trade_type === 'buy' 
                                    ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50'
                                    : 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50'
                                }`}>
                                    {trade.trade_type === 'buy' ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
                                    {trade.trade_type.toUpperCase()}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                ${parseFloat(trade.amount).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {trade.rate}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                ₵{parseFloat(trade.total_ghs || '0').toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(trade.status)}`}>
                                    {getStatusIcon(trade.status)}
                                    {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                                </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
         )}
      </div>
    </div>
  );
}

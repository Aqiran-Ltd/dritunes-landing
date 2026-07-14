'use client';

import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { fetchTrades, type TradeQueryParams } from '@/lib/tradeService';

interface Trade {
  id: number;
  trade_number: string;
  trade_type: 'sell';
  asset_name: string;
  amount: string;
  rate_used: string;
  total_payout: string;
  trade_status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'disputed';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

export default function HistoryPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [assetType, setAssetType] = useState<string>('');
  const [tradeStatus, setTradeStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10
  });

  const router = useRouter();

  const loadTrades = async (page = 1) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const params: TradeQueryParams = {
        page,
        per_page: pagination.perPage,
        search: searchTerm,
        asset_type: assetType || undefined,
        trade_status: tradeStatus || undefined,
        payment_status: paymentStatus || undefined
      };

      const response: any = await fetchTrades(token, params);
      
      const data = response.data?.data || response.data || [];
      const meta = response.data || {};

      if (Array.isArray(data)) {
        setTrades(data);
        setPagination({
          currentPage: meta.current_page || 1,
          lastPage: meta.last_page || 1,
          total: meta.total || data.length,
          perPage: meta.per_page || pagination.perPage
        });
      }
    } catch (error) {
      console.error('Failed to fetch trades', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTrades(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, assetType, tradeStatus, paymentStatus]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'paid':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/50';
      case 'rejected':
      case 'failed':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/50';
      case 'disputed':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50';
      default: // pending
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'paid':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'rejected':
      case 'failed':
        return <XCircleIcon className="w-4 h-4" />;
      case 'disputed':
        return <ExclamationCircleIcon className="w-4 h-4" />;
      case 'in_progress':
        return <ArrowPathIcon className="w-4 h-4 animate-spin" />;
      default: // pending
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const filterOptions = {
    assetType: [
      { id: 'all', name: 'All Assets' },

      { id: 'gift_card', name: 'Gift Card' }
    ],
    tradeStatus: [
      { id: 'all', name: 'All Status' },
      { id: 'pending', name: 'Pending' },
      { id: 'in_progress', name: 'In Progress' },
      { id: 'approved', name: 'Approved' },
      { id: 'rejected', name: 'Rejected' },
      { id: 'disputed', name: 'Disputed' }
    ],
    paymentStatus: [
      { id: 'all', name: 'All Payment' },
      { id: 'pending', name: 'Pending' },
      { id: 'paid', name: 'Paid' },
      { id: 'failed', name: 'Failed' }
    ]
  };

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trade History</h1>
           <p className="text-gray-500 dark:text-gray-400">View and track all your past transactions.</p>
        </div>
        <div className="w-full sm:w-80">
           <Input 
              placeholder="Search by ID or Asset..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
              className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:ring-red-600 rounded-2xl h-11"
           />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-44">
              <Select 
                  label="Asset Class"
                  options={filterOptions.assetType}
                  value={filterOptions.assetType.find(o => o.id === (assetType || 'all')) || null}
                  onChange={(o) => setAssetType(String(o.id) === 'all' ? '' : String(o.id))}
                  className="!space-y-1"
              />
          </div>
          <div className="w-full sm:w-44">
              <Select 
                  label="Trade Status"
                  options={filterOptions.tradeStatus}
                  value={filterOptions.tradeStatus.find(o => o.id === (tradeStatus || 'all')) || null}
                  onChange={(o) => setTradeStatus(String(o.id) === 'all' ? '' : String(o.id))}
                  className="!space-y-1"
              />
          </div>
          <div className="w-full sm:w-44">
              <Select 
                  label="Payment Status"
                  options={filterOptions.paymentStatus}
                  value={filterOptions.paymentStatus.find(o => o.id === (paymentStatus || 'all')) || null}
                  onChange={(o) => setPaymentStatus(String(o.id) === 'all' ? '' : String(o.id))}
                  className="!space-y-1"
              />
          </div>
          
          <button 
            onClick={() => {
                setAssetType('');
                setTradeStatus('');
                setPaymentStatus('');
                setSearchTerm('');
            }}
            className="px-4 h-11 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2"
          >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Reset
          </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden min-h-[400px]">
         {isLoading && trades.length === 0 ? (
             <div className="p-24 flex justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
             </div>
         ) : trades.length === 0 ? (
             <div className="p-24 text-center text-gray-500">
                 <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                 <p>No trades found matching your filters.</p>
             </div>
         ) : (
             <>
                <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                          <tr>
                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset</th>
                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payout</th>
                             <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                             <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                          {trades.map((trade) => (
                             <tr 
                                key={trade.id} 
                                onClick={() => router.push(`/dashboard/history/${trade.trade_number}`)}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                             >
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    {formatDistanceToNow(new Date(trade.created_at), { addSuffix: true })}
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors">
                                    {trade.trade_number}
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    {trade.asset_name.replace(/_/g, ' ')}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest border bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50">
                                        <ArrowTrendingDownIcon className="w-3 h-3" />
                                        PAYOUT
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">
                                    ${parseFloat(trade.amount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                    {trade.rate_used}
                                </td>
                                <td className="px-6 py-4 font-black text-gray-900 dark:text-white">
                                    ₵{parseFloat(trade.total_payout).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(trade.trade_status)}`}>
                                        {getStatusIcon(trade.trade_status)}
                                        {trade.trade_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(trade.payment_status)}`}>
                                        {getStatusIcon(trade.payment_status)}
                                        {trade.payment_status}
                                    </span>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Showing page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={pagination.currentPage <= 1 || isLoading}
                            onClick={() => loadTrades(pagination.currentPage - 1)}
                            className="rounded-xl h-10 px-4"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={pagination.currentPage >= pagination.lastPage || isLoading}
                            onClick={() => loadTrades(pagination.currentPage + 1)}
                            className="rounded-xl h-10 px-4"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
              </>
         )}
      </div>
    </div>
  );
}

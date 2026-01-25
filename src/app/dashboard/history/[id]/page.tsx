'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fetchCompanyPaymentMethods, type PaymentMethod } from '@/lib/tradeService';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  CreditCardIcon,
  HashtagIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface TradeDetail {
  id: number;
  trade_number: string;
  user_id: number;
  trade_type: 'buy' | 'sell';
  asset_type: string;
  asset_name: string;
  amount: string;
  rate_used: string;
  total_payout: string;
  payment_status: 'pending' | 'paid' | 'failed';
  trade_status: 'pending' | 'approved' | 'rejected' | 'disputed';
  created_at: string;
  updated_at: string;
  admin_notes: string | null;
  user_notes: string | null;
  user_payment_details?: Record<string, string> | null;
  payment_method_id?: number | null; 
  payment_method?: {
    name: string;
    details: Record<string, string>;
  } | null;
}

export default function TradeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trade, setTrade] = useState<TradeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token || !id) return;
        
        const response: any = await api.get(`/trades/${id}`, token);
        if (response.data) {
           const tradeData: TradeDetail = response.data;
           
           // If 'buy' trade and we have an ID but no expanded object, fetch company methods to find it
           if (tradeData.trade_type === 'buy' && !tradeData.payment_method && tradeData.payment_method_id) {
               try {
                  const methods = await fetchCompanyPaymentMethods(token);
                  const matched = methods.find(m => m.id === Number(tradeData.payment_method_id));
                  if (matched) {
                      tradeData.payment_method = {
                          name: matched.name,
                          details: matched.details
                      };
                  }
               } catch (err) {
                   console.error("Failed to hydrate payment method details", err);
               }
           }
           setTrade(tradeData);
        }
      } catch (error) {
        console.error('Failed to fetch trade details', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrade();
  }, [id]);

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
      default: 
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'paid':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'rejected':
      case 'failed':
        return <XCircleIcon className="w-5 h-5" />;
      case 'disputed':
        return <ExclamationCircleIcon className="w-5 h-5" />;
      default: 
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Trade not found.</p>
        <button onClick={() => router.back()} className="text-red-600 mt-4 font-medium hover:underline">
            Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-slide-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
             Trade Details
             <span className="text-lg font-normal text-gray-400">#{trade.trade_number}</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Main Details Card */}
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Transaction Info</h2>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Statuses */}
                  <div className="flex flex-col space-y-1">
                     <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Trade Status</label>
                     <div className={`mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(trade.trade_status)} w-fit`}>
                        {getStatusIcon(trade.trade_status)}
                        <span className="font-medium capitalize">{trade.trade_status}</span>
                     </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                     <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Payment Status</label>
                     <div className={`mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(trade.payment_status)} w-fit`}>
                        {getStatusIcon(trade.payment_status)}
                        <span className="font-medium capitalize">{trade.payment_status}</span>
                     </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-1 sm:col-span-2">
                     <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4" />
                        Date Created
                     </label>
                     <p className="text-gray-900 dark:text-white font-medium">
                        {format(new Date(trade.created_at), 'PPP pp')}
                     </p>
                  </div>
               </div>
            </div>

            {/* Admin Notes */}
            {trade.admin_notes && (
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100 dark:border-blue-900/30">
                   <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">Admin Feedback</h3>
                   <p className="text-blue-600 dark:text-blue-200 text-sm">{trade.admin_notes}</p>
                </div>
            )}
         </div>

         {/* Side Summary Card */}
         <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Asset Details</h2>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                     <span className="text-gray-500 text-sm">Asset</span>
                     <span className="font-bold text-gray-900 dark:text-white">{trade.asset_name.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                     <span className="text-gray-500 text-sm">Type</span>
                     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        trade.trade_type === 'buy' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                     }`}>
                        {trade.trade_type.toUpperCase()}
                     </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                     <span className="text-gray-500 text-sm">Amount</span>
                     <span className="font-mono font-medium text-gray-900 dark:text-white">${parseFloat(trade.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                     <span className="text-gray-500 text-sm">Rate</span>
                     <span className="font-mono font-medium text-gray-900 dark:text-white">{trade.rate_used}</span>
                  </div>
                  
                  <div className="pt-4 mt-2">
                     <div className="flex justify-between items-center">
                        <span className="text-gray-900 dark:text-white font-bold">Total Payout</span>
                        <span className="text-xl font-black text-red-600 dark:text-red-400">₵{parseFloat(trade.total_payout).toFixed(2)}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Payment Information Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Payment Information</h2>
               
               {/* SELL: User provided details to get paid */}
               {trade.trade_type === 'sell' && trade.user_payment_details && (
                   <div className="space-y-4">
                       <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Payout Destination</p>
                       {Object.entries(trade.user_payment_details).map(([key, value]) => (
                           <div key={key} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                               <span className="text-gray-500 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                               <span className="font-medium text-gray-900 dark:text-white text-right">{value}</span>
                           </div>
                       ))}
                   </div>
               )}

               {/* BUY: User paid to Company Account */}
               {trade.trade_type === 'buy' && trade.payment_method && (
                   <div className="space-y-4">
                       <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Paid To Company Account</p>
                       <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                           <span className="text-gray-500 text-sm">Method</span>
                           <span className="font-bold text-gray-900 dark:text-white">{trade.payment_method.name}</span>
                       </div>
                       {trade.payment_method.details && Object.entries(trade.payment_method.details).map(([key, value]) => (
                           <div key={key} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                               <span className="text-gray-500 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                               <span className="font-medium text-gray-900 dark:text-white text-right select-all">{value}</span>
                           </div>
                       ))}
                   </div>
               )}

               {/* Fallback if no structured data but notes exist */}
               {((trade.trade_type === 'sell' && !trade.user_payment_details) || (trade.trade_type === 'buy' && !trade.payment_method)) && (
                   <div className="text-sm text-gray-500 italic">
                       {trade.user_notes ? `Note: ${trade.user_notes}` : 'No detailed payment info available.'}
                   </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

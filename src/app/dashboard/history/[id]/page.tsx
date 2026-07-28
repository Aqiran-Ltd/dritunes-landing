'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
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
  ArrowTrendingDownIcon,
  WalletIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TradeChatPanel } from '@/components/dashboard/TradeChatPanel';
import { resolveStorageUrl } from '@/lib/storage';

interface TradeDetail {
  id: number;
  trade_number: string;
  user_id: number;
  asset_type: 'gift_card';
  asset_name: string;
  amount: string;
  code: string | null;
  rate_id: number;
  rate_used: string;
  total_payout: string;
  payment_status: 'pending' | 'paid' | 'failed';
  trade_status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'disputed';
  withdrawal_preference: 'wallet' | 'direct_payout';
  attachments: string[];
  user_notes: string | null;
  admin_notes: string | null;
  payment_reference: string | null;
  approved_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  rate?: {
    id: number;
    category: string;
    asset_name: string;
    denomination: string;
    country_code: string;
    type: string;
    rate: string;
  };
  user_payment_method?: {
    id: number;
    payment_type: string;
    account_name: string;
    account_number: string;
    bank_name: string;
    branch?: string;
  } | null;
  // Legacy support for user_payment_details
  user_payment_details?: Record<string, any> | string | null;
}

const prefixUrl = resolveStorageUrl;

export default function TradeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trade, setTrade] = useState<TradeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token || !id) return;
        
        const response: any = await api.get(`/trades/${id}`, token);
        
        // Robust unwrapping of the response payload based on common API patterns
        let dataPayload = response;
        if (response.data?.data && response.data.data.id) {
            dataPayload = response.data.data;
        } else if (response.data && response.data.id) {
            dataPayload = response.data;
        }
        
        if (dataPayload && dataPayload.id) {
           const tradeData: TradeDetail = { ...dataPayload };
           
            // Hydrate payment method details if missing
            /*
            if (!tradeData.payment_method && tradeData.payment_method_id) {
                // ... removed
            }
            */

           // Handle attachments that might be JSON strings
           if (typeof tradeData.attachments === 'string' && (tradeData.attachments as string).startsWith('[')) {
               try {
                   tradeData.attachments = JSON.parse(tradeData.attachments);
               } catch (e) {
                   console.error("Failed to parse attachments JSON", e);
               }
           }
           
           // Handle user_payment_details that might be JSON strings
           if (typeof tradeData.user_payment_details === 'string') {
               try {
                   tradeData.user_payment_details = JSON.parse(tradeData.user_payment_details);
               } catch (e) {
                   console.error("Failed to parse user_payment_details JSON", e);
               }
           }

           setTrade(tradeData);
        } else {
            console.error("Invalid trade response structure:", response);
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
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50';
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
      case 'in_progress':
        return <ArrowPathIcon className="w-5 h-5 animate-spin" />;
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
    <>
    <div className="max-w-7xl mx-auto space-y-8 animate-slide-in-up pb-20">
      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-white dark:bg-gray-800 hover:shadow-md rounded-2xl transition-all border border-gray-100 dark:border-gray-800"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
               Trade ID
               <span className="text-red-600">#{trade.trade_number}</span>
               {trade.rate?.country_code && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-xl ml-2 border border-gray-200 dark:border-gray-700">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                        src={`https://flagcdn.com/w40/${trade.rate.country_code.toLowerCase()}.png`} 
                        alt={trade.rate.country_code}
                        className="w-5 h-auto rounded-sm shadow-sm"
                     />
                     <span className="text-xs font-black text-gray-500 dark:text-gray-400">{trade.rate.country_code}</span>
                  </div>
               )}
            </h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Transaction Detail</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-1">Trade Status</span>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold shadow-sm ${getStatusColor(trade.trade_status)}`}>
                 {getStatusIcon(trade.trade_status)}
                 <span className="capitalize">{trade.trade_status}</span>
              </div>
           </div>
           <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-1">Payment Status</span>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold shadow-sm ${getStatusColor(trade.payment_status)}`}>
                 {getStatusIcon(trade.payment_status)}
                 <span className="capitalize">{trade.payment_status}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* LEFT COLUMN: Main Info */}
         <div className="lg:col-span-2 space-y-8">
            {/* Transaction Timeline / Steps */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
               <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Transaction Timeline</h2>
               <div className="flex flex-wrap gap-8 md:gap-12">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                        <CalendarIcon className="w-5 h-5 text-gray-500" />
                     </div>
                     <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Created</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{format(new Date(trade.created_at), 'MMM d, p')}</p>
                     </div>
                  </div>
                  {trade.paid_at && (
                    <div className="flex items-start gap-4">
                       <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                          <CheckBadgeIcon className="w-5 h-5 text-green-600" />
                       </div>
                       <div>
                          <p className="text-[10px] text-green-600 font-bold uppercase">Paid At</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{format(new Date(trade.paid_at), 'MMM d, p')}</p>
                       </div>
                    </div>
                  )}
                  {trade.approved_at && (
                    <div className="flex items-start gap-4">
                       <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                          <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                       </div>
                       <div>
                          <p className="text-[10px] text-blue-600 font-bold uppercase">Approved</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{format(new Date(trade.approved_at), 'MMM d, p')}</p>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            {/* Asset Details Bento */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Asset Configuration</h2>
                 <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black tracking-widest uppercase">Payout</span>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="space-y-1 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                     <p className="text-[10px] text-gray-400 font-bold uppercase">Asset Name</p>
                     <p className="font-black text-gray-900 dark:text-white truncate">{trade.asset_name.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="space-y-1 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                     <p className="text-[10px] text-gray-400 font-bold uppercase">Region</p>
                     <div className="flex items-center gap-2">
                        {trade.rate?.country_code ? (
                           <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                 src={`https://flagcdn.com/w40/${trade.rate.country_code.toLowerCase()}.png`}
                                 alt={trade.rate.country_code}
                                 className="w-5 h-auto rounded-sm shadow-sm"
                              />
                              <p className="font-black text-gray-900 dark:text-white uppercase">{trade.rate.country_code}</p>
                           </>
                        ) : (
                           <p className="font-black text-gray-900 dark:text-white uppercase">Global</p>
                        )}
                     </div>
                  </div>
                  <div className="space-y-1 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                     <p className="text-[10px] text-gray-400 font-bold uppercase">Denomination</p>
                     <p className="font-black text-gray-900 dark:text-white">{trade.rate?.denomination || trade.amount}</p>
                  </div>
                  <div className="space-y-1 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                     <p className="text-[10px] text-gray-400 font-bold uppercase">Card Type</p>
                     <p className="font-black text-gray-900 dark:text-white capitalize">
                        {trade.rate?.type || 'Gift Card'}
                     </p>
                  </div>
                  <div className="space-y-1 p-5 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
                     <p className="text-[10px] text-red-600 font-bold uppercase">Rate</p>
                     <p className="font-black text-red-700 dark:text-red-400">
                        {trade.rate_used} <span className="text-[9px] font-bold text-red-400">GHS</span>
                     </p>
                  </div>
               </div>

               {trade.code && (
                  <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">E-Code</p>
                     <p className="font-mono font-black text-gray-900 dark:text-white select-all tracking-wider">{trade.code}</p>
                  </div>
               )}
            </div>

            {/* Payment Details */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Payment Details</h2>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                     trade.withdrawal_preference === 'wallet'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  }`}>
                     {trade.withdrawal_preference === 'wallet' ? <WalletIcon className="w-3.5 h-3.5" /> : <BuildingLibraryIcon className="w-3.5 h-3.5" />}
                     {trade.withdrawal_preference === 'wallet' ? 'Wallet Credit' : 'Direct Payout'}
                  </div>
               </div>

               {trade.withdrawal_preference === 'wallet' ? (
                  <div className="flex items-center gap-4 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/20">
                     <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
                        <WalletIcon className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white">Credited to Wallet</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Funds were added to your Dr iTunes wallet balance.</p>
                     </div>
                  </div>
               ) : trade.user_payment_method ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl col-span-2 md:col-span-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Account Holder</p>
                        <p className="font-black text-gray-900 dark:text-white truncate">{trade.user_payment_method.account_name}</p>
                     </div>
                     <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Network / Bank</p>
                        <p className="font-black text-gray-900 dark:text-white uppercase truncate">{trade.user_payment_method.bank_name || 'N/A'}</p>
                     </div>
                     <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Type</p>
                        <p className="font-black text-gray-900 dark:text-white uppercase truncate">{trade.user_payment_method.payment_type || 'N/A'}</p>
                     </div>
                     <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl col-span-2 md:col-span-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Account Number</p>
                        <p className="font-mono font-black text-gray-900 dark:text-white select-all tracking-wider">{trade.user_payment_method.account_number}</p>
                     </div>
                  </div>
               ) : trade.user_payment_details ? (
                  <div className="grid grid-cols-2 gap-4">
                     {Object.entries(trade.user_payment_details as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                           <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                           <p className="font-black text-gray-900 dark:text-white truncate uppercase">{String(value)}</p>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-6">
                     <WalletIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                     <p className="text-sm font-bold text-gray-400 italic">No payment destination on record.</p>
                  </div>
               )}
            </div>

            {/* Attachments / Card Images — only for physical card trades */}
            {trade.attachments && trade.rate?.type !== 'ecode' && (
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Verification Assets</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(trade.attachments) ? (
                            trade.attachments.map((url, idx) => (
                                <div 
                                    key={idx} 
                                    className="group relative aspect-video rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 shadow-sm cursor-pointer"
                                    onClick={() => setSelectedImage(prefixUrl(url))}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={prefixUrl(url)} 
                                        alt={`Attachment ${idx + 1}`} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <span className="text-black font-black text-[10px] uppercase tracking-wider">Preview Proof</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div 
                                className="group relative aspect-video rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 shadow-sm cursor-pointer"
                                onClick={() => setSelectedImage(prefixUrl(trade.attachments as unknown as string))}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={prefixUrl(trade.attachments as unknown as string)} 
                                    alt="Trade Attachment" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <span className="text-black font-black text-[10px] uppercase tracking-wider">Preview Proof</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Original submission notes — kept separate from the live chat thread below */}
            {(trade.user_notes || trade.admin_notes) && (
              <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                 <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Trade Notes</h2>
                 <div className="space-y-6">
                    {trade.user_notes && (
                      <div className="max-w-[85%]">
                         <p className="text-[10px] text-gray-500 font-bold uppercase ml-4 mb-2">Your Note</p>
                         <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-[2rem] rounded-tl-none border border-gray-100 dark:border-gray-800">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">"{trade.user_notes}"</p>
                         </div>
                      </div>
                    )}
                    {trade.admin_notes && (
                      <div className="max-w-[85%] ml-auto text-right">
                         <p className="text-[10px] text-red-500 font-bold uppercase mr-4 mb-2">Internal Feedback</p>
                         <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-[2rem] rounded-tr-none border border-red-100 dark:border-red-900/20">
                            <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed font-medium">{trade.admin_notes}</p>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {/* Live trade chat */}
            <TradeChatPanel tradeNumber={trade.trade_number} />
         </div>

         {/* RIGHT COLUMN: Payout Info */}
         <div className="space-y-8">
            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-red-900/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <WalletIcon className="w-24 h-24" />
               </div>
               <div className="relative z-10">
                  <p className="text-[10px] text-red-200 font-black uppercase tracking-[0.2em] mb-4">Total Disbursement</p>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black">₵{parseFloat(trade.total_payout).toLocaleString()}</span>
                     <span className="text-sm font-bold text-red-200">GHC</span>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="p-2 bg-white/10 rounded-xl">
                           {trade.withdrawal_preference === 'wallet' ? <WalletIcon className="w-4 h-4" /> : <BuildingLibraryIcon className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">
                           {trade.withdrawal_preference === 'wallet' ? 'Wallet Credit' : 'Direct Payout'}
                        </span>
                     </div>
                     <CheckBadgeIcon className="w-6 h-6 text-red-300" />
                  </div>
               </div>
            </div>

            {/* Payout Destination Info */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
               <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Payout Destination</h2>
               
               {trade.user_payment_method ? (
                   <div className="space-y-6">
                       <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                           <p className="text-[10px] text-gray-500 font-bold uppercase">Account Holder</p>
                           <p className="font-black text-gray-900 dark:text-white truncate">{trade.user_payment_method.account_name}</p>
                       </div>
                       
                       <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center gap-4 py-1">
                             <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-2xl text-red-600">
                                <BuildingLibraryIcon className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Network / Bank</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase truncate">
                                   {trade.user_payment_method.bank_name || 'N/A'}
                                </p>
                             </div>
                          </div>

                          <div className="flex items-center gap-4 py-1">
                             <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-2xl text-red-600">
                                <CreditCardIcon className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Account Details</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white truncate select-all">
                                   {trade.user_payment_method.account_number}
                                </p>
                             </div>
                          </div>
                          
                          {trade.user_payment_method.payment_type && (
                             <div className="flex items-center gap-4 py-1">
                                <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-2xl text-red-600">
                                   <HashtagIcon className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Type</p>
                                   <p className="text-sm font-black text-gray-900 dark:text-white uppercase truncate">
                                      {trade.user_payment_method.payment_type}
                                   </p>
                                </div>
                             </div>
                          )}
                       </div>
                   </div>
               ) : trade.user_payment_details ? (
                   <div className="space-y-4">
                       {Object.entries(trade.user_payment_details as Record<string, any>).map(([key, value]) => (
                           <div key={key} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                               <p className="text-[10px] text-gray-500 font-bold uppercase">{key.replace(/_/g, ' ')}</p>
                               <p className="font-black text-gray-900 dark:text-white truncate uppercase">{String(value)}</p>
                           </div>
                       ))}
                   </div>
               ) : (
                   <div className="text-center py-6">
                      <WalletIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-400 italic">No structured destination info.</p>
                   </div>
               )}
            </div>

             {/* Proof of Disbursement */}
             {trade.payment_reference && (
                 <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-green-100 dark:border-green-900/30 overflow-hidden relative">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Disbursement Proof</h2>
                        <CheckBadgeIcon className="w-6 h-6 text-green-500" />
                    </div>
                    
                    <div className="space-y-6">
                        <div className="p-5 bg-green-50/50 dark:bg-green-900/10 rounded-3xl border border-green-50 dark:border-green-900/20">
                            <p className="text-[10px] text-green-600 font-bold uppercase mb-1">Payment Reference</p>
                            <p className="font-mono text-xs font-black text-green-700 dark:text-green-400 select-all tracking-wider">{trade.payment_reference}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Payment Type</p>
                                <p className="font-black text-gray-900 dark:text-white text-xs capitalize">{trade.user_payment_method?.payment_type || "Payout"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Disbursed On</p>
                                <p className="font-black text-gray-900 dark:text-white text-xs">
                                  {trade.paid_at ? format(new Date(trade.paid_at), "MMM d, p") : "Processing"}
                                </p>
                            </div>
                        </div>
                    </div>
                 </div>
             )}
         </div>
      </div>
    </div>

    {/* Image Preview Modal */}
    <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <XMarkIcon className="w-8 h-8" />
            </motion.button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedImage} 
                alt="Full preview" 
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

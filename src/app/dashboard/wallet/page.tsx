'use client';

import React, { useEffect, useState } from 'react';
import { 
  WalletIcon, 
  ArrowUpRightIcon, 
  ArrowDownLeftIcon,
  ClockIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { fetchWallet, requestWithdrawal, type WalletData } from '@/lib/walletService';
import { fetchUserPaymentMethods, type UserPaymentMethod } from '@/lib/paymentMethodService';
import PaymentMethodsManager from '@/components/dashboard/PaymentMethodsManager';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [userMethods, setUserMethods] = useState<UserPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState<number>(-1);
  const [withdrawStatus, setWithdrawStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const [walletData, methods] = await Promise.all([
        fetchWallet(token),
        fetchUserPaymentMethods(token)
      ]);
      
      setWallet(walletData);
      setUserMethods(methods);
      
      const defaultMethod = methods.find(m => m.is_default);
      if (defaultMethod) setSelectedMethodId(defaultMethod.id);
    } catch (error) {
      console.error('Failed to load wallet data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethodId === -1) {
      setWithdrawStatus({ type: 'error', message: 'Please select a payout account.' });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
        setWithdrawStatus({ type: 'error', message: 'Please enter a valid amount.' });
        return;
    }

    if (wallet && amount > parseFloat(wallet.balance)) {
        setWithdrawStatus({ type: 'error', message: 'Insufficient balance.' });
        return;
    }

    setIsSubmitting(true);
    setWithdrawStatus(null);
    const loadingToast = toast.loading('Submitting withdrawal request...');
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await requestWithdrawal(token, amount, selectedMethodId);
      toast.success('Withdrawal request submitted successfully!', { id: loadingToast });
      setWithdrawAmount('');
      setTimeout(() => {
        setIsWithdrawing(false);
        setWithdrawStatus(null);
        loadWalletData();
      }, 2000);
    } catch (err: any) {
      const msg = err.message || 'Failed to submit withdrawal request.';
      toast.error(msg, { id: loadingToast });
      setWithdrawStatus({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !wallet) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-in-up pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">My Wallet</h1>
         <p className="text-gray-500 dark:text-gray-400">Manage your earnings and payouts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Balance and History */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Balance Card */}
          <div className="bg-gray-900 dark:bg-black rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-white/5 shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
             
             <div className="relative z-10 space-y-8">
                <div className="flex items-start justify-between">
                   <div>
                       <p className="text-gray-400 font-medium mb-1 uppercase tracking-widest text-xs">Total Balance</p>
                       <h2 className="text-5xl font-black italic tracking-tighter">
                         ₵{parseFloat(wallet?.balance || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                       </h2>
                   </div>
                   <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10">
                       <WalletIcon className="w-8 h-8 text-white" />
                   </div>
                </div>

                <div className="flex items-center justify-between gap-6 pt-4">
                   <div className="flex-1">
                      <button 
                        onClick={() => setIsWithdrawing(true)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-3xl h-16 font-black text-lg shadow-2xl shadow-red-600/40 transition-all flex items-center justify-center gap-2 group"
                      >
                        <ArrowUpRightIcon className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Withdraw
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Recent Wallet Activity */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Recent Transactions</h2>
                 <ClockIcon className="w-5 h-5 text-gray-400" />
             </div>

             <div className="space-y-4">
               {wallet?.transactions?.data && wallet.transactions.data.length > 0 ? (
                 wallet.transactions.data.map((tx) => (
                   <div key={tx.id} className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-xl ${
                           tx.type === 'credit' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                         }`}>
                           {tx.type === 'credit' ? <ArrowDownLeftIcon className="w-5 h-5" /> : <ArrowUpRightIcon className="w-5 h-5" />}
                         </div>
                         <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{tx.description || (tx.type === 'credit' ? 'Trade Payout' : 'Withdrawal')}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                               {new Date(tx.created_at).toLocaleDateString()} • {tx.reference}
                            </p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                           {tx.type === 'credit' ? '+' : '-'}₵{parseFloat(tx.amount).toFixed(2)}
                         </p>
                         <span className={`text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${
                           tx.status === 'completed' ? 'text-green-600 bg-green-50' : 
                           tx.status === 'failed' ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50'
                         }`}>
                           {tx.status}
                         </span>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-12 text-center">
                    <p className="text-gray-500 text-sm">No recent transactions found.</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Right Column: Payment Methods Manager */}
        <div className="space-y-8">
           <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
             <PaymentMethodsManager />
           </div>

           {/* Promotional Card / Info */}
           <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-[2.5rem] p-8 text-white">
              <BanknotesIcon className="w-10 h-10 mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Instant Payouts</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Choose "Direct Payout" during your sell trades to receive funds directly in your bank or momo account as soon as the trade is approved.
              </p>
           </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {isWithdrawing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Withdraw Funds</h3>
                <button 
                  onClick={() => setIsWithdrawing(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-6">
                {withdrawStatus && (
                  <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
                    withdrawStatus.type === 'success' 
                      ? 'bg-green-50 text-green-600 border border-green-100' 
                      : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {withdrawStatus.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <ExclamationCircleIcon className="w-5 h-5" />}
                    {withdrawStatus.message}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Amount to Withdraw</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₵</span>
                    <Input 
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      className="pl-8 rounded-2xl h-14 text-xl font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold px-1 flex justify-between mt-2">
                    <span>Available: ₵{parseFloat(wallet?.balance || '0').toLocaleString()}</span>
                    <button 
                      type="button" 
                      onClick={() => setWithdrawAmount(wallet?.balance || '0')}
                      className="text-red-600 hover:underline"
                    >
                      Use Max
                    </button>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Withdraw To</label>
                  <div className="space-y-2">
                    {userMethods.length === 0 ? (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-xs text-gray-500">No payout account linked.</p>
                      </div>
                    ) : (
                      userMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethodId(method.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                            selectedMethodId === method.id 
                              ? 'border-red-600 bg-red-50/50 dark:bg-red-600/10' 
                              : 'border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className="text-left">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{method.account_name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                              {method.payment_method?.name} • {method.account_number}
                            </p>
                          </div>
                          {selectedMethodId === method.id && <CheckCircleIcon className="w-5 h-5 text-red-600" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  isLoading={isSubmitting} 
                  disabled={userMethods.length === 0}
                  className="w-full rounded-2xl h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-xl shadow-red-600/20"
                >
                  Confirm Withdrawal
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

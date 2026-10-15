'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { 
  WalletIcon, 
  ArrowUpRightIcon, 
  ArrowDownLeftIcon,
  ClockIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { fetchWallet, requestWithdrawal, type WalletData, type WalletQueryParams } from '@/lib/walletService';
import { fetchUserPaymentMethods, type UserPaymentMethod } from '@/lib/paymentMethodService';
import PaymentMethodsManager from '@/components/dashboard/PaymentMethodsManager';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [userMethods, setUserMethods] = useState<UserPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState<number>(-1);
  const [withdrawStatus, setWithdrawStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [txType, setTxType] = useState<string>('');
  const [txStatus, setTxStatus] = useState<string>('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10
  });

  const loadWalletData = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const params: WalletQueryParams = {
        page,
        per_page: pagination.perPage,
        search: searchTerm,
        type: txType || undefined,
        status: txStatus || undefined
      };

      const [walletData, methods] = await Promise.all([
        fetchWallet(token, params),
        fetchUserPaymentMethods(token)
      ]);
      
      setWallet(walletData);
      setUserMethods(methods);
      
      if (walletData) {
        setPagination({
          currentPage: walletData.transactions.current_page || 1,
          lastPage: walletData.transactions.last_page || 1,
          total: walletData.transactions.total || 0,
          perPage: 10
        });
      }
      
      const defaultMethod = methods.find(m => m.is_default);
      if (defaultMethod) setSelectedMethodId(defaultMethod.id);
    } catch (error) {
      console.error('Failed to load wallet data', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, txType, txStatus, pagination.perPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadWalletData(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [loadWalletData]);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-in-up pb-10">
      <div className="flex flex-col gap-1">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">My Wallet</h1>
         <p className="text-gray-500 dark:text-gray-400">Manage your earnings and payouts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900 dark:bg-black rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-white/5 shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
             
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
                        className="w-full bg-gold-500 hover:bg-gold-600 text-ink rounded-3xl h-16 font-black text-lg shadow-2xl shadow-gold-500/40 transition-all flex items-center justify-center gap-2 group"
                      >
                        <ArrowUpRightIcon className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Withdraw
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Recent Activity</h2>
                 <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400" />
             </div>

             <div className="flex flex-wrap gap-4 mb-8 items-end">
                <div className="flex-1 min-w-[200px]">
                    <Input 
                        placeholder="Search notes or reference..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                        className="rounded-2xl h-10 text-xs"
                    />
                </div>
                <div className="w-32">
                    <Select 
                        label="Type"
                        options={[
                            { id: 'all', name: 'All' },
                            { id: 'credit', name: 'Credit' },
                            { id: 'debit', name: 'Debit' }
                        ]}
                        value={[{ id: 'all', name: 'All' }, { id: 'credit', name: 'Credit' }, { id: 'debit', name: 'Debit' }].find(o => o.id === (txType || 'all')) || null}
                        onChange={(o) => setTxType(String(o.id) === 'all' ? '' : String(o.id))}
                        className="!space-y-1"
                    />
                </div>
                <div className="w-32">
                    <Select 
                        label="Status"
                        options={[
                            { id: 'all', name: 'All' },
                            { id: 'pending', name: 'Pending' },
                            { id: 'in_progress', name: 'In Progress' },
                            { id: 'completed', name: 'Completed' },
                            { id: 'failed', name: 'Failed' }
                        ]}
                        value={[{ id: 'all', name: 'All' }, { id: 'pending', name: 'Pending' }, { id: 'in_progress', name: 'In Progress' }, { id: 'completed', name: 'Completed' }, { id: 'failed', name: 'Failed' }].find(o => o.id === (txStatus || 'all')) || null}
                        onChange={(o) => setTxStatus(String(o.id) === 'all' ? '' : String(o.id))}
                        className="!space-y-1"
                    />
                </div>
             </div>

             <div className="space-y-4">
               {isLoading && (!wallet || wallet.transactions.data.length === 0) ? (
                 <div className="py-12 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
                 </div>
               ) : wallet?.transactions?.data && wallet.transactions.data.length > 0 ? (
                 wallet.transactions.data.map((tx) => (
                   <button 
                      key={tx.id} 
                      onClick={() => setSelectedTx(tx)}
                      className="w-full text-left group flex items-start sm:items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-transparent hover:border-gold-100 dark:hover:border-gold-900/30 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:shadow-gold-500/5 transition-all text-sm"
                   >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                         <div className={`shrink-0 p-3 rounded-xl ${
                           tx.type === 'credit' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-900/40' 
                            : 'bg-gold-100 text-gold-700 dark:bg-gold-900/20 dark:text-gold-400 group-hover:bg-gold-200 dark:group-hover:bg-gold-900/40'
                         } transition-colors`}>
                            {tx.type === 'credit' ? <ArrowDownLeftIcon className="w-5 h-5" /> : <ArrowUpRightIcon className="w-5 h-5" />}
                         </div>
                         <div>
                            <p className="font-bold text-gray-900 dark:text-white mb-0.5">{tx.description || (tx.type === 'credit' ? 'Trade Payout' : 'Withdrawal')}</p>
                            {tx.trade && (
                                <p className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded w-fit mb-1">
                                    Trade {tx.trade.trade_number}
                                </p>
                            )}
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                               {formatDateTime(tx.created_at)} • {tx.reference || `TXN-${tx.id.toString().padStart(5, '0')}`}
                            </p>
                         </div>
                      </div>
                      <div className="text-right shrink-0 mt-3 sm:mt-0">
                         <p className={`font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-gold-700'}`}>
                           {tx.type === 'credit' ? '+' : '-'}₵{parseFloat(tx.amount).toFixed(2)}
                         </p>
                         <span className={`text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${
                           tx.status === 'completed' ? 'text-green-600 bg-green-50' : 
                           tx.status === 'failed' ? 'text-red-600 bg-red-50' : 
                           tx.status === 'in_progress' ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50'
                         }`}>
                           {tx.status}
                         </span>
                      </div>
                   </button>
                 ))
               ) : (
                 <div className="py-12 text-center">
                    <p className="text-gray-500 text-sm">No transactions found matching your filters.</p>
                 </div>
               )}
             </div>

             {wallet && wallet.transactions.total > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Page {pagination.currentPage} of {pagination.lastPage}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={pagination.currentPage <= 1 || isLoading}
                            onClick={() => loadWalletData(pagination.currentPage - 1)}
                            className="rounded-xl h-9 px-3"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={pagination.currentPage >= pagination.lastPage || isLoading}
                            onClick={() => loadWalletData(pagination.currentPage + 1)}
                            className="rounded-xl h-9 px-3"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                      </div>
                  </div>
              )}
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
             <PaymentMethodsManager />
           </div>

           <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-[2.5rem] p-8 text-ink">
              <BanknotesIcon className="w-10 h-10 mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Instant Payouts</h3>
              <p className="text-ink/80 text-sm leading-relaxed">
                Choose &quot;Direct Payout&quot; during your sell trades to receive funds directly in your bank or momo account as soon as the trade is approved.
              </p>
           </div>
        </div>
      </div>

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
                      : 'bg-gold-50 text-gold-700 border border-gold-100'
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
                      className="text-gold-700 hover:underline"
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
                              ? 'border-gold-500 bg-gold-50/50 dark:bg-gold-500/10' 
                              : 'border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className="text-left">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{method.account_name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                              {method.payment_method?.name} • {method.account_number}
                            </p>
                          </div>
                          {selectedMethodId === method.id && <CheckCircleIcon className="w-5 h-5 text-gold-700" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  isLoading={isSubmitting} 
                  disabled={userMethods.length === 0}
                  className="w-full rounded-2xl h-14 bg-gold-500 hover:bg-gold-600 text-ink font-black text-lg shadow-xl shadow-gold-500/20"
                >
                  Confirm Withdrawal
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTx && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedTx(null)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                />
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto border-l border-gray-100 dark:border-gray-800"
                >
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                Transaction Details
                            </h2>
                            <button 
                                onClick={() => setSelectedTx(null)}
                                className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="text-center mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-4 ${
                                selectedTx.type === 'credit' 
                                    ? 'bg-green-500 shadow-green-500/30' 
                                    : 'bg-gold-500 shadow-gold-500/30'
                            }`}>
                                {selectedTx.type === 'credit' ? <ArrowDownLeftIcon className="w-8 h-8 text-white" /> : <ArrowUpRightIcon className="w-8 h-8 text-ink" />}
                            </div>
                            <h3 className={`text-4xl font-black tracking-tighter mb-2 ${selectedTx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                {selectedTx.type === 'credit' ? '+' : '-'}₵{parseFloat(selectedTx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h3>
                            <div className="flex items-center justify-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded w-fit ${
                                    selectedTx.status === 'completed' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 
                                    selectedTx.status === 'failed' ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : 
                                    selectedTx.status === 'in_progress' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' : 'text-amber-600 bg-amber-100 dark:bg-amber-900/30'
                                    }`}>
                                    {selectedTx.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">General Information</h4>
                                <div className="space-y-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                                        <span className="text-gray-500 text-sm">Description</span>
                                        <span className="font-semibold text-gray-900 dark:text-white text-right max-w-[60%] leading-tight">
                                            {selectedTx.description || (selectedTx.type === 'credit' ? 'Trade Payout' : 'Withdrawal')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                                        <span className="text-gray-500 text-sm">Date & Time</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatDateTime(selectedTx.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                                        <span className="text-gray-500 text-sm">Transaction ID</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-semibold text-gray-900 dark:text-white text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                {selectedTx.reference || `TXN-${selectedTx.id.toString().padStart(5, '0')}`}
                                            </span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(selectedTx.reference || `TXN-${selectedTx.id.toString().padStart(5, '0')}`);
                                                    toast.success('Copied to clipboard');
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                title="Copy Transaction ID"
                                            >
                                                <DocumentDuplicateIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-500 text-sm">Type</span>
                                        <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                            {selectedTx.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {selectedTx.trade && (
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                                        <span>Related Trade</span>
                                        <ArrowUpRightIcon className="w-3 h-3" />
                                    </h4>
                                    <div className="space-y-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 shadow-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-blue-100/50 dark:border-blue-900/30">
                                            <span className="text-gray-500 text-sm">Trade Number</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                {selectedTx.trade.trade_number}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-blue-100/50 dark:border-blue-900/30">
                                            <span className="text-gray-500 text-sm">Asset Sold</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {selectedTx.trade.amount} {selectedTx.trade.asset_name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 text-sm">
                                            <span className="text-gray-500">Rate Applied</span>
                                            <span className="font-mono font-black text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                                                ₵{selectedTx.trade.rate_used} / $
                                            </span>
                                        </div>
                                    </div>
                                    <a 
                                        href={`/dashboard/history/${selectedTx.trade.id}`}
                                        className="mt-3 block w-full text-center py-3 rounded-xl bg-blue-600 tracking-wide text-white font-bold text-xs shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                                    >
                                        View Full Trade Details
                                    </a>
                                </div>
                            )}

                            {selectedTx.notes && (
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Admin Notes</h4>
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 text-sm rounded-2xl border border-yellow-200 dark:border-yellow-900/30 leading-relaxed italic">
                                        &quot;{selectedTx.notes}&quot;
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
}

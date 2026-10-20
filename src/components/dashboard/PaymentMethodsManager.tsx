'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BuildingLibraryIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon,
  XMarkIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  fetchUserPaymentMethods, 
  addUserPaymentMethod, 
  deleteUserPaymentMethod, 
  updateUserPaymentMethod,
  type UserPaymentMethod 
} from '@/lib/paymentMethodService';
import { fetchCompanyPaymentMethods, type PaymentMethod as CompanyPaymentMethod } from '@/lib/tradeService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const MOMO_OPTIONS: SelectOption[] = [
  { id: 'mtn', name: 'MTN Mobile Money', description: 'Scan & Pay, Transfers' },
  { id: 'telecel', name: 'Telecel Cash', description: 'Fast & Secure' },
  { id: 'at', name: 'AT Money', description: 'Reliable Payouts' },
];

const BANK_OPTIONS: SelectOption[] = [
  { id: 'gcb', name: 'GCB Bank' },
  { id: 'ecobank', name: 'Ecobank Ghana' },
  { id: 'zenith', name: 'Zenith Bank' },
  { id: 'gtbank', name: 'GTBank' },
  { id: 'fidelity', name: 'Fidelity Bank' },
  { id: 'stanbic', name: 'Stanbic Bank' },
  { id: 'absa', name: 'ABSA Bank' },
  { id: 'calbank', name: 'CalBank' },
];

export default function PaymentMethodsManager() {
  const [userMethods, setUserMethods] = useState<UserPaymentMethod[]>([]);
  const [companyMethods, setCompanyMethods] = useState<CompanyPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State for New Method
  const [selectedCategory, setSelectedCategory] = useState<'momo' | 'bank' | null>(null);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');

  const selectedOption = useMemo(() => {
    const options = selectedCategory === 'momo' ? MOMO_OPTIONS : BANK_OPTIONS;
    return options.find(o => o.name === bankName) || null;
  }, [selectedCategory, bankName]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const [uMethods, cMethods] = await Promise.all([
        fetchUserPaymentMethods(token),
        fetchCompanyPaymentMethods(token)
      ]);
      
      setUserMethods(uMethods);
      setCompanyMethods(cMethods);
    } catch (err) {
      console.error('Failed to load payment methods', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: 'momo' | 'bank') => {
    setSelectedCategory(category);
    setBankName('');
    setBranch('');
  };

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      setError(`Please select an account type.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const loadingToast = toast.loading('Saving payment method...');
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await addUserPaymentMethod(token, {
        payment_type: selectedCategory,
        account_name: accountName,
        account_number: accountNumber,
        bank_name: bankName,
        branch: branch,
        is_default: userMethods.length === 0 // Default if it's the first one
      });

      toast.success('Payment method added successfully!', { id: loadingToast });
      setIsAdding(false);
      resetForm();
      await loadData();
    } catch (err: any) {
      const msg = err.message || 'Failed to add payment method.';
      setError(msg);
      toast.error(msg, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setAccountName('');
    setAccountNumber('');
    setBankName('');
    setBranch('');
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    
    const loadingToast = toast.loading('Deleting account...');
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      await deleteUserPaymentMethod(token, id);
      toast.success('Account deleted successfully!', { id: loadingToast });
      await loadData();
    } catch (err) {
      console.error('Failed to delete method', err);
      toast.error('Failed to delete account.', { id: loadingToast });
    }
  };

  const handleSetDefault = async (id: number) => {
    const loadingToast = toast.loading('Updating default account...');
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      await updateUserPaymentMethod(token, id, { is_default: true });
      toast.success('Default account updated!', { id: loadingToast });
      await loadData();
    } catch (err) {
      console.error('Failed to set default', err);
      toast.error('Failed to update default account.', { id: loadingToast });
    }
  };

  const isMoMoMethod = (method: CompanyPaymentMethod | UserPaymentMethod['payment_method'] | undefined) => {
    if (!method) return false;
    const name = method.name?.toLowerCase() || '';
    const type = method.type?.toLowerCase() || '';
    
    // Telecel is MoMo, NOT Bank. Fixes the classification issue.
    return name.includes('momo') || type.includes('momo') || type.includes('mobile') || name.includes('telecel');
  };

  const getMethodIcon = (method: CompanyPaymentMethod | UserPaymentMethod['payment_method'] | undefined) => {
    if (isMoMoMethod(method)) {
      return <DevicePhoneMobileIcon className="w-6 h-6" />;
    }
    if (method?.type?.toLowerCase().includes('bank') || method?.name?.toLowerCase().includes('bank')) {
      return <BuildingLibraryIcon className="w-6 h-6" />;
    }
    return <BanknotesIcon className="w-6 h-6" />;
  };

  if (isLoading && userMethods.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Methods</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5"
        >
          <PlusIcon className="w-4 h-4" />
          Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {userMethods.length === 0 ? (
          <div className="md:col-span-2 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center">
            <BuildingLibraryIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No payment methods found. Add one to receive payouts.</p>
            <Button 
              variant="ghost" 
              onClick={() => setIsAdding(true)}
              className="text-gold-700 dark:text-gold-400 font-bold mt-2"
            >
              Add your first account
            </Button>
          </div>
        ) : (
          userMethods.map((method) => (
            <motion.div 
              layout
              key={method.id}
              className={`relative bg-gray-50 dark:bg-[#15171e] border-2 rounded-3xl p-6 transition-all w-full ${
                method.is_default 
                  ? 'border-gold-500 shadow-lg shadow-gold-500/5' 
                  : 'border-transparent hover:border-gray-200 dark:hover:border-gray-800'
              }`}
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl  ${
                      method.is_default 
                        ? 'bg-gold-500 text-ink' 
                        : 'bg-white dark:bg-gray-800 text-gray-400'
                    }`}>
                      {getMethodIcon(method.payment_method)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{method.account_name}</p>
                        {method.is_default && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-gold-500 text-ink px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                        {method.payment_method?.name}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDelete(method.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Account"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                   <p className="text-xl font-bold text-gray-900 dark:text-white select-all">
                      {method.account_number}
                   </p>
                   {method.bank_name && (
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{method.bank_name}</p>
                   )}
                </div>

                {!method.is_default && (
                  <button 
                    onClick={() => handleSetDefault(method.id)}
                    className="w-full py-2.5 rounded-xl bg-white dark:bg-gray-800/50 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gold-700 transition-all border border-gray-100 dark:border-gray-800"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Method Modal Backdrop */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Add Payout Account</h3>
                <p className="text-gray-500 text-sm mt-1">Where would you like to receive your payments?</p>
              </div>

              <form onSubmit={handleAddMethod} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
                    <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('momo')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        selectedCategory === 'momo' 
                          ? 'border-gold-500 bg-gold-50/50 dark:bg-gold-500/10 text-gold-700 dark:text-gold-400' 
                          : 'border-gray-50 dark:border-gray-800 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${selectedCategory === 'momo' ? 'bg-gold-500 text-ink' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <DevicePhoneMobileIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">Mobile Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCategorySelect('bank')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        selectedCategory === 'bank' 
                          ? 'border-gold-500 bg-gold-50/50 dark:bg-gold-500/10 text-gold-700 dark:text-gold-400' 
                          : 'border-gray-50 dark:border-gray-800 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${selectedCategory === 'bank' ? 'bg-gold-500 text-ink' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <BuildingLibraryIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">Bank Account</span>
                    </button>
                  </div>
                </div>

                {selectedCategory && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Account Holder Name</label>
                      <Input 
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="e.g. John Doe"
                        required
                        className="rounded-2xl h-12"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                        {selectedCategory === 'momo' ? 'Phone Number' : 'Account Number'}
                      </label>
                      <Input 
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder={selectedCategory === 'momo' ? 'e.g. 0541234567' : 'e.g. 1234567890'}
                        required
                        className="rounded-2xl h-12"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Select
                        label={selectedCategory === 'momo' ? 'Network Operator' : 'Bank Name'}
                        options={selectedCategory === 'momo' ? MOMO_OPTIONS : BANK_OPTIONS}
                        value={selectedOption}
                        onChange={(option) => setBankName(option.name)}
                        placeholder={selectedCategory === 'momo' ? 'Select Network' : 'Select Bank'}
                        searchable={true}
                      />
                    </div>

                    {selectedCategory === 'bank' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Branch (Optional)</label>
                        <Input 
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          placeholder="e.g. Airport Residential"
                          className="rounded-2xl h-12"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAdding(false)} 
                    className="flex-1 rounded-2xl h-12"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    isLoading={isSubmitting} 
                    disabled={!selectedCategory}
                    className="flex-1 rounded-2xl h-12 bg-gold-500 hover:bg-gold-600 text-ink shadow-lg shadow-gold-500/20"
                  >
                    Save Account
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRates, type Category, type GiftCard } from '@/lib/ratesService';
import { createTrade, fetchCompanyPaymentMethods, type PaymentMethod } from '@/lib/tradeService';
import { fetchUserPaymentMethods, type UserPaymentMethod } from '@/lib/paymentMethodService';
import { fetchSocials } from '@/lib/socialService';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, type SelectOption } from '@/components/ui/Select';
import { 
  ArrowPathIcon, 
  BoltIcon, 
  CheckCircleIcon, 
  BanknotesIcon, 
  BuildingLibraryIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ClipboardDocumentCheckIcon,
  PhotoIcon,
  XCircleIcon,
  WalletIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type TradeType = 'sell' | 'buy';

export default function TradePage() {
  const { user } = useAuth();
  const router = useRouter();

  // -- Data State --
  const [categories, setCategories] = useState<Category[]>([]);
  const [companyPaymentMethods, setCompanyPaymentMethods] = useState<PaymentMethod[]>([]);
  const [userPaymentMethods, setUserPaymentMethods] = useState<UserPaymentMethod[]>([]);
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/233548434599'); 
  const [loadingRates, setLoadingRates] = useState(true);

  // -- Form State --
  const [tradeType, setTradeType] = useState<TradeType>('sell'); 
  const [selectedCatName, setSelectedCatName] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCardId, setSelectedCardId] = useState<number>(-1);
  const [selectedType, setSelectedType] = useState<'physical' | 'ecode'>('physical');
  const [amount, setAmount] = useState<string>('100');
  
  // -- Payout Details (When Selling) --
  const [withdrawalPreference, setWithdrawalPreference] = useState<'wallet' | 'direct_payout'>('direct_payout');
  const [selectedUserMethodId, setSelectedUserMethodId] = useState<number>(-1);
  
  // -- Attachment (When Selling) --
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Buy Mode sender reference
  const [senderReference, setSenderReference] = useState('');
  const [selectedCompanyMethodId, setSelectedCompanyMethodId] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAttachments(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  // -- Submission State --
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // -- Fetch Data --
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const [ratesData, paymentData, userMethodsData] = await Promise.all([
             fetchRates(),
             fetchCompanyPaymentMethods(''),
             token ? fetchUserPaymentMethods(token) : Promise.resolve([])
        ]);
        
        setCategories(ratesData.categories);
        if (ratesData.categories.length > 0) setSelectedCatName(ratesData.categories[0].name);
        
        setCompanyPaymentMethods(paymentData);
        setUserPaymentMethods(userMethodsData);
        
        const defaultMethod = userMethodsData.find(m => m.is_default);
        if (defaultMethod) setSelectedUserMethodId(defaultMethod.id);
        else if (userMethodsData.length > 0) setSelectedUserMethodId(userMethodsData[0].id);

        fetchSocials().then(s => {
          if (s.whatsapp) setWhatsappLink(s.whatsapp);
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRates(false);
      }
    };
    init();
  }, []);

  // -- Derived Data Logic --
  const activeCategory = useMemo(() => categories.find(c => c.name === selectedCatName), [categories, selectedCatName]);
  
  const activeRegions = useMemo(() => {
    if (!activeCategory) return [];
    return Array.from(new Set(activeCategory.cards.map(c => c.region || "Global")));
  }, [activeCategory]);

  useEffect(() => {
    if (activeRegions.length > 0 && !activeRegions.includes(selectedRegion)) {
        setSelectedRegion(activeRegions[0]);
    }
  }, [activeRegions]);

  const availableCards = useMemo(() => {
    if (!activeCategory || !selectedRegion) return [];
    return activeCategory.cards.filter(c => (c.region || "Global") === selectedRegion);
  }, [activeCategory, selectedRegion, activeRegions]);

  useEffect(() => {
     if (availableCards.length > 0) setSelectedCardId(0);
     else setSelectedCardId(-1);
  }, [availableCards]);

  const activeCard = useMemo(() => {
    if (selectedCardId >= 0 && availableCards[selectedCardId]) return availableCards[selectedCardId];
    return null;
  }, [availableCards, selectedCardId]);

  const currentRate = useMemo(() => {
     if (!activeCard) return 0;
     return selectedType === 'physical' ? activeCard.rates.ghsPhysical : activeCard.rates.ghsEcode;
  }, [activeCard, selectedType]);

  const estimatedPayout = useMemo(() => {
      const amt = parseFloat(amount);
      if (isNaN(amt) || !currentRate) return 0;
      return amt * currentRate;
  }, [amount, currentRate]);

  const isValid = useMemo(() => {
      return activeCard && estimatedPayout > 0 && parseFloat(amount) > 0;
  }, [activeCard, estimatedPayout, amount]);

  // -- Submit Handler --
  const handleSubmit = async () => {
      if (!isValid || !activeCard) return;
      
      const token = localStorage.getItem('access_token');
      if (!token) {
          router.push('/auth/login');
          return;
      }

      const payload: any = {
          amount: parseFloat(amount),
          rate_id: selectedType === 'physical' ? activeCard.physicalId : activeCard.ecodeId,
          trade_type: tradeType,
          asset_name: activeCard.assetName,
          asset_type: 'gift_card',
          user_notes: senderReference
      };

      if (tradeType === 'sell') {
          if (withdrawalPreference === 'direct_payout' && selectedUserMethodId === -1) {
              setError("Please select a payout account.");
              return;
          }
          payload.withdrawal_preference = withdrawalPreference;
          if (withdrawalPreference === 'direct_payout') {
              payload.user_payment_method_id = selectedUserMethodId;
          }
          if (attachments.length > 0) {
              payload.attachments = attachments;
          }
      } else {
          let methodId = selectedCompanyMethodId;
          if (!methodId && companyPaymentMethods.length > 0) {
              methodId = companyPaymentMethods[0].id;
          }
          if (!methodId) {
              setError("Please select a payment method.");
              return;
          }
          payload.payment_method_id = methodId;
      }

      setSubmitting(true);
      setError('');
      setSuccess('');
      const loadingToast = toast.loading('Initiating trade...');

      try {
          await createTrade(token, payload);
          toast.success("Trade initiated successfully!", { id: loadingToast });
          setSuccess("Trade initiated successfully! Check your trades history.");
          setTimeout(() => router.push('/dashboard/history'), 2000);
      } catch (err: any) {
          const msg = err.message || 'Failed to create trade.';
          setError(msg);
          toast.error(msg, { id: loadingToast });
      } finally {
          setSubmitting(false);
      }
  };

  if (loadingRates) {
      return <div className="p-12 text-center text-gray-500">Loading market data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-slide-in-up pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Start a Trade</h1>
            <p className="text-gray-500 dark:text-gray-400">Securely buy or sell gift cards instantly.</p>
          </div>
          <BoltIcon className="w-10 h-10 text-yellow-500" />
      </div>

      {/* Trade Type Toggle */}
      <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex">
          <button 
             onClick={() => setTradeType('sell')}
             className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${tradeType === 'sell' ? 'bg-white dark:bg-gray-700 shadow-md text-red-600 dark:text-red-400' : 'text-gray-500 hover:text-gray-700'}`}
          >
             <BanknotesIcon className="w-5 h-5" /> Sell Gift Card
          </button>
          <button 
             onClick={() => setTradeType('buy')}
             className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${tradeType === 'buy' ? 'bg-white dark:bg-gray-700 shadow-md text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700'}`}
          >
             <CreditCardIcon className="w-5 h-5" /> Buy Gift Card
          </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Asset Selection */}
          <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <ClipboardDocumentCheckIcon className="w-5 h-5 text-gray-400" /> 
                      1. Asset Details
                  </h3>
                  
                  <div className="space-y-4">
                      <div>
                          <Select
                            label="Category"
                            options={categories.map(c => ({ id: c.name, name: c.name }))}
                            value={selectedCatName ? { id: selectedCatName, name: selectedCatName } : null}
                            onChange={(opt) => setSelectedCatName(opt.name)}
                            searchable
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <Select
                                label="Region"
                                options={activeRegions.map(r => ({ id: r, name: r }))}
                                value={selectedRegion ? { id: selectedRegion, name: selectedRegion } : null}
                                onChange={(opt) => setSelectedRegion(opt.name)}
                              />
                          </div>
                          <div>
                              <Select
                                label="Type"
                                options={[
                                    { id: 'physical', name: 'Physical Card' },
                                    { id: 'ecode', name: 'E-Code' }
                                ]}
                                value={selectedType === 'physical' ? { id: 'physical', name: 'Physical Card' } : { id: 'ecode', name: 'E-Code' }}
                                onChange={(opt) => setSelectedType(opt.id as any)}
                              />
                          </div>
                      </div>

                      <div>
                          <Select
                            label="Card Amount on Label"
                            options={availableCards.map((c, i) => ({ id: i, name: c.amount }))}
                            value={selectedCardId >= 0 && availableCards[selectedCardId] ? { id: selectedCardId, name: availableCards[selectedCardId].amount } : null}
                            onChange={(opt) => setSelectedCardId(opt.id as number)}
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Total Amount ($)</label>
                          <input 
                            type="number" 
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-yellow-500 font-bold text-lg"
                            placeholder="100.00"
                          />
                      </div>

                      {tradeType === 'sell' && (
                          <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">Upload Card images</label>
                              <label
                                  htmlFor="file-upload"
                                  onDragOver={handleDragOver}
                                  onDragLeave={handleDragLeave}
                                  onDrop={handleDrop}
                                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                                      isDragging 
                                      ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                                      : 'border-gray-300 dark:border-gray-700 hover:border-primary/80 dark:hover:border-primary bg-gray-50 dark:bg-gray-800'
                                  }`}
                              >
                                  <div className="space-y-4 text-center w-full">
                                      {attachments.length > 0 && (
                                          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                                              {attachments.map((file, idx) => (
                                                  <div key={idx} className="flex flex-col items-center">
                                                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm group">
                                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                                          <img 
                                                              src={URL.createObjectURL(file)} 
                                                              alt="Preview" 
                                                              className="object-cover w-full h-full"
                                                          />
                                                          {/* Remove Button Overlay */}
                                                          <button 
                                                              type="button" 
                                                              onClick={(e) => {
                                                                  e.preventDefault();
                                                                  setAttachments(prev => prev.filter((_, i) => i !== idx));
                                                              }}
                                                              className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
                                                              aria-label="Remove image"
                                                          >
                                                              <XCircleIcon className="w-5 h-5" />
                                                          </button>
                                                      </div>
                                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium w-24 truncate">{file.name}</p>
                                                  </div>
                                              ))}
                                          </div>
                                      )}
                                      
                                      <div className={`flex flex-col items-center justify-center ${attachments.length > 0 ? 'border-t border-gray-200 dark:border-gray-700 pt-4' : ''}`}>
                                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                                          <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center mt-2 relative">
                                              <span className="font-medium text-primary dark:text-primary hover:text-primary/80">
                                                  {attachments.length > 0 ? 'Click to add more' : 'Click to upload'}
                                              </span>
                                              <input 
                                                  id="file-upload" 
                                                  name="file-upload" 
                                                  type="file" 
                                                  className="sr-only" 
                                                  accept="image/*"
                                                  multiple // allow selecting multiple files
                                                  onChange={handleFileChange}
                                              />
                                              <p className="pl-1">or drag and drop</p>
                                          </div>
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                              PNG, JPG, GIF up to 10MB
                                          </p>
                                      </div>
                                  </div>
                              </label>
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* RIGHT: Payment & Summary */}
          <div className="space-y-6">
               {/* Selling: User Data / Buying: Company Data */}
               <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <BuildingLibraryIcon className="w-5 h-5 text-gray-400" /> 
                      2. Payment Details
                  </h3>

                  {tradeType === 'sell' ? (
                      <div className="space-y-6">
                          <p className="text-sm text-gray-500">How would you like to receive your payment?</p>
                          
                          {/* Withdrawal Preference Selector */}
                          <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                              <button
                                  type="button"
                                  onClick={() => setWithdrawalPreference('direct_payout')}
                                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                                      withdrawalPreference === 'direct_payout' 
                                      ? 'bg-white dark:bg-gray-700 shadow-sm text-red-600' 
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                              >
                                  <BuildingLibraryIcon className="w-4 h-4" /> Direct Payout
                              </button>
                              <button
                                  type="button"
                                  onClick={() => setWithdrawalPreference('wallet')}
                                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                                      withdrawalPreference === 'wallet' 
                                      ? 'bg-white dark:bg-gray-700 shadow-sm text-red-600' 
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                              >
                                  <WalletIcon className="w-4 h-4" /> Credit Wallet
                              </button>
                          </div>

                          <AnimatePresence mode="wait">
                              {withdrawalPreference === 'direct_payout' ? (
                                  <motion.div 
                                      key="direct"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="space-y-4"
                                  >
                                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Select Payout Account</label>
                                      {userPaymentMethods.length === 0 ? (
                                          <div className="p-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl text-center">
                                              <p className="text-sm text-gray-400 mb-4">No payment methods found.</p>
                                              <Button 
                                                  variant="outline" 
                                                  size="sm"
                                                  onClick={() => router.push('/dashboard/wallet')}
                                              >
                                                  Add Account in Wallet
                                              </Button>
                                          </div>
                                      ) : (
                                          <div className="space-y-2">
                                              {userPaymentMethods.map((method) => (
                                                  <button
                                                      key={method.id}
                                                      type="button"
                                                      onClick={() => setSelectedUserMethodId(method.id)}
                                                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                                          selectedUserMethodId === method.id 
                                                          ? 'border-red-600 bg-red-50/50 dark:bg-red-600/10' 
                                                          : method.is_default
                                                              ? 'border-red-200 dark:border-red-900/30 bg-red-50/10 dark:bg-red-900/5'
                                                              : 'border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                                      }`}
                                                  >
                                                      <div className="text-left">
                                                          <div className="flex items-center gap-2">
                                                              <p className="text-sm font-bold text-gray-900 dark:text-white">{method.account_name}</p>
                                                              {method.is_default && (
                                                                  <span className="text-[9px] font-black uppercase tracking-tighter bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-md border border-red-200 dark:border-red-800">
                                                                      Default
                                                                  </span>
                                                              )}
                                                          </div>
                                                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                              {method.payment_method?.name} • {method.account_number}
                                                          </p>
                                                      </div>
                                                      {selectedUserMethodId === method.id && <CheckIcon className="w-5 h-5 text-red-600" />}
                                                  </button>
                                              ))}
                                          </div>
                                      )}
                                  </motion.div>
                              ) : (
                                  <motion.div 
                                      key="wallet"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[2rem] text-center"
                                  >
                                      <div className="p-3 bg-red-600 text-white rounded-2xl w-fit mx-auto mb-3 shadow-lg shadow-red-600/20">
                                          <WalletIcon className="w-6 h-6" />
                                      </div>
                                      <p className="text-sm font-bold text-red-900 dark:text-red-200">Funds will be credited to your wallet.</p>
                                      <p className="text-xs text-red-600/70 dark:text-red-400/60 mt-1">You can withdraw anytime from your balance.</p>
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>
                    ) : (
                      <div className="space-y-4">
                          <p className="text-sm text-gray-500">Select a payment method to pay into:</p>
                          
                          {companyPaymentMethods.length > 0 ? (
                              <div className="space-y-3">
                                  {companyPaymentMethods.map((method) => (
                                      <div 
                                        key={method.id} 
                                        onClick={() => setSelectedCompanyMethodId(method.id)}
                                        className={`cursor-pointer p-4 rounded-xl border transition-all ${
                                            selectedCompanyMethodId === method.id 
                                            ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500 ring-1 ring-yellow-500' 
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-yellow-300'
                                        }`}
                                      >
                                          <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                      selectedCompanyMethodId === method.id ? 'border-yellow-600' : 'border-gray-400'
                                                  }`}>
                                                      {selectedCompanyMethodId === method.id && <div className="w-2 h-2 rounded-full bg-yellow-600" />}
                                                  </div>
                                                  <BuildingLibraryIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                                  <p className="font-bold text-gray-900 dark:text-white">{method.name}</p>
                                              </div>
                                          </div>
                                          
                                          <div className="pl-6 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                              {Object.entries(method.details).map(([key, value]) => (
                                                  <div key={key} className="flex justify-between">
                                                      <span className="font-medium text-gray-500 dark:text-gray-400">{key}:</span>
                                                      <span className="font-semibold select-all">{value}</span>
                                                  </div>
                                              ))}
                                          </div>
                                          
                                          {method.instructions && (
                                              <div className="pl-6 mt-3 text-xs text-gray-500 italic">
                                                  {method.instructions}
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-sm text-gray-500">
                                  No payment methods available. Please contact support.
                              </div>
                          )}
                      </div>
                   )}
                   
                   {/* SHARED: Notes & Support */}
                   <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Additional Notes (Optional)</label>
                        <textarea 
                          value={senderReference} 
                          onChange={e => setSenderReference(e.target.value)}
                          placeholder="e.g. Payment Reference, specific instructions..."
                          className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-yellow-500 min-h-[80px]"
                        />

                        <div className="text-center mt-4">
                              <p className="text-xs text-gray-400 mb-2">Need help? Chat with us.</p>
                              <button onClick={() => window.open(whatsappLink)} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors">
                                  WhatsApp Support
                              </button>
                        </div>
                   </div>
               </div>

               {/* Summary Card */}
               <div className={`p-6 rounded-2xl shadow-xl text-white ${tradeType === 'sell' ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-green-600 to-green-800'}`}>
                  <p className="text-white/80 text-sm font-medium mb-1">
                      {tradeType === 'sell' ? 'You Will Receive' : 'You Will Pay'}
                  </p>
                  <div className="text-4xl font-black mb-4">
                      {isValid ? `₵${estimatedPayout.toLocaleString()}` : '---'}
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/70 border-t border-white/20 pt-4 mb-6">
                      <span>Rate Applied</span>
                      <span className="font-mono font-bold">{currentRate}</span>
                  </div>

                  {error && (
                      <div className="mb-4 p-3 bg-white/10 rounded-lg text-sm text-red-200 font-medium">
                          {error}
                      </div>
                  )}

                  {success && (
                      <div className="mb-4 p-3 bg-green-500/20 rounded-lg text-sm text-green-100 font-bold flex items-center gap-2">
                           <CheckCircleIcon className="w-5 h-5" /> {success}
                      </div>
                  )}

                  <button 
                    onClick={handleSubmit} 
                    disabled={!isValid || submitting}
                    className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                      {submitting ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />}
                      {submitting ? 'Processing...' : (tradeType === 'sell' ? 'Start Trade' : 'Proceed to Buy')}
                  </button>
               </div>
          </div>
      </div>
    </div>
  );
}

// Icon wrapper to fix missing PaperAirplaneIcon if needed (reusing HeroIcons)
function PaperAirplaneIcon(props: any) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
        </svg>
    )
}

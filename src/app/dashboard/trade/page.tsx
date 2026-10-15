'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRates, type Category } from '@/lib/ratesService';
import { createTrade } from '@/lib/tradeService';
import { fetchUserPaymentMethods, type UserPaymentMethod } from '@/lib/paymentMethodService';
import { fetchSocials } from '@/lib/socialService';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Select } from '@/components/ui/Select';
import {
  ArrowPathIcon,
  BoltIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  ClipboardDocumentCheckIcon,
  PhotoIcon,
  XCircleIcon,
  WalletIcon,
  CheckIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function TradePage() {
  useAuth();
  const router = useRouter();

  // -- Data State --
  const [categories, setCategories] = useState<Category[]>([]);
  const [userPaymentMethods, setUserPaymentMethods] = useState<UserPaymentMethod[]>([]);
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/233548434599'); 
  const [loadingRates, setLoadingRates] = useState(true);

  // -- Form State --
  const [selectedCatName, setSelectedCatName] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCardId, setSelectedCardId] = useState<number>(-1);
  const [selectedType, setSelectedType] = useState<'physical' | 'ecode' | null>(null);
  const [amount, setAmount] = useState<string>('');
  
  // -- Payout Details --
  const [withdrawalPreference, setWithdrawalPreference] = useState<'wallet' | 'direct_payout' | null>(null);
  const [selectedUserMethodId, setSelectedUserMethodId] = useState<number>(-1);
  
  // -- Trade Details --
  const [code, setCode] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Payout reference/notes
  const [userNotes, setUserNotes] = useState('');

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

  // -- Helpers --
  const getCategoryStyle = (name: string) => {
    const n = (name || "").toLowerCase();
    if (n.includes('apple') || n.includes('itunes')) return { icon: <DevicePhoneMobileIcon className="w-5 h-5" />, color: "from-gray-600 to-gray-800" };
    if (n.includes('steam')) return { icon: <ShoppingBagIcon className="w-5 h-5" />, color: "from-blue-600 to-blue-800" };
    if (n.includes('google')) return { icon: <GlobeAltIcon className="w-5 h-5" />, color: "from-green-600 to-green-800" };
    if (n.includes('xbox') || n.includes('microsoft')) return { icon: <GlobeAltIcon className="w-5 h-5" />, color: "from-green-700 to-green-900" };
    if (n.includes('sephora')) return { icon: <ShoppingBagIcon className="w-5 h-5" />, color: "from-red-600 to-red-800" };
    if (n.includes('amazon')) return { icon: <ShoppingBagIcon className="w-5 h-5" />, color: "from-yellow-600 to-yellow-800" };
    if (n.includes('visa') || n.includes('vanilla')) return { icon: <ShoppingBagIcon className="w-5 h-5" />, color: "from-blue-500 to-blue-700" };
    if (n.includes('nike')) return { icon: <ShoppingBagIcon className="w-5 h-5" />, color: "from-orange-500 to-orange-700" };
    if (n.includes('razer')) return { icon: <BoltIcon className="w-5 h-5" />, color: "from-green-500 to-green-700" };
    return { icon: <GiftIcon className="w-5 h-5" />, color: "from-purple-600 to-purple-800" };
  };

  // -- Fetch Data --
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const [ratesData, userMethodsData] = await Promise.all([
             fetchRates(),
             token ? fetchUserPaymentMethods(token) : Promise.resolve([])
        ]);

        setCategories(ratesData.categories);
        setUserPaymentMethods(userMethodsData);

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

  // -- Pre-fill from URL Params --
  useEffect(() => {
    if (categories.length > 0 && typeof window !== 'undefined' && !selectedCatName) {
      const params = new URLSearchParams(window.location.search);
      const asset = params.get('asset');
      const region = params.get('region');
      const cardLabel = params.get('card');
      const amt = params.get('amount');
      const type = params.get('type');
      
      if (asset) setSelectedCatName(asset);
      if (region) setSelectedRegion(region);
      
      if (amt) {
        setAmount(amt);
      } else if (cardLabel) {
        // Extract all numbers from the string (including decimals) to handle ranges like "50~100"
        const numbers = cardLabel.match(/\d+(\.\d+)?/g);
        if (numbers && numbers.length > 0) {
          const highest = Math.max(...numbers.map(Number));
          setAmount(highest.toString());
        }
      }

      if (type) {
        if (type.toLowerCase() === 'physical') setSelectedType('physical');
        else if (type.toLowerCase() === 'e-code' || type.toLowerCase() === 'ecode') setSelectedType('ecode');
      }
    }
  }, [categories, selectedCatName]);

  // -- Auto-select settlement or deselect when switching --
  useEffect(() => {
    if (withdrawalPreference === 'direct_payout' && selectedUserMethodId === -1 && userPaymentMethods.length > 0) {
      const defaultMethod = userPaymentMethods.find(m => m.is_default);
      if (defaultMethod) {
        setSelectedUserMethodId(defaultMethod.id);
      } else {
        setSelectedUserMethodId(userPaymentMethods[0].id);
      }
    } else if (withdrawalPreference === 'wallet' && selectedUserMethodId !== -1) {
      setSelectedUserMethodId(-1);
    }
  }, [withdrawalPreference, userPaymentMethods, selectedUserMethodId]);

  // -- Derived Data Logic --
  const activeCategory = useMemo(() => categories.find(c => c.name === selectedCatName), [categories, selectedCatName]);
  
  const activeRegions = useMemo(() => {
    if (!activeCategory) return [];
    return Array.from(new Set(activeCategory.cards.map(c => c.region || "Global")));
  }, [activeCategory]);

  useEffect(() => {
    if (activeRegions.length > 0 && selectedRegion && !activeRegions.includes(selectedRegion)) {
        setSelectedRegion('');
    }
  }, [activeRegions, selectedRegion]);

  const availableCards = useMemo(() => {
    if (!activeCategory || !selectedRegion) return [];
    return activeCategory.cards.filter(c => (c.region || "Global") === selectedRegion);
  }, [activeCategory, selectedRegion]);

  useEffect(() => {
      let nextId = -1;
      if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const cardLabel = params.get('card') || params.get('amount'); // fallback to 'amount' for legacy links
          if (cardLabel && availableCards.length > 0) {
              nextId = availableCards.findIndex(c => c.amount === cardLabel);
          }
      }
      setSelectedCardId(nextId);
  }, [availableCards]);

  const activeCard = useMemo(() => {
    if (selectedCardId >= 0 && availableCards[selectedCardId]) return availableCards[selectedCardId];
    return null;
  }, [availableCards, selectedCardId]);

  const currentRate = useMemo(() => {
     if (!activeCard || !selectedType) return 0;
     return selectedType === 'physical' ? activeCard.rates.ghsPhysical : activeCard.rates.ghsEcode;
  }, [activeCard, selectedType]);

  const estimatedPayout = useMemo(() => {
      const amt = parseFloat(amount);
      if (isNaN(amt) || !currentRate) return 0;
      return amt * currentRate;
  }, [amount, currentRate]);

  const isValid = useMemo(() => {
      const amt = parseFloat(amount);
      const isWithdrawalValid = withdrawalPreference === 'wallet' || (withdrawalPreference === 'direct_payout' && selectedUserMethodId !== -1);
      const isCodeValid = selectedType !== 'ecode' || code.trim().length > 0;
      const isAttachmentsValid = selectedType !== 'physical' || attachments.length > 0;
      return !!activeCard && !!selectedType && estimatedPayout > 0 && !isNaN(amt) && amt > 0 && isWithdrawalValid && isCodeValid && isAttachmentsValid;
  }, [activeCard, selectedType, estimatedPayout, amount, code, attachments, withdrawalPreference, selectedUserMethodId]);

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
          asset_name: activeCard.assetName,
          asset_type: 'gift_card',
          user_notes: userNotes,
          denomination: activeCard.amount,
          withdrawal_preference: withdrawalPreference,
          code: selectedType === 'ecode' ? code.trim() : null,
      };

      if (withdrawalPreference === 'direct_payout') {
          if (selectedUserMethodId === -1) {
              setError("Please select a payout account.");
              return;
          }
          payload.user_payment_method_id = selectedUserMethodId;
      }

      if (attachments.length > 0) {
          payload.attachments = attachments;
      }

      setSubmitting(true);
      setError('');
      setSuccess('');
      const loadingToast = toast.loading('Initiating payout...');

      try {
          await createTrade(token, payload);
          toast.success("Payout initiated successfully!", { id: loadingToast });
          setSuccess("Payout initiated successfully! Check your history.");
          setTimeout(() => router.push('/dashboard/history'), 2000);
      } catch (err: any) {
          const msg = err.message || 'Failed to initiate payout.';
          setError(msg);
          toast.error(msg, { id: loadingToast });
      } finally {
          setSubmitting(false);
      }
  };

  if (loadingRates) {
      return <div className="p-12 text-center text-gray-500 font-medium">Loading market data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-slide-in-up pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Start a Payout</h1>
            <p className="text-gray-500 dark:text-gray-400">Securely trade your assets for GHC instantly.</p>
          </div>
          <BoltIcon className="w-10 h-10 text-yellow-500" />
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
                            options={categories.map(c => ({ 
                              id: c.name, 
                              name: c.name,
                              icon: c.logoUrl ? <img src={c.logoUrl} alt={c.name} className="w-5 h-5 object-contain rounded-sm" /> : getCategoryStyle(c.name).icon
                            }))}
                            value={selectedCatName ? { 
                              id: selectedCatName, 
                              name: selectedCatName,
                              icon: activeCategory?.logoUrl ? <img src={activeCategory.logoUrl} alt={selectedCatName} className="w-5 h-5 object-contain rounded-sm" /> : getCategoryStyle(selectedCatName).icon
                            } : null}
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
                            onChange={(opt) => setSelectedRegion(opt.id as string)}
                            placeholder="Select Region"
                          />
                          </div>
                          <div>
                              <Select
                            label="Type"
                            options={[
                                { id: 'physical', name: 'Physical Card' },
                                { id: 'ecode', name: 'E-Code' }
                            ]}
                            value={selectedType === 'physical' 
                                ? { id: 'physical', name: 'Physical Card' } 
                                : selectedType === 'ecode' 
                                    ? { id: 'ecode', name: 'E-Code' }
                                    : null
                            }
                            onChange={(opt) => setSelectedType(opt.id as 'physical' | 'ecode')}
                            placeholder="Select Type"
                          />
                          </div>
                      </div>

                      <div>
                          <Select
                            label="Card Amount on Label"
                            options={availableCards.map((c, i) => ({ id: i, name: c.amount }))}
                            value={selectedCardId >= 0 && availableCards[selectedCardId] ? { id: selectedCardId, name: availableCards[selectedCardId].amount } : null}
                            onChange={(opt) => setSelectedCardId(Number(opt.id))}
                            placeholder="Select Amount"
                            disabled={!selectedRegion}
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Total Amount ($)</label>
                          <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-gold-500 font-bold text-lg"
                            placeholder="100.00"
                          />
                      </div>

                      {selectedType === 'ecode' ? (
                          <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                  E-Code <span className="text-gold-700">*</span>
                              </label>
                              <input
                                  type="text"
                                  value={code}
                                  onChange={e => setCode(e.target.value)}
                                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-gold-500 font-mono"
                                  placeholder="Enter your gift card code..."
                              />
                          </div>
                      ) : (
                          <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">Upload Card Images</label>
                              <label
                                  htmlFor="file-upload"
                                  onDragOver={handleDragOver}
                                  onDragLeave={handleDragLeave}
                                  onDrop={handleDrop}
                                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                                      isDragging
                                      ? 'border-gold-500 bg-gold-50/5 dark:bg-gold-500/10'
                                      : 'border-gray-300 dark:border-gray-700 hover:border-gold-500/80 dark:hover:border-gold-500 bg-gray-50 dark:bg-gray-800'
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
                                                          <button
                                                              type="button"
                                                              onClick={(e) => {
                                                                  e.preventDefault();
                                                                  setAttachments(prev => prev.filter((_, i) => i !== idx));
                                                              }}
                                                              className="absolute top-1 right-1 bg-gold-500/80 hover:bg-gold-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
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
                                              <span className="font-medium text-gold-700 hover:text-gold-800">
                                                  {attachments.length > 0 ? 'Click to add more' : 'Click to upload'}
                                              </span>
                                              <input
                                                  id="file-upload"
                                                  name="file-upload"
                                                  type="file"
                                                  className="sr-only"
                                                  accept="image/*"
                                                  multiple
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
               <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <BuildingLibraryIcon className="w-5 h-5 text-gray-400" /> 
                      2. Payment Details
                  </h3>

                  <div className="space-y-6">
                      <p className="text-sm text-gray-500">How would you like to receive your payment?</p>
                      
                      <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                          <button
                              type="button"
                              onClick={() => setWithdrawalPreference('direct_payout')}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                                  withdrawalPreference === 'direct_payout' 
                                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gold-700' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                          >
                              <BuildingLibraryIcon className="w-4 h-4" /> Direct Payout
                          </button>
                          <button
                              type="button"
                              onClick={() => setWithdrawalPreference('wallet')}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                                  withdrawalPreference === 'wallet' 
                                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gold-700' 
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
                                          <p className="text-sm text-gray-400 mb-4">No payout methods found.</p>
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
                                                      ? 'border-gold-500 bg-gold-50/50 dark:bg-gold-500/10' 
                                                      : method.is_default
                                                          ? 'border-gold-200 dark:border-gold-900/30 bg-gold-50/10 dark:bg-gold-900/5'
                                                          : 'border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                                  }`}
                                              >
                                                  <div className="text-left">
                                                      <div className="flex items-center gap-2">
                                                          <p className="text-sm font-bold text-gray-900 dark:text-white">{method.account_name}</p>
                                                          {method.is_default && (
                                                              <span className="text-[9px] font-black uppercase tracking-tighter bg-gold-100 dark:bg-gold-900/50 text-gold-700 dark:text-gold-400 px-1.5 py-0.5 rounded-md border border-gold-200 dark:border-gold-700">
                                                                  Default
                                                              </span>
                                                          )}
                                                      </div>
                                                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                           {`${method.payment_type} • ${method.bank_name} • ${method.account_number}`}
                                                      </p>
                                                  </div>
                                                  {selectedUserMethodId === method.id && <CheckIcon className="w-5 h-5 text-gold-700" />}
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
                                  className="p-6 bg-gold-50 dark:bg-gold-900/10 border border-gold-100 dark:border-gold-900/20 rounded-[2rem] text-center"
                              >
                                  <div className="p-3 bg-gold-500 text-ink rounded-2xl w-fit mx-auto mb-3 shadow-lg shadow-gold-500/20">
                                      <WalletIcon className="w-6 h-6" />
                                  </div>
                                  <p className="text-sm font-bold text-gold-900 dark:text-gold-200">Funds will be credited to your wallet.</p>
                                  <p className="text-xs text-gold-700/70 dark:text-gold-400/60 mt-1">You can withdraw anytime from your balance.</p>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </div>
               
                  {/* SHARED: Notes & Support */}
                  <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
                       <label className="block text-sm font-medium text-gray-500 mb-1">Additional Notes (Optional)</label>
                       <textarea 
                         value={userNotes} 
                         onChange={e => setUserNotes(e.target.value)}
                         placeholder="e.g. Specific instructions for this payout..."
                         className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-gold-500 min-h-[80px]"
                       />

                       <div className="text-center mt-4">
                             <p className="text-xs text-gray-400 mb-2">Need help? Chat with us.</p>
                             <button onClick={() => window.open(whatsappLink)} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors cursor-pointer">
                                 WhatsApp Support
                             </button>
                       </div>
                  </div>
               </div>

               <div className="p-6 rounded-2xl shadow-xl text-ink bg-gradient-to-br from-gold-500 to-gold-600">
                  <p className="text-ink/80 text-sm font-medium mb-1">
                      You Will Receive
                  </p>
                  <div className="text-4xl font-black mb-4">
                      {isValid ? `₵${estimatedPayout.toLocaleString()}` : '---'}
                  </div>
                  
                  <div className="flex justify-between text-sm text-ink/70 border-t border-ink/15 pt-4 mb-6">
                      <span>Rate Applied</span>
                      <span className="font-mono font-bold uppercase">{currentRate}</span>
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
                    className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                      {submitting ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />}
                      {submitting ? 'Processing...' : 'Start Payout Trade'}
                  </button>
               </div>
          </div>
      </div>
    </div>
  );
}

// Icon wrapper to fix missing PaperAirplaneIcon if needed
function PaperAirplaneIcon(props: any) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
    );
}

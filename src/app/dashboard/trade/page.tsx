'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRates, type Category, type GiftCard } from '@/lib/ratesService';
import { createTrade, fetchCompanyPaymentMethods, type PaymentMethod } from '@/lib/tradeService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  BoltIcon, 
  CheckCircleIcon, 
  BanknotesIcon, 
  BuildingLibraryIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

type TradeType = 'sell' | 'buy'; // Sell = User to Company (Get paid), Buy = Company to User (Pay us)

export default function TradePage() {
  const { user } = useAuth();
  const router = useRouter();

  // -- Data State --
  const [categories, setCategories] = useState<Category[]>([]);
  const [companyPaymentMethods, setCompanyPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);

  // -- Form State --
  const [tradeType, setTradeType] = useState<TradeType>('sell'); 
  const [selectedCatName, setSelectedCatName] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCardId, setSelectedCardId] = useState<number>(-1);
  const [selectedType, setSelectedType] = useState<'physical' | 'ecode'>('physical');
  const [amount, setAmount] = useState<string>('100');
  
  // -- Payment Details (When Selling) --
  const [paymentProvider, setPaymentProvider] = useState('Momo');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // -- Submission State --
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // -- Fetch Rates --
  useEffect(() => {
    const init = async () => {
      try {
        const [ratesData, paymentData] = await Promise.all([
             fetchRates(),
             fetchCompanyPaymentMethods('') // No token needed if public
        ]);
        
        setCategories(ratesData.categories);
        if (ratesData.categories.length > 0) setSelectedCatName(ratesData.categories[0].name);
        
        setCompanyPaymentMethods(paymentData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRates(false);
      }
    };
    init();
  }, []);

  // -- Derived Data Logic (Reuse from Rates Page) --
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
     // Reset card selection when available cards change
     if (availableCards.length > 0) setSelectedCardId(0);
     else setSelectedCardId(-1);
  }, [availableCards]);

  const activeCard = useMemo(() => {
    if (selectedCardId >= 0 && availableCards[selectedCardId]) return availableCards[selectedCardId];
    return null;
  }, [availableCards, selectedCardId]);

  // -- Rate Calculation --
  const currentRate = useMemo(() => {
     if (!activeCard) return 0;
     // Assuming Sell Rate is what we pay user
     // If user buys, logic might differ (margin added?), but usually same rate ID used
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

      setSubmitting(true);
      setError('');
      setSuccess('');

      try {
          // Identify correct ID
          const rateId = selectedType === 'physical' ? activeCard.physicalId : activeCard.ecodeId;
          
          if (!rateId) throw new Error("Selected card type not available for this region.");

          // Find a valid payment method ID (Required by API)
          // For Sell: We just need ANY valid ID to pass validation (or specific one if logic dictates)
          // For Buy: We likely select the one user pays to.
          // Defaulting to first available company method if user hasn't "selected" one in Sell mode.
          const defaultMethodId = companyPaymentMethods[0]?.id;
          if (!defaultMethodId) throw new Error("System error: No payment methods available to process trade.");

          // Construct Notes for user payment details (since API might not map them automatically yet)
          const notes = tradeType === 'sell' 
            ? `Payout Details: ${paymentProvider} - ${accountName} - ${accountNumber}`
            : undefined;

          await createTrade(token, {
              amount: parseFloat(amount),
              rate_id: rateId,
              trade_type: tradeType,
              asset_name: activeCard.assetName,
              asset_type: 'gift_card', // Hardcoded for now based on API requirement
              payment_method_id: defaultMethodId, // REQUIRED field
              payment_method_name: tradeType === 'sell' ? paymentProvider : undefined,
              payment_account_name: tradeType === 'sell' ? accountName : undefined,
              payment_account_number: tradeType === 'sell' ? accountNumber : undefined,
              notes: notes
          });

          setSuccess("Trade initiated successfully! Check your trades history.");
          // Reset form?
      } catch (err: any) {
          setError(err.message || 'Failed to create trade.');
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
                          <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                          <select 
                            value={selectedCatName}
                            onChange={e => setSelectedCatName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-yellow-500"
                          >
                              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">Region</label>
                              <select 
                                value={selectedRegion}
                                onChange={e => setSelectedRegion(e.target.value)}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-yellow-500"
                              >
                                  {activeRegions.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                               <select 
                                value={selectedType}
                                onChange={e => setSelectedType(e.target.value as any)}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-yellow-500"
                              >
                                  <option value="physical">Physical Card</option>
                                  <option value="ecode">E-Code</option>
                              </select>
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Card Amount on Label</label>
                           <select 
                                value={selectedCardId}
                                onChange={e => setSelectedCardId(Number(e.target.value))}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-yellow-500"
                              >
                                  {availableCards.map((c, i) => <option key={i} value={i}>{c.amount}</option>)}
                              </select>
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
                      <div className="space-y-4">
                          <p className="text-sm text-gray-500">Provide details where you want to receive payment.</p>
                          
                          <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">Payment Provider</label>
                              <select 
                                value={paymentProvider}
                                onChange={e => setPaymentProvider(e.target.value)}
                                className="w-full p-3 rounded-xl bg-red-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-500"
                              >
                                  <option value="Momo">Mobile Money (Momo)</option>
                                  <option value="Bank">Bank Transfer</option>
                                  <option value="Crypto">USDT / Crypto</option>
                              </select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="block text-sm font-medium text-gray-500 mb-1">Account Name</label>
                                  <input 
                                    type="text" 
                                    value={accountName}
                                    onChange={e => setAccountName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-500"
                                  />
                               </div>
                               <div>
                                  <label className="block text-sm font-medium text-gray-500 mb-1">Number/Address</label>
                                  <input 
                                    type="text" 
                                    value={accountNumber}
                                    onChange={e => setAccountNumber(e.target.value)}
                                    placeholder="055..."
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-500"
                                  />
                               </div>
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <p className="text-sm text-gray-500">Make payment to one of our accounts below to purchase.</p>
                          
                          {companyPaymentMethods.length > 0 ? (
                              <div className="space-y-3">
                                  {companyPaymentMethods.map((method) => (
                                      <div key={method.id} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/50">
                                          <div className="flex items-center gap-2 mb-2">
                                              <BuildingLibraryIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                              <p className="font-bold text-yellow-800 dark:text-yellow-400">{method.name}</p>
                                          </div>
                                          
                                          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                              {Object.entries(method.details).map(([key, value]) => (
                                                  <div key={key} className="flex justify-between">
                                                      <span className="font-medium text-gray-500 dark:text-gray-400">{key}:</span>
                                                      <span className="font-semibold select-all">{value}</span>
                                                  </div>
                                              ))}
                                          </div>
                                          
                                          {method.instructions && (
                                              <div className="mt-3 text-xs bg-white dark:bg-black/20 p-2 rounded-lg text-gray-500 italic">
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
                          
                          <div className="text-center mt-4">
                              <p className="text-xs text-gray-400 mb-2">Need help? Chat with us.</p>
                              <button onClick={() => window.open('https://wa.me/233548434599')} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors">
                                  WhatsApp Support
                              </button>
                          </div>
                      </div>
                  )}
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

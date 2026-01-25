'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRates, type Category, type GiftCard } from '@/lib/ratesService';
import { createTrade, fetchCompanyPaymentMethods, type PaymentMethod } from '@/lib/tradeService';
import { fetchSocials } from '@/lib/socialService';
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
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/233548434599'); // Default fallback
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
  
  // Momo Fields
  const [momoName, setMomoName] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [momoNetwork, setMomoNetwork] = useState('MTN');

  // Bank Fields
  const [bankName, setBankName] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');

  // Crypto Fields
  const [walletAddress, setWalletAddress] = useState('');
  const [cryptoNetwork, setCryptoNetwork] = useState('TRC20');

  // -- Sender Details (When Buying) --
  const [senderName, setSenderName] = useState('');
  const [senderReference, setSenderReference] = useState(''); // Serves as User Notes
  const [selectedCompanyMethodId, setSelectedCompanyMethodId] = useState<number | null>(null);

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

        // Fetch Socials separately to not block main content if it fails
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

          // Construct Payload Base
          const payload: any = {
              amount: parseFloat(amount),
              rate_id: rateId,
              trade_type: tradeType,
              asset_name: activeCard.assetName,
              asset_type: 'gift_card', // hardcoded
              user_notes: senderReference // Mapping the UI "Notes" field to API "user_notes"
          };

          if (tradeType === 'sell') {
               // SELL MODE: Requires user_payment_details Object
               let userDetailsObj: any = {};
               if (paymentProvider === 'Momo') {
                    userDetailsObj = {
                        account_name: momoName,
                        account_number: momoNumber,
                        network: momoNetwork
                    };
               } else if (paymentProvider === 'Bank') {
                    userDetailsObj = {
                        bank_name: bankName,
                        account_name: bankAccountName,
                        account_number: bankAccountNumber
                    };
               } else if (paymentProvider === 'Crypto') {
                    userDetailsObj = {
                        wallet_address: walletAddress,
                        network: cryptoNetwork
                    };
               }
               // Add to payload
               payload.user_payment_details = userDetailsObj;
               
               // Keep legacy fields populated just in case, or for admin view redundancy
               payload.payment_method_name = paymentProvider;
               payload.payment_account_name = momoName || bankAccountName;
               payload.payment_account_number = momoNumber || bankAccountNumber || walletAddress;

          } else {
               // BUY MODE: Requires payment_method_id
               // Use selected ID, or default to first if user didn't click (but better to enforce selection or auto-select first)
               let methodId = selectedCompanyMethodId;
               if (!methodId && companyPaymentMethods.length > 0) {
                   methodId = companyPaymentMethods[0].id; // Auto-select first if none clicked
               }
               
               if (!methodId) throw new Error("Please select a payment method to proceed.");
               
               payload.payment_method_id = methodId;
               // No user_payment_details for Buy
          }

          await createTrade(token, payload);

          setSuccess("Trade initiated successfully! Check your trades history.");
          // Optional: Reset form here
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
                          
                          <div className="space-y-4">
                              <label className="block text-sm font-medium text-gray-500 mb-1">Payment Provider</label>
                              <select 
                                value={paymentProvider}
                                onChange={e => setPaymentProvider(e.target.value)}
                                className="w-full p-3 rounded-xl bg-red-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-500 mb-4"
                              >
                                  <option value="Momo">Mobile Money (Momo)</option>
                                  <option value="Bank">Bank Transfer</option>
                                  <option value="Crypto">USDT / Crypto</option>
                              </select>

                              {/* CONDITIONAL INPUTS */}
                              {paymentProvider === 'Momo' && (
                                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase">Network</label>
                                          <select value={momoNetwork} onChange={e => setMomoNetwork(e.target.value)} className="w-full p-2 rounded-lg border mt-1 dark:bg-gray-700 dark:border-gray-600">
                                              <option value="MTN">MTN</option>
                                              <option value="Vodafone">Telecel (Vodafone)</option>
                                              <option value="AirtelTigo">AirtelTigo</option>
                                          </select>
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase">Account Name</label>
                                          <input type="text" value={momoName} onChange={e => setMomoName(e.target.value)} className="w-full p-2 rounded-lg border mt-1 dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. John Doe" />
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase">Number</label>
                                          <input type="text" value={momoNumber} onChange={e => setMomoNumber(e.target.value)} className="w-full p-2 rounded-lg border mt-1 dark:bg-gray-700 dark:border-gray-600" placeholder="055..." />
                                      </div>
                                  </div>
                              )}

                              {paymentProvider === 'Bank' && (
                                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase">Bank Name</label>
                                          <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} className="w-full p-2 rounded-lg border mt-1 dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. Ecobank" />
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase">Account Name</label>
                                          <input type="text" value={bankAccountName} onChange={e => setBankAccountName(e.target.value)} className="w-full p-2 rounded-lg border mt-1 dark:bg-gray-700 dark:border-gray-600" />
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase">Account Number</label>
                                          <input type="text" value={bankAccountNumber} onChange={e => setBankAccountNumber(e.target.value)} className="w-full p-2 rounded-lg border mt-1 dark:bg-gray-700 dark:border-gray-600" />
                                      </div>
                                  </div>
                              )}

                               {paymentProvider === 'Crypto' && (
                                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase">Network</label>
                                          <select value={cryptoNetwork} onChange={e => setCryptoNetwork(e.target.value)} className="w-full p-2 rounded-lg border mt-1 dark:bg-gray-700 dark:border-gray-600">
                                              <option value="TRC20">TRC20</option>
                                              <option value="ERC20">ERC20</option>
                                              <option value="BEP20">BEP20</option>
                                          </select>
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase">Wallet Address</label>
                                          <input type="text" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} className="w-full p-2 rounded-lg border mt-1 dark:bg-gray-700 dark:border-gray-600 font-mono text-sm" placeholder="T..." />
                                      </div>
                                  </div>
                              )}
                          </div>
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

"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  CalculatorIcon,
  BoltIcon,
  ChatBubbleLeftEllipsisIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/ratesService";
import { parseAmountRule, validateAmount, getHelperText } from "@/lib/validation";

interface PriceUpdateSectionProps {
  initialCategories: Category[];
}

export default function PriceUpdateSection({ initialCategories = [] }: PriceUpdateSectionProps) {
  const router = useRouter();

  // -- Selection State -- //
  const [selectedCatName, setSelectedCatName] = useState<string>(initialCategories[0]?.name || "");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCardId, setSelectedCardId] = useState<number>(-1); // Index of selected card in strict filtered list
  const [selectedType, setSelectedType] = useState<"physical" | "ecode">("physical");
  const [amount, setAmount] = useState<string>("50");

  // -- Derived Data -- //
  const activeCategory = useMemo(() =>
    initialCategories.find(c => c.name === selectedCatName),
    [initialCategories, selectedCatName]);

  const activeRegions = useMemo(() => {
    if (!activeCategory) return [];
    return Array.from(new Set(activeCategory.cards.map(c => c.region || "Global")));
  }, [activeCategory]);

  // Cards available for the selected category + region
  const availableCards = useMemo(() => {
    if (!activeCategory || !selectedRegion) return [];
    return activeCategory.cards.filter(c => (c.region || "Global") === selectedRegion);
  }, [activeCategory, selectedRegion]);

  // The currently selected specific card object
  const activeCard = useMemo(() => {
    if (selectedCardId >= 0 && availableCards[selectedCardId]) {
      return availableCards[selectedCardId];
    }
    return availableCards[0] || null;
  }, [availableCards, selectedCardId]);

  // -- Auto-Reset Logic -- //

  // 1. When Category Changes -> Reset Region, Card, Type
  useEffect(() => {
    if (activeRegions.length > 0) {
      setSelectedRegion(activeRegions[0]);
    } else {
      setSelectedRegion("");
    }
  }, [activeCategory, activeRegions]);

  // 2. When Region Changes -> Reset Card (Prefer "50")
  useEffect(() => {
    const preferredIndex = availableCards.findIndex(c => c.amount.includes('50') || c.amount === '50 fixed');
    setSelectedCardId(preferredIndex >= 0 ? preferredIndex : 0);
  }, [selectedRegion, availableCards]);

  // -- Calculation & Validation -- //
  const { currentRate, calculatedValue, isValid, validationMessage, validationHelper } = useMemo(() => {
    if (!activeCard) {
      return {
        currentRate: 0,
        calculatedValue: 0,
        isValid: false,
        validationMessage: "Select a card",
        validationHelper: ""
      };
    }

    // 1. Parse Rule
    const rule = parseAmountRule(activeCard.amount);

    // 2. Helper Text
    const helper = getHelperText(rule);

    // 3. Validation
    const amt = parseFloat(amount);
    const validation = validateAmount(amt, rule);

    const rate = selectedType === "physical"
      ? (activeCard.rates.ghsPhysical || 0)
      : (activeCard.rates.ghsEcode || 0);

    return {
      currentRate: rate,
      calculatedValue: validation.isValid ? (amt * rate) : 0,
      isValid: validation.isValid,
      validationMessage: validation.message || "",
      validationHelper: helper
    };
  }, [activeCard, selectedType, amount]);

  // -- WhatsApp Action -- //
  const handleTrade = () => {
    if (!isValid) return;

    const message = `Hi check this for me: ${selectedCatName} ${selectedRegion} ${amount} (${selectedType})`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/233548434599?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  // -- Marquee Data -- //
  const allRates = useMemo(() => {
    const list: { name: string; rate: number }[] = [];
    initialCategories.forEach(cat => {
      cat.cards.forEach(card => {
        const rate = card.rates?.ghsPhysical || card.rates?.ghsEcode || 0;
        if (rate > 0) {
          list.push({
            name: `${cat.name} ${card.region} `,
            rate: rate
          });
        }
      });
    });
    return list.sort(() => 0.5 - Math.random()).slice(0, 20);
  }, [initialCategories]);

  return (
    <section className="py-20 px-4 bg-white dark:bg-[#0a0a0a] relative overflow-hidden text-gray-900 dark:text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center px-4 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-full text-red-600 dark:text-red-400 text-sm font-semibold mb-6">
            <BoltIcon className="w-4 h-4 mr-2" />
            Live Market Updates
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Top Rates. <span className="text-red-600 dark:text-red-500">Instantly.</span>
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">Real-time exchange rates updated every 5 minutes.</p>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: Quick Calculator Widget */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-xl shadow-red-900/5 relative z-20">

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <CalculatorIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Rate Check</h3>
            </div>

            <div className="space-y-5">

              {/* Categories & Regions Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</label>
                  <div className="relative">
                    <select
                      value={selectedCatName}
                      onChange={(e) => setSelectedCatName(e.target.value)}
                      className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all cursor-pointer truncate pr-8"
                    >
                      {initialCategories.length === 0 && <option>Loading...</option>}
                      {initialCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Region</label>
                  <div className="relative">
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all cursor-pointer truncate pr-8"
                      disabled={!activeCategory}
                    >
                      {activeRegions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Option & Type Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Card Amount</label>
                  <div className="relative">
                    <select
                      value={selectedCardId}
                      onChange={(e) => setSelectedCardId(Number(e.target.value))}
                      className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all cursor-pointer truncate pr-8"
                      disabled={!selectedRegion}
                    >
                      {availableCards.map((card, idx) => (
                        <option key={idx} value={idx}>
                          {card.amount || "Any Amount"}
                        </option>
                      ))}
                      {availableCards.length === 0 && <option value={-1}>No cards</option>}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</label>
                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as "physical" | "ecode")}
                      className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all cursor-pointer truncate pr-8"
                    >
                      <option value="physical">Physical Card</option>
                      <option value="ecode">E-Code</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trade Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border ${!isValid ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg pl-8 pr-4 py-3 text-gray-900 dark:text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400`}
                    placeholder="100"
                  />
                </div>
                {/* Validation Feedback */}
                <div className="text-xs min-h-[1.25em] flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">{validationHelper}</span>
                  {!isValid && <span className="text-red-500 font-bold">{validationMessage}</span>}
                </div>
              </div>

              {/* Result Card */}
              <div className="bg-red-600 text-white rounded-xl p-6 shadow-lg shadow-red-200 dark:shadow-none flex justify-between items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-red-100 text-xs font-medium uppercase tracking-wider mb-1">Estimated Payout</p>
                  <p className="text-white/80 text-xs">
                    Rate: {currentRate > 0 ? `₵${currentRate.toFixed(2)} /$` : "N/A"}
                  </p >
                </div>
                <div className="relative z-10 text-right">
                  {isValid && calculatedValue > 0 ? (
                    <span className="text-3xl font-bold tracking-tight block">
                      ₵{calculatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  ) : (
                    <span className="text-lg font-bold opacity-90 block">
                      {!isValid ? "Inv. Amount" : (currentRate === 0 ? "No Rate" : "---")}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <button
                   onClick={() => router.push('/dashboard/trade')}
                   disabled={!isValid || calculatedValue <= 0}
                   className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                 >
                   <BoltIcon className="w-6 h-6" />
                   Trade Now
                 </button>
                 <button
                  onClick={handleTrade}
                  disabled={!isValid || calculatedValue <= 0}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                >
                  <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                  WhatsApp
                </button>
              </div>

                <button onClick={() => router.push("/rates")} className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                  View Full Rates Table <ArrowPathIcon className="w-4 h-4" />
                </button>
            </div>
          </motion.div>

          {/* RIGHT: Live Ticker & Graphics */}
          <div className="space-y-8 relative">
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
              <h3 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                Don&apos;t settle for less.<br />
                Trade at the <span className="text-red-600">peak</span> of the market.
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                We monitor the market 24/7 to ensure you get the absolute best rates for your assets.
              </p>
            </motion.div>

            {/* MARQUEE */}
            <div className="relative w-full overflow-hidden h-80 mask-linear-fade bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-gray-50 dark:from-[#0a0a0a] via-transparent to-gray-50 dark:to-[#0a0a0a] opacity-50" />

              {/* Vertical Scrolling Columns */}
              <div className="grid grid-cols-2 gap-4 h-full overflow-hidden relative p-4">
                {/* Column 1 - Scroll Up */}
                <div className="space-y-3 animate-scroll-up">
                  {[...allRates, ...allRates].map((item, i) => (
                    <div key={`col1-${i}`} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-lg flex justify-between items-center shadow-sm">
                      <span className="text-gray-900 dark:text-white font-medium text-sm truncate max-w-[100px]">{item.name}</span>
                      <span className="text-red-600 dark:text-red-400 font-mono font-bold text-sm">₵{item.rate}</span>
                    </div>
                  ))}
                </div>

                {/* Column 2 - Scroll Down */}
                <div className="space-y-3 animate-scroll-down">
                  {[...allRates, ...allRates].reverse().map((item, i) => (
                    <div key={`col2-${i}`} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-lg flex justify-between items-center shadow-sm">
                      <span className="text-gray-900 dark:text-white font-medium text-sm truncate max-w-[100px]">{item.name}</span>
                      <span className="text-green-600 dark:text-green-500 font-mono font-bold text-sm">₵{item.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
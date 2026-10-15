'use client';

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  CalculatorIcon,
  BoltIcon,
  ChatBubbleLeftEllipsisIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  GiftIcon,
  ArrowRightIcon,
  FireIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { Select, type SelectOption } from '@/components/ui/Select';
import { useRouter } from "next/navigation";
import { Category } from "@/lib/ratesService";
import { parseAmountRule, validateAmount, getHelperText } from "@/lib/validation";
import { useSettings } from "@/contexts/SettingsContext";

interface PriceUpdateSectionProps {
  initialCategories: Category[];
}

export default function PriceUpdateSection({ initialCategories = [] }: PriceUpdateSectionProps) {
  const router = useRouter();
  const { settings } = useSettings();

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
    return activeCategory.cards.filter(c => (c.region || "Global") === selectedRegion)
      .sort((a, b) => { // Sort by amount (lowest to highest)
          const getAmountValue = (amt: string) => {
              const match = amt.match(/(\d+)/);
              return match ? parseInt(match[0], 10) : 0;
          };
          return getAmountValue(a.amount) - getAmountValue(b.amount);
      });
  }, [activeCategory, selectedRegion]);

  // The currently selected specific card object
  const activeCard = useMemo(() => {
    if (selectedCardId >= 0 && availableCards[selectedCardId]) {
      return availableCards[selectedCardId];
    }
    return availableCards[0] || null;
  }, [availableCards, selectedCardId]);

  // -- Auto-Reset Logic -- //
  // Adjusted during render (not effects) by detecting the change directly, per
  // React's guidance on resetting state in response to a prop/derived-value change.

  // 1. When Category Changes -> Reset Region, Card, Type
  // `null` initial value guarantees this runs once on mount too (mirroring the
  // useEffect it replaces, which always fires after the first render).
  const [prevCategorySelection, setPrevCategorySelection] = useState<{ category: typeof activeCategory; regions: typeof activeRegions } | null>(null);
  if (!prevCategorySelection || prevCategorySelection.category !== activeCategory || prevCategorySelection.regions !== activeRegions) {
    setPrevCategorySelection({ category: activeCategory, regions: activeRegions });
    setSelectedRegion(activeRegions.length > 0 ? activeRegions[0] : "");
  }

  // 2. When Region Changes -> Reset Card (Prefer "50")
  const [prevRegionSelection, setPrevRegionSelection] = useState<{ region: string; cards: typeof availableCards } | null>(null);
  if (!prevRegionSelection || prevRegionSelection.region !== selectedRegion || prevRegionSelection.cards !== availableCards) {
    setPrevRegionSelection({ region: selectedRegion, cards: availableCards });
    const preferredIndex = availableCards.findIndex(c => c.amount.includes('50') || c.amount === '50 fixed');
    setSelectedCardId(preferredIndex >= 0 ? preferredIndex : 0);
  }

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

  const categoryOptions: SelectOption[] = useMemo(() => {
    return initialCategories.map(c => ({
      id: c.name,
      name: c.name,
      icon: c.logoUrl ? <img src={c.logoUrl} alt={c.name} className="w-5 h-5 object-contain rounded-sm" /> : getCategoryStyle(c.name).icon
    }));
  }, [initialCategories]);

  const regionOptions: SelectOption[] = useMemo(() => {
    return activeRegions.map(r => ({ id: r, name: r }));
  }, [activeRegions]);

  const cardOptions: SelectOption[] = useMemo(() => {
    return availableCards.map((c, i) => ({ id: String(i), name: c.amount }));
  }, [availableCards]);

  const typeOptions: SelectOption[] = [
    { id: 'physical', name: 'Physical Card' },
    { id: 'ecode', name: 'E-Code' }
  ];

  // -- WhatsApp Action -- //
  const handleTrade = () => {
    if (!isValid) return;

    const message = `Hi check this for me: ${selectedCatName} ${selectedRegion} ${amount} (${selectedType})`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = settings?.whatsapp_number || '233548434599';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

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
    // Return first 30 rates stably to prevent hydration mismatch
    return list.slice(0, 30);
  }, [initialCategories]);

  return (
    <section className="py-20 px-4 bg-white dark:bg-[#0a0a0a] relative overflow-hidden text-gray-900 dark:text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center px-4 py-1.5 bg-gold-50 dark:bg-gold-900/20 border border-gold-100 dark:border-gold-900/30 rounded-full text-gold-700 dark:text-gold-400 text-sm font-semibold mb-6">
            <BoltIcon className="w-4 h-4 mr-2" />
            Live Market Updates
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Top Rates. <span className="text-gold-700 dark:text-gold-400">Instantly.</span>
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">Real-time exchange rates updated every 5 minutes.</p>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: Quick Calculator Widget */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-xl shadow-gold-900/5 relative z-20">

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gold-50 dark:bg-gold-900/20 rounded-xl">
                <CalculatorIcon className="w-6 h-6 text-gold-700 dark:text-gold-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Rate Check</h3>
            </div>

            <div className="space-y-5">

              {/* Categories & Regions Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Select
                    label="Category"
                    options={categoryOptions}
                    value={selectedCatName ? categoryOptions.find(opt => opt.id === selectedCatName) || null : null}
                    onChange={(opt) => setSelectedCatName(opt.id as string)}
                    searchable
                    placeholder="e.g. Steam, Apple..."
                  />
                </div>

                <Select
                  label="Region"
                  options={regionOptions}
                  value={selectedRegion ? { id: selectedRegion, name: selectedRegion } : null}
                  onChange={(opt) => setSelectedRegion(opt.id as string)}
                  placeholder="Select Region"
                />
              </div>

              {/* Card Option & Type Row */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Card Amount"
                  options={cardOptions}
                  value={selectedCardId >= 0 && cardOptions[selectedCardId] ? cardOptions[selectedCardId] : null}
                  onChange={(opt) => setSelectedCardId(Number(opt.id))}
                  placeholder="Select Amount"
                  disabled={!selectedRegion}
                />

                <Select
                  label="Type"
                  options={typeOptions}
                  value={selectedType === "physical" ? typeOptions[0] : typeOptions[1]}
                  onChange={(opt) => setSelectedType(opt.id as "physical" | "ecode")}
                />
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
              <div className="bg-gold-500 text-ink rounded-xl p-6 shadow-lg shadow-gold-200 dark:shadow-none flex justify-between items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600 pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-ink/70 text-xs font-medium uppercase tracking-wider mb-1">Estimated Payout</p>
                  <p className="text-ink/80 text-xs">
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

              <div className={`grid gap-3 ${settings?.offer_trade_via_whatsapp ? 'grid-cols-2' : 'grid-cols-1'}`}>
                 <button
                   onClick={() => router.push(`/dashboard/trade?asset=${encodeURIComponent(selectedCatName)}&region=${encodeURIComponent(selectedRegion)}&card=${encodeURIComponent(activeCard?.amount || '')}&amount=${encodeURIComponent(amount)}&type=${encodeURIComponent(selectedType)}`)}
                   disabled={!isValid || calculatedValue <= 0}
                   className="w-full py-4 bg-gold-500 hover:bg-gold-600 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-ink font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-900/20"
                 >
                   <BoltIcon className="w-6 h-6" />
                   Trade Now
                 </button>

                 {settings?.offer_trade_via_whatsapp && (
                 <button
                  onClick={handleTrade}
                  disabled={!isValid || calculatedValue <= 0}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                >
                  <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                  WhatsApp
                </button>
                )}
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
                Trade at the <span className="text-gold-700 dark:text-gold-400">peak</span> of the market.
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
                      <span className="text-gold-700 dark:text-gold-400 font-mono font-bold text-sm">₵{item.rate}</span>
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
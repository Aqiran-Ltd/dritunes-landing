'use client';

import { useState, useMemo } from "react";
import {
  BoltIcon,
  ChatBubbleLeftEllipsisIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  GiftIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
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

  return (
    <section id="calculator" className="py-24 lg:py-32 bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
        <div>
          <SectionHeading
            title="Work out your payout"
            intro="Pick your card and enter its value. The figure you see is the amount we pay, with nothing taken off later."
          />
          <Link
            href="/rates"
            className="mt-8 inline-block font-semibold text-ink dark:text-white underline decoration-gray-300 dark:decoration-gray-600 underline-offset-8 hover:decoration-ink dark:hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold rounded"
          >
            Browse the full rates table
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-[28px] shadow-[0_30px_80px_-40px_rgba(26,26,29,0.35)]">
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
                <label htmlFor="quick-amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">Card value in US dollars</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input
                    id="quick-amount"
                    type="number"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border ${!isValid ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg pl-8 pr-4 py-3 text-gray-900 dark:text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all placeholder-gray-400`}
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
              <div aria-live="polite" className="bg-ink text-white rounded-2xl p-6 flex justify-between items-end gap-4">
                <div>
                  <p className="text-sm text-gray-300">You would receive</p>
                  <p className="mt-1 text-sm text-gray-400 tabular-nums">
                    {currentRate > 0 ? `₵${currentRate.toFixed(2)} for every $1` : "No rate for this card yet"}
                  </p>
                </div>
                <div className="text-right">
                  {isValid && calculatedValue > 0 ? (
                    <span className="text-4xl font-bold tracking-[-0.04em] tabular-nums text-gold block">
                      ₵{calculatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  ) : (
                    <span className="text-lg font-semibold text-gray-400 block">
                      {!isValid ? "Check the amount" : "—"}
                    </span>
                  )}
                </div>
              </div>

              <div className={`grid gap-3 ${settings?.offer_trade_via_whatsapp ? 'grid-cols-2' : 'grid-cols-1'}`}>
                 <button
                   onClick={() => router.push(`/dashboard/trade?asset=${encodeURIComponent(selectedCatName)}&region=${encodeURIComponent(selectedRegion)}&card=${encodeURIComponent(activeCard?.amount || '')}&amount=${encodeURIComponent(amount)}&type=${encodeURIComponent(selectedType)}`)}
                   disabled={!isValid || calculatedValue <= 0}
                   className="w-full h-14 bg-gold hover:bg-gold-400 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-ink font-semibold rounded-full transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-gold"
                 >
                   Trade this card
                 </button>

                 {settings?.offer_trade_via_whatsapp && (
                 <button
                  onClick={handleTrade}
                  disabled={!isValid || calculatedValue <= 0}
                  className="w-full h-14 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                  Trade on WhatsApp
                </button>
                )}
              </div>

            </div>
        </div>
      </div>
    </section>
  );
}

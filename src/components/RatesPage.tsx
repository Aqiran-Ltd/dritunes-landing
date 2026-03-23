"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from 'fuse.js';
import { audit } from "@/lib/audit";
import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftEllipsisIcon,
  PaperAirplaneIcon,
  GiftIcon,
  BoltIcon
} from "@heroicons/react/24/solid";
import { Select, type SelectOption } from "@/components/ui/Select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { fetchRates, fetchGiftCardGroups, type GiftCard, type Category, type Rate, type GiftCardBrand } from "@/lib/ratesService";
import { useSettings } from "@/contexts/SettingsContext";

// Types
type Currency = "RMB" | "GHS" | "NGN";
type DeliveryType = "Physical" | "E-Code" | "All";
type SortOption = "rate-high" | "rate-low" | "region-asc" | "region-desc" | "amount-asc" | "amount-desc";

const regionMapping: Record<string, { name: string; flag: string }> = {
  "US": { name: "United States", flag: "🇺🇸" },
  "GB": { name: "United Kingdom", flag: "🇬🇧" },
  "UK": { name: "United Kingdom", flag: "🇬🇧" },
  "DE": { name: "Germany", flag: "🇩🇪" },
  "CA": { name: "Canada", flag: "🇨🇦" },
  "AU": { name: "Australia", flag: "🇦🇺" },
  "CH": { name: "Switzerland", flag: "🇨🇭" },
  "FR": { name: "France", flag: "🇫🇷" },
  "ES": { name: "Spain", flag: "🇪🇸" },
  "IT": { name: "Italy", flag: "🇮🇹" },
  "NL": { name: "Netherlands", flag: "🇳🇱" },
  "PT": { name: "Portugal", flag: "🇵🇹" },
  "IE": { name: "Ireland", flag: "🇮🇪" },
  "GR": { name: "Greece", flag: "🇬🇷" },
  "AT": { name: "Austria", flag: "🇦🇹" },
  "BE": { name: "Belgium", flag: "🇧🇪" },
  "FI": { name: "Finland", flag: "🇫🇮" },
  "LU": { name: "Luxembourg", flag: "🇱🇺" },
  "MX": { name: "Mexico", flag: "🇲🇽" },
  "BR": { name: "Brazil", flag: "🇧🇷" },
  "JP": { name: "Japan", flag: "🇯🇵" },
  "TR": { name: "Turkey", flag: "🇹🇷" },
  "HK": { name: "Hong Kong", flag: "🇭🇰" },
  "SG": { name: "Singapore", flag: "🇸🇬" },
  "CN": { name: "China", flag: "🇨🇳" },
  "GH": { name: "Ghana", flag: "🇬🇭" },
  "NG": { name: "Nigeria", flag: "🇳🇬" },
  "ZA": { name: "South Africa", flag: "🇿🇦" },
  "EU": { name: "Europe", flag: "🇪🇺" },
  "Global": { name: "Worldwide", flag: "🌐" }
};

// Extended interface for search
interface SearchableCard extends GiftCard {
  categoryName: string;
}

export default function RatesPage() {
  // State
  const { user } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<GiftCardBrand[]>([]);
  const [activeCategoryName, setActiveCategoryName] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("GHS");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("rate-high");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const sortOptions: SelectOption[] = [
    { id: "rate-high", name: "Rate: High to Low" },
    { id: "rate-low", name: "Rate: Low to High" },
    { id: "region-asc", name: "Region: A-Z" },
    { id: "region-desc", name: "Region: Z-A" },
    { id: "amount-asc", name: "Amount: Low to High" },
    { id: "amount-desc", name: "Amount: High to Low" },
  ];

  const activeSortOption = useMemo(() => 
    sortOptions.find(o => o.id === sortBy) || sortOptions[0],
    [sortBy]
  );

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [ratesData, brandsData] = await Promise.all([
          fetchRates(),
          fetchGiftCardGroups()
        ]);
        setCategories(ratesData.categories);
        setBrands(brandsData);
        if (ratesData.categories.length > 0 && !activeCategoryName) {
          setActiveCategoryName(ratesData.categories[0].name);
        }
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error fetching rates data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load rates data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Audit: Log Search (Debounced)
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) return;
    const timeoutId = setTimeout(() => {
      audit.log('rates_search', { query: searchQuery });
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ratesData, brandsData] = await Promise.all([
        fetchRates(),
        fetchGiftCardGroups()
      ]);
      setCategories(ratesData.categories);
      setBrands(brandsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh rates data');
    } finally {
      setIsLoading(false);
    }
  };

  // Helpers
  const getCurrencySymbol = (currency: Currency) => {
    switch (currency) {
      case "RMB": return "¥";
      case "GHS": return "¢";
      case "NGN": return "₦";
    }
  };

  const getRate = (rate: Rate, currency: Currency, delivery: DeliveryType): number => {
    if (!rate) return 0;
    if (currency === "RMB") return rate.sourcePhysical;
    if (delivery === "All") {
      const physical = currency === "GHS" ? rate.ghsPhysical : rate.ngnPhysical;
      const ecode = currency === "GHS" ? rate.ghsEcode : rate.ngnEcode;
      return Math.max(physical, ecode);
    }
    if (currency === "GHS") return delivery === "Physical" ? rate.ghsPhysical : rate.ghsEcode;
    if (currency === "NGN") return delivery === "Physical" ? rate.ngnPhysical : rate.ngnEcode;
    return 0;
  };

  const getAmountValue = (amount: string): number => {
    const match = amount.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

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

  const handleTrade = (card: GiftCard, categoryName: string, activeRegion: string, overrideType?: DeliveryType) => {
    const finalType = overrideType || deliveryType;
    const rate = getRate(card.rates, selectedCurrency, finalType);
    if (rate <= 0) return;
    const typeStr = selectedCurrency === 'RMB' ? 'Physical' : finalType;
    const message = `Hi, I want to trade:\n\n*${categoryName} ${activeRegion}*\nAmount: *${card.amount}*\nType: *${typeStr}*\nRate: *${getCurrencySymbol(selectedCurrency)}${rate}*\n\nPlease advise on next steps.`;
    audit.log('trade_intent_whatsapp', {
      asset: card.productName || categoryName,
      region: activeRegion,
      amount: card.amount,
      rate: rate,
      currency: selectedCurrency,
      type: typeStr
    });
    const phoneNumber = settings?.whatsapp_number || '233548434599';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleGeneralSupport = () => {
    window.open(`https://wa.me/233548434599?text=${encodeURIComponent("Hi, I have a question about gift card trading.")}`, '_blank');
  };

  const activeCategory = useMemo(() =>
    categories.find(c => c.name === activeCategoryName),
    [categories, activeCategoryName]
  );

  const getAllRegions = useMemo(() => {
    if (!activeCategory) return [];
    return Array.from(new Set(activeCategory.cards.map(c => c.region)));
  }, [activeCategory]);

  const allCards = useMemo(() => {
    return categories.flatMap(cat =>
      cat.cards.map(card => ({ ...card, categoryName: cat.name } as SearchableCard))
    );
  }, [categories]);

  const fuse = useMemo(() => {
    return new Fuse(allCards, {
      keys: [
        { name: 'productName', weight: 0.7 },
        { name: 'categoryName', weight: 0.6 },
        { name: 'region', weight: 0.5 },
        { name: 'amount', weight: 0.3 }
      ],
      threshold: 0.4,
      distance: 100,
    });
  }, [allCards]);

  const filteredCards = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const results = fuse.search(searchQuery);
      const grouped: Record<string, SearchableCard[]> = {};
      results.forEach(res => {
        const card = res.item;
        const groupKey = `${card.categoryName}:::${card.region}`;
        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(card);
      });
      return grouped as Record<string, GiftCard[]>;
    }
    if (!activeCategory) return {};
    let filtered = activeCategory.cards;
    if (selectedRegions.size > 0) {
      filtered = filtered.filter(card => selectedRegions.has(card.region));
    }
    if (!showUnavailable) {
      filtered = filtered.filter(card => getRate(card.rates, selectedCurrency, deliveryType) > 0);
    }
    filtered = [...filtered].sort((a, b) => {
      const rateA = getRate(a.rates, selectedCurrency, deliveryType);
      const rateB = getRate(b.rates, selectedCurrency, deliveryType);
      switch (sortBy) {
        case "rate-high": return rateB - rateA;
        case "rate-low": return rateA - rateB;
        case "region-asc": return a.region.localeCompare(b.region);
        case "region-desc": return b.region.localeCompare(a.region);
        case "amount-asc": return getAmountValue(a.amount) - getAmountValue(b.amount);
        case "amount-desc": return getAmountValue(b.amount) - getAmountValue(a.amount);
        default: return 0;
      }
    });
    return filtered.reduce((acc, card) => {
      if (!acc[card.region]) acc[card.region] = [];
      acc[card.region].push(card);
      return acc;
    }, {} as Record<string, GiftCard[]>);
  }, [activeCategory, searchQuery, fuse, selectedRegions, showUnavailable, selectedCurrency, deliveryType, sortBy]);

  const toggleRegion = (regionKey: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionKey)) newExpanded.delete(regionKey);
    else newExpanded.add(regionKey);
    setExpandedRegions(newExpanded);
  };

  const expandAllRegions = () => {
    const keys = Object.keys(filteredCards);
    setExpandedRegions(new Set(keys));
  };

  const collapseAllRegions = () => setExpandedRegions(new Set());

  const toggleRegionFilter = (region: string) => {
    const newSelected = new Set(selectedRegions);
    if (newSelected.has(region)) newSelected.delete(region);
    else newSelected.add(region);
    setSelectedRegions(newSelected);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategorySearch("");
    setSelectedRegions(new Set());
    setShowUnavailable(false);
    setSortBy("rate-high");
  };

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-yellow-50 to-red-100 dark:from-[#0a0a0a] dark:via-[#171717] dark:to-[#23272f]">
      <Navigation />
      <div className="flex-1 flex flex-col items-center py-12 px-4 pt-32 relative overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 1 }} className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100 dark:from-yellow-900 dark:via-red-900 dark:to-pink-900 pointer-events-none z-0" />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 relative z-10 w-full max-w-6xl">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-full text-yellow-700 dark:text-yellow-300 text-lg font-bold mb-6 shadow-lg">
            <CurrencyDollarIcon className="w-6 h-6 mr-2 text-yellow-500" />
            Live Gift Card Rates
          </div>
          <AnimatePresence>
            {!user && (
              <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }} className="mb-8 p-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-2xl shadow-2xl max-w-3xl mx-auto overflow-hidden text-white relative z-20">
                 <div className="bg-black/10 backdrop-blur-sm p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-full animate-pulse shadow-inner"><BoltIcon className="w-8 h-8 text-yellow-300" /></div>
                      <div className="text-left">
                        <h3 className="font-bold text-xl leading-tight">Trading just got faster!</h3>
                        <p className="text-red-100 text-sm mt-1">Login to access the <span className="font-bold text-white underline decoration-yellow-400">Live Trade Dashboard</span> with instant payouts.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                       <a href="/auth/register" className="whitespace-nowrap px-6 py-3 bg-white text-red-600 font-black rounded-xl shadow-lg hover:bg-gray-50 hover:scale-105 transition-all text-sm uppercase tracking-wide">Get Started</a>
                       <a href="/auth/login" className="whitespace-nowrap px-6 py-3 bg-red-800/50 hover:bg-red-800/70 text-white font-bold rounded-xl border border-white/20 transition-all text-sm uppercase tracking-wide backdrop-blur-md">Login</a>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
          <h1 className="text-4xl md:text-6xl font-black text-gradient mb-4 animate-gradient-x">Comprehensive Rates</h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-6">Real-time rates for all major gift cards.</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            {isLoading && (<div className="flex items-center gap-2 text-yellow-600"><ArrowPathIcon className="w-5 h-5 animate-spin" /> Loading...</div>)}
            {error && (<div className="flex items-center gap-2 text-red-600"><ExclamationTriangleIcon className="w-5 h-5" /> {error} <button onClick={handleRefresh} className="underline">Retry</button></div>)}
            {!isLoading && !error && lastUpdated && (<div className="flex items-center gap-2 text-green-600"><CheckCircleIcon className="w-5 h-5" /> Updated {lastUpdated.toLocaleTimeString()} <button onClick={handleRefresh}><ArrowPathIcon className="w-4 h-4 hover:rotate-180 transition-transform" /></button></div>)}
          </div>
        </motion.div>
        {/* MASTER FILTER BAR */}
        <div className="w-full max-w-6xl mx-auto mb-10 sticky top-24 z-30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2.5rem] p-3 shadow-2xl border border-white/20 dark:border-white/5 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center"
          >
            {/* Search Part */}
            <div className="relative flex-1 group">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                placeholder="Search assets, regions, or denominations..." 
                className="w-full pl-14 pr-12 py-4 rounded-[2rem] bg-gray-50/50 dark:bg-black/20 border-none focus:ring-2 focus:ring-red-500/50 outline-none transition-all font-medium text-gray-900 dark:text-white" 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Controls Group */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-50/50 dark:bg-black/20 rounded-[2rem]">
              {/* Delivery Type Dropdown */}
              <div className="min-w-[140px] border-r border-gray-200 dark:border-gray-800 pr-1">
                <Select 
                  options={[
                    { id: "All", name: "All Types" },
                    { id: "Physical", name: "Physical" },
                    { id: "E-Code", name: "E-Code" }
                  ]} 
                  value={{ id: deliveryType, name: deliveryType === "All" ? "All Types" : deliveryType }} 
                  onChange={(opt) => setDeliveryType(opt.id as DeliveryType)} 
                  className="!space-y-0 [&>button]:!py-2 [&>button]:!rounded-full [&>button]:!bg-transparent [&>button]:!border-none !text-xs !font-black !uppercase !tracking-widest" 
                />
              </div>

              {/* Sort Dropdown */}
              <div className="min-w-[180px]">
                <Select 
                  options={sortOptions} 
                  value={activeSortOption} 
                  onChange={(opt) => setSortBy(opt.id as SortOption)} 
                  className="!space-y-0 [&>button]:!py-2 [&>button]:!rounded-full [&>button]:!bg-transparent [&>button]:!border-none" 
                />
              </div>

              {/* Region Trigger */}
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${showFilters || selectedRegions.size > 0 ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
              >
                <GlobeAltIcon className="w-5 h-5" />
                <span>Regions</span>
                {selectedRegions.size > 0 && <span className="bg-white text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-black">{selectedRegions.size}</span>}
              </button>
            </div>
          </motion.div>

          {/* REGION SELECTOR POPOVER */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0, y: -10 }} 
                animate={{ height: "auto", opacity: 1, y: 10 }} 
                exit={{ height: 0, opacity: 0, y: -10 }} 
                className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 z-20 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Filter by Region</h3>
                  {selectedRegions.size > 0 && (
                    <button onClick={() => setSelectedRegions(new Set())} className="text-[10px] font-bold text-red-600 uppercase tracking-wider hover:underline">Clear All</button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {getAllRegions.map(r => (
                    <button 
                      key={r} 
                      onClick={() => toggleRegionFilter(r)} 
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all border-2 ${selectedRegions.has(r) ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20" : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500/50"}`}
                    >
                      <span className="text-2xl">{regionMapping[r]?.flag || "🏳️"}</span>
                      <div className="flex flex-col items-start leading-tight">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${selectedRegions.has(r) ? "text-white/70" : "text-gray-400"}`}>{r}</span>
                        <span className="text-xs font-bold truncate max-w-[100px]">{regionMapping[r]?.name || r}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {!searchQuery && categories.length > 0 && (
          <div className="w-full max-w-6xl mx-auto mb-8 relative z-10">
            <div className="flex items-center justify-between mb-4 px-4 lg:px-0">
              <button onClick={() => setShowCategoryModal(true)} className="text-sm font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors uppercase tracking-wider">View All {categories.length} Assets</button>
            </div>
          <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar px-4 lg:px-0">
            {categories.slice(0, 10).map(cat => {
              const style = getCategoryStyle(cat.name);
              const isActive = activeCategoryName === cat.name;
              return (
                <motion.button 
                  key={cat.name} 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={() => { setActiveCategoryName(cat.name); setExpandedRegions(new Set()); setSelectedRegions(new Set()); }} 
                  className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer border-2 ${isActive ? `bg-gradient-to-r ${style.color} text-white border-transparent` : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-200 dark:hover:border-red-900"}`}
                >
                  {cat.logoUrl ? (
                    <img src={cat.logoUrl} alt={cat.name} className="w-6 h-6 object-contain rounded-md" />
                  ) : style.icon}
                  <span>{cat.name}</span>
                </motion.button>
              );
            })}
            <button onClick={() => setShowCategoryModal(true)} className="whitespace-nowrap px-6 py-2.5 rounded-xl font-bold bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:border-red-400 hover:text-red-500 transition-all shadow-sm">+ More Assets</button>
          </div>
          </div>
        )}
        <AnimatePresence>
          {showCategoryModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCategoryModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
                <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">All Trading Assets</h2>
                    <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><XMarkIcon className="w-8 h-8 text-gray-400" /></button>
                  </div>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input type="text" value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} placeholder="Find a brand (e.g. Steam, Apple, Nike...)" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-500 text-lg font-medium" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredCategories.map(cat => {
                      const style = getCategoryStyle(cat.name);
                      const isActive = activeCategoryName === cat.name;
                      return (
                        <button key={cat.name} onClick={() => { setActiveCategoryName(cat.name); setExpandedRegions(new Set()); setSelectedRegions(new Set()); setShowCategoryModal(false); }} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group ${isActive ? `bg-gray-50 dark:bg-gray-800 border-red-500 ring-4 ring-red-500/10` : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-red-400 hover:shadow-lg hover:y-[-2px]"}`}>
                          <div className={`p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform overflow-hidden flex items-center justify-center w-16 h-16`}>
                            {cat.logoUrl ? (
                              <img src={cat.logoUrl} alt={cat.name} className="w-full h-full object-contain" />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${style.color} text-white rounded-xl [&>svg]:w-8 [&>svg]:h-8`}>{style.icon}</div>
                            )}
                          </div>
                          <span className={`font-bold text-sm text-center ${isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>{cat.name}</span>
                        </button>
                      );
                    })}
                    {filteredCategories.length === 0 && (<div className="col-span-full py-12 text-center"><p className="text-gray-500 dark:text-gray-400 text-lg">No assets found matching &quot;{categorySearch}&quot;</p></div>)}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <div className="w-full max-w-6xl mx-auto relative z-10 pb-20">
          {!searchQuery && (
            <div className="mb-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${getCategoryStyle(activeCategoryName).color} opacity-10 blur-3xl rounded-full -mr-32 -mt-32`} />
              
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center p-4 shadow-xl border border-gray-100 dark:border-gray-700 relative z-10">
                {activeCategory?.logoUrl ? (
                  <img src={activeCategory.logoUrl} alt={activeCategoryName} className="w-full h-full object-contain" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getCategoryStyle(activeCategoryName).color} text-white rounded-xl [&>svg]:w-12 [&>svg]:h-12`}>
                    {getCategoryStyle(activeCategoryName).icon}
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left relative z-10">
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-gray-900 dark:text-white">{activeCategoryName}</h2>
                {activeCategory?.note ? (
                  <div className="bg-red-500/10 dark:bg-red-500/5 border-l-4 border-red-500 p-5 rounded-r-2xl backdrop-blur-sm">
                    <p className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed">{activeCategory.note}</p>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-xl font-medium">Real-time trading rates for premium {activeCategoryName} assets.</p>
                )}
              </div>

              <div className="flex flex-col gap-4 min-w-[240px] relative z-10">
                <div className="bg-gray-50/50 dark:bg-black/20 p-4 rounded-2xl border border-gray-100/50 dark:border-white/5">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">Regions</span>
                    <span className="font-black text-lg text-gray-900 dark:text-white">{getAllRegions.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">Variations</span>
                    <span className="font-black text-lg text-gray-900 dark:text-white">{activeCategory?.cards.length || 0}</span>
                  </div>
                </div>
                <button onClick={() => router.push('/dashboard/trade')} className={`w-full py-4 bg-gradient-to-r ${getCategoryStyle(activeCategoryName).color} text-white font-black rounded-2xl shadow-xl shadow-black/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg`}>
                  <BoltIcon className="w-6 h-6 animate-pulse" />
                  Trade Now
                </button>
              </div>
            </div>
          )}

          {searchQuery && Object.keys(filteredCards).length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3 text-2xl font-black text-gray-800 dark:text-white">
              <MagnifyingGlassIcon className="w-8 h-8 text-yellow-500" />
              <span>Search Results for <span className="text-yellow-600 dark:text-yellow-400">&quot;{searchQuery}&quot;</span></span>
            </motion.div>
          )}
          {Object.keys(filteredCards).length === 0 ? (
            <div className="text-center py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No cards found matching your filters.</p>
              <button onClick={resetFilters} className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full font-semibold transition-colors shadow-sm">Reset Filters</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end gap-2">
                <button onClick={expandAllRegions} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-md transition-all">Expand All</button>
                <button onClick={collapseAllRegions} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold shadow-md transition-all">Collapse All</button>
              </div>
              {Object.entries(filteredCards).map(([regionKey, cards]) => {
                const [catName, regName] = regionKey.includes(':::') ? regionKey.split(':::') : [activeCategoryName, regionKey];
                const style = getCategoryStyle(catName);
                const isExpanded = expandedRegions.has(regionKey);
                const sortedCards = [...cards].sort((a, b) => getAmountValue(a.amount) - getAmountValue(b.amount));
                return (
                  <motion.div key={regionKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 dark:border-gray-800 overflow-hidden">
                    <button onClick={() => toggleRegion(regionKey)} className={`w-full px-6 py-4 bg-gradient-to-r ${style.color} text-white font-bold text-lg flex items-center justify-between hover:opacity-90 transition-opacity cursor-pointer`}>
                      <div className="flex items-center gap-3">
                        {style.icon} 
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{regionMapping[regName]?.flag || "🏳️"}</span>
                          <div className="flex flex-col items-start leading-tight">
                            <span className="text-xs opacity-80 font-black uppercase tracking-widest">{regionMapping[regName]?.name || regName}</span>
                            <span className="text-lg font-black">{catName} <span className="opacity-60">{regName}</span></span>
                          </div>
                        </div>
                        <span className="text-sm font-normal opacity-90 bg-black/20 px-3 py-1 rounded-full border border-white/10">{cards.length} Variations</span>
                      </div>
                      {isExpanded ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="p-0">
                            <div className="hidden md:block overflow-x-auto">
                              <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold">
                                  <tr>
                                    <th className="px-6 py-4">Card Amount</th>
                                    <th className="px-6 py-4">Rate ({selectedCurrency})</th>
                                    <th className="px-6 py-4">Status</th>
                                    {selectedCurrency !== "RMB" && <th className="px-6 py-4">Type</th>}
                                    <th className="px-6 py-4">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                  {sortedCards.flatMap(card => {
                                    const types: ("Physical" | "E-Code")[] = deliveryType === "All" ? ["Physical", "E-Code"] : [deliveryType as "Physical" | "E-Code"];
                                    return types.map(type => ({ card, type }));
                                  }).filter(item => {
                                    if (showUnavailable) return true;
                                    return getRate(item.card.rates, selectedCurrency, item.type) > 0;
                                  }).map((item, idx) => {
                                    const { card, type } = item;
                                    const rate = getRate(card.rates, selectedCurrency, type);
                                    const isAvailable = rate > 0;
                                    return (
                                      <tr key={`${card.id}-${type}-${idx}`} className={`group transition-colors ${isAvailable ? "hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10" : "opacity-60 bg-gray-50/50 dark:bg-gray-800/20"}`}>
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors uppercaseTracking">{card.amount}</td>
                                        <td className="px-6 py-4"><div className={`text-xl font-black ${isAvailable ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>{isAvailable ? <>{getCurrencySymbol(selectedCurrency)}{rate.toFixed(2)}</> : '-'}</div></td>
                                        <td className="px-6 py-4">{isAvailable ? (<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Available</span>) : (<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Currently Unavailable</span>)}</td>
                                        {selectedCurrency !== "RMB" && (<td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${type === "Physical" ? "bg-red-100 text-red-600 dark:bg-red-900/40" : "bg-blue-100 text-blue-600 dark:bg-blue-900/40"}`}>{type}</span></td>)}
                                        <td className="px-6 py-4">{isAvailable && (<div className="flex items-center gap-2">
                                              <button onClick={() => { audit.log('trade_intent_platform', { asset: catName, region: regName, amount: card.amount, rate: rate, currency: selectedCurrency, type }); router.push(user ? '/dashboard/trade' : '/auth/login'); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-900/10 transition-all hover:scale-105" title="Trade Now"><BoltIcon className="w-3.5 h-3.5" /> Trade Now</button>
                                              {settings?.offer_trade_via_whatsapp && (<button onClick={() => handleTrade({ ...card }, catName, regName, type)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-md shadow-green-900/10 transition-all hover:scale-105" title="Chat on WhatsApp"><ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5" /> WhatsApp</button>)}
                                            </div>)}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                              {sortedCards.flatMap(card => {
                                const types: ("Physical" | "E-Code")[] = deliveryType === "All" ? ["Physical", "E-Code"] : [deliveryType as "Physical" | "E-Code"];
                                return types.map(type => ({ card, type }));
                              }).filter(item => {
                                if (showUnavailable) return true;
                                return getRate(item.card.rates, selectedCurrency, item.type) > 0;
                              }).map((item, idx) => {
                                const { card, type } = item;
                                const rate = getRate(card.rates, selectedCurrency, type);
                                const isAvailable = rate > 0;
                                return (
                                  <div key={`${card.id}-${type}-${idx}`} className={`p-4 flex items-center justify-between ${!isAvailable && "opacity-60 bg-gray-50/50 dark:bg-gray-800/20"}`}>
                                    <div>
                                      <div className="font-bold text-gray-900 dark:text-white mb-1 uppercaseTracking">{card.amount}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        {selectedCurrency !== "RMB" && <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${type === "Physical" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>{type}</span>}
                                        {!isAvailable && <span className="text-red-500">Unavailable</span>}
                                      </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                      <div>{isAvailable ? (<div className="text-xl font-black text-gray-900 dark:text-white">{getCurrencySymbol(selectedCurrency)}{rate.toFixed(2)}</div>) : (<span className="text-sm font-bold text-gray-400">N/A</span>)}{isAvailable && <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Rate</div>}</div>
                                      {isAvailable && (<div className="flex gap-2">
                                          <button onClick={() => { audit.log('trade_intent_platform', { asset: catName, region: regName, amount: card.amount, rate: rate, currency: selectedCurrency, type }); router.push(user ? '/dashboard/trade' : '/auth/login'); }} className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 transition-colors" title="Trade Now"><BoltIcon className="w-5 h-5" /></button>
                                          {settings?.offer_trade_via_whatsapp && (<button onClick={() => handleTrade(card, catName, regName, type)} className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 transition-colors" title="Chat on WhatsApp"><PaperAirplaneIcon className="w-5 h-5 -rotate-45 relative left-[-1px] top-[1px]" /></button>)}
                                        </div>)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleGeneralSupport} className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 text-white rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center"><ChatBubbleLeftEllipsisIcon className="w-8 h-8" /></motion.button>
      <Footer />
    </main>
  );
}

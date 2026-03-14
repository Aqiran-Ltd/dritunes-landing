'use client';

import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { ArrowTrendingUpIcon, FireIcon } from '@heroicons/react/24/solid';
import { DevicePhoneMobileIcon, ShoppingBagIcon, GlobeAltIcon, GiftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface Rate {
  id: number;
  asset_name: string;
  category: string;
  rate: string;
  type: string;
  country_code: string;
  denomination: string;
}

export default function RatesTicker() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        
        const response: any = await api.get('/rates', token);
        let ratesData = [];
            
        if (response.data && response.data.data) {
            ratesData = response.data.data;
        } else if (response.data) {
            ratesData = response.data;
        } else if (Array.isArray(response)) {
             ratesData = response;
        }

        // Sort by sell_rate desc to show best rates first, take top 15 for a good scroll
        const sortedRates = ratesData
            .sort((a: Rate, b: Rate) => parseFloat(b.rate) - parseFloat(a.rate))
            .slice(0, 15);
            
        setRates(sortedRates);
      } catch (error) {
        console.error('Failed to fetch rates', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused || rates.length === 0) return;

    let animationFrameId: number;
    
    const scroll = () => {
      if (scrollContainer) {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1; // Speed of scroll
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, rates]);

  const getCategoryStyle = (name: string) => {
    const n = (name || "").toLowerCase();
    if (n.includes('apple') || n.includes('itunes')) return { icon: <DevicePhoneMobileIcon className="w-5 h-5" />, bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-300" };
    if (n.includes('steam')) return { icon: <ShoppingBagIcon className="w-5 h-5" />, bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" };
    if (n.includes('google')) return { icon: <GlobeAltIcon className="w-5 h-5" />, bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" };
    if (n.includes('xbox') || n.includes('microsoft')) return { icon: <GlobeAltIcon className="w-5 h-5" />, bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" };
    if (n.includes('sephora')) return { icon: <ShoppingBagIcon className="w-5 h-5" />, bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400" };
    if (n.includes('amazon')) return { icon: <ShoppingBagIcon className="w-5 h-5" />, bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" };
    if (n.includes('razor')) return { icon: <ShoppingBagIcon className="w-5 h-5" />, bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" };
    return { icon: <GiftIcon className="w-5 h-5" />, bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" };
  };

  // Duplicate rates for infinite scroll effect
  const displayRates = [...rates, ...rates];

  if (isLoading || rates.length === 0) return null;

  return (
    <div className="w-full relative py-2">
       <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <FireIcon className="w-5 h-5 text-red-600 dark:text-red-500 animate-pulse" />
             </div>
             Hot Rates
          </h2>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800">
            Live Updates
          </span>
       </div>
       
       <div 
         ref={scrollRef}
         className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-none select-none cursor-grab active:cursor-grabbing"
         onMouseEnter={() => setIsPaused(true)}
         onMouseLeave={() => setIsPaused(false)}
         onTouchStart={() => setIsPaused(true)}
         onTouchEnd={() => setIsPaused(false)}
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
       >
          {displayRates.map((rate, index) => {
             const style = getCategoryStyle(rate.asset_name);
             const isHighRate = parseFloat(rate.rate) > 10;
             
             return (
               <motion.div 
                  key={`${rate.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -2 }}
                  className="min-w-[200px] bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
               >
                  <div className="flex items-start justify-between mb-3">
                     <div className={`p-2 rounded-xl ${style.bg} ${style.text}`}>
                        {style.icon}
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                         {rate.country_code}
                     </span>
                  </div>
                  
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3 truncate" title={rate.asset_name.replace(/_/g, ' ')}>
                     {rate.asset_name.replace(/_/g, ' ')}
                  </h3>
                  
                  <div className="flex items-end justify-between">
                     <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Sell Rate</span>
                         <div className="flex items-baseline gap-0.5">
                             <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                                 {parseFloat(rate.rate).toFixed(2)}
                             </span>
                             <span className="text-xs text-gray-400 font-medium">/$</span>
                         </div>
                     </div>
                     {isHighRate && (
                         <div className="text-green-500 dark:text-green-400 flex items-center gap-0.5 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md">
                             <ArrowTrendingUpIcon className="w-3 h-3" />
                         </div>
                     )}
                  </div>

                  {/* Denomination Row */}
                  <div className="mt-3 pt-2 border-t border-gray-50 dark:border-gray-800/50">
                     <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium truncate italic" title={rate.denomination}>
                       {rate.denomination}
                     </p>
                  </div>
               </motion.div>
             );
          })}
       </div>
    </div>
  );
}

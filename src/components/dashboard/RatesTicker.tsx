'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import { fetchTrendsRates, type TrendsRates } from '@/lib/analyticsService';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, FireIcon } from '@heroicons/react/24/solid';
import { DevicePhoneMobileIcon, ShoppingBagIcon, GlobeAltIcon, GiftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface Rate {
  id: number;
  asset_name: string;
  category: string;
  rate: string;
  type: string;
  country_code: string;
  denomination: string;
  gift_card?: {
    id: number;
    name: string;
    image_url: string;
  };
}

const SparklineTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/80 text-white text-[9px] font-bold px-2 py-1 rounded-md">
      Avg: {Number(payload[0].value).toFixed(2)}
    </div>
  );
};

function SparklineOverlay({ assetName }: { assetName: string }) {
  const [trendData, setTrendData] = useState<TrendsRates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    fetchTrendsRates(token, assetName, 7, 'day')
      .then(setTrendData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [assetName]);

  const chartData = trendData
    ? (trendData.labels || []).map((label, i) => ({
        date: label,
        avg: (trendData.avg_dataset && trendData.avg_dataset[i]) ?? 0,
        min: (trendData.min_dataset && trendData.min_dataset[i]) ?? 0,
        max: (trendData.max_dataset && trendData.max_dataset[i]) ?? 0,
      }))
    : [];

  const hasData = chartData.length > 0;

  // Compute 7-day change
  let change: number | null = null;
  if (hasData && chartData.length >= 2) {
    const first = chartData[0].avg;
    const last = chartData[chartData.length - 1].avg;
    if (first > 0) change = ((last - first) / first) * 100;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 4 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 rounded-2xl overflow-hidden z-20 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 flex flex-col justify-between p-3"
    >
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasData ? (
        <div className="flex-1 flex items-center justify-center text-center">
          <p className="text-[10px] text-gray-400 font-medium">No trend data available</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">7-Day Trend</p>
            {change !== null && (
              <span className={`inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                change >= 0
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-600'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-600'
              }`}>
                {change >= 0
                  ? <ArrowTrendingUpIcon className="w-2.5 h-2.5" />
                  : <ArrowTrendingDownIcon className="w-2.5 h-2.5" />}
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            )}
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                <defs>
                  <linearGradient id={`spark-${assetName}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={<SparklineTooltip />} />
                <Area
                  type="monotone"
                  dataKey="avg"
                  stroke="#dc2626"
                  strokeWidth={1.5}
                  fill={`url(#spark-${assetName})`}
                  dot={false}
                  activeDot={{ r: 3, fill: '#dc2626', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-[8px] text-gray-400 uppercase tracking-wider">Min</p>
              <p className="text-[10px] font-black text-gray-700 dark:text-gray-300">
                {hasData ? Math.min(...chartData.map(d => d.min)).toFixed(2) : '—'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] text-gray-400 uppercase tracking-wider">Avg</p>
              <p className="text-[10px] font-black text-gray-700 dark:text-gray-300">
                {hasData ? (chartData.reduce((s, d) => s + d.avg, 0) / chartData.length).toFixed(2) : '—'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-gray-400 uppercase tracking-wider">Max</p>
              <p className="text-[10px] font-black text-gray-700 dark:text-gray-300">
                {hasData ? Math.max(...chartData.map(d => d.max)).toFixed(2) : '—'}
              </p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function RatesTicker() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);
  // Cache sparkline data by asset name to avoid re-fetching
  const sparkCacheRef = useRef<Set<string>>(new Set());

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
          scrollContainer.scrollLeft += 1;
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
            Hover a card for 7-day trend
          </span>
       </div>
       
       <div 
         ref={scrollRef}
         className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-none select-none cursor-grab active:cursor-grabbing"
         onMouseEnter={() => setIsPaused(true)}
         onMouseLeave={() => { setIsPaused(false); setHoveredAsset(null); }}
         onTouchStart={() => setIsPaused(true)}
         onTouchEnd={() => { setIsPaused(false); setHoveredAsset(null); }}
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
       >
          {displayRates.map((rate, index) => {
             const style = getCategoryStyle(rate.asset_name);
             const isHighRate = parseFloat(rate.rate) > 10;
             const cardKey = `${rate.id}-${index}`;
             const isHovered = hoveredAsset === cardKey;
             
             return (
               <motion.div 
                  key={cardKey}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative min-w-[200px] bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  onMouseEnter={() => {
                    setHoveredAsset(cardKey);
                    sparkCacheRef.current.add(rate.asset_name);
                  }}
                  onMouseLeave={() => setHoveredAsset(null)}
               >
                  {/* Normal content */}
                  <div className="flex items-start justify-between mb-3">
                     <div className={`p-2 rounded-xl ${style.bg} ${style.text} flex items-center justify-center w-10 h-10 overflow-hidden`}>
                        {rate.gift_card?.image_url ? (
                          <img src={rate.gift_card.image_url} alt={rate.asset_name} className="w-full h-full object-contain" />
                        ) : style.icon}
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

                  <div className="mt-3 pt-2 border-t border-gray-50 dark:border-gray-800/50">
                     <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium truncate italic" title={rate.denomination}>
                       {rate.denomination}
                     </p>
                  </div>

                  {/* Sparkline overlay on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <SparklineOverlay assetName={rate.asset_name} />
                    )}
                  </AnimatePresence>
               </motion.div>
             );
          })}
       </div>
    </div>
  );
}

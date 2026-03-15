'use client';

import React, { useEffect, useState } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, TrophyIcon, CubeIcon } from '@heroicons/react/24/outline';
import { fetchTrendsSummary, type TrendsSummary } from '@/lib/analyticsService';

interface Props {
  days?: number;
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3" />
      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-20" />
    </div>
  );
}

function ChangeBadge({ change }: { change: number | null }) {
  if (change === null) return <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-full">New period</span>;
  const isUp = change >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full ${
      isUp
        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
    }`}>
      {isUp ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
      {isUp ? '+' : ''}{change.toFixed(1)}%
    </span>
  );
}

export default function TrendsSummaryCards({ days = 30 }: Props) {
  const [data, setData] = useState<TrendsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    fetchTrendsSummary(token, days)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!data) return null;

  const total_trades = data.trades.current;
  const approved_trades = total_trades - (data.pending_count + data.rejected_count);
  const successRate = total_trades > 0
    ? Math.round((approved_trades / total_trades) * 100)
    : 0;

  const cards = [
    {
      label: 'Total Trades',
      value: total_trades.toLocaleString(),
      change: data.trades.percentage_change,
      sub: `${data.pending_count} pending · ${data.rejected_count} rejected`,
      icon: <CubeIcon className="w-5 h-5" />,
      accent: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Volume',
      value: `₵${data.volume.current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: data.volume.percentage_change,
      sub: `${days}-day GHS payout`,
      icon: <ArrowTrendingUpIcon className="w-5 h-5" />,
      accent: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      change: null,
      sub: `${approved_trades} approved`,
      icon: <ArrowTrendingUpIcon className="w-5 h-5" />,
      accent: successRate >= 70
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Top Asset',
      value: data.top_asset ?? '—',
      change: null,
      sub: 'Most traded asset',
      icon: <TrophyIcon className="w-5 h-5" />,
      accent: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {card.label}
            </p>
            <div className={`p-1.5 rounded-lg ${card.accent}`}>
              {card.icon}
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white truncate mb-2">
            {card.value}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {'change' in card && <ChangeBadge change={card.change} />}
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{card.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

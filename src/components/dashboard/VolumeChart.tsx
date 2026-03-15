'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchTrendsVolume, type TrendsVolume } from '@/lib/analyticsService';

const PERIOD_OPTIONS: { label: string; days: number }[] = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

const METRIC_OPTIONS: { label: string; value: 'volume' | 'count' }[] = [
  { label: 'Volume (₵)', value: 'volume' },
  { label: 'Trade Count', value: 'count' },
];

const CustomTooltip = ({ active, payload, label, metric }: any) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl p-3 text-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
        {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
      <p className="font-black text-gray-900 dark:text-white text-base">
        {metric === 'volume' ? `₵${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `${val} trades`}
      </p>
    </div>
  );
};

export default function VolumeChart() {
  const [activeDays, setActiveDays] = useState(30);
  const [activeMetric, setActiveMetric] = useState<'volume' | 'count'>('volume');
  const [data, setData] = useState<TrendsVolume | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (days: number, metric: 'volume' | 'count') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const result = await fetchTrendsVolume(token, days, metric);
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(activeDays, activeMetric); }, [activeDays, activeMetric, load]);

  const chartData = data
    ? data.labels.map((label, i) => ({ date: label, value: data.dataset.data[i] ?? 0 }))
    : [];

  const hasData = chartData.some(d => d.value > 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">Trade Volume</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {activeMetric === 'volume' ? 'GHS payout over time' : 'Number of trades over time'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Metric toggle */}
          <div className="flex bg-gray-50 dark:bg-gray-800 rounded-xl p-1 gap-1">
            {METRIC_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setActiveMetric(opt.value)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeMetric === opt.value
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {/* Period toggle */}
          <div className="flex bg-gray-50 dark:bg-gray-800 rounded-xl p-1 gap-1">
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt.days}
                onClick={() => setActiveDays(opt.days)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeDays === opt.days
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Total callout */}
      {data && (
        <div className="mb-4">
          <p className="text-3xl font-black italic text-gray-900 dark:text-white">
            {activeMetric === 'volume'
              ? `₵${Number(data?.meta?.total ?? data.dataset.data.reduce((a, b) => a + b, 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              : `${data?.meta?.total ?? data.dataset.data.reduce((a, b) => a + (b > 0 ? 1 : 0), 0)} trades`}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-0.5">
            {activeDays}-day total
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="h-52 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 rounded-xl z-10">
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && !hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-600">
            <p className="text-sm font-medium">No trade data in this window</p>
            <p className="text-xs mt-1">Start trading to see your volume chart</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 700 }}
                tickFormatter={v =>
                  new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v =>
                  activeMetric === 'volume'
                    ? v >= 1000 ? `₵${(v / 1000).toFixed(1)}k` : `₵${v}`
                    : String(v)
                }
                width={activeMetric === 'volume' ? 52 : 28}
              />
              <Tooltip content={<CustomTooltip metric={activeMetric} />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#dc2626"
                strokeWidth={2.5}
                fill="url(#volGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#dc2626', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchTrendsDistribution, type TrendsDistribution } from '@/lib/analyticsService';

// A vibrant colour palette for the slices
const SLICE_COLORS = [
  '#dc2626', '#2563eb', '#16a34a', '#d97706', '#7c3aed',
  '#0891b2', '#db2777', '#65a30d', '#ea580c', '#6366f1',
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl p-3 text-sm">
      <p className="font-black text-gray-900 dark:text-white mb-1">{d.name}</p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400">{d.count} trades</p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400">
        ₵{Number(d.payout).toLocaleString('en-US', { minimumFractionDigits: 2 })} payout
      </p>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AssetDistributionChart() {
  const [data, setData] = useState<TrendsDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    fetchTrendsDistribution(token, 30)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pieData = data?.breakdown.map((item, i) => ({
    name: item.asset_name,
    count: item.count,
    payout: item.payout,
    color: SLICE_COLORS[i % SLICE_COLORS.length],
  })) ?? [];

  const hasData = pieData.length > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 h-full">
      <div className="mb-5">
        <h3 className="font-bold text-gray-900 dark:text-white">Asset Mix</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Trade distribution by asset · 30 days
        </p>
      </div>

      {loading ? (
        <div className="h-52 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasData ? (
        <div className="h-52 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 text-center">
          <svg className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="4 2" />
          </svg>
          <p className="text-sm font-medium">No trade data yet</p>
          <p className="text-xs mt-1">Complete a trade to see asset mix</p>
        </div>
      ) : (
        <>
          {/* Donut */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="45%"
                  outerRadius="75%"
                  dataKey="count"
                  paddingAngle={2}
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-1.5 max-h-36 overflow-y-auto scrollbar-none">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{item.name}</span>
                </div>
                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 ml-2">{item.count}T</span>
              </div>
            ))}
          </div>

          {/* Meta totals */}
          {data && (
            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">
                  {data?.meta?.total_trades || data.breakdown.reduce((a, b) => a + b.count, 0)} trades
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payout</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">
                  ₵{Number(data?.meta?.total_payout || data.breakdown.reduce((a, b) => a + Number(b.payout), 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

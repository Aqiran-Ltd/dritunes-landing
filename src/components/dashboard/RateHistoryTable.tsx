'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchRateHistory, type RateHistoryItem, type RateHistoryPage } from '@/lib/analyticsService';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CreditCardIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';

function getDelta(oldRate: string, newRate: string) {
  const o = parseFloat(oldRate);
  const n = parseFloat(newRate);
  if (isNaN(o) || isNaN(n) || o === 0) return null;
  return ((n - o) / o) * 100;
}

function ActionBadge({ action }: { action: RateHistoryItem['action'] }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
      action === 'created'
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
    }`}>
      {action}
    </span>
  );
}

function TypeBadge({ type }: { type: string | null | undefined }) {
  if (!type) return <span className="text-gray-400">—</span>;
  const isPhysical = type.toLowerCase() === 'physical';
  const Icon = isPhysical ? CreditCardIcon : TicketIcon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
      isPhysical 
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
        : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
    }`}>
      <Icon className="w-3 h-3 stroke-[2.5]" />
      {type}
    </span>
  );
}

function RateDelta({ oldRate, newRate }: { oldRate: string; newRate: string }) {
  const delta = getDelta(oldRate, newRate);
  const n = parseFloat(newRate);
  const isUp = (delta ?? 0) >= 0;

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1">
        <span className="font-black text-gray-900 dark:text-white">{n.toFixed(2)}</span>
        {delta !== null && (
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-black ${
            isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {isUp ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
            {isUp ? '+' : ''}{delta.toFixed(1)}%
          </span>
        )}
      </div>
      <span className="text-[9px] text-gray-400 line-through">{parseFloat(oldRate).toFixed(2)}</span>
    </div>
  );
}

export default function RateHistoryTable() {
  const [rows, setRows] = useState<RateHistoryItem[]>([]);
  const [meta, setMeta] = useState<RateHistoryPage['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Filters
  const [assetSearch, setAssetSearch] = useState('');
  const [category, setCategory] = useState('');
  const [action, setAction] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (pageNum: number, append = false) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    if (!append) { setLoading(true); setError(null); }
    else setLoadingMore(true);

    try {
      const result = await fetchRateHistory(token, {
        page: pageNum,
        per_page: 20,
        asset_name: assetSearch || undefined,
        category: category || undefined,
        action: action || undefined,
        from: from || undefined,
        to: to || undefined,
      });

      if (!result || !Array.isArray(result.data) || !result.meta) throw new Error('Unexpected response structure');

      setRows(prev => append ? [...prev, ...result.data] : result.data);
      setMeta(result.meta);
    } catch (e: any) {
      console.error('RateHistory fetch error:', e);
      setError(e?.message || 'Failed to load rate history');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [assetSearch, category, action, from, to]);

  // Debounce search/filter changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setError(null);
      load(1, false);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [assetSearch, category, action, from, to, load]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next, true);
  };

  const hasActiveFilters = !!(assetSearch || category || action || from || to);

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search asset name…"
            value={assetSearch}
            onChange={e => setAssetSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
          />
          {assetSearch && (
            <button onClick={() => setAssetSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters toggle */}
        <button
          onClick={() => setShowFilters(p => !p)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
            showFilters || hasActiveFilters
              ? 'bg-gold-50 dark:bg-gold-900/20 border-gold-200 dark:border-gold-700 text-gold-700 dark:text-gold-400'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          <FunnelIcon className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 bg-gold-500 text-ink text-[9px] rounded-full flex items-center justify-center font-black">!</span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">All</option>
              <option value="gift_card">Gift Card</option>

            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Action</label>
            <select
              value={action}
              onChange={e => setAction(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">All</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">From Date</label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">To Date</label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          {hasActiveFilters && (
            <div className="sm:col-span-2 md:col-span-4 flex justify-end">
              <button
                onClick={() => { setCategory(''); setAction(''); setFrom(''); setTo(''); setAssetSearch(''); }}
                className="text-xs text-gold-700 dark:text-gold-400 hover:text-gold-800 font-semibold underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Meta count */}
        {meta && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              {meta.total.toLocaleString()} rate changes recorded
            </p>
          </div>
        )}

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3">
            <p className="font-medium text-gray-900 dark:text-white">Failed to load rate history</p>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">{error}</p>
            <button
              onClick={() => load(1, false)}
              className="mt-2 px-5 py-2 bg-gold-500 text-ink text-sm font-bold rounded-xl hover:bg-gold-600 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-600">
            <p className="font-medium">No rate changes found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    {['Asset', 'Denomination', 'Category', 'Type', 'Action', 'New Rate', 'Changed At'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white">{row.asset_name}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400 max-w-[180px] truncate" title={row.rate?.denomination}>
                        {row.rate?.denomination ?? '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                          {row.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 capitalize">
                        <TypeBadge type={row.rate?.type} />
                      </td>
                      <td className="px-5 py-3.5"><ActionBadge action={row.action} /></td>
                      <td className="px-5 py-3.5"><RateDelta oldRate={row.old_rate} newRate={row.new_rate} /></td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">
                        {new Date(row.created_at).toLocaleString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
              {rows.map(row => (
                <div key={row.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{row.asset_name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-tight max-w-[200px] truncate">{row.rate?.denomination}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <ActionBadge action={row.action} />
                      <RateDelta oldRate={row.old_rate} newRate={row.new_rate} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {row.category.replace('_', ' ')}
                    </span>
                    <TypeBadge type={row.rate?.type} />
                    <span className="text-[9px] text-gray-400 ml-auto">
                      {new Date(row.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {meta && meta.current_page < meta.last_page && (
              <div className="p-4 border-t border-gray-50 dark:border-gray-800 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-black disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
                >
                  {loadingMore ? (
                    <><div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" /> Loading…</>
                  ) : (
                    `Load More (page ${meta.current_page}/${meta.last_page})`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

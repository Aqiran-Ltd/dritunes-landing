'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRates, type Category } from '@/lib/ratesService';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  ChartBarIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import PriceUpdateSection from '@/components/PriceUpdateSection';
import RateHistoryTable from '@/components/dashboard/RateHistoryTable';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'live' | 'history';

export default function DashboardRatesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('live');

  const loadRates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');
      const data = await fetchRates(token);
      setCategories(data.categories);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error(err);
      setError('Failed to load live rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
    const interval = setInterval(loadRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && categories.length === 0 && activeTab === 'live') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <BoltIcon className="w-12 h-12 text-red-500 animate-pulse" />
        <p className="text-gray-500 animate-pulse">Fetching live market data...</p>
      </div>
    );
  }

  if (error && categories.length === 0 && activeTab === 'live') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={loadRates}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'live',
      label: 'Live Rates',
      icon: <BoltIcon className="w-4 h-4" />,
    },
    {
      id: 'history',
      label: 'Rate History',
      icon: <ChartBarIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-8 animate-slide-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Market Rates</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {activeTab === 'live'
              ? 'Live exchange rates for gift cards. Updated in real-time.'
              : 'A full audit log of every rate change in the system.'}
          </p>
        </div>

        {activeTab === 'live' && (
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live Connection
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
            {lastUpdated && (
              <span className="text-xs text-gray-400">Updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
            <button
              onClick={loadRates}
              className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${loading ? 'animate-spin text-red-500' : 'text-gray-400'}`}
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5 gap-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'live' ? (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden"
          >
            <div className="-my-10 -mx-4 md:mx-0">
              <PriceUpdateSection initialCategories={categories} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <RateHistoryTable />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

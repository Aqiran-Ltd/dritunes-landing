"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CurrencyDollarIcon, ArrowTrendingUpIcon, StarIcon } from "@heroicons/react/24/solid";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

const rates = [
  { name: "Bitcoin (BTC)", rate: "₵12.50 / $1", best: true },
  { name: "USDT (Tether)", rate: "₵12.20 / $1", best: false },
  { name: "iTunes Gift Card", rate: "₵10.00 / $1", best: false },
  { name: "Amazon Gift Card", rate: "₵9.80 / $1", best: false },
  { name: "Steam Gift Card", rate: "₵9.50 / $1", best: false },
  { name: "Razer Gold", rate: "₵9.00 / $1", best: false },
  { name: "Vanilla Visa", rate: "₵8.80 / $1", best: false },
  { name: "Walmart MoneyCard", rate: "₵8.50 / $1", best: false },
];

export default function RatesPage() {
  const [search, setSearch] = useState("");
  const filteredRates = rates.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-yellow-50 to-red-100 dark:from-[#0a0a0a] dark:via-[#171717] dark:to-[#23272f]">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 pt-32 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100 dark:from-yellow-900 dark:via-red-900 dark:to-pink-900 pointer-events-none z-0"
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/30 rounded-full blur-2xl z-0"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl z-0"
        />
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative z-10"
        >
          <div className="inline-flex items-center px-6 py-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-full text-yellow-700 dark:text-yellow-300 text-lg font-bold mb-6 shadow-lg animate-pulse-slow">
            <CurrencyDollarIcon className="w-6 h-6 mr-2 text-yellow-500 animate-bounce" />
            Live Rates
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gradient mb-4 animate-gradient-x">All Rates at a Glance</h1>
          <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-4">Check the latest rates for all supported crypto and gift cards. Updated in real time for your convenience!</p>
        </motion.div>
        {/* Search Bar */}
        <div className="w-full max-w-xl mx-auto mb-10 relative z-10">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search rates (e.g. Bitcoin, Amazon, Gift Card)"
            className="w-full px-6 py-4 rounded-full border-2 border-yellow-300 dark:border-yellow-700 bg-white/80 dark:bg-gray-900/80 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all shadow-md placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        {/* Creative Divider */}
        <div className="w-32 h-2 mx-auto mb-12 bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 rounded-full blur-sm animate-pulse-slow" />
        {/* Creative Rates Table - Simple, Modern Card Design */}
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
          {filteredRates.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 dark:text-gray-500 text-lg font-medium py-12">No rates found.</div>
          ) : (
            filteredRates.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`relative rounded-2xl p-6 shadow-lg border-2 ${item.best ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30' : 'border-red-100 dark:border-gray-700 bg-white dark:bg-gray-800'} transition-all duration-300 flex flex-col items-center group hover:shadow-2xl`}
              >
                <div className="flex items-center mb-2">
                  <ArrowTrendingUpIcon className="w-6 h-6 mr-2 text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</span>
                  {item.best && <StarIcon className="w-5 h-5 ml-2 text-yellow-400 animate-bounce" title="Best Rate" />}
                </div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-yellow-200 mb-1">
                  {item.rate}
                </div>
                {item.best && <div className="text-xs font-semibold text-yellow-600 dark:text-yellow-300">Best Rate!</div>}
              </motion.div>
            ))
          )}
        </div>
        {/* Creative CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center relative z-10"
        >
          <Link href="/trade" className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg animate-pulse-slow">
            Start Trading Now
          </Link>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
} 
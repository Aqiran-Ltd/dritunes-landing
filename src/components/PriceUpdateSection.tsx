"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CurrencyDollarIcon, 
  GiftIcon, 
  ArrowPathIcon, 
  PlayIcon,
  PauseIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

export default function PriceUpdateSection() {
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulated price data
  const [prices, setPrices] = useState({
    bitcoin: { price: 43250.50, change: 2.34, volume: "2.1B" },
    ethereum: { price: 2650.75, change: -1.23, volume: "1.8B" },
    usdt: { price: 1.00, change: 0.01, volume: "45.2B" },
    amazon: { price: 12.50, change: 0.00, volume: "N/A" },
    apple: { price: 15.75, change: 0.00, volume: "N/A" },
    google: { price: 18.25, change: 0.00, volume: "N/A" }
  });

  const refreshPrices = () => {
    // Simulate price updates
    setPrices(prev => ({
      bitcoin: { 
        price: prev.bitcoin.price + (Math.random() - 0.5) * 1000,
        change: prev.bitcoin.change + (Math.random() - 0.5) * 2,
        volume: prev.bitcoin.volume
      },
      ethereum: { 
        price: prev.ethereum.price + (Math.random() - 0.5) * 100,
        change: prev.ethereum.change + (Math.random() - 0.5) * 2,
        volume: prev.ethereum.volume
      },
      usdt: { 
        price: 1.00 + (Math.random() - 0.5) * 0.02,
        change: prev.usdt.change + (Math.random() - 0.5) * 0.1,
        volume: prev.usdt.volume
      },
      amazon: prev.amazon,
      apple: prev.apple,
      google: prev.google
    }));
    setLastUpdate(new Date());
  };

  useEffect(() => {
    if (!isAutoRefresh) return;
    
    const interval = setInterval(refreshPrices, 5000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 dark:from-gray-800 dark:via-red-800 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-full text-red-700 dark:text-red-300 text-sm font-medium mb-6 shadow-lg"
          >
            <ChartBarIcon className="w-5 h-5 mr-2" />
            <span className="font-semibold">Live Market Updates</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-gray-100 mb-4">
            Real-Time <span className="text-gradient">Price Updates</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto">
            Stay updated with the latest cryptocurrency and gift card prices. Get the best rates for your trades.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <motion.button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-6 py-3 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-full text-white dark:text-gray-200 font-medium hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300"
          >
            {isAutoRefresh ? (
              <PauseIcon className="w-5 h-5 mr-2" />
            ) : (
              <PlayIcon className="w-5 h-5 mr-2" />
            )}
            {isAutoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
          </motion.button>
          
          <motion.button
            onClick={refreshPrices}
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-6 py-3 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 rounded-full text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Refresh Now
          </motion.button>
        </motion.div>

        {/* Last Update Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center px-4 py-2 bg-green-500/20 dark:bg-green-400/20 border border-green-400/30 dark:border-green-300/30 rounded-full text-green-300 dark:text-green-200 text-sm font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            Last Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </motion.div>

        {/* Price Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cryptocurrencies */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white dark:text-gray-100 flex items-center">
              <CurrencyDollarIcon className="w-6 h-6 mr-2 text-yellow-400" />
              Cryptocurrencies
            </h3>
            
            {Object.entries(prices).filter(([key]) => ['bitcoin', 'ethereum', 'usdt'].includes(key)).map(([key, data]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-2xl p-6 hover:bg-white/15 dark:hover:bg-gray-700/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold text-white dark:text-gray-100 capitalize">
                    {key === 'usdt' ? 'USDT' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    data.change >= 0 
                      ? 'bg-green-500/20 dark:bg-green-400/20 text-green-300 dark:text-green-200 border border-green-400/30 dark:border-green-300/30'
                      : 'bg-red-500/20 dark:bg-red-400/20 text-red-300 dark:text-red-200 border border-red-400/30 dark:border-red-300/30'
                  }`}>
                    {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                  </span>
                </div>
                
                <div className="text-3xl font-bold text-white dark:text-gray-100 mb-2">
                  ${data.price.toLocaleString()}
                </div>
                
                <div className="text-sm text-gray-300 dark:text-gray-400">
                  24h Volume: {data.volume}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-white/20 dark:bg-gray-600/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.abs(data.change) * 10}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-2 rounded-full ${
                        data.change >= 0 
                          ? 'bg-gradient-to-r from-green-400 to-green-500 dark:from-green-300 dark:to-green-400'
                          : 'bg-gradient-to-r from-red-400 to-red-500 dark:from-red-300 dark:to-red-400'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Gift Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white dark:text-gray-100 flex items-center">
              <GiftIcon className="w-6 h-6 mr-2 text-purple-400" />
              Gift Cards
            </h3>
            
            {Object.entries(prices).filter(([key]) => ['amazon', 'apple', 'google'].includes(key)).map(([key, data]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-2xl p-6 hover:bg-white/15 dark:hover:bg-gray-700/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold text-white dark:text-gray-100 capitalize">
                    {key.charAt(0).toUpperCase() + key.slice(1)} Gift Card
                  </h4>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Fixed Rate
                  </span>
                </div>
                
                <div className="text-3xl font-bold text-white dark:text-gray-100 mb-2">
                  ₵{data.price.toFixed(2)}
                </div>
                
                <div className="text-sm text-gray-300 dark:text-gray-400">
                  Per $1 USD
                </div>
                
                {/* Availability Indicator */}
                <div className="mt-4">
                  <div className="w-full bg-white/20 dark:bg-gray-600/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-300 dark:to-blue-400"
                    />
                  </div>
                  <div className="text-xs text-gray-300 dark:text-gray-400 mt-1">Available</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trading Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white dark:text-gray-100 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2 text-red-400" />
              Trading Info
            </h3>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-2xl p-6 hover:bg-white/15 dark:hover:bg-gray-700/50 transition-all duration-300"
            >
              <h4 className="text-lg font-bold text-white dark:text-gray-100 mb-4">Market Status</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 dark:text-gray-400">Market Hours:</span>
                  <span className="text-white dark:text-gray-100 font-semibold">24/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 dark:text-gray-400">Min Trade:</span>
                  <span className="text-white dark:text-gray-100 font-semibold">₵50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 dark:text-gray-400">Max Trade:</span>
                  <span className="text-white dark:text-gray-100 font-semibold">₵1M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 dark:text-gray-400">Processing:</span>
                  <span className="text-green-400 dark:text-green-300 font-semibold">Instant</span>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Trading Now
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 text-white dark:text-gray-200 font-bold rounded-xl hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300"
              >
                View All Rates
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
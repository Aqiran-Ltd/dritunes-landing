"use client";
import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  ChartBarIcon 
} from "@heroicons/react/24/outline";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import Link from "next/link";

export default function StatsSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      value: "10,000+",
      label: "Happy Customers",
      description: "Trusted by thousands across Ghana",
      icon: UsersIcon,
      gradient: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      value: "₵50M+",
      label: "Trading Volume",
      description: "Successfully processed transactions",
      icon: CurrencyDollarIcon,
      gradient: "from-green-500 to-green-600",
      delay: 0.2
    },
    {
      value: "99.9%",
      label: "Success Rate",
      description: "Secure and reliable transactions",
      icon: ShieldCheckIcon,
      gradient: "from-purple-500 to-purple-600",
      delay: 0.3
    },
    {
      value: "24/7",
      label: "Support Available",
      description: "Round-the-clock customer service",
      icon: ChartBarIcon,
      gradient: "from-red-500 to-red-600",
      delay: 0.4
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-white via-red-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-full text-red-700 dark:text-red-300 text-sm font-medium mb-6 shadow-lg"
          >
            <div className="relative w-6 h-6 mr-3">
              <Image
                src={mounted && resolvedTheme === 'dark' ? "/logo/white.png" : "/logo/red-black.png"}
                alt="Dr iTunes Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-semibold">Our Success Metrics</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by <span className="text-gradient">Thousands</span> Across Ghana
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our commitment to excellence has made us Ghana&apos;s most trusted crypto and gift card trading service.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: stat.delay }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-red-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: stat.delay + 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {stat.label}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {stat.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/trade" passHref legacyBehavior>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center mx-auto"
            >
              Join Our Success Story
              <ChartBarIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 
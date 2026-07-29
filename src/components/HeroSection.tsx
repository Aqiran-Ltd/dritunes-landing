"use client";
import React from "react";

import { motion } from "framer-motion";
import { CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useTheme } from "@/contexts/ThemeContext";
import { useHasMounted } from "@/hooks/useHasMounted";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";

export default function HeroSection() {
  const { resolvedTheme } = useTheme();
  const mounted = useHasMounted();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-red-50 to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      {/* Creative Background Elements */}
      <div className="absolute inset-0 bg-pattern opacity-30" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Floating Shapes */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-red-500 rounded-full opacity-20 blur-xl"
      />
      <motion.div
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-red-600 rounded-full opacity-15 blur-xl"
      />
      <motion.div
        animate={{ 
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-25 blur-lg"
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src={mounted && resolvedTheme === 'dark' ? "/logo/white.png" : "/logo/red-black.png"}
              alt="Dr iTunes Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 1, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full"></div>
          </motion.div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-flex items-center px-6 py-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-full text-red-700 dark:text-red-300 text-sm font-medium mb-8 shadow-lg"
        >
          <CheckCircleIcon className="w-5 h-5 mr-2 text-red-500" />
          <span className="font-semibold">Trusted by 10,000+ Ghanaians</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
        >
          <span className="text-gradient">Dr iTunes</span>
          <br />
          <span className="text-gray-900 dark:text-white">Consult</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
        >
          Ghana&apos;s Premier <span className="text-red-400 font-bold">Gift Card</span> Trading Service
          <br />
          <span className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium">Online Trading • Physical Store • 24/7 Support</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link href="/trade">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => track('CTA Click', { label: 'Start Trading Now', location: 'Hero' })}
              className="group px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg min-w-[220px] flex items-center justify-center"
            >
              Start Trading Now
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </Link>
          <Link href="/about">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border-2 border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white font-bold rounded-full transition-all duration-300 text-lg min-w-[220px] shadow-lg hover:shadow-xl"
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-red-600 dark:border-red-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-red-600 dark:bg-red-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
} 
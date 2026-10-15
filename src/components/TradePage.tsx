"use client";
import React from "react";
import { motion } from "framer-motion";
import { PhoneIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, CreditCardIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function TradePage() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] dark:from-[#0a0a0a] dark:via-[#171717] dark:to-[#23272f]">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 pt-32 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-red-200 via-pink-100 to-yellow-100 dark:from-red-900 dark:via-pink-900 dark:to-yellow-900 pointer-events-none z-0"
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-10 w-32 h-32 bg-red-400/30 rounded-full blur-2xl z-0"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl z-0"
        />
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative z-10"
        >
          <div className="inline-flex items-center px-6 py-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-full text-red-700 dark:text-red-300 text-lg font-bold mb-6 shadow-lg animate-pulse-slow">
            <CurrencyDollarIcon className="w-6 h-6 mr-2 text-red-500 animate-bounce" />
            Start Trading with Aqiran Xchange
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gradient mb-4 animate-gradient-x">Trade Gift Cards Easily</h1>
          <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-4">Follow these simple steps to get the best rates and fastest service in Ghana!</p>
        </motion.div>
        {/* Creative Divider */}
        <div className="w-32 h-2 mx-auto mb-12 bg-gradient-to-r from-red-400 via-yellow-400 to-pink-400 rounded-full blur-sm animate-pulse-slow" />
        {/* Step-by-Step Guide */}
        <div className="w-full max-w-3xl mx-auto mb-12 relative z-10">
          <ol className="space-y-8">
            <li className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CreditCardIcon className="w-10 h-10 text-red-500 bg-red-100 dark:bg-red-900/30 rounded-full p-2" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">1. Choose Your Card</h2>
                <p className="text-gray-600 dark:text-gray-300">Select the type of gift card you want to trade. We accept iTunes, Amazon, Steam, and more.</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="w-10 h-10 text-blue-500 bg-blue-100 dark:bg-blue-900/30 rounded-full p-2" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">2. Contact Us Instantly</h2>
                <p className="text-gray-600 dark:text-gray-300">Reach out via WhatsApp, Telegram, phone, or email. Our team is ready 24/7 to assist you and answer your questions.</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <ArrowRightIcon className="w-10 h-10 text-green-500 bg-green-100 dark:bg-green-900/30 rounded-full p-2" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">3. Get a Live Quote</h2>
                <p className="text-gray-600 dark:text-gray-300">We’ll give you the best rate for your trade, instantly. No hidden fees, no delays.</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="w-10 h-10 text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">4. Complete Your Trade</h2>
                <p className="text-gray-600 dark:text-gray-300">Send your card, receive your payment instantly via your preferred method (Mobile Money, Bank, etc.).</p>
              </div>
            </li>
          </ol>
        </div>
        {/* Contact Methods - Creative Cards */}
        <div className="w-full max-w-2xl mx-auto mb-12 relative z-10">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center animate-gradient-x">Contact Us Now</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a href="https://wa.me/233548434599" target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-4 bg-green-100 dark:bg-green-900/30 rounded-2xl shadow hover:shadow-lg transition-all group">
              <PhoneIcon className="w-7 h-7 text-green-600 mr-4 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-lg text-green-700 dark:text-green-300">WhatsApp</span>
            </a>
            <a href="https://t.me/dritunes" target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl shadow hover:shadow-lg transition-all group">
              <ChatBubbleLeftRightIcon className="w-7 h-7 text-blue-600 mr-4 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-lg text-blue-700 dark:text-blue-300">Telegram</span>
            </a>
            <a href="mailto:info@aqiranxchange.com" className="flex items-center px-6 py-4 bg-red-100 dark:bg-red-900/30 rounded-2xl shadow hover:shadow-lg transition-all group">
              <EnvelopeIcon className="w-7 h-7 text-red-600 mr-4 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-lg text-red-700 dark:text-red-400">Email</span>
            </a>
            <div className="flex items-center px-6 py-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl shadow group">
              <MapPinIcon className="w-7 h-7 text-purple-600 mr-4" />
              <span className="font-semibold text-lg text-purple-700 dark:text-purple-300">Tamale, Ghana</span>
            </div>
          </div>
        </div>
        {/* Creative CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center relative z-10"
        >
          <Link href="/rates" className="inline-block px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg animate-pulse-slow">
            View All Rates
          </Link>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}

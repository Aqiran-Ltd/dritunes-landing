"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  SparklesIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post("/newsletter/subscribe", {
        name,
        email,
        phone
      });
      
      setIsSubscribed(true);
      setEmail("");
      setName("");
      setPhone("");
      // Success message will stay visible
    } catch (err: any) {
      console.error("Newsletter subscription error:", err);
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gold-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-pattern opacity-5" />
      
      {/* Animated Background Shapes */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-32 h-32 bg-gold-200 rounded-full opacity-30 blur-xl"
      />
      <motion.div
        animate={{ 
          scale: [1.1, 1, 1.1],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-10 w-40 h-40 bg-gold-300 rounded-full opacity-25 blur-xl"
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-gold-100 dark:bg-gold-900/30 border border-gold-200 dark:border-gold-600/50 rounded-full text-gold-700 dark:text-gold-300 text-sm font-medium mb-8 shadow-lg"
          >
            <EnvelopeIcon className="w-4 h-4 mr-2 text-gold-700 dark:text-gold-400" />
            Stay Updated
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Get <span className="text-gradient">Exclusive</span> Trading Insights
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Subscribe to our newsletter and be the first to know about market updates, exclusive rates, and trading opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Newsletter Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gold-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-500 rounded-xl flex items-center justify-center mr-4">
                  <EnvelopeIcon className="w-6 h-6 text-ink" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Subscribe Now</h3>
                  <p className="text-gray-600 dark:text-gray-400">Get weekly updates and exclusive offers</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 dark:focus:ring-gold-500/20 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 dark:focus:ring-gold-500/20 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number for SMS updates"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 dark:focus:ring-gold-500/20 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-gold-700 dark:text-gold-400 border-gray-300 rounded focus:ring-gold-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to receive marketing communications from Aqiran Xchange. You can unsubscribe at any time.
                  </label>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`group w-full px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-600 text-ink font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-ink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </div>
                  ) : (
                    <>
                      Subscribe to Newsletter
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Success & Error Messages */}
              <AnimatePresence>
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl flex items-center text-green-700 dark:text-green-300"
                  >
                    <CheckCircleIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                    <span className="font-medium text-sm">Please check your email to confirm your subscription!</span>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mt-6 p-4 bg-gold-50 dark:bg-gold-900/20 border border-gold-100 dark:border-gold-700 rounded-xl flex items-center text-gold-700 dark:text-gold-300"
                  >
                    <ExclamationCircleIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                    <span className="font-medium text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Benefits & Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* What You'll Get */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gold-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
            >
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-gold-700 dark:text-gold-400" />
                What You&apos;ll Get
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Weekly market analysis and trends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Exclusive trading rates and offers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Early access to new services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Trading tips and strategies</span>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl p-6 shadow-xl text-ink"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">5K+</div>
                  <div className="text-ink/70 text-sm">Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">98%</div>
                  <div className="text-ink/70 text-sm">Satisfaction Rate</div>
                </div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gold-100 dark:border-gray-700"
            >
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-gold-700 dark:text-gold-400" />
                Why Subscribe?
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-gold-700 dark:text-gold-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Stay ahead of market trends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-gold-700 dark:text-gold-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Get the best rates first</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-gold-700 dark:text-gold-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Exclusive member benefits</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-gold-700 dark:text-gold-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">No spam, only valuable content</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Action */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              href="/contact"
              className="group w-full px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg text-center flex items-center justify-center"
            >
              Need Help? Contact Us
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
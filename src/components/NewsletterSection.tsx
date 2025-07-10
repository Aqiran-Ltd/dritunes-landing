"use client";

import { motion } from "framer-motion";
import { 
  CheckCircleIcon,
  BellIcon,
  ArrowRightIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function NewsletterSection() {
  return (
    <section id="newsletter" className="py-24 px-4 bg-gradient-to-br from-red-50 via-white to-red-50 relative overflow-hidden">
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
        className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full opacity-30 blur-xl"
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
        className="absolute bottom-20 right-10 w-40 h-40 bg-red-300 rounded-full opacity-25 blur-xl"
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
            className="inline-flex items-center px-6 py-3 bg-red-100 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-8 shadow-lg"
          >
            <div className="relative w-6 h-6 mr-3">
              <Image
                src="/logo/red-black.png"
                alt="Dr iTunes Logo"
                fill
                className="object-contain"
              />
            </div>
            <BellIcon className="w-4 h-4 mr-2 text-red-500" />
            Stay Updated
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Get <span className="text-gradient">Exclusive</span> Trading Insights
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
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
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-red-100 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                  <BellIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Subscribe Now</h3>
                  <p className="text-gray-600">Get weekly updates and exclusive offers</p>
                </div>
              </div>
              
              <form onSubmit={e => e.preventDefault()} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number for SMS updates"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-white"
                  />
                </div>
                
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to receive marketing communications from Dr iTunes Consult. You can unsubscribe at any time.
                  </label>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="group w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center justify-center"
                >
                  Subscribe to Newsletter
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>
              </form>
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
              className="bg-white rounded-2xl p-6 shadow-xl border border-red-100 hover:shadow-2xl transition-all duration-300"
            >
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-red-500" />
                What You&apos;ll Get
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Weekly market analysis and trends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Exclusive trading rates and offers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Early access to new services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Trading tips and strategies</span>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 shadow-xl text-white"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">5K+</div>
                  <div className="text-red-100 text-sm">Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">98%</div>
                  <div className="text-red-100 text-sm">Satisfaction Rate</div>
                </div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-red-100"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-red-500" />
                Why Subscribe?
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />
                  <span className="text-gray-700 text-sm">Stay ahead of market trends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />
                  <span className="text-gray-700 text-sm">Get the best rates first</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />
                  <span className="text-gray-700 text-sm">Exclusive member benefits</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />
                  <span className="text-gray-700 text-sm">No spam, only valuable content</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Action */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              href="/contact"
              className="group block w-full px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg text-center flex items-center justify-center"
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
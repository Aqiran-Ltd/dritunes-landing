"use client";

import { motion } from "framer-motion";
import { CheckCircleIcon, ShieldCheckIcon, ClockIcon, UserGroupIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 bg-gradient-to-br from-gold-50 via-white to-gold-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-pattern opacity-10" />
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-10 right-10 w-32 h-32 bg-gold-200 rounded-full opacity-20 blur-xl"
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-gold-100 border border-gold-200 rounded-full text-gold-700 dark:text-gold-400 text-sm font-medium mb-8 shadow-lg"
          >
            <div className="relative w-6 h-6 mr-3">
              <Image
                src="/logo/aqiran-xchange-logo.svg"
                alt="Aqiran Xchange logo"
                fill
                className="object-contain"
              />
            </div>
            <CheckCircleIcon className="w-4 h-4 mr-2 text-gold-700 dark:text-gold-400" />
            About Aqiran Xchange
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Empowering <span className="text-gradient">Ghana&apos;s Future</span> Through Digital Finance
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Founded in the heart of Tamale as Dr iTunes Consult, Aqiran Xchange has grown from a local startup into a leading gift card trading service. We offer both online trading via WhatsApp/Telegram and a physical store – giving you the flexibility to trade however you prefer.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gold-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl font-bold text-gold-700 dark:text-gold-400 mb-2">5+</div>
            <div className="text-gray-600 text-sm font-medium">Years Experience</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gold-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl font-bold text-gold-700 dark:text-gold-400 mb-2">16</div>
            <div className="text-gray-600 text-sm font-medium">Regions Served</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gold-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl font-bold text-gold-700 dark:text-gold-400 mb-2">10K+</div>
            <div className="text-gray-600 text-sm font-medium">Happy Customers</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gold-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl font-bold text-gold-700 dark:text-gold-400 mb-2">24/7</div>
            <div className="text-gray-600 text-sm font-medium">Support Available</div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gold-100 relative overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full opacity-10 -translate-y-12 translate-x-12" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-500 rounded-xl flex items-center justify-center text-ink mb-6 shadow-lg">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Security First</h3>
              <p className="text-gray-600 leading-relaxed">
                Your assets are protected with bank-grade security measures. We prioritize the safety of your transactions and personal information.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gold-100 relative overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full opacity-10 -translate-y-12 translate-x-12" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center text-ink mb-6 shadow-lg">
                <ClockIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Trading</h3>
              <p className="text-gray-600 leading-relaxed">
                Get the best rates instantly. Our platform ensures fast transactions whether you&apos;re trading gift cards.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gold-100 relative overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full opacity-10 -translate-y-12 translate-x-12" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-pink-600 rounded-xl flex items-center justify-center text-ink mb-6 shadow-lg">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trust & Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                Building lasting relationships through honesty and transparency. We believe in clear communication and fair pricing.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group px-10 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-600 text-ink font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center mx-auto"
          >
            Start Trading Today
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>
          <p className="text-gray-500 mt-4 text-sm font-medium">
            Join thousands of satisfied customers across Ghana
          </p>
        </motion.div>

        {/* Interactive Trading Hub */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24"
        >
          <div className="text-center mb-16">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Your <span className="text-gradient">Trading Hub</span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              Experience seamless trading with our comprehensive platform
            </motion.p>
          </div>

          {/* Trading Platform Interface */}
          <div className="relative max-w-7xl mx-auto">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500 via-gold-500 to-gold-600 rounded-3xl blur-3xl opacity-10" />
            
            {/* Main Platform Container */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl p-12 border border-gold-500 overflow-hidden">
              {/* Platform Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gold-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-mono text-sm ml-4">Aqiran Xchange Trading Terminal</span>
                </div>
                <div className="text-green-400 text-sm font-mono">● LIVE</div>
              </div>

              {/* Trading Grid */}
              <div className="grid grid-cols-1 gap-8">

                {/* Gift Card Trading Panel */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.3 }}
                  className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-gold-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">🎁</span>
                    </div>
                    <h4 className="text-white text-xl font-bold">Gift Card Trading</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: "Amazon Gift Card", rate: "₵15.50", status: "Available" },
                      { name: "Apple Gift Card", rate: "₵15.80", status: "Available" },
                      { name: "Google Play Card", rate: "₵15.30", status: "Available" }
                    ].map((card, idx) => (
                      <motion.div
                        key={card.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 1.4 + idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-semibold">{card.name}</div>
                            <div className="text-green-400 text-sm">● {card.status}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">{card.rate}</div>
                            <div className="text-gray-400 text-sm">per $1</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="mt-8 pt-8 border-t border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-gold-500 to-gold-600 text-ink py-3 px-6 rounded-xl font-semibold hover:from-gold-600 hover:to-gold-600 transition-all duration-300"
                  >
                    Start Trading
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                  >
                    View Rates
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300"
                  >
                    Contact Support
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
"use client";

import { motion } from "framer-motion";
import { 
  BoltIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  PhoneIcon, 
  CheckBadgeIcon, 
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";

const features = [
  {
    title: "Fast Online Trading",
    description: "Trade instantly via WhatsApp and Telegram - get rates and complete transactions remotely.",
    icon: BoltIcon,
    gradient: "from-red-500 to-red-600",
    delay: 0.1,
  },
  {
    title: "Secure Physical Store",
    description: "Visit our secure, monitored store in Tamale for in-person trading with professional staff.",
    icon: ShieldCheckIcon,
    gradient: "from-red-600 to-red-700",
    delay: 0.2,
  },
  {
    title: "Best Market Rates",
    description: "Get the highest exchange rates in Ghana with our competitive pricing and fair deals.",
    icon: ChartBarIcon,
    gradient: "from-red-500 to-pink-600",
    delay: 0.3,
  },
  {
    title: "24/7 WhatsApp Support",
    description: "Message us anytime on WhatsApp for instant rates, trading, and customer support.",
    icon: PhoneIcon,
    gradient: "from-red-600 to-orange-600",
    delay: 0.4,
  },
  {
    title: "Telegram Trading",
    description: "Trade securely via Telegram with our dedicated trading channel and instant responses.",
    icon: CheckBadgeIcon,
    gradient: "from-red-500 to-yellow-600",
    delay: 0.5,
  },
  {
    title: "Hybrid Trading Options",
    description: "Choose between online trading (WhatsApp/Telegram) or visit our physical store in Tamale.",
    icon: DevicePhoneMobileIcon,
    gradient: "from-red-600 to-purple-600",
    delay: 0.6,
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-br from-white via-red-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
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
            <CheckCircleIcon className="w-4 h-4 mr-2 text-red-500" />
            Why Choose Dr iTunes
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Your <span className="text-gradient">Trusted</span> Trading Partner
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Trade online via WhatsApp/Telegram or visit our physical store in Tamale - we offer both options for your convenience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.8 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white rounded-3xl border border-red-100 group-hover:border-red-200 transition-all duration-300 shadow-lg group-hover:shadow-xl" />
              <div className="relative p-8 h-full">
                {/* Main Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Crypto Icon Overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-1 shadow-md"
                >
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs font-bold">₵</span>
                  </div>
                </motion.div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
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
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center mx-auto"
          >
            Explore All Features
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 
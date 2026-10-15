"use client";

import { motion } from "framer-motion";
import { 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  UserGroupIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function FeaturesSection() {

  const features = [
    {
      icon: CurrencyDollarIcon,
      title: "Best Exchange Rates",
      description: "Get the most competitive rates for your gift card trades. We offer market-leading prices with no hidden fees.",
      gradient: "from-green-500 to-green-600",
      delay: 0.1
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Transactions",
      description: "Your security is our priority. All transactions are encrypted and protected with industry-standard security measures.",
      gradient: "from-blue-500 to-blue-600",
      delay: 0.2
    },
    {
      icon: ClockIcon,
      title: "24/7 Support",
      description: "Our dedicated support team is available round the clock to assist you with any questions or concerns.",
      gradient: "from-purple-500 to-purple-600",
      delay: 0.3
    },
    {
      icon: UserGroupIcon,
      title: "Expert Team",
      description: "Our experienced team of e-commerce and digital finance experts ensures you get the best guidance and service.",
      gradient: "from-orange-500 to-orange-600",
      delay: 0.4
    },
    {
      icon: GlobeAltIcon,
      title: "Online & Physical Store",
      description: "Trade online via WhatsApp/Telegram or visit our physical store in Tamale for in-person assistance.",
      gradient: "from-red-500 to-red-600",
      delay: 0.5
    },
    {
      icon: AcademicCapIcon,
      title: "Workshops & Events",
      description: "Join our educational workshops and events to learn about digital entrepreneurship and digital finance.",
      gradient: "from-indigo-500 to-indigo-600",
      delay: 0.6
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
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
            className="inline-flex items-center px-6 py-3 bg-red-100 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-8 shadow-lg"
          >
            <div className="relative w-6 h-6 mr-3">
              <Image
                src="/logo/aqiran-xchange-logo.svg"
                alt="Aqiran Xchange logo"
                fill
                className="object-contain"
              />
            </div>
            <ShieldCheckIcon className="w-4 h-4 mr-2 text-red-500" />
            Why Choose Dr iTunes
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose <span className="text-gradient">Dr iTunes</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We provide the best gift card trading experience in Ghana with unmatched security, support, and rates.
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
              transition={{ duration: 0.8, delay: feature.delay }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
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
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mt-12"
        >
          <Link href="/trade" passHref legacyBehavior>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center mx-auto"
            >
              Experience the Difference
              <CurrencyDollarIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 
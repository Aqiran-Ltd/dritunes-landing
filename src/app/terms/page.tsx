"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ScaleIcon, 
  ArrowPathIcon, 
  CheckBadgeIcon, 
  BanknotesIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  const terms = [
    {
      title: "1. The Trade of Trust",
      icon: ScaleIcon,
      content: "By using Aqiran Xchange (formerly Dr iTunes Consult), you enter into a partnership built on mutual trust. You agree to provide accurate information and use our services only for lawful purposes. We reserve the right to refuse service to anyone who violates these terms or attempts fraudulent activity.",
      color: "blue"
    },
    {
      title: "2. The Trading Workflow",
      icon: ArrowPathIcon,
      content: "When you initiate a trade, you will receive a live quote based on current market rates. Quotes are valid for a limited time (typically 15-30 minutes). Once you confirm the trade and provide the asset (Gift Card), our team verifies the asset before processing the payout.",
      color: "orange"
    },
    {
      title: "3. Identity & KYC",
      icon: CheckBadgeIcon,
      content: "To ensure a secure environment, we require KYC verification for all active traders. This involves submitting a government-issued ID and a selfie. We keep this data secure and use it solely to protect both you and our platform from unauthorized access.",
      color: "green"
    },
    {
      title: "4. Instant Payouts",
      icon: BanknotesIcon,
      content: "Once a trade is verified, we process payouts instantly to your saved Mobile Money or Bank account. While we aim for 'instant' delivery, occasional delays may occur due to network maintenance or banking system downtimes beyond our control.",
      color: "red"
    },
    {
      title: "5. Prohibited Activities",
      icon: ExclamationTriangleIcon,
      content: "Attempting to trade stolen cards, using third-party accounts for payouts, or providing false identification is strictly prohibited. Such actions will result in immediate account suspension and may be reported to the relevant authorities.",
      color: "purple"
    }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium mb-6">
            <ScaleIcon className="w-4 h-4 mr-2" />
            Terms of Partnership
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Terms of <span className="text-orange-600">Service</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Rules of engagement for a smooth and secure trading experience.
          </p>
        </motion.div>

        <div className="space-y-12">
          {terms.map((term, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className={`p-4 rounded-2xl bg-${term.color}-100 dark:bg-${term.color}-900/30 text-${term.color}-600 dark:text-${term.color}-400 shrink-0 group-hover:scale-110 transition-transform`}>
                  <term.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {term.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {term.content}
                  </p>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl text-white text-center shadow-xl"
        >
          <h3 className="text-3xl font-black mb-6">Ready to trade?</h3>
          <p className="mb-10 text-lg opacity-90 leading-relaxed max-w-2xl mx-auto">
            By continuing to use our platform, you acknowledge that you have read and agreed to these terms. Let&apos;s build a digital future together.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href="/trade"
              className="px-10 py-4 bg-white text-red-600 font-bold rounded-full hover:shadow-lg transition-all text-lg"
            >
              Start Trading Now
            </a>
            <a
              href="/contact"
              className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all text-lg"
            >
              Ask a Question
            </a>
          </div>
        </motion.div>
        
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          Last Updated: March 18, 2026
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

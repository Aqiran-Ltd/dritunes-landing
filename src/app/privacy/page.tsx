"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheckIcon, LockClosedIcon, EyeIcon, ServerIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: EyeIcon,
      content: "We collect information to provide better services to all our users. This includes your name, email address, phone number, and KYC (Know Your Customer) documents such as government-issued IDs and selfies for identity verification. We also collect device-specific information like your device model and FCM tokens for notifications.",
      color: "blue"
    },
    {
      title: "2. How We Use Information",
      icon: ServerIcon,
      content: "We use the information we collect to process your trades, verify your identity for security, and communicate with you about your account. Your email is used for transactional updates and our newsletter (subject to your confirmation). We use Postmark for reliable email delivery.",
      color: "green"
    },
    {
      title: "3. Trade Security & KYC",
      icon: ShieldCheckIcon,
      content: "Security is our top priority. Your KYC documents are used strictly for verification purposes to prevent fraud and comply with financial regulations. We use industry-standard encryption and Laravel Sanctum for secure API authentication.",
      color: "red"
    },
    {
      title: "4. Information Sharing",
      icon: LockClosedIcon,
      content: "We do not share your personal information with companies, organizations, or individuals outside of Dr iTunes Consult except in very limited circumstances, such as for legal reasons or with your explicit consent.",
      color: "purple"
    },
    {
      title: "5. Your Data Rights",
      icon: DocumentTextIcon,
      content: "You have the right to access, update, or delete your account at any time. You can manage your notification settings and unsubscribe from our newsletter using the links provided in our emails.",
      color: "orange"
    }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium mb-6">
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            Privacy First
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Privacy <span className="text-red-600">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            At Dr iTunes Consult, transparency is the foundation of our partnership with you.
          </p>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-2xl bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-600 dark:text-${section.color}-400 shrink-0`}>
                  <section.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {section.content}
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
          className="mt-20 p-8 bg-red-600 rounded-3xl text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Have questions?</h3>
          <p className="mb-8 opacity-90 leading-relaxed">
            If you have any questions about how we handle your data, our team is always here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
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

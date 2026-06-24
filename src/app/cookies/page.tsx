"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CogIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function CookiePolicy() {
  const sections = [
    {
      title: "1. What Are Cookies?",
      icon: MagnifyingGlassIcon,
      content: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.",
      color: "blue"
    },
    {
      title: "2. Essential Cookies",
      icon: ShieldCheckIcon,
      content: "These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as accessing secure areas that require authentication.",
      color: "red"
    },
    {
      title: "3. Performance and Analytics",
      icon: ChartBarIcon,
      content: "These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.",
      color: "green"
    },
    {
      title: "4. Functionality Cookies",
      icon: CogIcon,
      content: "These cookies are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences (for example, your choice of language or region).",
      color: "purple"
    },
    {
      title: "5. Managing Your Cookies",
      icon: CheckCircleIcon,
      content: "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser. If you choose to reject cookies, you may still use our website though your access to some functionality may be restricted.",
      color: "orange"
    }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-6">
            <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
            Cookie Transparency
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Cookie <span className="text-blue-600">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            How Dr iTunes Consult uses cookies to improve your digital experience.
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
          className="mt-20 p-8 bg-blue-600 rounded-3xl text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Need More Details?</h3>
          <p className="mb-8 opacity-90 leading-relaxed">
            If you have any specific questions about our use of cookies or other technologies, please get in touch with our support team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
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

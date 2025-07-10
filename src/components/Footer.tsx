"use client";

import { motion } from "framer-motion";
import { 
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowUpIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo/white.png"
                  alt="Dr iTunes Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Dr iTunes</h3>
                <p className="text-red-400 text-sm font-medium">Consult</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Ghana&apos;s premier crypto and gift card trading service. Trusted by thousands of customers across the country.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
              >
                <span className="text-white font-bold">₿</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors duration-200"
              >
                <span className="text-white font-bold">💬</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
              >
                <span className="text-white font-bold">📧</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-6 text-red-400">Our Services</h4>
            <ul className="space-y-3">
              {[
                "Crypto Trading",
                "Gift Card Exchange",
                "Online Trading",
                "Physical Store",
                "24/7 Support",
                "Best Rates"
              ].map((service, index) => (
                <motion.li
                  key={service}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-gray-300 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                >
                  {service}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-6 text-red-400">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "#home" },
                { name: "Features", href: "#features" },
                { name: "About", href: "#about" },
                { name: "Contact", href: "#contact" },
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" }
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold mb-6 text-red-400">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-red-400" />
                <span className="text-gray-300">+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-red-400" />
                <span className="text-gray-300">WhatsApp Available</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-red-400" />
                <span className="text-gray-300">info@dritunesconsult.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-red-400" />
                <span className="text-gray-300">Tamale, Northern Region</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Dr iTunes Consult. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Made with ❤️ in Ghana</span>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
            >
              <ArrowUpIcon className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 
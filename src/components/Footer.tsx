"use client";

import { motion } from "framer-motion";
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon, 
  EnvelopeIcon, 
  MapPinIcon 
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 mb-6">
                <div className="relative w-16 h-16">
                  <Image
                    src="/logo/white.png"
                    alt="Dr iTunes Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white dark:text-gray-100">Dr iTunes</h3>
                  <p className="text-red-400 font-medium">Consult</p>
                </div>
              </Link>
              <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed mb-6">
                Ghana&apos;s premier crypto and gift card trading service. Trusted by thousands for secure, fast, and reliable transactions with 24/7 support.
              </p>
              
              {/* Trust Badges */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium">Secure</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-bold text-white dark:text-gray-100 mb-6 flex items-center">
                <span className="w-8 h-0.5 bg-red-500 mr-3"></span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "#home" },
                  { name: "About Us", href: "/about" },
                  { name: "Our Services", href: "#features" },
                  { name: "Contact", href: "/contact" },
                  { name: "Privacy Policy", href: "/privacy" },
                  { name: "Terms of Service", href: "/terms" }
                ].map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="text-gray-300 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-300 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-bold text-white dark:text-gray-100 mb-6 flex items-center">
                <span className="w-8 h-0.5 bg-red-500 mr-3"></span>
                Contact Info
              </h4>
              <ul className="space-y-4">
                <li>
                  <motion.a
                    href="https://wa.me/233548434599"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 5 }}
                    className="text-gray-300 dark:text-gray-400 hover:text-green-400 dark:hover:text-green-300 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                      <PhoneIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-xs text-gray-400">24/7 Support</div>
                    </div>
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="https://t.me/dritunes"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 5 }}
                    className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Telegram</div>
                      <div className="text-xs text-gray-400">Instant Chat</div>
                    </div>
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="mailto:info@dritunesconsult.com"
                    whileHover={{ x: 5 }}
                    className="text-gray-300 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-300 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                      <EnvelopeIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-xs text-gray-400">info@dritunesconsult.com</div>
                    </div>
                  </motion.a>
                </li>
                <li>
                  <div className="text-gray-300 dark:text-gray-400 text-sm flex items-center group">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <MapPinIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-xs text-gray-400">Tamale, Ghana</div>
                    </div>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-lg font-bold text-white dark:text-gray-100 mb-6 flex items-center">
                <span className="w-8 h-0.5 bg-red-500 mr-3"></span>
                Follow Us
              </h4>
              
              {/* Social Media Icons */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  {
                    name: "Facebook",
                    href: "https://facebook.com/profile.php?id=61577944273619",
                    bgColor: "bg-gray-600 hover:bg-red-400",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )
                  },
                  {
                    name: "Telegram",
                    href: "https://t.me/dritunes",
                    bgColor: "bg-gray-600 hover:bg-red-400",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    )
                  },
                  {
                    name: "Instagram",
                    href: "https://instagram.com/dr.itunesconsult/",
                    bgColor: "bg-gray-600 hover:bg-red-400",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )
                  },
                  {
                    name: "TikTok",
                    href: "https://tiktok.com/@dritunes",
                    bgColor: "bg-gray-600 hover:bg-red-400",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    )
                  },
                  {
                    name: "X (Twitter)",
                    href: "https://x.com/dritunes",
                    bgColor: "bg-gray-600 hover:bg-red-400",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )
                  },
                  {
                    name: "YouTube",
                    href: "https://youtube.com/@dritunes",
                    bgColor: "bg-gray-600 hover:bg-red-400",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )
                  }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 ${social.bgColor} rounded-xl flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl`}
                    title={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h5 className="text-sm font-semibold text-white mb-2">Stay Updated</h5>
                <p className="text-xs text-gray-400 mb-3">Get the latest crypto news and trading tips</p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 dark:border-gray-700 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                © {currentYear} Dr iTunes Consult. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs">
                <a href="/privacy" className="text-gray-400 hover:text-red-400 transition-colors duration-200">Privacy Policy</a>
                <span className="text-gray-600">•</span>
                <a href="/terms" className="text-gray-400 hover:text-red-400 transition-colors duration-200">Terms of Service</a>
                <span className="text-gray-600">•</span>
                <a href="/cookies" className="text-gray-400 hover:text-red-400 transition-colors duration-200">Cookie Policy</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-xs">Made with ❤️ in Ghana</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Secure & Reliable</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 
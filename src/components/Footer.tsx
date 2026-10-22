"use client";

import { motion } from "framer-motion";
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon, 
  EnvelopeIcon, 
  MapPinIcon 
} from "@heroicons/react/24/outline";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";

import { usePathname } from 'next/navigation';
import { fetchSocials, Socials } from '@/lib/socialService';
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [socials, setSocials] = useState<Socials | null>(null);

  useEffect(() => {
    fetchSocials().then(setSocials);
  }, []);

  const socialLinks = [
    {
      name: "Facebook",
      href: socials?.facebook || "#",
      bgColor: "bg-gray-600 hover:bg-blue-600",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "Telegram",
      href: socials?.telegram || "#",
      bgColor: "bg-gray-600 hover:bg-blue-500",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      href: socials?.instagram || "#",
      bgColor: "bg-gray-600 hover:bg-pink-600",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: "TikTok",
      href: socials?.tiktok || "#",
      bgColor: "bg-gray-600 hover:bg-black",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    },
    {
      name: "X (Twitter)",
      href: socials?.x_twitter || "#",
      bgColor: "bg-gray-600 hover:bg-black",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: "YouTube",
      href: socials?.youtube || "#",
      bgColor: "bg-gray-600 hover:bg-gold-500",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500 via-gold-500 to-gold-500" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link href="/" className="inline-block mb-4" aria-label="Aqiran Xchange home">
                <BrandLogo variant="on-dark" className="h-12 sm:h-14" />
              </Link>
              <p className="flex items-center gap-2 mb-4 text-xs sm:text-sm text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
                Formerly Dr iTunes Consult
              </p>
              <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                Secure, fast, and reliable gift card trading with 24/7 support. Trade online or visit our physical counter in Tamale.
              </p>
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
              <h4 className="text-base font-semibold text-white mb-4 sm:mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "/" },
                  { name: "About Us", href: "/about" },
                  { name: "Rates", href: "/rates" },
                  { name: "Our Services", href: "/#features" },
                  { name: "Contact", href: "/contact" },
                  { name: "Privacy Policy", href: "/privacy" },
                  { name: "Terms of Service", href: "/terms" }
                ].map((link) => {
                  const normalize = (path: string) => path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
                  const isActive = normalize(pathname) === normalize(link.href);
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`text-sm py-1 flex items-center group transition-colors duration-200 ${
                          isActive 
                            ? "text-gold-400 font-medium" 
                            : "text-gray-300 dark:text-gray-400 hover:text-gold-400 dark:hover:text-gold-300"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 bg-gold-500 rounded-full mr-2.5 transition-opacity duration-200 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}></span>
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
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
              <h4 className="text-base font-semibold text-white mb-4 sm:mb-6">
                Contact Info
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href={socials?.whatsapp ? `https://wa.me/${socials.whatsapp.replace(/\D/g, '')}` : "https://wa.me/233548434599"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 dark:text-gray-400 hover:text-green-400 dark:hover:text-green-300 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200 shrink-0">
                      <PhoneIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-xs text-gray-400">24/7 Support</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={socials?.telegram || "https://t.me/dritunes"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200 shrink-0">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Telegram</div>
                      <div className="text-xs text-gray-400">Instant Chat</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@aqiranxchange.com"
                    className="text-gray-300 dark:text-gray-400 hover:text-gold-400 dark:hover:text-gold-300 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200 shrink-0">
                      <EnvelopeIcon className="w-4 h-4 text-ink" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-xs text-gray-400 truncate max-w-[180px]">info@aqiranxchange.com</div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="text-gray-300 dark:text-gray-400 text-sm flex items-center group">
                    <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center mr-3 shrink-0">
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
              <h4 className="text-base font-semibold text-white mb-4 sm:mb-6">
                Follow Us
              </h4>
              
              {/* Social Media Icons */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => track('Social Link Click', { platform: social.name })}
                    className={`h-11 sm:h-12 ${social.bgColor} rounded-xl flex items-center justify-center text-white transition-all duration-300 shadow-md hover:shadow-lg`}
                    title={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>

              {/* Quick WhatsApp / Store banner */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3.5">
                <p className="text-xs font-semibold text-gold-400 mb-1">Store & Trade Hours</p>
                <p className="text-xs text-gray-300">Mon – Sun: 24/7 Online</p>
                <p className="text-xs text-gray-400 mt-0.5">Physical Counter: Tamale, Ghana</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Secondary Marketplace & Trademark Disclaimer */}
        <div className="border-t border-gray-800/80 dark:border-gray-800 pt-6 pb-6 text-[11px] sm:text-xs leading-relaxed text-gray-400 dark:text-gray-400">
          <p>
            <strong className="text-gray-300 dark:text-gray-300">Independent Secondary Marketplace Disclaimer:</strong> Aqiran Xchange is an independent secondary marketplace facilitating peer and OTC gift card exchange. We are not affiliated with, endorsed by, sponsored by, or authorized by Apple Inc., Amazon.com, Inc., Valve Corporation (Steam), Google LLC, Razer Inc., Sony, Microsoft, or any other trademark owner. All registered trademarks and brand names are the property of their respective holders.
          </p>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 dark:border-gray-700 pt-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                © {currentYear} Aqiran Xchange. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs">
                <Link href="/privacy" className="text-gray-400 hover:text-gold-400 transition-colors duration-200">Privacy Policy</Link>
                <span className="text-gray-600">•</span>
                <Link href="/terms" className="text-gray-400 hover:text-gold-400 transition-colors duration-200">Terms of Service</Link>
                <span className="text-gray-600">•</span>
                <Link href="/cookies" className="text-gray-400 hover:text-gold-400 transition-colors duration-200">Cookie Policy</Link>
                <span className="text-gray-600">•</span>
                <Link href="/auth/delete-account" className="text-gray-400 hover:text-red-400 transition-colors duration-200">Delete Account</Link>
              </div>
            </div>
            
            <p className="text-gray-400 text-xs shrink-0">Made in Tamale, Ghana</p>
          </div>
        </motion.div>

        {/* Oversized wordmark, cropped by the footer edge */}
        <div aria-hidden="true" className="mt-8 -mb-20 sm:-mb-28 md:-mb-40 pointer-events-none select-none overflow-hidden max-w-full">
          <Image
            src="/logo/aqiran-xchange-full-logo-mono-white.svg"
            alt=""
            width={3017}
            height={995}
            className="w-full h-auto opacity-[0.04]"
          />
        </div>
      </div>
    </footer>
  );
} 
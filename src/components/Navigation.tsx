"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  HomeIcon,
  InformationCircleIcon,
  BanknotesIcon,
  PhoneIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { useTheme } from "@/contexts/ThemeContext";
import { useHasMounted } from "@/hooks/useHasMounted";
import { audit } from "@/lib/audit";
import { useAuth } from "@/contexts/AuthContext";
import BrandLogo from "@/components/BrandLogo";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon, 
  ChevronDownIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const mounted = useHasMounted();
  const { setTheme, resolvedTheme } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "About", href: "/about", icon: InformationCircleIcon },
    { name: "Rates", href: "/rates", icon: BanknotesIcon },
    { name: "Contact", href: "/contact", icon: PhoneIcon },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gold-100 dark:border-gray-700"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
            aria-label="Aqiran Xchange home"
          >
            <BrandLogo className="h-9 lg:h-11" priority />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              // Normalize paths by removing trailing slashes for comparison
              // Exception: if both are just "/", they match.
              const normalize = (path: string) => path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
              const isActive = normalize(pathname) === normalize(item.href);
              
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => audit.log('navigation_click', { label: item.name, href: item.href })}
                  whileHover={{ y: -2 }}
                  className={`font-medium transition-colors duration-200 relative group ${
                    isActive 
                      ? "text-gold-700 dark:text-gold-400" 
                      : "text-gray-700 dark:text-gray-300 hover:text-gold-700 dark:hover:text-gold-400"
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold-500 dark:bg-gold-400 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </motion.a>
              );
            })}
            {/* Theme Toggle */}
            <motion.button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {mounted && resolvedTheme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </motion.button>
            {/* Desktop Auth Buttons or Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 flex items-center justify-center font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mobile-hidden">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <Squares2X2Icon className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <UserCircleIcon className="w-4 h-4" />
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gold-700 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-lg"
                        >
                          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-gold-700 dark:hover:text-gold-400 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-2 bg-gold-500 text-ink font-semibold rounded-full hover:bg-gold-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Mobile */}
            <motion.button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {mounted && resolvedTheme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-gold-700 dark:hover:text-gold-400 transition-colors duration-200"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Drawer & Backdrop */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Dimmed backdrop */}
              <motion.div
                key="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              />

              {/* Drawer Container */}
              <motion.div
                key="mobile-drawer"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed top-16 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border-b border-gold-200/50 dark:border-gray-800 shadow-2xl rounded-b-3xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto"
              >
                <div className="px-4 pt-4 pb-6 space-y-4">
                  {/* Nav Links */}
                  <div className="grid grid-cols-1 gap-1">
                    {navItems.map((item) => {
                      const normalize = (path: string) => path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
                      const isActive = normalize(pathname) === normalize(item.href);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => {
                            audit.log('navigation_click', { label: item.name, href: item.href });
                            setIsOpen(false);
                          }}
                          className={`flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-base transition-all duration-200 ${
                            isActive
                              ? "text-ink dark:text-white bg-gold/15 dark:bg-gold/20 font-semibold"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isActive ? "bg-gold text-ink" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            }`}>
                              <Icon className="w-5 h-5" />
                            </span>
                            <span>{item.name}</span>
                          </div>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-gold" />
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Quick Action Button for Mobile Traders */}
                  <div className="pt-2">
                    <Link
                      href="/rates"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between w-full p-3.5 rounded-2xl bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent border border-gold-500/30 text-ink dark:text-white group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="relative flex w-2.5 h-2.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75 animate-ping" />
                          <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-crimson" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">Live Payout Rates</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">View real-time cedis per $1</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gold-700 dark:text-gold-400 underline underline-offset-2">Explore →</span>
                    </Link>
                  </div>

                  {/* User Profile or Auth Buttons */}
                  {user ? (
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                      <div className="flex items-center gap-3 px-2 py-1">
                        <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-400 flex items-center justify-center font-bold text-base">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 h-11 text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl"
                        >
                          <Squares2X2Icon className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                          className="flex items-center justify-center gap-2 h-11 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 rounded-xl"
                        >
                          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
                      <Link
                        href="/auth/login"
                        onClick={() => setIsOpen(false)}
                        className="h-12 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center text-sm"
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setIsOpen(false)}
                        className="h-12 bg-gold text-ink font-semibold rounded-2xl hover:bg-gold-400 flex items-center justify-center text-sm shadow-md"
                      >
                        Register
                      </Link>
                    </div>
                  )}

                  {/* 24/7 WhatsApp Support footer link */}
                  <div className="pt-1 text-center">
                    <a
                      href="https://wa.me/233548434599"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors py-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Tamale Store & WhatsApp Support: +233 54 843 4599
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
} 
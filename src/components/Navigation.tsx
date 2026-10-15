"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/contexts/ThemeContext";
import { useHasMounted } from "@/hooks/useHasMounted";
import { audit } from "@/lib/audit";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
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

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Rates", href: "/rates" },
    { name: "Contact", href: "/contact" },
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
            className="flex items-center space-x-3"
          >
            <div className="relative w-12 h-12 lg:w-14 lg:h-14">
              <Image
                src={mounted && resolvedTheme === 'dark' ? "/logo/aqiran-xchange-logo-white.svg" : "/logo/aqiran-xchange-logo.svg"}
                alt="Aqiran Xchange logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                Aqiran
              </h1>
              <p className="text-xs lg:text-sm text-gold-700 dark:text-gold-400 font-medium">
                Xchange
              </p>
            </div>
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
                  <div className="w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-900/20 text-gold-700 flex items-center justify-center font-bold">
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
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gold-700 hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-lg"
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

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gold-100 dark:border-gray-700"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => {
                  // Normalize paths for mobile as well
                  const normalize = (path: string) => path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
                  const isActive = normalize(pathname) === normalize(item.href);
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      whileHover={{ x: 10 }}
                      className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-gold-700 dark:text-gold-400 bg-gold-50 dark:bg-gray-800"
                          : "text-gray-700 dark:text-gray-300 hover:text-gold-700 dark:hover:text-gold-400 hover:bg-gold-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.name}
                    </motion.a>
                  );
                })}
                {user ? (
                   <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 mb-4 px-3">
                        <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/20 text-gold-700 flex items-center justify-center font-bold">
                           {user.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                           <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                     </div>
                      <Link
                        href="/dashboard"
                         onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                      >
                        Dashboard
                      </Link>
                       <button
                         onClick={() => {
                           logout();
                           setIsOpen(false);
                         }}
                         className="w-full text-left px-3 py-2 text-gold-700 hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-md"
                       >
                         Sign Out
                       </button>
                   </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                     <Link
                      href="/auth/login"
                      className="px-6 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-center"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-6 py-2 bg-gold-500 text-ink font-semibold rounded-full hover:bg-gold-600 text-center"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
} 
'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationsDropdown from '@/components/dashboard/NotificationsDropdown';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Overview';
      case '/dashboard/trade':
        return 'Trade Center';
      case '/dashboard/rates':
        return 'Live Rates';
      case '/dashboard/wallet':
        return 'Wallet';
      case '/dashboard/profile':
        return 'Profile Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {getPageTitle(pathname)}
          </h1>
          <p className="text-xs text-gray-500 font-medium hidden sm:block">
            Welcome back, {user?.name?.split(' ')[0] || 'Trader'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 focus-within:border-gold-500/50 focus-within:ring-4 focus-within:ring-gold-500/10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 w-64 shadow-sm">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400 text-gray-900 dark:text-white ml-2"
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationsDropdown />

        <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-800">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-gold-500/20 transition-all cursor-pointer">
             <div className="w-full h-full bg-gradient-to-tr from-gold-500 to-orange-500 flex items-center justify-center text-ink font-bold text-sm">
                {user?.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    user?.name?.charAt(0) || 'U'
                )}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}

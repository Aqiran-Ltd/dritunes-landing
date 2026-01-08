'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon, 
  CurrencyDollarIcon, 
  ArrowsRightLeftIcon, 
  WalletIcon, 
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,

  XMarkIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import TopBar from '@/components/dashboard/TopBar';
import VerificationBanner from '@/components/dashboard/VerificationBanner';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Trade', href: '/dashboard/trade', icon: ArrowsRightLeftIcon },
  { name: 'History', href: '/dashboard/history', icon: ClockIcon },
  { name: 'Rates', href: '/dashboard/rates', icon: CurrencyDollarIcon },
  { name: 'Wallet', href: '/dashboard/wallet', icon: WalletIcon },
  { name: 'Verification', href: '/dashboard/kyc', icon: ShieldCheckIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) return null; 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-800 relative justify-between lg:justify-start">
             <Link href="/" className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                   <Image src="/logo/red-black.png" alt="Logo" fill className="object-contain" />
                </div>
                <span className="text-xl font-bold dark:text-white">Dritunes</span>
             </Link>
             <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
               <XMarkIcon className="w-6 h-6" />
             </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              // Active state logic:
              // 1. Exact match for Dashboard root
              // 2. Starts with href for sub-pages (e.g. /dashboard/trade/create matches /dashboard/trade)
              // Active state logic:
              // 1. If item is Dashboard (/dashboard), it's active if pathname is EXACTLY /dashboard
              // 2. If item is sub-page (e.g. /dashboard/trade), it's active if pathname STARTS WITH that href
              const isActive = item.href === '/dashboard' 
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-500'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
             <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-red-100 dark:bg-red-900/20 ring-2 ring-transparent text-red-600 flex items-center justify-center font-bold">
                   <div className="w-full h-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center text-white">
                      {user.name.charAt(0)}
                   </div>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                   <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
             </div>
             <button
               onClick={() => logout()}
               className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
             >
               <ArrowLeftOnRectangleIcon className="w-5 h-5" />
               Sign Out
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
          
          <TopBar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto dark:text-gray-100">
               
               <VerificationBanner />
               
               {children}
            </div>
          </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

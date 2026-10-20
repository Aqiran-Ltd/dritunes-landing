'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CurrencyDollarIcon, 
  BanknotesIcon,
  QrCodeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       <Link 
          href="/dashboard/trade?type=sell_gift_card"
          className="group relative overflow-hidden bg-gradient-to-br from-gold-500 to-gold-600 p-6 rounded-3xl text-ink shadow-lg transition-transform hover:scale-[1.02]"
       >
          <div className="relative z-10">
             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
                <CurrencyDollarIcon className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-lg leading-tight">Sell Gift Card</h3>
             <p className="text-ink/70 text-xs mt-1">Instant Payment</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
       </Link>

       <Link 
          href="/dashboard/rates"
          className="group relative overflow-hidden bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 transition-transform hover:scale-[1.02] hover:border-gold-100 dark:hover:border-gold-900/30"
       >
          <div className="relative z-10">
             <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                <QrCodeIcon className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">View Rates</h3>
             <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Check current prices</p>
          </div>
       </Link>

       <Link 
          href="/dashboard/wallet"
          className="group relative overflow-hidden bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 transition-transform hover:scale-[1.02] hover:border-gold-100 dark:hover:border-gold-900/30"
       >
          <div className="relative z-10">
             <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3 text-green-600 dark:text-green-400">
                <BanknotesIcon className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">Withdraw</h3>
             <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">To Mobile Money</p>
          </div>
       </Link>

       <Link 
          href="/dashboard/trade"
          className="group relative overflow-hidden bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-transparent transition-transform hover:scale-[1.02] flex flex-col items-center justify-center text-center h-full"
       >
          <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-2 shadow-sm">
             <PlusIcon className="w-6 h-6 text-gray-400 dark:text-gray-300" />
          </div>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">More Actions</span>
       </Link>
    </div>
  );
}

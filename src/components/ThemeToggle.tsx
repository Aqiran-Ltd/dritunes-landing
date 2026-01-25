'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  if (!mounted) {
    return (
      <div className="p-2.5 w-11 h-11" aria-hidden="true" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {resolvedTheme === 'light' ? (
        <SunIcon className="w-6 h-6 text-orange-500" />
      ) : (
        <MoonIcon className="w-6 h-6 text-blue-400" />
      )}
    </button>
  );
}

'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import MaintenanceMode from './MaintenanceMode';
import { usePathname } from 'next/navigation';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { settings, isLoading } = useSettings();
  const pathname = usePathname();

  // Define routes that should always be accessible even in maintenance mode
  // For example, if there's a separate admin panel in the same app or specific public info
  const isExemptedRoute = pathname?.startsWith('/api') || pathname?.startsWith('/_next');

  if (!isLoading && settings?.maintenance_mode && !isExemptedRoute) {
    return <MaintenanceMode />;
  }

  return <>{children}</>;
}

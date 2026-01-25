'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Settings {
  offer_trade_via_whatsapp: boolean;
  whatsapp_number: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  trade_updates: boolean;
  marketing_updates: boolean;
}

interface SettingsContextType {
  settings: Settings | null;
  notificationSettings: NotificationSettings | null;
  isLoading: boolean;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const response: any = await api.get('/settings');
      // Handle the response format flexibly
      if (response && response.data) {
         setSettings(response.data);
      } else if (response) {
         setSettings(response);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
      // Fallback defaults if verification fails or no settings found
      setSettings({
          offer_trade_via_whatsapp: false,
          whatsapp_number: '233548434599' // fallback
      });
    }
  };

  const fetchNotificationSettings = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
        const response: any = await api.get('/notification-settings', token);
         if (response && response.data) {
             setNotificationSettings(response.data);
         } else if (response) {
             setNotificationSettings(response);
         }
    } catch (error) {
        console.error('Failed to load notification settings', error);
    }
  };

  const updateNotificationSettings = async (newSettings: Partial<NotificationSettings>) => {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("Not authenticated");
      
      try {
          // Optimistic update
          setNotificationSettings(prev => prev ? { ...prev, ...newSettings } : newSettings as NotificationSettings);
          
          await api.post('/notification-settings', newSettings, token);
      } catch (error) {
          console.error("Failed to update notification settings", error);
          fetchNotificationSettings(); // Revert
          throw error;
      }
  }

  useEffect(() => {
    const init = async () => {
        setIsLoading(true);
        await refreshSettings();
        await fetchNotificationSettings();
        setIsLoading(false);
    };
    init();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, notificationSettings, isLoading, updateNotificationSettings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

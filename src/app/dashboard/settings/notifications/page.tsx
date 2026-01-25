'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Switch } from '@headlessui/react';
import { BellIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, TagIcon } from '@heroicons/react/24/outline';

function Toggle({ label, description, checked, onChange, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex gap-4">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg h-fit">
           <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">{label}</h3>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        className={`${
          checked ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
}

export default function NotificationSettingsPage() {
  const { notificationSettings, updateNotificationSettings, isLoading } = useSettings();
  const [error, setError] = useState('');

  const handleToggle = async (key: string, value: boolean) => {
    try {
      setError('');
      await updateNotificationSettings({ [key]: value });
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    }
  };

  if (isLoading) {
      return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage how you receive updates and alerts.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 px-6">
        
        <Toggle 
            label="Email Notifications" 
            description="Receive important account alerts and trade receipts via email."
            icon={EnvelopeIcon}
            checked={notificationSettings?.email_notifications ?? false}
            onChange={(val: boolean) => handleToggle('email_notifications', val)}
        />

        <Toggle 
            label="SMS Notifications" 
            description="Get text messages for urgent security alerts and trade updates."
            icon={ChatBubbleLeftRightIcon}
            checked={notificationSettings?.sms_notifications ?? false}
            onChange={(val: boolean) => handleToggle('sms_notifications', val)}
        />

        <Toggle 
            label="Push Notifications" 
            description="Receive real-time push notifications on your device."
            icon={BellIcon}
            checked={notificationSettings?.push_notifications ?? false}
            onChange={(val: boolean) => handleToggle('push_notifications', val)}
        />

        <Toggle 
            label="Trade Updates" 
            description="Get notified when your trade status changes (e.g. Processing, Completed)."
            icon={TagIcon}
            checked={notificationSettings?.trade_updates ?? false}
            onChange={(val: boolean) => handleToggle('trade_updates', val)}
        />

        <div className="py-6"></div> 
        {/* Spacer or additional marketing toggle if needed */}
         <Toggle 
            label="Marketing & Offers" 
            description="Receive updates about new rates, bonuses, and special offers."
            icon={TagIcon}
            checked={notificationSettings?.marketing_updates ?? false}
            onChange={(val: boolean) => handleToggle('marketing_updates', val)}
        />

      </div>
    </div>
  );
}

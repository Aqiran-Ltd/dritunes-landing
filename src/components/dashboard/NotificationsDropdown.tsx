'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { playNotificationSound } from '@/lib/notificationSound';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { 
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  WalletIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: string;
  title?: string;
  body?: string;
  data: {
    title?: string;
    body?: string;
    message?: string;
    type?: string;
    reference_id?: string | number;
    status?: string;
    icon?: string;
    color?: string;
    [key: string]: any;
  };
  read_at: string | null;
  created_at: string;
}

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevUnreadRef = useRef<number | null>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const response: any = await api.get('/notifications', token);
      const list: Notification[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response) ? response : [];

      const newUnread = list.filter((n: Notification) => !n.read_at).length;

      if (prevUnreadRef.current !== null && newUnread > prevUnreadRef.current) {
        playNotificationSound();
      }
      prevUnreadRef.current = newUnread;

      setNotifications(list);
      setUnreadCount(newUnread);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Poll every 60 seconds (basic real-time simulation)
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token') || undefined;
      await api.post(`/notifications/${id}/read`, {}, token);
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('access_token') || undefined;
      await api.post('/notifications/read-all', {}, token);
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleNotificationClick = async (notification: Notification, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }
    
    const { type, reference_id, trade_number, action_url, icon } = notification.data;
    
    if (action_url) {
      router.push(action_url);
      setIsOpen(false);
      return;
    }

    if (type === 'transaction_update' || icon === 'payments') {
      router.push(`/dashboard/wallet`);
      setIsOpen(false);
    } else if (type === 'trade_created' || type === 'trade_update' || trade_number) {
      router.push(`/dashboard/history/${trade_number || reference_id}`);
      setIsOpen(false);
    }
  };

  const getIconAndColor = (data: Notification['data']) => {
    const colorType = data.color || 'info';
    const iconType = data.icon || 'info';

    let ColorClass = 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    let Icon = InformationCircleIcon;

    if (colorType === 'success') {
      ColorClass = 'text-green-500 bg-green-50 dark:bg-green-900/20';
    } else if (colorType === 'danger' || colorType === 'error') {
      ColorClass = 'text-red-500 bg-red-50 dark:bg-red-900/20';
    } else if (colorType === 'warning') {
      ColorClass = 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
    }

    if (iconType === 'check_circle') Icon = CheckCircleIcon;
    if (iconType === 'cancel' || iconType === 'error') Icon = XCircleIcon;
    if (iconType === 'warning') Icon = ExclamationTriangleIcon;
    if (iconType === 'payments') Icon = WalletIcon;

    return { Icon, ColorClass };
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && notifications.length === 0) {
        fetchNotifications();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group focus:outline-none"
      >
        <BellIcon className={`w-6 h-6 transition-colors ${isOpen ? 'text-gray-900 dark:text-white' : 'group-hover:text-red-500'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-900 animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 origin-top-right"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {loading && notifications.length === 0 ? (
                 <div className="p-8 text-center text-gray-500">
                    <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs">Loading...</p>
                 </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 px-4 text-center">
                   <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                      <BellIcon className="w-6 h-6" />
                   </div>
                   <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No system notifications</p>
                   <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">We'll let you know when something important happens.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {notifications.map((notification) => {
                    const { Icon, ColorClass } = getIconAndColor(notification.data);
                    const title = notification.title || notification.data.title || 'Notification';
                    const body = notification.body || notification.data.body || notification.data.message || 'You have a new notification.';
                    const hasAction = notification.data.type === 'trade_update' || 
                                      notification.data.type === 'trade_created' || 
                                      notification.data.type === 'transaction_update' || 
                                      !!notification.data.trade_number ||
                                      notification.data.icon === 'payments' ||
                                      !!notification.data.action_url;
                    
                    return (
                      <div
                        key={notification.id}
                        onClick={(e) => handleNotificationClick(notification, e)}
                        className={`group relative w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all duration-200 cursor-pointer flex flex-col gap-3 ${
                          !notification.read_at ? 'bg-red-50/30 dark:bg-red-900/10' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-0.5 p-2 rounded-full h-fit flex-shrink-0 ${ColorClass}`}>
                             <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className={`text-sm pr-2 ${!notification.read_at ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-200'}`}>
                                {title}
                              </p>
                              {!notification.read_at && (
                                <span className="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></span>
                              )}
                            </div>
                            <p className={`text-xs mt-1 leading-relaxed ${!notification.read_at ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                               {body}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium tracking-wide uppercase">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        
                        {hasAction && (
                          <div className="mt-1 pl-11">
                            <button
                              onClick={(e) => handleNotificationClick(notification, e)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                            >
                              View Details
                              <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

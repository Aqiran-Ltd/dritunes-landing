"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { 
  BellAlertIcon as BellRing,
  ArrowRightIcon as ArrowRight,
  CheckCircleIcon as CheckCircle2,
  XCircleIcon,
  ExclamationCircleIcon as AlertCircle,
  WalletIcon as Wallet
} from "@heroicons/react/24/outline";
import { playNotificationSound } from "@/lib/notificationSound";

interface NotificationContextType {
  fcmToken: string | null;
  requestPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  fcmToken: null,
  requestPermission: async () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestPermission = async () => {
    if (!messaging) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY // Optional, but good if needed. 
          // Usually just getToken(messaging) works if simple config. 
          // We'll stick to simple first.
        });
        if (token) {
          console.log("FCM Token:", token);
          setFcmToken(token);
          // Here you would typically send this token to your server
        }
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (messaging) {
      // Handle foreground messages
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        playNotificationSound();

        const data = payload.data || {};
        const type = data.type as string | undefined;
        const referenceId = data.reference_id as string | undefined;
        const tradeNumber = data.trade_number as string | undefined;
        const status = data.status as string | undefined;
        const icon = data.icon as string | undefined;

        let Icon = BellRing;
        let iconColor = "text-blue-500";
        let bgColor = "bg-blue-50 dark:bg-blue-900/20";
        let targetRoute = "/dashboard";

        if (type === "transaction_update" || icon === "payments") {
          targetRoute = "/dashboard/wallet";
          Icon = Wallet;
          if (status === "completed" || status === "approved") {
            iconColor = "text-green-500";
            bgColor = "bg-green-50 dark:bg-green-900/20";
          } else if (status === "failed" || status === "rejected") {
            iconColor = "text-red-500";
            bgColor = "bg-red-50 dark:bg-red-900/20";
          }
        } else if (type === "trade_created" || type === "trade_update" || tradeNumber) {
          const idToUse = tradeNumber || referenceId;
          targetRoute = idToUse ? `/dashboard/history/${idToUse}` : "/dashboard/history";
          if (status === "approved" || status === "completed") {
            Icon = CheckCircle2;
            iconColor = "text-green-500";
            bgColor = "bg-green-50 dark:bg-green-900/20";
          } else if (status === "rejected" || status === "failed") {
            Icon = XCircleIcon;
            iconColor = "text-red-500";
            bgColor = "bg-red-50 dark:bg-red-900/20";
          } else if (status === "disputed") {
            Icon = AlertCircle;
            iconColor = "text-amber-500";
            bgColor = "bg-amber-50 dark:bg-amber-900/20";
          }
        }

        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-sm w-full bg-white dark:bg-slate-900 shadow-xl rounded-xl pointer-events-auto flex flex-col border border-gray-100 dark:border-slate-800 overflow-hidden`}
          >
            <div className="p-4 flex items-start">
              <div className={`flex-shrink-0 p-2 rounded-full ${bgColor}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <div className="ml-3 flex-1 pt-0.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {payload.notification?.title || "New Notification"}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {payload.notification?.body}
                </p>
              </div>
            </div>
            {(type === "trade_created" || type === "trade_update" || type === "transaction_update") && (
              <div className="border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex divide-x divide-gray-100 dark:divide-slate-700">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    router.push(targetRoute);
                  }}
                  className="w-full border border-transparent rounded-none flex items-center justify-center py-3 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none transition-colors"
                >
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ), { duration: 5000 });
      });

      return () => unsubscribe();
    }
  }, [router]);

  // Auto request on mount
  useEffect(() => {
    requestPermission();
  }, []);

  // Register device with backend when we have a user and a token
  useEffect(() => {
    const registerDevice = async () => {
      if (!fcmToken) return;
      
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return;

      // Get or create a persistent device ID
      let deviceId = localStorage.getItem("device_id");
      if (!deviceId) {
        deviceId = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem("device_id", deviceId);
      }

      try {
        // We use the api utility but we need to ensure we pass the token if it's not automatically picked up structure-wise
        // But api wrapper handles headers manually in some calls. 
        // Let's use the explicit token we got from localStorage.
        await api.post("/devices", {
          device_id: deviceId,
          type: "web",
          fcm_token: fcmToken,
          meta_data: {
            user_agent: navigator.userAgent,
            platform: navigator.platform
          }
        }, accessToken);
        console.log("Device registered with backend successfully");
      } catch (error) {
        console.error("Failed to register device:", error);
      }
    };

    registerDevice();
  }, [fcmToken]); // We rely on token presence. If user logs out/in, token might stay same, but we might want to re-register? 
  // Actually, if we just check for token, we might miss the auth state. 
  // But wait, we can't easily check 'user' here without importing useAuth, which might cause circular dep if Auth uses Notification?
  // Layout: AuthProvider -> NotificationProvider. So Notification can use Auth.
  
  return (
    <NotificationContext.Provider value={{ fcmToken, requestPermission }}>
      {children}
    </NotificationContext.Provider>
  );
};

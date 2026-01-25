"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (messaging) {
      // Handle foreground messages
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src="/logo/red-black.png"
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {payload.notification?.title || "New Notification"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {payload.notification?.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ));
      });

      return () => unsubscribe();
    }
  }, []);

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

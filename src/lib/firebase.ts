import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// isSupported() is async, so a plain exported variable would still be null
// when components first read it. Callers await this instead.
let messagingPromise: Promise<Messaging | null> | null = null;

export function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  messagingPromise ??= isSupported()
    .then((supported) => (supported ? getMessaging(app) : null))
    .catch(() => null);
  return messagingPromise;
}

/**
 * Registers the messaging service worker, handing it this build's Firebase
 * config through the script URL. The worker is a static file that can't read
 * NEXT_PUBLIC_* env vars, so this keeps one source of truth for the config.
 */
export function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration> {
  const params = new URLSearchParams(
    Object.entries(firebaseConfig).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string" && entry[1] !== "",
    ),
  );
  return navigator.serviceWorker.register(`/firebase-messaging-sw.js?${params}`);
}

export { app };

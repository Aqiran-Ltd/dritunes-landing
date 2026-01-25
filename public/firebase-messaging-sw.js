importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker.
// These values are hardcoded because this file is served as a static asset
// and doesn't have access to process.env at build time in this setup.
firebase.initializeApp({
  apiKey: "AIzaSyDP1cuweCJHKGcz0z61KIcfrCbufsHc3NQ",
  authDomain: "dritunes-consult.firebaseapp.com",
  projectId: "dritunes-consult",
  storageBucket: "dritunes-consult.firebasestorage.app",
  messagingSenderId: "1028409005424",
  appId: "1:1028409005424:web:f92d833898c456661dabb5"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo/red-black.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

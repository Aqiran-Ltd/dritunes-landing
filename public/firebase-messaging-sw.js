// Keep this version in step with the "firebase" package in package.json.
importScripts('https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.8.0/firebase-messaging-compat.js');

// The Firebase config arrives as query parameters on this script's URL
// (see registerMessagingServiceWorker in src/lib/firebase.ts), because a static
// file in public/ can't read NEXT_PUBLIC_* env vars.
const config = Object.fromEntries(new URL(self.location.href).searchParams);

if (config.apiKey && config.projectId && config.messagingSenderId && config.appId) {
  firebase.initializeApp(config);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function (payload) {
    // Pushes with a `notification` block are displayed by Firebase itself;
    // showing them here too would produce a duplicate. Only data-only pushes
    // need to be displayed by hand.
    if (payload.notification) return;

    const data = payload.data || {};
    if (!data.title && !data.body) return;

    self.registration.showNotification(data.title || 'Aqiran Xchange', {
      body: data.body || '',
      icon: '/icon-192.png',
      data,
    });
  });
} else {
  console.warn('[firebase-messaging-sw.js] Missing Firebase config; push notifications are disabled.');
}

// Open the related page when a notification we displayed is clicked.
self.addEventListener('notificationclick', function (event) {
  const data = event.notification.data || {};
  // Firebase-displayed notifications handle their own clicks.
  if (data.FCM_MSG) return;

  event.notification.close();
  const id = data.trade_number || data.reference_id || data.trade_id;
  let path = '/dashboard';
  if (data.type === 'transaction_update') path = '/dashboard/wallet';
  else if (id) path = '/dashboard/history/' + id;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clients) {
      const url = new URL(path, self.location.origin).href;
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});

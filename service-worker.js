// ====================================================
// 🔥 PWA Service Worker + Firebase Cloud Messaging
// ====================================================

// --- Bagian 1: PWA Cache Setup ---
const CACHE_NAME = 'barakahku-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/data/doa.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// Install SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate SW & bersihkan cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch dari cache dulu, fallback ke network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// ====================================================
// --- Bagian 2: Firebase Cloud Messaging ---
// ====================================================

// Import Firebase SDKs (gunakan importScripts karena ini SW)
importScripts('https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging.js');

// Konfigurasi Firebase — sama persis dengan di app.js / index.html
firebase.initializeApp({
  apiKey: "AIzaSyDbtIz_-mXJIjkFYOYBfPGq_KSMUTzQgwQ",
  authDomain: "barakahku-app.firebaseapp.com",
  projectId: "barakahku-app",
  storageBucket: "barakahku-app.firebasestorage.app",
  messagingSenderId: "510231053293",
  appId: "1:510231053293:web:1d6b6cf3e62bde252b5de4",
  measurementId: "G-HMQP1RTSQV"
});

// Inisialisasi Firebase Messaging
const messaging = firebase.messaging();

// Saat pesan diterima di background
messaging.onBackgroundMessage((payload) => {
  console.log('[service-worker.js] Pesan background diterima:', payload);

  const notificationTitle = payload.notification?.title || 'Notifikasi Baru';
  const notificationOptions = {
    body: payload.notification?.body || 'Anda memiliki pesan baru.',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-72.png',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Tangani klik notifikasi
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(targetUrl));
});

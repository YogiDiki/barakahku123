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
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// Install SW
self.addEventListener('install', event => {
  console.log('✅ Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Caching files...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate SW & bersihkan cache lama
self.addEventListener('activate', event => {
  console.log('✅ Service Worker activated');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('🗑️ Deleting old cache:', key);
              return caches.delete(key);
            })
      );
    })
  );
  return self.clients.claim();
});

// Fetch dari cache dulu, fallback ke network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(err => {
        console.error('❌ Fetch error:', err);
      });
    })
  );
});

// ====================================================
// 🔥 Firebase Messaging Service Worker (Compat Version)
// ====================================================

// Import Firebase scripts - gunakan versi COMPAT untuk service worker
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Konfigurasi Firebase — sama dengan di app.js
firebase.initializeApp({
  apiKey: "AIzaSyDbtIz_-mXJIjkFYOYBfPGq_KSMUTzQgwQ",
  authDomain: "barakahku-app.firebaseapp.com",
  projectId: "barakahku-app",
  storageBucket: "barakahku-app.firebasestorage.app",
  messagingSenderId: "510231053293",
  appId: "1:510231053293:web:1d6b6cf3e62bde252b5de4",
  measurementId: "G-HMQP1RTSQV"
});

const messaging = firebase.messaging();

// Saat pesan diterima di background
messaging.onBackgroundMessage((payload) => {
  console.log('[service-worker.js] 📩 Pesan background diterima:', payload);
  
  const notificationTitle = payload.notification?.title || 'Notifikasi Baru';
  const notificationOptions = {
    body: payload.notification?.body || 'Anda memiliki pesan baru.',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-192.png',
    tag: 'barakahku-notification',
    requireInteraction: false
  };
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
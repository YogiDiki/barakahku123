// ====================================================
// 🔥 Firebase Cloud Messaging Service Worker ONLY
// File ini HARUS bernama: firebase-messaging-sw.js
// File ini HARUS berada di root folder
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
  console.log('[firebase-messaging-sw.js] 📩 Pesan background diterima:', payload);
  
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

console.log('✅ Firebase Messaging Service Worker ready');
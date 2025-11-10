// ====================================================
// 🔥 Firebase Cloud Messaging Service Worker ONLY
// File: firebase-messaging-sw.js (HARUS di root)
// ====================================================

try {
    // Import Firebase scripts - gunakan versi COMPAT untuk service worker
    importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');
  
    console.log('✅ Firebase scripts loaded');
  
    // Konfigurasi Firebase
    firebase.initializeApp({
      apiKey: "AIzaSyDbtIz_-mXJIjkFYOYBfPGq_KSMUTzQgwQ",
      authDomain: "barakahku-app.firebaseapp.com",
      projectId: "barakahku-app",
      storageBucket: "barakahku-app.firebasestorage.app",
      messagingSenderId: "510231053293",
      appId: "1:510231053293:web:1d6b6cf3e62bde252b5de4",
      measurementId: "G-HMQP1RTSQV"
    });
  
    console.log('✅ Firebase initialized in SW');
  
    const messaging = firebase.messaging();
  
    // Handler untuk pesan background
    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] 📩 Background message received:', payload);
      
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
  
  } catch (error) {
    console.error('❌ Firebase Messaging SW initialization failed:', error);
  }
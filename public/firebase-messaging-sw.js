// importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');
importScripts('env.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');

// Set Firebase configuration, once available
// "Default" Firebase configuration (prevents errors)
const projectId = process.env.projectId;

const firebaseConfig = {
  projectId,
  apiKey: process.env.apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
}

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Configure message handler 
messaging.onBackgroundMessage((payload) => {
  console.info('[firebase-messaging-sw.js] Received background message ', payload);
  const { icon, body, title } = payload.notification;
  self.registration.showNotification(title, { body, icon });
}); 

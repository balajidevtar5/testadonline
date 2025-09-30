// Scripts for Firebase and Firebase Messaging
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');

// Check if Firebase is already initialized to avoid re-initialization
const firebaseConfig = {
  apiKey: "AIzaSyCfejHMuLX1Fon8pjMNSgb1AgPh8ys-EEo",
  authDomain: "adonline-84a70.firebaseapp.com",
  projectId: "adonline-84a70",
  storageBucket: "adonline-84a70.firebasestorage.app",
  messagingSenderId: "612453146634",
  appId: "1:612453146634:web:680423b16c5433614afff3",
  measurementId: "G-V5B4DSKC9B"
};
if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);

   
  } catch (error) {
    console.error('Error initializing Firebase in service worker:', error);
  }
}

// Retrieve firebase messaging
self.addEventListener('push', function (event) {
  if (event.data) {
    const payload = event.data.json();
    const notificationTitle = payload.notification.title || 'New Notification';
    const notificationOptions = {
      body: payload.data.body || '',
      icon: '/512X512.svg', // Replace with path to your app icon
      image: payload.data.image || "/512X512.svg",
      data: payload.data || {},
      tag: 'notification-1' // Giving a tag to replace existing notifications
    };

    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "NOTIFICATION_RECEIVED",
          payload: payload,
        });
      });
    });

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});


self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  // logEffect(logEvents.Notification_Click)
  const postId = event?.notification?.data?.postid; // Extract postId from notification data

  const urlToOpen = new URL(event.notification.data.SharePostUrl || '/', self.location.origin).href;
  const notificationId = event?.notification?.data?.notificationId

  // const logPromise = clients.matchAll({
  //   type: 'window',
  //   includeUncontrolled: true
  // }).then((windowClients) => {
  //   for (const client of windowClients) {
  //     // Send to all clients (the first one will handle it)
  //     client.postMessage({
  //       type: 'LOG_EVENT',
  //       eventData: {
  //         eventName: 'notification_click',
  //         eventParams: {
  //           post_id: postId,
  //           notification_id: notificationId
  //         }
  //       }
  //     });
  //   }
  // });

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
    .then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients?.length; i++) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url === urlToOpen && 'focus' in client) {

          client.postMessage({ type: 'NOTIFICATION_CLICK', postId, notificationId });
          // const payload = {
          //   SelectAll: false,
          //   NotificationId: notificationId
          // }
          // ReadInAppNotifications(payload)
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen).then((windowClient) => {
          if (windowClient) {
            // Wait for the new window to load, then send the postId
            // const payload = {
            //   SelectAll: false,
            //   NotificationId: notificationId
            // }
            // ReadInAppNotifications(payload)
            windowClient.postMessage({ type: 'NOTIFICATION_CLICK', postId, notificationId });

          }
        });
      }
    });

  event.waitUntil(Promise.all([promiseChain]));;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {

      // Force update to get the latest service worker
      registration.update();
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

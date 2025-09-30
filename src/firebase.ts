import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { getAnalytics, logEvent } from "firebase/analytics";
import { storeData } from "./utils/localstorage";
import { firebaseConfig } from "./libs/constant";
import { detectPWAEnvironment } from "./utils/pwaUtils";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const analytics = getAnalytics(firebaseApp);


export const getOrRegisterServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const existingRegistration = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js");
      if (existingRegistration) {
        return existingRegistration;
      }

      return navigator.serviceWorker.register("/firebase-messaging-sw.js", {
        scope: "/firebase-messaging-sw.js",
      });
    } catch (error) {
      throw new Error("Service Worker registration failed: " + error.message);
    }
  }
  throw new Error("The browser does not support service workers.");
};

/**
 * Fetch Firebase Cloud Messaging (FCM) token
 */
export const getFirebaseToken = async () => {
  try {
    const serviceWorkerRegistration = await getOrRegisterServiceWorker();
    const token = await getToken(messaging, { serviceWorkerRegistration });
    if (token) {
      return token;
    } else {
      console.warn("No FCM token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching FCM token:", error);
    return null;
  }
};


/**
 * Set up notifications and request permissions
 */
export const setupNotifications = async (callback) => {

  try {
    const { isPWAInstalled, platform } = await detectPWAEnvironment();
    if (isPWAInstalled && platform === "Android") {
      console.log("⏩ Skipping notification setup: Android PWA installed");
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const token = await getFirebaseToken();
      if (token) {
        await storeData("firebaseToken", token);
      }

      // Execute the callback with the token
      if (callback && typeof callback === "function") {
        callback(token);
      }
    } else {
      console.warn("Notification permission denied.");
      if (callback && typeof callback === "function") {
        callback(null);
      }
    }
    // Handle foreground notifications
    onMessage(messaging, (payload) => {
      
      // Handle or display notifications in your app
    });
  } catch (error) {
    console.error("Error setting up notifications:", error);
    if (callback && typeof callback === "function") {
      callback(null);
    }
  }
};

/**
 * Log install referrer for Firebase Analytics
 */
export const logInstallReferrer = () => {
  const urlParams = new URLSearchParams(window.location.search);


  const referrer = urlParams.get("referrer");
  if (referrer) {
    try {
      logEvent(analytics, "install_referrer", { referrer });
    } catch (error) {
      console.error("Error logging to Firebase Analytics:", error);
    }
  } else {
    console.warn("Install Referrer not found in URL.");
  }
};

export { messaging,logEvent,analytics };

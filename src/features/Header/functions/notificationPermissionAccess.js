import { message } from "antd";
import { setupNotifications } from "../../../firebase";
import { fireBaseTokenStore } from "../../../redux/services/common.api";
import { LOGEVENTCALL, logEvents } from "../../../libs/constant";
import { logEffect } from "../../../utils/logger";
import { detectPWAEnvironment } from "../../../utils/pwaUtils";
import { storeData } from "../../../utils/localstorage";

const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const isIOSPWA = () => {
  return (
    isIOSDevice() &&
    (window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches)
  );
};

const showNotificationMessage = (messageText) => {
  const isIOS = isIOSDevice();
  const isPWA = isIOSPWA();
  
  console.log("📢[notificationPermissionAccess.js:28]: 🔍 Platform Info", { isIOS, isPWA, userAgent: navigator.userAgent });
  
  if (isIOS) {
   
    if (isPWA) {
      alert(messageText);
    } else {
      try {
        
        setTimeout(() => {
          message.info(messageText, 5);
        }, 200);
        
        
        setTimeout(() => {
          console.log("📢[notificationPermissionAccess.js:42]: ", '⚠️ Fallback: Using native alert for iOS Safari');
          alert(messageText);
        }, 1000);
        
      } catch (error) {
        console.warn('❌ Antd message failed on iOS, using alert:', error);
        alert(messageText);
      }
    }
  } else {
    // Non-iOS devices - use regular Antd message
    console.log("📢[notificationPermissionAccess.js:53]: ", '🖥️ Using regular Antd message for non-iOS device');
    message.info(messageText, 5);
  }
};

export const NotificationPermissionAccess = async ({ 
  loginUserData, 
  loginState, 
  t 
}) => {
  const isIOS = isIOSDevice();
  const isPWA = isIOSPWA();
  console.log("📢[notificationPermissionAccess.js:65]: ", { 
    isIOS, 
    isPWA, 
    permission: typeof Notification !== 'undefined' ? Notification.permission : 'undefined'
  });
  let permission;
  if (typeof Notification === 'undefined') {
    permission = 'unsupported';
  } else {
    permission = Notification.permission;
  }

  if (permission === "denied" || permission === "default" || permission === 'unsupported') {
    const messageText = t("toastMessage.You have blocked notification. Please enable them from settings to receive the notification.");
    
    console.log('📵 Notification permission denied/default, showing message');
    showNotificationMessage(messageText);
    
    if (LOGEVENTCALL) {
      logEffect(logEvents.Notification_Click);
    }
    return;
  }

  const init = async () => {
    if (!loginUserData && !loginState) return;

    const env = await detectPWAEnvironment();
    const platform = env.platform;
    const isPwa = env.isPWAInstalled;
    const userId = loginUserData?.data?.[0]?.id || loginState?.data?.[0]?.id;

    if (!userId) {
      console.warn("No valid user ID found for Firebase token registration.");
      return;
    }

    if (platform === "iOS") {
      window.receiveDeviceToken = async (token) => {
        console.log("📲 Received iOS FCM token from native:", token);
        if (token) {
          await storeFirebaseToken(token, userId);
          await storeData("firebaseToken", token);
        } else {
          console.warn("⚠️ Native returned an empty token.");
        }
      };

      if (window.webkit?.messageHandlers?.["get-fcm-token"]) {
        window.webkit.messageHandlers["get-fcm-token"].postMessage(null);
        console.log("📡 Requested token from native iOS.");
      } else {
        console.warn("❌ Native 'get-fcm-token' handler not available.");
      }
    } else {
      setupNotifications(async (token) => {
        if (token) {
          await storeFirebaseToken(token, userId);
        } else {
          console.warn("No Firebase token generated.");
        }
      });
    }
  };

  init();
};

const storeFirebaseToken = async (token, id) => {
  if (token) {
    const payload = {
      token: token,
      userId: id,
    };
    await fireBaseTokenStore(payload);
  }
};

 
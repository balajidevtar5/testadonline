export function isRunningAsPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
  }
  export function getPlatform() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(ua)) return 'Android';
  if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
  if (/Macintosh/.test(ua) && 'ontouchend' in document) return 'iOS';

  return 'Web';
}

export async function detectPWAEnvironment() {
  const platform = getPlatform();
  const isPWAInstalled = isRunningAsPWA();
  return { platform, isPWAInstalled };
}
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your_secret_key'; // Replace with a strong secret key

// Encrypt function
const encrypt = (text) => CryptoJS.AES.encrypt(text, SECRET_KEY).toString();

// Decrypt function
const decrypt = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};

// Custom language detector plugin (fixing the issue)
const CustomLanguageDetector = {
  type: 'languageDetector',
  detect: () => {
    const encryptedLang = Cookies.get('userLang');
    return encryptedLang ? decrypt(encryptedLang) : null;
  },
  init: () => {}, // Required for i18next
  cacheUserLanguage: (lng) => {
    const encryptedLang = encrypt(lng);
    Cookies.set('userLang', encryptedLang, { expires: 7, secure: true, sameSite: 'None' });
  },
};

async function getTranslationPath() {
  let manifest;
  try{
  // Fetch the manifest if on production (assuming BETA URL for production)
    const response = await fetch('/BETA/web/asset-manifest.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.status}`);
    }
    manifest = await response.json();
  } catch (error) {
    console.error(error);
  }

  return (lng) => {
    const defaultPath = `/locales/${lng}/translation.json`;
    if (manifest) {
      const hashedPath = manifest[`locales/${lng}/translation.json`];
      return hashedPath || defaultPath;
    }
    return defaultPath;
  };
}

getTranslationPath().then((loadPathResolver) => {
  i18n
    .use(HttpApi)
    .use(LanguageDetector) // Default language detector for fallback
    .use(CustomLanguageDetector) // Custom encrypted language detector
    .use(initReactI18next)
    .init({
      supportedLngs: ['en', 'es', 'fr', 'gu', 'hi'],
      fallbackLng: 'en',
      detection: {
        order: ['customCookieDetector', 'cookie', 'htmlTag', 'path', 'subdomain'],
        caches: ['cookie'],
      },
      backend: {
        loadPath: (lng) => loadPathResolver(lng),
      },
      react: {
        useSuspense: false,
      },
    });
});

export default i18n;

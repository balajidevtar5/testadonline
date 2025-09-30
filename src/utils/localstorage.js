import { FRONTEND_VERSION } from "../libs/constant";
import { removeStoredData, setStoredData } from "../redux/slices/storageSlice";
import { store } from "../redux/store";
import Cookies from "js-cookie"
export const isStorageAvailable = (type) => {
    try {
      const storage = window[type];
      const testKey = '__test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  export const areCookiesEnabled = () => {
    try {
      document.cookie = 'testCookie=1';
      const cookiesEnabled = document.cookie.includes('testCookie');
      document.cookie = 'testCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // Clean up
      return cookiesEnabled;
    } catch (e) {
      return false;
    }
  };

  const memoryStorage = {};

  const isLocalStorageAvailable = () => {
    try {
      localStorage.setItem("test", "1");
      localStorage.removeItem("test");
      return true;
    } catch (error) {
      return false;
    }
  };

  
  const getVersionedKey = (key) => `${key}_${FRONTEND_VERSION}`;

  const findExistingVersionedKey = (baseKey) => {
    if (!isLocalStorageAvailable()) return null;
    
    // Get all keys from localStorage
    const allKeys = Object.keys(localStorage);
    
    // Find any key that starts with the base key and includes a version
    return allKeys.find(key => key.startsWith(`${baseKey}_`));
  };
  
  export const storeData = async (key, value) => {
    const versionedKey = getVersionedKey(key);
    const baseKey = key;
    
    // Only stringify if value is provided and is an object
    const shouldStoreNewValue = value !== undefined;
    const dataToStore = shouldStoreNewValue && typeof value === "object" && value !== null
      ? JSON.stringify(value)
      : value;
      
    // Try localStorage
    if (isLocalStorageAvailable()) {
      try {
        // Check if a versioned key already exists
        const existingVersionedKey = findExistingVersionedKey(baseKey);
        // console.log("Found existing versioned key:", existingVersionedKey);
        
        if (existingVersionedKey) {
          // Get existing value before removing it
          const existingValue = localStorage.getItem(existingVersionedKey);
          
          // If we're storing a new value, use that. Otherwise, use the existing value
          const valueToStore = shouldStoreNewValue ? dataToStore : existingValue;
          
          // Remove old versioned key
          if (existingVersionedKey !== versionedKey) {
            localStorage.removeItem(existingVersionedKey);
            // console.log(`Removed old version key: ${existingVersionedKey}`);
          }
          
          // Store value with new versioned key
          localStorage.setItem(versionedKey, valueToStore);
          // console.log(`✅ Migrated/stored value to ${versionedKey}`);
          return;
        }
        
        // If no existing key found and we have a new value to store
        if (shouldStoreNewValue) {
          localStorage.setItem(versionedKey, dataToStore);
          // console.log(`✅ Stored new data in localStorage with key: ${versionedKey}`);
          return;
        }
        
      } catch (error) {
        // console.warn("⚠️ localStorage write error:", error);
      }
    }
    
    // Fallback to Redux if localStorage is unavailable
      store.dispatch(setStoredData({ key: versionedKey, value }));
      // console.log(`✅ Data stored in Redux with key: ${versionedKey}`);
  };
  
  export const getData = async (key) => {
    const versionedKey = getVersionedKey(key);
  
    // Try localStorage
    if (isLocalStorageAvailable()) {
      try {
        const data = localStorage.getItem(versionedKey);
        if (data !== null) {
          // console.log(`✅ Data retrieved from localStorage with key: ${versionedKey}`);
          try {
            return JSON.parse(data);
          } catch {
            return data;
          }
        }
      } catch (error) {
        // console.warn("⚠️ localStorage read error:", error);
      }
    }
  
    // Try Redux
    const reduxState = store.getState().storage[versionedKey];
    if (reduxState !== undefined) {
      // console.log(`✅ Data retrieved from Redux with key: ${versionedKey}`);
      return JSON.parse(reduxState);
    }
  
    // Last fallback to in-memory storage
    if (memoryStorage[versionedKey] !== undefined) {
      // console.log(`✅ Data retrieved from memory storage with key: ${versionedKey}`);
      return memoryStorage[versionedKey];
    }
  
    // console.warn(`❌ Data not found for key: ${versionedKey}`);
    return null;
  };
  
  export const removeItem = async (key) => {
    const versionedKey = getVersionedKey(key);
  
    // Try removing from Cookies first
  //   if(areCookiesEnabled()){
  //   try {
  //     Cookies.remove(versionedKey);
  //     console.log(`✅ '${versionedKey}' removed from cookies`);
  //   } catch (error) {
  //     console.warn("⚠️ Cookies removal error:", error);
  //   }
  // }
  
    // Try removing from localStorage
    if (isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(versionedKey);
        // console.log(`✅ '${versionedKey}' removed from localStorage`);
      } catch (error) {
        // console.warn("⚠️ localStorage removal error:", error);
      }
    }
  
    // Remove from Redux
    store.dispatch(removeStoredData(versionedKey));
    // console.log(`✅ '${versionedKey}' removed from Redux`);
  
    // Remove from memory storage
    if (versionedKey in memoryStorage) {
      delete memoryStorage[versionedKey];
      // console.log(`✅ '${versionedKey}' removed from memory storage`);
    }
  };
  

 
  
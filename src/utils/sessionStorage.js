import { FRONTEND_VERSION } from "../libs/constant";
import { removeStoredData, setStoredData } from "../redux/slices/storageSlice";
import { store } from "../redux/store";
import Cookies from "js-cookie";

export const isSessionStorageAvailable = () => {
  try {
    sessionStorage.setItem("test", "1");
    sessionStorage.removeItem("test");
    return true;
  } catch (error) {
    return false;
  }
};

const memoryStorage = {};

const getVersionedKey = (key) => `${key}_${FRONTEND_VERSION}`;

const findExistingVersionedKey = (baseKey) => {
  if (!isSessionStorageAvailable()) return null;
  const allKeys = Object.keys(sessionStorage);
  return allKeys.find((key) => key.startsWith(`${baseKey}_`));
};

export const storeSessionData = async (key, value) => {
  const versionedKey = getVersionedKey(key);
  const baseKey = key;
  const shouldStoreNewValue = value !== undefined;
  const dataToStore = shouldStoreNewValue && typeof value === "object" && value !== null ? JSON.stringify(value) : value;

  if (isSessionStorageAvailable()) {
    try {
      const existingVersionedKey = findExistingVersionedKey(baseKey);
      if (existingVersionedKey) {
        const existingValue = sessionStorage.getItem(existingVersionedKey);
        const valueToStore = shouldStoreNewValue ? dataToStore : existingValue;
        if (existingVersionedKey !== versionedKey) {
          sessionStorage.removeItem(existingVersionedKey);
        }
        sessionStorage.setItem(versionedKey, valueToStore);
        return;
      }
      if (shouldStoreNewValue) {
        sessionStorage.setItem(versionedKey, dataToStore);
        return;
      }
    } catch (error) {}
  }

  store.dispatch(setStoredData({ key: versionedKey, value }));
};

export const getSessionData = async (key) => {
  const versionedKey = getVersionedKey(key);
  if (isSessionStorageAvailable()) {
    try {
      const data = sessionStorage.getItem(versionedKey);
      if (data !== null) {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      }
    } catch (error) {}
  }
  const reduxState = store.getState().storage[versionedKey];
  if (reduxState !== undefined) {
    return JSON.parse(reduxState);
  }
  if (memoryStorage[versionedKey] !== undefined) {
    return memoryStorage[versionedKey];
  }
  return null;
};

export const removeSessionItem = async (key) => {
  const versionedKey = getVersionedKey(key);
  if (isSessionStorageAvailable()) {
    try {
      sessionStorage.removeItem(versionedKey);
    } catch (error) {}
  }
  store.dispatch(removeStoredData(versionedKey));
  if (versionedKey in memoryStorage) {
    delete memoryStorage[versionedKey];
  }
};

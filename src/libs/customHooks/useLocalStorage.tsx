import { useState, useEffect } from "react";
import { getData, storeData, removeItem } from "../../utils/localstorage";

export const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  // Fetch stored value from cookies/localStorage/Redux on mount
  useEffect(() => {
    const fetchStoredValue = async () => {
      try {
        const item = await getData(key);
        setStoredValue(item !== null ? item : initialValue);
      } catch (error) {
        console.error("Error fetching storage data:", error);
        setStoredValue(initialValue);
      }
    };
    fetchStoredValue();
  }, [key]); // Re-run if key changes

  // Function to update the stored value
  const setValue = async (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await storeData(key, valueToStore);
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const clearValue = async () => {
    try {
      await removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  return [storedValue, setValue, clearValue];
};

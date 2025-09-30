import { useCookies } from "react-cookie";
import { encryptData, decryptData, isEncrypted } from "./cookieUtils";
import Cookies from "js-cookie";

export const getDecryptedCookie = (value) => {
  const cookieValue = Cookies.get("adminAuth");

  if (!cookieValue && !value) {
    return null;
  }

  const valueToProcess = value || cookieValue;

  if (!isEncrypted(valueToProcess)) {
    const encryptedValue = encryptData(valueToProcess);
    Cookies.set("adminAuth", encryptedValue);
    return valueToProcess; 
  }

  return decryptData(valueToProcess);
};

export const setEncryptedCookie = async (key: string, value: any, options: any = {}) => {
  try {

      const encryptedValue = await encryptData(value); // ✅ Use `await` for encryption
      // ✅ Store encrypted value in cookies
      Cookies.set(key, encryptedValue, {
          path: "/",
          secure: true,
          sameSite: "None",
          expires: options.expires || 7, // Default expiry: 7 days
          ...options
      });

      //console.log("✅ Cookie Set Successfully!");
  } catch (error) {
      console.error("❌ Error setting encrypted cookie:", error);
  }
};


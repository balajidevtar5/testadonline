import CryptoJS from "crypto-js";
import { SECRET_KEY } from "../libs/constant";


export const encryptData = (data) => {
  try {
    const jsonData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption Error:", error);
    return null;
  }
};

export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) {
      console.error("Decryption Error: No data provided for decryption.");
      return null;
    }
    
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      console.error("❌ Decryption Error: Decrypted text is empty.");
      return null;
    }

    return JSON.parse(decryptedText);
  } catch (error) {
    console.error("❌ Decryption Error:", error);
    return null;
  }
};


export const isEncrypted = (value) => {
  if (!value || typeof value !== "string") return false;

  // Example: Check if the value is base64 encoded (common encryption output)
  const base64Regex = /^[A-Za-z0-9+/=]+$/;

  // Assume encrypted values are base64 encoded and longer than a certain length
  return base64Regex.test(value) && value.length > 20;
};

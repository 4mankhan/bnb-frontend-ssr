import { decryptObject, encryptObject } from "./crypto";

export const safeLocalStorage = {
  getItem: async (key, defaultValue = null) => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(key);
        return item ? await decryptObject(item) : defaultValue;
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  },
  setItem: async (key, value) => {
    if (typeof window !== "undefined") {
      try {
        const encryptedValue = await encryptObject(value);
        localStorage.setItem(key, encryptedValue);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
      }
    }
  },
};

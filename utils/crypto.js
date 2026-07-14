/**
 * Crypto utilities for encrypting and decrypting text, objects, arrays, and URL search parameters
 * Uses Web Crypto API for secure encryption/decryption
 */

// Configuration for encryption
const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12; // 96 bits for GCM

/**
 * Generate or retrieve encryption key from environment variable
 */
async function getEncryptionKey() {
  const envKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  if (envKey) {
    try {
      if (!/^[a-fA-F0-9]{64}$/.test(envKey)) {
        throw new Error(
          "Invalid encryption key format in environment variable"
        );
      }

      const keyBytes = new Uint8Array(
        envKey.match(/.{2}/g).map((byte) => parseInt(byte, 16))
      );

      return await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: ALGORITHM },
        false,
        ["encrypt", "decrypt"]
      );
    } catch (error) {
      console.error("Failed to import environment encryption key:", error);
      throw new Error("Invalid encryption key configuration");
    }
  }

  throw new Error(
    "No encryption key found. Set ENCRYPTION_KEY environment variable."
  );
}

/**
 * Encrypt a string value (generic text encryption)
 * @param {string} plaintext - The text to encrypt
 * @returns {Promise<string>} - Base64 encoded encrypted data with IV
 */
export async function encryptText(plaintext) {
  try {
    if (!plaintext) return "";

    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      data
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode.apply(null, combined))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt text");
  }
}

/**
 * Encrypt a string value for URL parameters (with fallback for compatibility)
 * @param {string} plaintext - The text to encrypt
 * @returns {Promise<string>} - Base64 encoded encrypted data with IV
 */
export async function encryptParam(plaintext) {
  try {
    if (!plaintext) return "";

    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      data
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode.apply(null, combined))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  } catch (error) {
    console.error("Encryption error:", error);
    return plaintext; // Fallback for URL params
  }
}

/**
 * Decrypt an encrypted string value (generic text decryption)
 * @param {string} encryptedData - Base64 encoded encrypted data with IV
 * @returns {Promise<string>} - Decrypted plaintext
 */
export async function decryptText(encryptedData) {
  try {
    if (!encryptedData) return "";
    if (!isLikelyEncrypted(encryptedData)) {
      throw new Error("Invalid encrypted data format");
    }

    let base64 = encryptedData.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const combined = new Uint8Array(
      atob(base64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH);
    const encrypted = combined.slice(IV_LENGTH);

    const key = await getEncryptionKey();

    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt text");
  }
}

/**
 * Decrypt an encrypted string value for URL parameters (with fallback for compatibility)
 * @param {string} encryptedData - Base64 encoded encrypted data with IV
 * @returns {Promise<string>} - Decrypted plaintext
 */
export async function decryptParam(encryptedData) {
  try {
    if (!encryptedData) return "";
    if (!isLikelyEncrypted(encryptedData)) {
      return encryptedData;
    }

    let base64 = encryptedData.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const combined = new Uint8Array(
      atob(base64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH);
    const encrypted = combined.slice(IV_LENGTH);

    const key = await getEncryptionKey();

    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedData; // Fallback to original data if decryption fails
  }
}

/**
 * Encrypt an object by converting it to JSON and then encrypting
 * @param {Object} obj - The object to encrypt
 * @returns {Promise<string>} - Base64 encoded encrypted JSON data
 */
export async function encryptObject(obj) {
  try {
    if (!obj) return "";
    const jsonString = JSON.stringify(obj);
    return await encryptText(jsonString);
  } catch (error) {
    console.error("Object encryption error:", error);
    throw new Error("Failed to encrypt object");
  }
}

/**
 * Decrypt an encrypted string and parse it as JSON object
 * @param {string} encryptedData - Base64 encoded encrypted JSON data
 * @returns {Promise<Object>} - Decrypted and parsed object
 */
export async function decryptObject(encryptedData) {
  try {
    if (!encryptedData) return null;
    const decryptedString = await decryptText(encryptedData);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Object decryption error:", error);
    throw new Error("Failed to decrypt object");
  }
}

/**
 * Encrypt an array by converting it to JSON and then encrypting
 * @param {Array} arr - The array to encrypt
 * @returns {Promise<string>} - Base64 encoded encrypted JSON data
 */
export async function encryptArray(arr) {
  try {
    if (!arr || !Array.isArray(arr)) return "";
    const jsonString = JSON.stringify(arr);
    return await encryptText(jsonString);
  } catch (error) {
    console.error("Array encryption error:", error);
    throw new Error("Failed to encrypt array");
  }
}

/**
 * Decrypt an encrypted string and parse it as JSON array
 * @param {string} encryptedData - Base64 encoded encrypted JSON data
 * @returns {Promise<Array>} - Decrypted and parsed array
 */
export async function decryptArray(encryptedData) {
  try {
    if (!encryptedData) return [];
    const decryptedString = await decryptText(encryptedData);
    const result = JSON.parse(decryptedString);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Array decryption error:", error);
    throw new Error("Failed to decrypt array");
  }
}

function isLikelyEncrypted(data) {
  const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
  return base64UrlPattern.test(data) && data.length > 20;
}

/**
 * Encrypt all values in a URLSearchParams object
 * @param {URLSearchParams} searchParams - The search parameters to encrypt
 * @returns {Promise<URLSearchParams>} - New URLSearchParams with encrypted values
 */
export async function encryptSearchParams(searchParams) {
  const encrypted = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    const encryptedValue = await encryptParam(value);
    encrypted.set(key, encryptedValue);
  }

  return encrypted;
}

/**
 * Decrypt all values in a URLSearchParams object
 * @param {URLSearchParams} searchParams - The search parameters to decrypt
 * @returns {Promise<URLSearchParams>} - New URLSearchParams with decrypted values
 */
export async function decryptSearchParams(searchParams) {
  const decrypted = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    const decryptedValue = await decryptParam(value);
    decrypted.set(key, decryptedValue);
  }

  return decrypted;
}

/**
 * Create an encrypted URL with search parameters
 * @param {string} baseUrl - The base URL
 * @param {Object} params - Object with key-value pairs to encrypt and add as search params
 * @returns {Promise<string>} - Complete URL with encrypted search parameters
 */
export async function createEncryptedUrl(baseUrl, params) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      const encryptedValue = await encryptParam(String(value));
      searchParams.set(key, encryptedValue);
    }
  }

  return `${baseUrl}?${searchParams.toString()}`;
}

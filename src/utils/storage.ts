/**
 * Unified Safe Storage Engine for Rustum Platform
 * Encapsulates all browser localStorage operations with try-catch guards,
 * schema validation, and safe default state fallbacks.
 */

export type SchemaValidator<T> = (value: unknown) => value is T;

/**
 * Validates parsed value against default value schema or custom validator
 */
function validateSchema<T>(parsed: unknown, defaultValue: T, customValidator?: (val: unknown) => boolean): parsed is T {
  if (customValidator) {
    try {
      return customValidator(parsed);
    } catch {
      return false;
    }
  }

  // Null/Undefined checks
  if (parsed === null || parsed === undefined) {
    return defaultValue === parsed;
  }

  // Array schema validation
  if (Array.isArray(defaultValue)) {
    return Array.isArray(parsed);
  }

  // Object schema validation
  if (typeof defaultValue === 'object' && defaultValue !== null) {
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
  }

  // Primitive schema validation (string, number, boolean)
  if (typeof defaultValue !== 'undefined') {
    return typeof parsed === typeof defaultValue;
  }

  return true;
}

export const storage = {
  /**
   * Safely retrieve and parse an item from localStorage with type guard and schema fallback
   */
  get: <T>(key: string, defaultValue: T, customValidator?: (val: unknown) => boolean): T => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === undefined || raw === '') {
        return defaultValue;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // If it's a plain string that wasn't JSON-encoded, handle it gracefully
        if (typeof defaultValue === 'string') {
          return raw as unknown as T;
        }
        return defaultValue;
      }

      if (validateSchema(parsed, defaultValue, customValidator)) {
        return parsed as T;
      }

      console.warn(`[storage] Schema validation mismatch for key "${key}", falling back to default.`);
      return defaultValue;
    } catch (err) {
      console.warn(`[storage] Error reading key "${key}":`, err);
      return defaultValue;
    }
  },

  /**
   * Safely serialize and write an item to localStorage
   */
  set: <T>(key: string, value: T): boolean => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn(`[storage] Error writing key "${key}":`, err);
      return false;
    }
  },

  /**
   * Safely remove a specific key from localStorage
   */
  remove: (key: string): boolean => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`[storage] Error removing key "${key}":`, err);
      return false;
    }
  },

  /**
   * Safely check if a key exists and has a non-empty value
   */
  has: (key: string): boolean => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      return window.localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },

  /**
   * Safely clear all localStorage entries
   */
  clear: (): boolean => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      window.localStorage.clear();
      return true;
    } catch (err) {
      console.warn('[storage] Error clearing localStorage:', err);
      return false;
    }
  },

  /**
   * Reset all platform-specific stored states (cart, wishlist, auth tokens, gps, etc.)
   */
  clearPlatformData: (): void => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const platformKeys = [
        'hkaya_cart',
        'hkaya_wishlist',
        'hkaya_admin_token',
        'hkaya_customer_token',
        'hkaya_lang',
        'hkaya_theme',
        'hkaya_gps',
        'hkaya_customizer',
      ];
      platformKeys.forEach((k) => {
        try {
          window.localStorage.removeItem(k);
        } catch {}
      });
      // Also clear all remaining localStorage
      window.localStorage.clear();
      if (typeof window.sessionStorage !== 'undefined') {
        window.sessionStorage.clear();
      }
    } catch (e) {
      console.warn('[storage] Error during platform data reset:', e);
    }
  },
};

/**
 * Backwards-compatible safeStorage adapter matching existing interfaces
 */
export const safeStorage = {
  getItem: <T>(key: string, defaultValue: T, customValidator?: (val: unknown) => boolean): T => {
    return storage.get<T>(key, defaultValue, customValidator);
  },
  setItem: <T>(key: string, value: T): void => {
    storage.set<T>(key, value);
  },
  removeItem: (key: string): void => {
    storage.remove(key);
  },
  clear: (): void => {
    storage.clear();
  },
  clearPlatformData: (): void => {
    storage.clearPlatformData();
  },
};

export default storage;

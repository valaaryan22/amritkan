/**
 * Browser storage wrapper with error handling
 * Provides safe access to localStorage and sessionStorage with quota exceeded handling
 */

// Storage error types
export class StorageQuotaExceededError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StorageQuotaExceededError'
  }
}

export class StorageNotAvailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StorageNotAvailableError'
  }
}

// Check if storage is available
const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const storage = window[type]
    const testKey = '__storage_test__'
    storage.setItem(testKey, 'test')
    storage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

/**
 * LocalStorage wrapper for persistent data (cart, auth)
 */
export const localStore = {
  /**
   * Get item from localStorage
   */
  getItem: <T = string>(key: string): T | null => {
    if (!isStorageAvailable('localStorage')) {
      console.warn('[Storage] localStorage not available')
      return null
    }
    
    try {
      const item = localStorage.getItem(key)
      if (item === null) return null
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item) as T
      } catch {
        return item as T
      }
    } catch (error) {
      console.error(`[Storage] Error reading from localStorage:`, error)
      return null
    }
  },

  /**
   * Set item in localStorage
   */
  setItem: <T = any>(key: string, value: T): boolean => {
    if (!isStorageAvailable('localStorage')) {
      throw new StorageNotAvailableError('localStorage is not available')
    }
    
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value)
      localStorage.setItem(key, serialized)
      return true
    } catch (error: any) {
      // Check if quota exceeded
      if (
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) {
        console.error('[Storage] Storage quota exceeded')
        throw new StorageQuotaExceededError(
          'Storage quota exceeded. Please clear some data or use a different browser.'
        )
      }
      
      console.error(`[Storage] Error writing to localStorage:`, error)
      return false
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: (key: string): void => {
    if (!isStorageAvailable('localStorage')) {
      console.warn('[Storage] localStorage not available')
      return
    }
    
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`[Storage] Error removing from localStorage:`, error)
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear: (): void => {
    if (!isStorageAvailable('localStorage')) {
      console.warn('[Storage] localStorage not available')
      return
    }
    
    try {
      localStorage.clear()
    } catch (error) {
      console.error(`[Storage] Error clearing localStorage:`, error)
    }
  },

  /**
   * Check if key exists in localStorage
   */
  hasItem: (key: string): boolean => {
    if (!isStorageAvailable('localStorage')) return false
    
    try {
      return localStorage.getItem(key) !== null
    } catch (error) {
      console.error(`[Storage] Error checking localStorage:`, error)
      return false
    }
  },
}

/**
 * SessionStorage wrapper for temporary data (checkout state)
 */
export const sessionStore = {
  /**
   * Get item from sessionStorage
   */
  getItem: <T = string>(key: string): T | null => {
    if (!isStorageAvailable('sessionStorage')) {
      console.warn('[Storage] sessionStorage not available')
      return null
    }
    
    try {
      const item = sessionStorage.getItem(key)
      if (item === null) return null
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item) as T
      } catch {
        return item as T
      }
    } catch (error) {
      console.error(`[Storage] Error reading from sessionStorage:`, error)
      return null
    }
  },

  /**
   * Set item in sessionStorage
   */
  setItem: <T = any>(key: string, value: T): boolean => {
    if (!isStorageAvailable('sessionStorage')) {
      throw new StorageNotAvailableError('sessionStorage is not available')
    }
    
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value)
      sessionStorage.setItem(key, serialized)
      return true
    } catch (error: any) {
      // Check if quota exceeded
      if (
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) {
        console.error('[Storage] Storage quota exceeded')
        throw new StorageQuotaExceededError(
          'Storage quota exceeded. Please clear some data or use a different browser.'
        )
      }
      
      console.error(`[Storage] Error writing to sessionStorage:`, error)
      return false
    }
  },

  /**
   * Remove item from sessionStorage
   */
  removeItem: (key: string): void => {
    if (!isStorageAvailable('sessionStorage')) {
      console.warn('[Storage] sessionStorage not available')
      return
    }
    
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error(`[Storage] Error removing from sessionStorage:`, error)
    }
  },

  /**
   * Clear all items from sessionStorage
   */
  clear: (): void => {
    if (!isStorageAvailable('sessionStorage')) {
      console.warn('[Storage] sessionStorage not available')
      return
    }
    
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error(`[Storage] Error clearing sessionStorage:`, error)
    }
  },

  /**
   * Check if key exists in sessionStorage
   */
  hasItem: (key: string): boolean => {
    if (!isStorageAvailable('sessionStorage')) return false
    
    try {
      return sessionStorage.getItem(key) !== null
    } catch (error) {
      console.error(`[Storage] Error checking sessionStorage:`, error)
      return false
    }
  },
}

// Storage keys constants
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  CART: 'cart',
  CHECKOUT: 'checkout',
  PREFERENCES: 'preferences',
} as const

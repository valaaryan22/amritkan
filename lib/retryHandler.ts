import { AxiosError } from 'axios'

export interface RetryConfig {
  maxRetries?: number
  retryDelay?: number
  shouldRetry?: (error: unknown) => boolean
  onRetry?: (attempt: number, error: unknown) => void
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  retryDelay: 1000,
  shouldRetry: (error: unknown) => {
    // Retry on network errors or 5xx server errors
    if (error instanceof AxiosError) {
      if (!error.response) return true // Network error
      if (error.response.status >= 500) return true // Server error
    }
    return false
  },
  onRetry: () => {},
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries,
    retryDelay,
    shouldRetry,
    onRetry,
  } = { ...DEFAULT_CONFIG, ...config }

  let lastError: unknown
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // Check if we should retry
      const canRetry = attempt < maxRetries && shouldRetry(error)
      
      if (!canRetry) {
        throw error
      }
      
      // Calculate delay with exponential backoff
      const delayMs = retryDelay * Math.pow(2, attempt)
      
      // Call retry callback
      onRetry(attempt + 1, error)
      
      console.log(`[Retry Handler] Attempt ${attempt + 1}/${maxRetries} failed, retrying in ${delayMs}ms...`)
      
      // Wait before retrying
      await delay(delayMs)
    }
  }
  
  throw lastError
}

/**
 * Create a retry wrapper for API calls
 */
export function createRetryWrapper(config: RetryConfig = {}) {
  return <T>(fn: () => Promise<T>): Promise<T> => {
    return retryWithBackoff(fn, config)
  }
}

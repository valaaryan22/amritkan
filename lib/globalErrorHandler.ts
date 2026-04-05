import { handleError } from './errorHandler'

/**
 * Initialize global error handlers
 * Should be called once in the app initialization
 */
export function initGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Global Error Handler] Unhandled promise rejection:', event.reason)
    
    // Prevent default browser error handling
    event.preventDefault()
    
    // Handle the error
    handleError(event.reason, 'An unexpected error occurred')
  })

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('[Global Error Handler] Uncaught error:', event.error)
    
    // Don't prevent default for script errors
    if (event.error) {
      handleError(event.error, 'An unexpected error occurred')
    }
  })

  console.log('[Global Error Handler] Initialized')
}

/**
 * Clean up global error handlers
 */
export function cleanupGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return

  window.removeEventListener('unhandledrejection', () => {})
  window.removeEventListener('error', () => {})
}

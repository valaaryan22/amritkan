import { AxiosError } from 'axios'
import { toast } from '@/store/toastStore'

export interface ErrorDetails {
  message: string
  code?: string
  statusCode?: number
  errors?: Record<string, string[]>
}

/**
 * Extract error details from various error types
 */
export function extractErrorDetails(error: unknown): ErrorDetails {
  // Axios error
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status
    const data = error.response?.data as any

    // Network error
    if (!error.response) {
      return {
        message: 'Unable to connect. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      }
    }

    // Validation errors (400)
    if (statusCode === 400 && data?.errors) {
      const firstError = Object.values(data.errors)[0] as string[]
      return {
        message: firstError[0] || data.message || 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode,
        errors: data.errors,
      }
    }

    // Authentication errors (401)
    if (statusCode === 401) {
      return {
        message: 'Session expired. Please log in again.',
        code: 'AUTH_ERROR',
        statusCode,
      }
    }

    // Forbidden (403)
    if (statusCode === 403) {
      return {
        message: data?.message || 'You do not have permission to perform this action.',
        code: 'FORBIDDEN',
        statusCode,
      }
    }

    // Not found (404)
    if (statusCode === 404) {
      return {
        message: data?.message || 'The requested resource was not found.',
        code: 'NOT_FOUND',
        statusCode,
      }
    }

    // Server errors (5xx)
    if (statusCode && statusCode >= 500) {
      return {
        message: 'Something went wrong. Please try again.',
        code: 'SERVER_ERROR',
        statusCode,
      }
    }

    // Other errors
    return {
      message: data?.message || error.message || 'An error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode,
    }
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'ERROR',
    }
  }

  // Unknown error type
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  }
}

/**
 * Handle error and display appropriate toast message
 */
export function handleError(error: unknown, customMessage?: string): ErrorDetails {
  const details = extractErrorDetails(error)
  
  // Use custom message if provided, otherwise use extracted message
  const message = customMessage || details.message
  
  // Display error toast
  toast.error(message)
  
  // Log error for debugging
  console.error('[Error Handler]', {
    message,
    code: details.code,
    statusCode: details.statusCode,
    originalError: error,
  })
  
  return details
}

/**
 * Handle validation errors and return field-specific errors
 */
export function handleValidationError(error: unknown): Record<string, string> {
  const details = extractErrorDetails(error)
  
  if (details.errors) {
    // Convert array of errors to single string per field
    const fieldErrors: Record<string, string> = {}
    Object.entries(details.errors).forEach(([field, messages]) => {
      fieldErrors[field] = messages[0]
    })
    return fieldErrors
  }
  
  return {}
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response
  }
  return false
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401
  }
  return false
}

/**
 * Get user-friendly error message for specific error codes
 */
export function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
    AUTH_ERROR: 'Session expired. Please log in again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Something went wrong. Please try again.',
    INSUFFICIENT_BALANCE: 'Insufficient wallet balance. Please add money to your wallet.',
    OUT_OF_STOCK: 'This product is currently out of stock.',
    INVALID_COUPON: 'Invalid or expired coupon code.',
    DELIVERY_UNAVAILABLE: 'Delivery is not available in your area.',
  }
  
  return messages[code] || 'An error occurred. Please try again.'
}

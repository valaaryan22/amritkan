import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AxiosError } from 'axios'
import {
  extractErrorDetails,
  handleError,
  handleValidationError,
  isNetworkError,
  isAuthError,
  getErrorMessage,
} from './errorHandler'
import { toast } from '@/store/toastStore'

// Mock the toast store
vi.mock('@/store/toastStore', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('extractErrorDetails', () => {
    it('should extract network error details', () => {
      const error = new AxiosError('Network Error')
      error.response = undefined

      const details = extractErrorDetails(error)

      expect(details.code).toBe('NETWORK_ERROR')
      expect(details.message).toContain('internet connection')
    })

    it('should extract validation error details', () => {
      const error = new AxiosError('Validation Error')
      error.response = {
        status: 400,
        data: {
          message: 'Validation failed',
          errors: {
            email: ['Email is required'],
            phone: ['Phone is invalid'],
          },
        },
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      }

      const details = extractErrorDetails(error)

      expect(details.code).toBe('VALIDATION_ERROR')
      expect(details.statusCode).toBe(400)
      expect(details.errors).toEqual({
        email: ['Email is required'],
        phone: ['Phone is invalid'],
      })
    })

    it('should extract auth error details', () => {
      const error = new AxiosError('Unauthorized')
      error.response = {
        status: 401,
        data: { message: 'Unauthorized' },
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      }

      const details = extractErrorDetails(error)

      expect(details.code).toBe('AUTH_ERROR')
      expect(details.statusCode).toBe(401)
      expect(details.message).toContain('Session expired')
    })

    it('should extract server error details', () => {
      const error = new AxiosError('Server Error')
      error.response = {
        status: 500,
        data: { message: 'Internal Server Error' },
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      }

      const details = extractErrorDetails(error)

      expect(details.code).toBe('SERVER_ERROR')
      expect(details.statusCode).toBe(500)
      expect(details.message).toContain('Something went wrong')
    })

    it('should handle standard Error objects', () => {
      const error = new Error('Something went wrong')

      const details = extractErrorDetails(error)

      expect(details.code).toBe('ERROR')
      expect(details.message).toBe('Something went wrong')
    })

    it('should handle unknown error types', () => {
      const error = 'string error'

      const details = extractErrorDetails(error)

      expect(details.code).toBe('UNKNOWN_ERROR')
      expect(details.message).toContain('unexpected error')
    })
  })

  describe('handleError', () => {
    it('should display error toast', () => {
      const error = new Error('Test error')

      handleError(error)

      expect(toast.error).toHaveBeenCalledWith('Test error')
    })

    it('should use custom message if provided', () => {
      const error = new Error('Original error')

      handleError(error, 'Custom error message')

      expect(toast.error).toHaveBeenCalledWith('Custom error message')
    })

    it('should return error details', () => {
      const error = new Error('Test error')

      const details = handleError(error)

      expect(details.message).toBe('Test error')
      expect(details.code).toBe('ERROR')
    })
  })

  describe('handleValidationError', () => {
    it('should extract field errors from validation error', () => {
      const error = new AxiosError('Validation Error')
      error.response = {
        status: 400,
        data: {
          errors: {
            email: ['Email is required', 'Email must be valid'],
            phone: ['Phone is required'],
          },
        },
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      }

      const fieldErrors = handleValidationError(error)

      expect(fieldErrors).toEqual({
        email: 'Email is required',
        phone: 'Phone is required',
      })
    })

    it('should return empty object for non-validation errors', () => {
      const error = new Error('Not a validation error')

      const fieldErrors = handleValidationError(error)

      expect(fieldErrors).toEqual({})
    })
  })

  describe('isNetworkError', () => {
    it('should return true for network errors', () => {
      const error = new AxiosError('Network Error')
      error.response = undefined

      expect(isNetworkError(error)).toBe(true)
    })

    it('should return false for non-network errors', () => {
      const error = new AxiosError('Server Error')
      error.response = {
        status: 500,
        data: {},
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      }

      expect(isNetworkError(error)).toBe(false)
    })

    it('should return false for non-axios errors', () => {
      const error = new Error('Regular error')

      expect(isNetworkError(error)).toBe(false)
    })
  })

  describe('isAuthError', () => {
    it('should return true for 401 errors', () => {
      const error = new AxiosError('Unauthorized')
      error.response = {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      }

      expect(isAuthError(error)).toBe(true)
    })

    it('should return false for non-401 errors', () => {
      const error = new AxiosError('Bad Request')
      error.response = {
        status: 400,
        data: {},
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      }

      expect(isAuthError(error)).toBe(false)
    })

    it('should return false for non-axios errors', () => {
      const error = new Error('Regular error')

      expect(isAuthError(error)).toBe(false)
    })
  })

  describe('getErrorMessage', () => {
    it('should return message for known error codes', () => {
      expect(getErrorMessage('NETWORK_ERROR')).toContain('internet connection')
      expect(getErrorMessage('AUTH_ERROR')).toContain('Session expired')
      expect(getErrorMessage('VALIDATION_ERROR')).toContain('check your input')
      expect(getErrorMessage('INSUFFICIENT_BALANCE')).toContain('wallet balance')
    })

    it('should return default message for unknown error codes', () => {
      expect(getErrorMessage('UNKNOWN_CODE')).toContain('error occurred')
    })
  })
})

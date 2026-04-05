import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// Production API URL - hardcoded as fallback for builds
const PRODUCTION_API_URL = 'https://food.amritkan.com/api'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL

// Storage base URL for images (remove /api from base URL)
const STORAGE_BASE_URL = API_BASE_URL.replace('/api', '/storage')

// Helper function to get full image URL
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  
  return `${STORAGE_BASE_URL}/${cleanPath}`
}

// Log API URL on startup
console.log('[API] Base URL:', API_BASE_URL)

// Web storage helpers
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

const deleteToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

// Handle session expiry - clear all auth data and redirect to login
const handleSessionExpiry = (): void => {
  console.log('[API] Session expired - logging out user')
  deleteToken()
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for slow networks
  headers: {
    'Content-Type': 'application/json',
  },
})

// Retry configuration
const MAX_RETRIES = 2
const RETRY_DELAY = 1000 // 1 second

// Helper to check if request should be retried
const shouldRetry = (error: AxiosError): boolean => {
  // Retry on network errors or 5xx server errors
  if (!error.response) return true // Network error
  if (error.response.status >= 500) return true // Server error
  return false
}

// Helper to delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('[API] Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling, logging, and retry
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`)
    return response
  },
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number }
    
    // Initialize retry count
    if (!config._retryCount) {
      config._retryCount = 0
    }
    
    // Check if we should retry
    if (shouldRetry(error) && config._retryCount < MAX_RETRIES) {
      config._retryCount++
      console.log(`[API] Retrying request (${config._retryCount}/${MAX_RETRIES}): ${config.url}`)
      await delay(RETRY_DELAY * config._retryCount) // Exponential backoff
      return api(config)
    }
    
    if (error.response) {
      // Server responded with error
      console.error(`[API] Error ${error.response.status}:`, error.response.data)
      
      // Only logout on 401 for auth-critical endpoints
      // Don't logout for optional features like orders, banners, etc.
      if (error.response.status === 401) {
        const url = config.url || ''
        const isCriticalEndpoint = url.includes('/profile') || url.includes('/cart') || url.includes('/checkout')
        
        if (isCriticalEndpoint) {
          console.log('[API] 401 on critical endpoint - logging out')
          handleSessionExpiry()
        } else {
          console.log('[API] 401 on non-critical endpoint - not logging out')
        }
      }
    } else if (error.request) {
      // Request made but no response (network error)
      console.error('[API] Network error - no response received')
      console.error('[API] URL:', API_BASE_URL)
      // Create a more helpful error message
      error.message = `Network Error: Cannot connect to server at ${API_BASE_URL}. Please check your internet connection.`
    } else {
      console.error('[API] Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// API endpoints
export const authApi = {
  getConfig: () => api.get('/auth/config'),
  sendOtp: (phone: string) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (phone: string, otp: string) => api.post('/auth/verify-otp', { phone, otp }),
  loginWithPassword: (phone: string, password: string) => api.post('/auth/login-password', { phone, password }),
  googleAuth: (idToken: string) => api.post('/auth/google', { idToken }),
  forgotPassword: (phone: string) => api.post('/auth/forgot-password', { phone }),
  resetPassword: (phone: string, otp: string, password: string) => api.post('/auth/reset-password', { phone, otp, password }),
  setPassword: (password: string) => api.post('/auth/set-password', { password }),
  register: (data: { name: string; email: string; phone: string; password: string; password_confirmation: string }) => 
    api.post('/auth/register', data),
  // Email-based password reset endpoints
  forgotPasswordEmail: (email: string) => api.post('/auth/forgot-password-email', { email }),
  forgotPasswordByPhone: (phone: string) => api.post('/auth/forgot-password-phone', { phone }),
  verifyEmailOtp: (email: string, otp: string) => api.post('/auth/verify-email-otp', { email, otp }),
  resetPasswordEmail: (email: string, resetToken: string, password: string, password_confirmation: string) => 
    api.post('/auth/reset-password-email', { email, resetToken, password, password_confirmation }),
}

export const customerApi = {
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (data: { name?: string; email?: string }) => api.put('/customers/profile', data),
  getAddresses: () => api.get('/customers/addresses'),
  addAddress: (address: any) => api.post('/customers/addresses', address),
  updateAddress: (id: string, address: any) => api.put(`/customers/addresses/${id}`, address),
  deleteAddress: (id: string) => api.delete(`/customers/addresses/${id}`),
}

export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
}

export const subscriptionApi = {
  getAll: () => api.get('/subscriptions'),
  getById: (id: string) => api.get(`/subscriptions/${id}`),
  create: (data: any) => api.post('/subscriptions', data),
  pause: (id: string, startDate: string, endDate: string) => api.post(`/subscriptions/${id}/pause`, { startDate, endDate }),
  resume: (id: string) => api.post(`/subscriptions/${id}/resume`),
  cancel: (id: string) => api.delete(`/subscriptions/${id}`),
  updateQuantity: (id: string, quantity: number) => api.put(`/subscriptions/${id}/quantity`, { quantity }),
}

export const walletApi = {
  getBalance: () => api.get('/wallet/balance'),
  getTransactions: () => api.get('/wallet/transactions'),
  initiateAddMoney: (amount: number) => api.post('/wallet/add-money', { amount }),
  verifyPayment: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; amount: number }) => 
    api.post('/wallet/verify-payment', data),
}

export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (productId: string, variantId: string, quantity: number) => 
    api.post('/cart/items', { productId, variantId, quantity }),
  updateItem: (itemId: string, quantity: number) => 
    api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
}

export const orderApi = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string) => api.post(`/orders/${id}/cancel`),
}

export const couponApi = {
  validate: (code: string, orderAmount: number) => api.post('/coupons/validate', { code, order_amount: orderAmount }),
}

export const paymentApi = {
  createOrder: (orderId: string, amount: number) => 
    api.post('/payments/create-order', { order_id: orderId, amount }),
  verify: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) => 
    api.post('/payments/verify', {
      razorpay_order_id: data.razorpayOrderId,
      razorpay_payment_id: data.razorpayPaymentId,
      razorpay_signature: data.razorpaySignature,
    }),
  payWithWallet: (orderId: string) => api.post('/payments/wallet', { order_id: orderId }),
}

export const categoryApi = {
  getAll: () => api.get('/categories'),
}

export const bannerApi = {
  getAll: () => api.get('/banners'),
}

export const cityApi = {
  getAll: () => api.get('/cities'),
}

export const settingsApi = {
  getPublic: () => api.get('/settings/public'),
  getPaymentSettings: () => api.get('/settings/payment'),
}

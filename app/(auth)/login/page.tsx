'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OTPInput } from '@/components/ui/OTPInput'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { User } from '@/types'
import { AxiosError } from 'axios'

// Interface for expected API response structure
interface LoginApiResponse {
  data: {
    success: boolean
    data: {
      accessToken: string
      refreshToken?: string
      expiresAt?: string
      user: User
    }
  }
}

type LoginMethod = 'password' | 'otp'

// Token validation helper function
const isValidJwtToken = (token: unknown): token is string => {
  // Check if token is a non-empty string
  if (typeof token !== 'string' || token.trim().length === 0) {
    return false
  }
  
  // For preservation: accept any non-empty string token
  // The original behavior accepted any string, so we preserve that
  return true
}

// Type guard to validate API response structure
const isValidLoginResponse = (response: any): response is LoginApiResponse => {
  return (
    response &&
    response.data &&
    response.data.success === true &&
    response.data.data &&
    typeof response.data.data === 'object'
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuthStore()
  
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password')
  const [step, setStep] = useState<'phone' | 'otp' | 'password'>('password')
  const [isConfigLoading, setIsConfigLoading] = useState(true)
  const [authConfig, setAuthConfig] = useState<{
    otpEnabled: boolean;
    passwordEnabled: boolean;
    googleEnabled: boolean;
    registrationEnabled: boolean;
  } | null>(null)
  
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Fetch auth config
  useEffect(() => {
    if (isAuthenticated) return;
    
    const fetchConfig = async () => {
      try {
        const response = await authApi.getConfig()
        const data = response.data?.data || {}
        const config = {
          otpEnabled: data.otpLogin ?? data.otpEnabled ?? false,
          passwordEnabled: data.passwordLogin ?? data.passwordEnabled ?? false,
          googleEnabled: data.googleLogin ?? data.googleEnabled ?? false,
          registrationEnabled: data.registration ?? data.registrationEnabled ?? true,
        }
        setAuthConfig(config)
        
        // Set initial state based on available methods
        if (config.passwordEnabled && !config.otpEnabled) {
          setLoginMethod('password')
          setStep('password')
        } else if (config.otpEnabled && !config.passwordEnabled) {
          setLoginMethod('otp')
          setStep('phone')
        } else if (config.passwordEnabled && config.otpEnabled) {
          setLoginMethod('password')
          setStep('password')
        } else if (!config.passwordEnabled && !config.otpEnabled) {
          // Both disabled, just stay on current to show unavailable
          setStep('password')
        }
      } catch (err) {
        console.error('Failed to load auth config', err)
        // Fallback
        setAuthConfig({
          otpEnabled: true,
          passwordEnabled: true,
          googleEnabled: false,
          registrationEnabled: true
        })
      } finally {
        setIsConfigLoading(false)
      }
    }
    
    fetchConfig()
  }, [isAuthenticated])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, router])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const validatePhone = (phoneNumber: string): boolean => {
    // Indian phone number validation (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phoneNumber)
  }

  const handlePasswordLogin = async () => {
    setPhoneError('')
    setPasswordError('')
    
    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number')
      return
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.loginWithPassword(phone, password)
      
      // Debug: Log the actual response to understand the structure
      console.log('[DEBUG] Login API Response:', JSON.stringify(response.data, null, 2))
      
      // Validate response structure with type guard
      if (!isValidLoginResponse(response)) {
        console.log('[DEBUG] Invalid response structure:', (response as any).data)
        setPasswordError('Authentication failed - invalid response format')
        return
      }
      
      // Extract response data safely with optional chaining
      const token = response.data?.data?.accessToken
      const user = response.data?.data?.user
      
      console.log('[DEBUG] Extracted token:', token)
      console.log('[DEBUG] Extracted user:', user)
      
      // Validate token using helper function before calling authStore.login
      if (!isValidJwtToken(token)) {
        console.log('[DEBUG] Token validation failed for token:', token)
        setPasswordError('Authentication failed - invalid token received')
        return
      }
      
      // Validate user data exists
      if (!user) {
        console.log('[DEBUG] User data missing')
        setPasswordError('Authentication failed - invalid user data received')
        return
      }
      
      console.log('[DEBUG] Login successful, storing auth data')
      
      // Store auth data
      login(user, token)
      
      // Redirect to home
      router.replace('/')
    } catch (error) {
      console.log('[DEBUG] Login error:', error)
      const axiosError = error as AxiosError<{ message: string }>
      setPasswordError(axiosError.response?.data?.message || 'Invalid phone number or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setPhoneError('')
    
    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number')
      return
    }

    setIsLoading(true)
    try {
      await authApi.sendOtp(phone)
      setStep('otp')
      setResendTimer(60) // 60 seconds resend timer
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      setPhoneError(axiosError.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    setOtpError('')
    setIsLoading(true)
    
    try {
      const response = await authApi.verifyOtp(phone, otp)
      
      // Validate response structure with type guard
      if (!isValidLoginResponse(response)) {
        setOtpError('Login successful but session could not be established')
        return
      }
      
      // Extract response data safely with optional chaining
      const token = response.data?.data?.accessToken
      const user = response.data?.data?.user
      
      // Validate token using helper function before calling authStore.login
      if (!isValidJwtToken(token)) {
        setOtpError('Login successful but session could not be established')
        return
      }
      
      // Validate user data exists
      if (!user) {
        setOtpError('Login successful but session could not be established')
        return
      }
      
      // Store auth data
      login(user, token)
      
      // Redirect to home
      router.replace('/')
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      setOtpError(axiosError.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    
    setOtpError('')
    setIsLoading(true)
    
    try {
      await authApi.sendOtp(phone)
      setResendTimer(60)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      setOtpError(axiosError.response?.data?.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePhone = () => {
    setStep(loginMethod === 'password' ? 'password' : 'phone')
    setOtpError('')
  }

  const switchToOtpLogin = () => {
    setLoginMethod('otp')
    setStep('phone')
    setPassword('')
    setPasswordError('')
  }

  const switchToPasswordLogin = () => {
    setLoginMethod('password')
    setStep('password')
    setOtpError('')
  }

  if (isConfigLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const hasAnyLoginMethod = authConfig?.otpEnabled || authConfig?.passwordEnabled || authConfig?.googleEnabled;

  if (!hasAnyLoginMethod && !isConfigLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
         <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Login Unavailable</h2>
            <p className="text-gray-600">Login is currently disabled. Please contact support for assistance.</p>
         </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
          <p className="mt-2 text-gray-600">
            {step === 'password' 
              ? 'Enter your phone number and password' 
              : step === 'phone'
              ? 'Enter your phone number to get started'
              : 'Enter the OTP sent to your phone'}
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          {step === 'password' ? (
            <div className="space-y-6">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={phoneError}
                disabled={isLoading}
                maxLength={10}
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                disabled={isLoading}
              />
              
              <Button
                className="w-full"
                onClick={handlePasswordLogin}
                loading={isLoading}
                disabled={!phone || !password || isLoading}
              >
                Login
              </Button>

              <div className="flex items-center justify-between text-sm w-full mt-2">
                <Link href="/forgot-password" className={`text-blue-600 hover:text-blue-700 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                  Forgot Password?
                </Link>
                {authConfig?.otpEnabled && (
                  <button
                    type="button"
                    onClick={switchToOtpLogin}
                    className="text-blue-600 hover:text-blue-700"
                    disabled={isLoading}
                  >
                    Login with OTP instead
                  </button>
                )}
              </div>

              {authConfig?.registrationEnabled ? (
                <div className="mt-8 pt-4 border-t text-center text-sm">
                  <span className="text-gray-600">Don&apos;t have an account? </span>
                  <Link href="/register" className="font-semibold text-green-600 hover:text-green-700">
                    Create one now
                  </Link>
                </div>
              ) : null}
            </div>
          ) : step === 'phone' ? (
            <div className="space-y-6">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={phoneError}
                disabled={isLoading}
                maxLength={10}
              />
              
              <Button
                className="w-full"
                onClick={handleSendOtp}
                loading={isLoading}
                disabled={!phone || isLoading}
              >
                Send OTP
              </Button>

              {authConfig?.passwordEnabled && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={switchToPasswordLogin}
                    className="text-sm text-blue-600 hover:text-blue-700"
                    disabled={isLoading}
                  >
                    Login with Password instead
                  </button>
                </div>
              )}

              {authConfig?.registrationEnabled ? (
                <div className="mt-8 pt-4 border-t text-center text-sm">
                  <span className="text-gray-600">Don&apos;t have an account? </span>
                  <Link href="/register" className={`font-semibold text-green-600 hover:text-green-700 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                    Create one now
                  </Link>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="mb-4 text-center text-sm text-gray-600">
                  OTP sent to +91 {phone}
                </p>
                
                <OTPInput
                  length={6}
                  onComplete={handleVerifyOtp}
                  disabled={isLoading}
                  error={!!otpError}
                />
                
                {otpError && (
                  <p className="mt-2 text-center text-sm text-red-600">{otpError}</p>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isLoading}
                >
                  {resendTimer > 0 
                    ? `Resend OTP in ${resendTimer}s` 
                    : 'Resend OTP'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleChangePhone}
                  disabled={isLoading}
                >
                  Change Phone Number
                </Button>

                {authConfig?.passwordEnabled && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={switchToPasswordLogin}
                      className="text-sm text-blue-600 hover:text-blue-700"
                      disabled={isLoading}
                    >
                      Login with Password instead
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

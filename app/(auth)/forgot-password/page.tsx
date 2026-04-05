'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OTPInput } from '@/components/ui/OTPInput'
import { authApi } from '@/lib/api'
import { AxiosError } from 'axios'

export default function ForgotPasswordPage() {
  const router = useRouter()
  
  const [step, setStep] = useState<'phone' | 'otp' | 'reset'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  
  const [phoneError, setPhoneError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Start resend timer countdown
  useState(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  })

  const validatePhone = (phoneNumber: string) => {
    return /^[6-9]\d{9}$/.test(phoneNumber)
  }

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    setPhoneError('')
    
    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number')
      return
    }

    setIsLoading(true)
    try {
      await authApi.forgotPassword(phone)
      setStep('otp')
      setResendTimer(60)
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string, error?: { message: string } }>
      setPhoneError(
        axiosError.response?.data?.error?.message || 
        axiosError.response?.data?.message || 
        'Failed to send OTP.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (enteredOtp: string) => {
    setOtpError('')
    setOtp(enteredOtp)
    
    if (enteredOtp.length !== 6) return

    setStep('reset')
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    
    if (password !== passwordConfirmation) {
      setPasswordError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      await authApi.resetPassword(phone, otp, password)
      
      router.replace('/login?reset=success')
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string, error?: { message: string } }>
      setPasswordError(
        axiosError.response?.data?.error?.message || 
        axiosError.response?.data?.message || 
        'Failed to reset password. The OTP might be invalid.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-gray-600">
            {step === 'phone' && 'Enter your registered phone number'}
            {step === 'otp' && 'Enter the OTP sent to your phone'}
            {step === 'reset' && 'Create a new secure password'}
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
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
                type="submit"
                className="w-full text-white bg-green-600 hover:bg-green-700"
                loading={isLoading}
                disabled={!phone || isLoading}
              >
                Send Reset OTP
              </Button>
            </form>
          )}

          {step === 'otp' && (
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
                  onClick={() => handleSendOtp()}
                  disabled={resendTimer > 0 || isLoading}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep('phone')}
                  disabled={isLoading}
                >
                  Change Phone Number
                </Button>
              </div>
            </div>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                disabled={isLoading}
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                disabled={isLoading}
              />
              
              <Button
                type="submit"
                className="w-full text-white bg-green-600 hover:bg-green-700"
                loading={isLoading}
                disabled={!password || !passwordConfirmation || isLoading}
              >
                Reset Password
              </Button>
            </form>
          )}

          <div className="mt-8 text-center text-sm">
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

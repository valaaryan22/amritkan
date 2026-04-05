'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { AxiosError } from 'axios'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [isConfigLoading, setIsConfigLoading] = useState(true)
  const [authConfig, setAuthConfig] = useState<{ registrationEnabled: boolean } | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await authApi.getConfig()
        const data = response.data?.data || {}
        setAuthConfig({
          registrationEnabled: data.registration ?? data.registrationEnabled ?? true,
        })
      } catch (err) {
        console.error('Failed to load auth config', err)
        setAuthConfig({ registrationEnabled: true })
      } finally {
        setIsConfigLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    setGeneralError('')
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid 10-digit phone number'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsLoading(true)
    setGeneralError('')
    
    try {
      const response = await authApi.register(formData)
      
      const token = response.data?.data?.accessToken
      const user = response.data?.data?.user
      
      if (token && user) {
        login(user, token)
        router.replace('/')
      } else {
        setGeneralError('Registration successful but could not log in automatically. Please log in.')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: { message: string }, message?: string }>
      setGeneralError(
        axiosError.response?.data?.error?.message || 
        axiosError.response?.data?.message || 
        'Registration failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
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

  if (authConfig && !authConfig.registrationEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
         <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Registration Unavailable</h2>
            <p className="text-gray-600">New user registration is currently disabled. Please contact support.</p>
            <div className="mt-6">
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">Return to Login</Link>
            </div>
         </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Join Amritkan for fresh food delivery</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          {generalError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isLoading}
            />
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
            />
            
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              disabled={isLoading}
              maxLength={10}
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isLoading}
            />
            
            <Input
              label="Confirm Password"
              type="password"
              name="password_confirmation"
              placeholder="Confirm your password"
              value={formData.password_confirmation}
              onChange={handleChange}
              error={errors.password_confirmation}
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

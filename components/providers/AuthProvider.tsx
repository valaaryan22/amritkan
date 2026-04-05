'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loadStoredAuth = useAuthStore((state) => state.loadStoredAuth)

  useEffect(() => {
    // Load stored auth on mount
    loadStoredAuth()
  }, [loadStoredAuth])

  return <>{children}</>
}

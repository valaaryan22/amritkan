'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { MainLayout } from '@/components/layouts/MainLayout'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { useCartStore } from '@/store/cartStore'
import { useEffect } from 'react'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const loadFromStorage = useCartStore((state) => state.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return (
    <AuthGuard>
      <MainLayout>
        {children}
      </MainLayout>
      <ToastProvider />
    </AuthGuard>
  )
}

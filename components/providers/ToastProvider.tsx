'use client'

import { ToastContainer } from '@/components/ui/ToastContainer'
import { useToastStore } from '@/store/toastStore'

export function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  return <ToastContainer toasts={toasts} onClose={removeToast} />
}

'use client'

import { Toast, ToastProps } from './Toast'

interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div
      className="pointer-events-none fixed right-0 top-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:right-4 sm:top-4 sm:max-w-md"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}

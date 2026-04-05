'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
  }

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  }

  const iconStyles = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border p-4 shadow-lg',
        'animate-in slide-in-from-top-full',
        styles[type]
      )}
    >
      <div className={cn('flex-shrink-0', iconStyles[type])}>
        {icons[type]}
      </div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={() => onClose(id)}
        className={cn(
          'flex-shrink-0 rounded-lg p-1 transition-colors',
          'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
          type === 'success' && 'focus:ring-green-600',
          type === 'error' && 'focus:ring-red-600',
          type === 'info' && 'focus:ring-blue-600',
          type === 'warning' && 'focus:ring-yellow-600'
        )}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

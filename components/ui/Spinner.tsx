import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Spinner component for loading states
 */
export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`}
    />
  )
}

/**
 * Full page spinner with overlay
 */
export function PageSpinner({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" className="text-blue-600 mx-auto mb-4" />
        {message && (
          <p className="text-gray-600 text-sm">{message}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Inline spinner for content areas
 */
export function InlineSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size="lg" className="text-blue-600 mb-4" />
      {message && (
        <p className="text-gray-600 text-sm">{message}</p>
      )}
    </div>
  )
}

/**
 * Button spinner (small, for inline use in buttons)
 */
export function ButtonSpinner() {
  return <Spinner size="sm" className="text-current" />
}

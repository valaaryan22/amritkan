import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface NetworkErrorProps {
  message?: string
  onRetry?: () => void
  className?: string
}

/**
 * Display network error with retry button
 */
export function NetworkError({ 
  message = 'Unable to connect. Please check your internet connection.',
  onRetry,
  className = ''
}: NetworkErrorProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <WifiOff className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Connection Error
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Try Again
        </Button>
      )}
    </div>
  )
}

interface InlineNetworkErrorProps {
  message?: string
  onRetry?: () => void
  className?: string
}

/**
 * Inline network error display (smaller version)
 */
export function InlineNetworkError({
  message = 'Connection failed',
  onRetry,
  className = ''
}: InlineNetworkErrorProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg ${className}`}>
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-orange-600 flex-shrink-0" />
        <span className="text-sm text-orange-900">{message}</span>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Retry
        </Button>
      )}
    </div>
  )
}

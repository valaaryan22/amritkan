'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('[Error Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="mt-1 text-xs text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={reset}
          >
            Try again
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/'}
          >
            Go to home
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 rounded border border-gray-200 p-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              Error details (development only)
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-gray-600">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

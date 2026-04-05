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
    // Log the error details
    console.error('[Main Layout Error]', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error.message || 'An unexpected error occurred while loading the page'}
          </p>
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
            onClick={() => {
              // Clear any cached data and reload
              if (typeof window !== 'undefined') {
                window.location.href = '/login'
              }
            }}
          >
            Back to login
          </Button>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-600">
            Error details: {error.message}
          </p>
        </div>
      </div>
    </div>
  )
}

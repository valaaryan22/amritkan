'use client'

/**
 * Example component demonstrating error handling patterns
 * This is for documentation purposes and should not be used in production
 */

import { useState } from 'react'
import { 
  ErrorBoundary, 
  NetworkError, 
  ValidationError,
  ValidationSummary,
  Button,
  Input,
  InlineSpinner,
  EmptyCart,
  ProductGridSkeleton
} from '@/components/ui'
import { handleError, handleValidationError } from '@/lib/errorHandler'
import { retryWithBackoff } from '@/lib/retryHandler'
import { toast } from '@/store/toastStore'

// Example 1: Component with error boundary
function ComponentWithError() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('This is a test error')
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-2">Component with Error Boundary</h3>
      <p className="text-sm text-gray-600 mb-4">
        This component is wrapped in an error boundary. Click the button to trigger an error.
      </p>
      <Button onClick={() => setShouldError(true)} variant="danger">
        Trigger Error
      </Button>
    </div>
  )
}

// Example 2: Network error with retry
function NetworkErrorExample() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(false)
    
    try {
      // Simulate API call with retry
      const result = await retryWithBackoff(
        async () => {
          // Simulate random failure
          if (Math.random() > 0.5) {
            throw new Error('Network error')
          }
          return { message: 'Data loaded successfully!' }
        },
        {
          maxRetries: 3,
          retryDelay: 1000,
          onRetry: (attempt) => {
            toast.info(`Retry attempt ${attempt}...`)
          }
        }
      )
      
      setData(result)
      toast.success('Data loaded!')
    } catch (err) {
      setError(true)
      handleError(err, 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-2">Network Error with Retry</h3>
      
      {loading && <InlineSpinner message="Loading data..." />}
      
      {error && !loading && (
        <NetworkError 
          message="Failed to load data. Please try again."
          onRetry={fetchData}
        />
      )}
      
      {data && !loading && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-900">{data.message}</p>
        </div>
      )}
      
      {!loading && !error && !data && (
        <Button onClick={fetchData} variant="primary">
          Load Data
        </Button>
      )}
    </div>
  )
}

// Example 3: Form validation errors
function ValidationExample() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Simulate validation error
      if (!email.includes('@')) {
        throw {
          response: {
            status: 400,
            data: {
              errors: {
                email: ['Please enter a valid email address'],
                phone: ['Phone number is required']
              }
            }
          }
        }
      }

      toast.success('Form submitted successfully!')
    } catch (error) {
      const fieldErrors = handleValidationError(error)
      setErrors(fieldErrors)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-4">Form Validation Example</h3>
      
      <ValidationSummary errors={errors} className="mb-4" />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <ValidationError message={errors.email} />
        </div>
        
        <div>
          <Input
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
          <ValidationError message={errors.phone} />
        </div>
        
        <Button type="submit" loading={loading} variant="primary">
          Submit
        </Button>
      </form>
    </div>
  )
}

// Example 4: Loading states
function LoadingStatesExample() {
  const [loading, setLoading] = useState(false)

  const simulateLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-4">Loading States Example</h3>
      
      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Click the button to see skeleton loading state
          </p>
          <Button onClick={simulateLoading} variant="primary">
            Load Products
          </Button>
        </div>
      )}
    </div>
  )
}

// Example 5: Empty states
function EmptyStatesExample() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-4">Empty States Example</h3>
      <EmptyCart onStartShopping={() => toast.info('Navigate to products')} />
    </div>
  )
}

// Main example component
export function ErrorHandlingExample() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Error Handling Examples</h1>
        <p className="text-gray-600">
          This page demonstrates various error handling patterns used in the app.
        </p>
      </div>

      <ErrorBoundary level="component">
        <ComponentWithError />
      </ErrorBoundary>

      <NetworkErrorExample />

      <ValidationExample />

      <LoadingStatesExample />

      <EmptyStatesExample />
    </div>
  )
}

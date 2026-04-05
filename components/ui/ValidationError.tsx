import { AlertCircle } from 'lucide-react'

interface ValidationErrorProps {
  message?: string
  className?: string
}

/**
 * Display validation error message for form fields
 */
export function ValidationError({ message, className = '' }: ValidationErrorProps) {
  if (!message) return null

  return (
    <div className={`flex items-start gap-1.5 text-sm text-red-600 mt-1 ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  )
}

interface ValidationSummaryProps {
  errors: Record<string, string>
  className?: string
}

/**
 * Display summary of all validation errors
 */
export function ValidationSummary({ errors, className = '' }: ValidationSummaryProps) {
  const errorMessages = Object.values(errors).filter(Boolean)
  
  if (errorMessages.length === 0) return null

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-900 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errorMessages.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

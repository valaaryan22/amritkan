'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from './Button'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  level?: 'page' | 'component'
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component for catching React errors
 * Provides different fallback UIs for page-level and component-level errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[Error Boundary] Caught error:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Page-level error fallback
      if (this.props.level === 'page') {
        const AlertCircleIcon = AlertCircle as any
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircleIcon className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We encountered an error while loading this page. Please try again.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={this.handleReset}
                  variant="primary"
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 overflow-auto p-2 bg-red-50 rounded">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      }

      // Component-level error fallback
      const AlertCircleIcon = AlertCircle as any
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-900 mb-1">
                Error loading component
              </h3>
              <p className="text-sm text-red-700 mb-3">
                Something went wrong. Please try again.
              </p>
              <Button
                onClick={this.handleReset}
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

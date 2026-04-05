'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  resultCount?: number
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search products...',
  resultCount 
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sync with parent value
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Real-time filtering with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {value && resultCount !== undefined && (
        <p className="mt-2 text-sm text-gray-600">
          {resultCount} {resultCount === 1 ? 'product' : 'products'} found
        </p>
      )}
    </div>
  )
}

'use client'

import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length: number
  onComplete: (otp: string) => void
  disabled?: boolean
  error?: boolean
}

export function OTPInput({ length, onComplete, disabled, error }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (disabled) return
    
    // Only allow digits
    const digit = value.replace(/[^0-9]/g, '')
    if (digit.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Call onComplete when all digits are filled
    if (newOtp.every(d => d !== '') && newOtp.join('').length === length) {
      onComplete(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return
    
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '')
    
    if (pastedData.length === length) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      inputRefs.current[length - 1]?.focus()
      onComplete(pastedData)
    }
  }

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="One-time password input">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={error}
          className={cn(
            'h-12 w-12 rounded-lg border-2 text-center text-xl font-semibold transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-red-500' : 'border-gray-300',
            otp[index] && !error && 'border-blue-600'
          )}
        />
      ))}
    </div>
  )
}

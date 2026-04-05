'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Razorpay: any
  }
}

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setIsLoaded(true)
      return
    }

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setIsLoaded(true)
    script.onerror = () => console.error('Failed to load Razorpay SDK')
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return { isLoaded }
}

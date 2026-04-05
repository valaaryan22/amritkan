'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log web vitals in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric)
    }
    
    // In production, send to analytics service
    // Example: sendToAnalytics(metric)
    
    // You can also send to your backend API
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    // })
  })

  return null
}

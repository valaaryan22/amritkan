/**
 * Performance monitoring utilities
 * Helps track and optimize application performance
 */

/**
 * Measure and log component render time
 */
export function measureRenderTime(componentName: string, callback: () => void) {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now()
    callback()
    const end = performance.now()
    const duration = end - start
    
    if (duration > 16) { // More than one frame (60fps)
      console.warn(`[Performance] ${componentName} took ${duration.toFixed(2)}ms to render`)
    }
  } else {
    callback()
  }
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // In production, you would send this to your analytics service
    // For now, we'll just log it in development
    console.log(metric)
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(img: HTMLImageElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement
        const src = target.dataset.src
        
        if (src) {
          target.src = src
          target.removeAttribute('data-src')
          observer.unobserve(target)
        }
      }
    })
  })

  observer.observe(img)
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

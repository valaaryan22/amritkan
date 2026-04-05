'use client'

import { useState, useEffect, useCallback } from 'react'
import { Banner } from '@/types'
import { getImageUrl } from '@/lib/api'
import { useBanners } from '@/hooks/useBanners'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BannerCarouselProps {
  onCategorySelect?: (categoryId: string) => void
  onProductClick?: (productId: string) => void
}

export function BannerCarousel({ onCategorySelect, onProductClick }: BannerCarouselProps) {
  const { data: banners = [], isLoading, error } = useBanners()
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  // Filter active banners and sort by order
  const activeBanners = banners
    .filter(banner => banner.is_active)
    .sort((a, b) => a.order - b.order)

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (activeBanners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [activeBanners.length])

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => 
      prev === 0 ? activeBanners.length - 1 : prev - 1
    )
  }, [activeBanners.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
  }, [activeBanners.length])

  const handleBannerClick = useCallback((banner: Banner) => {
    // Handle banners with no target (no click action)
    if (!banner.target_type) {
      return
    }

    switch (banner.target_type) {
      case 'product':
        if (banner.target_id) {
          if (onProductClick) {
            onProductClick(banner.target_id)
          } else {
            router.push(`/products/${banner.target_id}`)
          }
        }
        break
      
      case 'category':
        if (banner.target_id && onCategorySelect) {
          onCategorySelect(banner.target_id)
        }
        break
      
      case 'url':
        if (banner.target_url) {
          window.open(banner.target_url, '_blank', 'noopener,noreferrer')
        }
        break
    }
  }, [router, onCategorySelect, onProductClick])

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse">
        <div className="aspect-[16/9] md:aspect-[21/9]" />
      </div>
    )
  }

  // Error state
  if (error) {
    return null // Silently fail - banners are not critical
  }

  // No banners
  if (activeBanners.length === 0) {
    return null
  }

  const currentBanner = activeBanners[currentIndex]
  const imageUrl = getImageUrl(currentBanner.image) || '/placeholder-banner.png'
  const hasClickAction = !!currentBanner.target_type

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gray-100 shadow-md">
      {/* Banner Image */}
      <div
        className={`relative aspect-[16/9] md:aspect-[21/9] ${
          hasClickAction ? 'cursor-pointer' : ''
        }`}
        onClick={() => handleBannerClick(currentBanner)}
      >
        <Image
          src={imageUrl}
          alt={currentBanner.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
          priority={currentIndex === 0}
        />
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Navigation Arrows (only show if multiple banners) */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-5 w-5 text-gray-800" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next banner"
          >
            <ChevronRight className="h-5 w-5 text-gray-800" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                handleDotClick(index)
              }}
              className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to banner ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

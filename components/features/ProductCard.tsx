'use client'

import { useState } from 'react'
import { Product, Variant } from '@/types'
import { getImageUrl } from '@/lib/api'
import { Star, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import dynamic from 'next/dynamic'
import { useCartStore } from '@/store/cartStore'

// Lazy load VariantSelector since it's only shown when needed
const VariantSelector = dynamic(() => import('./VariantSelector').then(mod => ({ default: mod.VariantSelector })), {
  loading: () => null,
})

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [showVariantSelector, setShowVariantSelector] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const imageUrl = getImageUrl(product.image) || '/placeholder-product.png'
  const minPrice = Math.min(...product.variants.map(v => v.price))

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Check if product has no variants
    if (product.variants.length === 0) {
      alert('This product needs configuration. Please contact support.')
      return
    }
    
    // If single variant, add directly
    if (product.variants.length === 1) {
      const variant = product.variants[0]
      addItem(product, variant, 1)
      return
    }
    
    // Multiple variants, show selector
    setShowVariantSelector(true)
  }

  const handleVariantSelect = (variant: Variant) => {
    addItem(product, variant, 1)
  }

  return (
    <>
      <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
        <div
          onClick={() => onClick(product)}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onClick(product)
            }
          }}
          aria-label={`View details for ${product.name}`}
        >
          <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          
          <div className="p-2 sm:p-3 md:p-4">
            <h3 className="mb-1 text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
              {product.name}
            </h3>
            
            <div className="mb-2 flex items-center gap-1" aria-label={`Rating: ${Number(product.rating || 0).toFixed(1)} out of 5 stars, ${product.review_count || 0} reviews`}>
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {Number(product.rating || 0).toFixed(1)}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                ({product.review_count})
              </span>
            </div>
            
            <div className="flex items-baseline gap-1 mb-2 sm:mb-3">
              <span className="text-base sm:text-lg font-bold text-gray-900">
                ₹{minPrice}
              </span>
              {product.variants.length > 0 && (
                <span className="text-xs sm:text-sm text-gray-500">
                  / {product.variants[0].unit}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-2 pb-2 sm:px-3 sm:pb-3 md:px-4 md:pb-4">
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            icon={<ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />}
            className="w-full text-xs sm:text-sm"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <VariantSelector
        product={product}
        isOpen={showVariantSelector}
        onClose={() => setShowVariantSelector(false)}
        onSelect={handleVariantSelect}
      />
    </>
  )
}

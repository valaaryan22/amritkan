'use client'

import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { Package } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  emptyMessage?: string
  onProductClick: (product: Product) => void
}

export function ProductGrid({ 
  products, 
  loading = false, 
  emptyMessage = 'No products found',
  onProductClick 
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
        <Package className="mb-4 h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
        <p className="text-base sm:text-lg font-medium text-gray-600">{emptyMessage}</p>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onClick={onProductClick}
        />
      ))}
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-square w-full animate-pulse bg-gray-200" />
      <div className="p-4">
        <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}

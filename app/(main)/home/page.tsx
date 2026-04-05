'use client'

import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/features/ProductGrid'
import { SearchBar } from '@/components/features/SearchBar'
import { CategoryFilter } from '@/components/features/CategoryFilter'
import dynamic from 'next/dynamic'
import { Product } from '@/types'
import { useState, useMemo } from 'react'

// Lazy load BannerCarousel since it's not critical for initial render
const BannerCarousel = dynamic(() => import('@/components/features/BannerCarousel').then(mod => ({ default: mod.BannerCarousel })), {
  loading: () => <div className="h-48 sm:h-64 bg-gray-100 rounded-lg animate-pulse" />,
  ssr: false,
})

export default function HomePage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const { data: products, isLoading, error } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`)
  }

  const handleBannerProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  const handleBannerCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    // Scroll to products section
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return []
    
    let filtered = products.slice()

    // Filter by category
    if (selectedCategoryId) {
      filtered = filtered.filter((product) => product.category_id === selectedCategoryId)
    }

    // Filter by search query (case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(query)
        const descMatch = product.description.toLowerCase().includes(query)
        return nameMatch || descMatch
      })
    }

    return filtered
  }, [products, searchQuery, selectedCategoryId])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Milk Subscription
            </h1>
            
            {user && (
              <div className="flex items-center gap-4">
                <span className="hidden text-sm text-gray-600 sm:inline">
                  {user.name || user.phone}
                </span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner Carousel */}
        <div className="mb-8">
          <BannerCarousel
            onCategorySelect={handleBannerCategorySelect}
            onProductClick={handleBannerProductClick}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Browse Products
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Fresh milk and dairy products delivered to your doorstep
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={searchQuery || selectedCategoryId ? filteredProducts.length : undefined}
          />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">
              Failed to load products. Please try again.
            </p>
          </div>
        )}

        <ProductGrid
          products={filteredProducts}
          loading={isLoading}
          emptyMessage={
            searchQuery || selectedCategoryId
              ? 'No products found matching your filters'
              : 'No products available'
          }
          onProductClick={handleProductClick}
        />
      </main>
    </div>
  )
}

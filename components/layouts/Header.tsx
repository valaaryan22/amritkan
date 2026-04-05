'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserMenu } from './UserMenu'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/home?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm" role="banner">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/home" className="flex-shrink-0 text-lg sm:text-xl font-bold text-blue-600" aria-label="MilkSub Home">
            MilkSub
          </Link>

          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden flex-1 max-w-md md:block"
            role="search"
            aria-label="Search products"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
            {/* Search Button - Mobile */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 md:hidden touch-manipulation"
              aria-label={showSearch ? "Close search" : "Open search"}
              aria-expanded={showSearch}
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 touch-manipulation"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white" aria-hidden="true">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <UserMenu />
          </nav>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearch} role="search" aria-label="Search products">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}

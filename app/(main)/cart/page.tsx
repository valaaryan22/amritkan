'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { CartItemCard } from '@/components/features/CartItemCard'
import { CartSummary } from '@/components/features/CartSummary'
import { Button } from '@/components/ui/Button'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const { items, loadFromStorage, getSubtotal, getItemCount } = useCartStore()

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const subtotal = getSubtotal()
  const itemCount = getItemCount()

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
        <div className="mb-4 sm:mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
        </div>
        <h2 className="mb-2 text-xl sm:text-2xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="mb-4 sm:mb-6 text-center text-sm sm:text-base text-gray-600">
          Add some products to your cart to get started
        </p>
        <Link href="/home">
          <Button variant="primary" icon={<ArrowLeft className="h-4 w-4" />}>
            Start Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-sm sm:text-base text-gray-600">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Cart summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <CartSummary subtotal={subtotal} />
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { CartItem } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { getImageUrl } from '@/lib/api'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const imageUrl = getImageUrl(item.product.image) || '/placeholder-product.png'
  const itemTotal = item.variant.price * item.quantity

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleRemove = () => {
    if (showConfirmDelete) {
      removeItem(item.id)
    } else {
      setShowConfirmDelete(true)
      // Reset confirmation after 3 seconds
      setTimeout(() => setShowConfirmDelete(false), 3000)
    }
  }

  return (
    <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
      {/* Product image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={imageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
            <p className="text-sm text-gray-600">
              {item.variant.name} - {item.variant.unit}
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">₹{item.variant.price}</p>
          </div>

          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="h-fit rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={showConfirmDelete ? 'Confirm remove' : 'Remove item'}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Quantity controls and total */}
        <div className="mt-auto flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-medium text-gray-900">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Item total */}
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-bold text-gray-900">₹{itemTotal}</p>
          </div>
        </div>

        {/* Confirmation message */}
        {showConfirmDelete && (
          <p className="mt-2 text-sm text-red-600">Click again to confirm removal</p>
        )}
      </div>
    </div>
  )
}

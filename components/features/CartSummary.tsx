'use client'

import { Button } from '@/components/ui/Button'
import { CouponInput } from './CouponInput'
import { useCartStore } from '@/store/cartStore'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CartSummaryProps {
  subtotal: number
  deliveryCharges?: number
}

export function CartSummary({ subtotal, deliveryCharges }: CartSummaryProps) {
  const discount = useCartStore((state) => state.getDiscount())
  const total = subtotal - discount + (deliveryCharges || 0)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>

      {/* Coupon input */}
      <div className="mb-4">
        <CouponInput />
      </div>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span className="font-medium">₹{Number(subtotal || 0).toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">-₹{Number(discount || 0).toFixed(2)}</span>
          </div>
        )}

        {/* Delivery charges */}
        {deliveryCharges !== undefined && (
          <div className="flex justify-between text-gray-700">
            <span>Delivery Charges</span>
            <span className="font-medium">
              {deliveryCharges === 0 ? 'FREE' : `₹${Number(deliveryCharges || 0).toFixed(2)}`}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>₹{Number(total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <Link href="/checkout" className="mt-6 block">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          icon={<ArrowRight className="h-5 w-5" />}
        >
          Proceed to Checkout
        </Button>
      </Link>

      {/* Additional info */}
      {deliveryCharges === undefined && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Delivery charges will be calculated at checkout
        </p>
      )}
    </div>
  )
}

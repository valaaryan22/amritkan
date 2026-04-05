'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCartStore } from '@/store/cartStore'
import { Tag, X } from 'lucide-react'
import { couponApi } from '@/lib/api'

export function CouponInput() {
  const { coupon, applyCoupon, removeCoupon, items, getSubtotal } = useCartStore()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a coupon code')
      return
    }

    if (items.length === 0) {
      setError('Cannot apply coupon to an empty cart')
      return
    }

    setLoading(true)
    setError('')

    try {
      const subtotal = getSubtotal()
      const response = await couponApi.validate(code.trim(), subtotal)
      
      if (response.data.success) {
        applyCoupon({
          code: code.trim(),
          discount_amount: response.data.data.discount_amount,
          discount_type: response.data.data.discount_type,
        })
        setCode('')
      } else {
        setError(response.data.message || 'Invalid coupon code')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to validate coupon')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    removeCoupon()
    setError('')
  }

  if (coupon) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Coupon Applied</p>
              <p className="text-sm text-green-700">Code: {coupon.code}</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-100"
            aria-label="Remove coupon"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setError('')
          }}
          error={error}
          disabled={loading}
        />
        <Button
          variant="outline"
          onClick={handleApply}
          loading={loading}
          disabled={loading || !code.trim()}
          className="whitespace-nowrap"
        >
          Apply
        </Button>
      </div>
    </div>
  )
}

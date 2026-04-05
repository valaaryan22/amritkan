'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Package } from 'lucide-react'
import { orderApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export default function OrderSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null
      const response = await orderApi.getById(orderId)
      return response.data.data
    },
    enabled: !!orderId,
  })

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Button onClick={() => router.push('/home')}>Go to Home</Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2" />
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-600" />
        
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We&apos;ll deliver it to you soon.
        </p>

        {order && (() => {
          const num = order.orderNumber || order.order_number || ''
          const created = order.createdAt || order.created_at
          const tot = order.total || 0
          const pm = order.paymentMethod || order.payment_method || ''
          const st = order.orderStatus || order.order_status || order.status || 'pending'
          return (
          <div className="bg-white rounded-lg border p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <Package className="w-6 h-6 text-gray-600" />
              <div>
                <div className="font-semibold">Order #{num}</div>
                {created && (
                <div className="text-sm text-gray-600">
                  {new Date(created).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold">₹{Number(tot).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold capitalize">{pm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {st.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
          )
        })()}

        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/orders')}
          >
            View Orders
          </Button>
          <Button onClick={() => router.push('/home')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}

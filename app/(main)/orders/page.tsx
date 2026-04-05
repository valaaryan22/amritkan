'use client'

import { useQuery } from '@tanstack/react-query'
import { Package, RefreshCw, AlertCircle } from 'lucide-react'
import { orderApi } from '@/lib/api'
import { Order } from '@/types'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await orderApi.getAll()
      return response.data.data as Order[]
    },
    enabled: isAuthenticated, // Only fetch if authenticated
    retry: false, // Don't retry on error
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  // Show error message if API fails (but don't logout)
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Orders</h2>
        <p className="text-gray-500 mb-6">There was a problem loading your orders. Please try again.</p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-6">Start shopping to place your first order</p>
        <Button onClick={() => router.push('/home')}>Browse Products</Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
        >
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/orders/${order.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-semibold text-lg">Order #{order.orderNumber || 'N/A'}</div>
                <div className="text-sm text-gray-600">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }) : 'Unknown Date'}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus?.replace('_', ' ') || 'Unknown'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.items?.slice(0, 2).map((item) => (
                <div key={item.id} className="text-sm text-gray-600">
                  {item.productName || 'Unknown Product'} - {item.variantLabel || 'Unknown Variant'} × {item.quantity || 0}
                </div>
              )) || []}
              {(order.items?.length || 0) > 2 && (
                <div className="text-sm text-gray-500">
                  +{(order.items?.length || 0) - 2} more items
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="font-semibold text-lg">₹{Number(order.total || 0).toFixed(2)}</div>
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {order.paymentMethod || 'Unknown'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

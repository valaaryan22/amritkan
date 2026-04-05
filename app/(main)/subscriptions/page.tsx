'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar, RefreshCw, Plus } from 'lucide-react'
import { subscriptionApi } from '@/lib/api'
import { Subscription } from '@/types'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubscriptionCard } from '@/components/features/subscriptions/SubscriptionCard'

export default function SubscriptionsPage() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: subscriptions, isLoading, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      try {
        const response = await subscriptionApi.getAll()
        // Normalize API response (camelCase) to frontend format (snake_case)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (response.data.data as any[]).map((sub: any) => ({
          id: sub.id,
          customer_id: sub.customerId || sub.customer_id,
          product_id: sub.productId || sub.product_id,
          variant_id: sub.variantId || sub.variant_id,
          quantity: sub.quantity || 1,
          frequency: sub.frequency?.toUpperCase() || 'DAILY',
          start_date: sub.startDate || sub.start_date,
          next_delivery_date: sub.nextDeliveryDate || sub.next_delivery_date,
          end_date: sub.endDate || sub.end_date,
          total_deliveries: sub.totalDeliveries ?? sub.total_deliveries,
          completed_deliveries: sub.completedDeliveries ?? sub.completed_deliveries ?? 0,
          status: (sub.status || 'active').toLowerCase(),
          pause_start_date: sub.pauseStart || sub.pause_start_date,
          pause_end_date: sub.pauseEnd || sub.pause_end_date,
          product: sub.product || null,
          variant: sub.variant || (sub.product ? { id: '', name: sub.product.unit || 'Default', price: sub.product.price || 0, product_id: sub.product.id, unit: sub.product.unit || '', stock: 0, is_available: true } : null),
          created_at: sub.createdAt || sub.created_at,
          updated_at: sub.updatedAt || sub.updated_at,
        })) as Subscription[]
      } catch (error) {
        return []
      }
    },
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
            <div key={i} className="h-48 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Active Subscriptions</h2>
        <p className="text-gray-500 mb-6">Create a subscription for regular deliveries</p>
        <Button onClick={() => router.push('/subscriptions/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Subscription
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Subscriptions</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/subscriptions/create')}
            icon={<Plus className="w-4 h-4" />}
          >
            Create
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            onRefresh={refetch}
          />
        ))}
      </div>
    </div>
  )
}

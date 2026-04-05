'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Subscription } from '@/types'
import { Button } from '@/components/ui/Button'
import { Pause, Play, Trash2, Edit } from 'lucide-react'
import { getImageUrl, subscriptionApi } from '@/lib/api'
import { PauseSubscriptionModal } from './PauseSubscriptionModal'
import { UpdateQuantityModal } from './UpdateQuantityModal'
import { CancelSubscriptionModal } from './CancelSubscriptionModal'

interface SubscriptionCardProps {
  subscription: Subscription
  onRefresh: () => void
}

export function SubscriptionCard({ subscription, onRefresh }: SubscriptionCardProps) {
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const resumeMutation = useMutation({
    mutationFn: async () => {
      const response = await subscriptionApi.resume(subscription.id)
      return response.data
    },
    onSuccess: () => {
      onRefresh()
    },
  })

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'DAILY':
        return 'Daily'
      case 'ALTERNATE':
        return 'Alternate Days'
      case 'WEEKLY':
        return 'Weekly'
      case 'MONTHLY':
        return 'Monthly'
      default:
        return frequency
    }
  }

  const calculateProgress = () => {
    if (!subscription.total_deliveries) return null
    return ((subscription.completed_deliveries || 0) / subscription.total_deliveries) * 100
  }

  const progress = calculateProgress()

  return (
    <>
      <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(subscription.product?.image) || '/placeholder.png'}
              alt={subscription.product?.name || 'Product'}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>

          {/* Subscription Details */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{subscription.product?.name || 'Unknown Product'}</h3>
                <p className="text-sm text-gray-600">
                  {subscription.variant?.name || 'Unknown Variant'} × {subscription.quantity || 0}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(subscription.status)}`}>
                {subscription.status || 'Unknown'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-600">Frequency</div>
                <div className="font-medium">{getFrequencyLabel(subscription.frequency)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Next Delivery</div>
                <div className="font-medium">
                  {subscription.status === 'active' || subscription.status === 'paused'
                    ? subscription.next_delivery_date ? new Date(subscription.next_delivery_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }) : 'TBD'
                    : 'N/A'}
                </div>
              </div>
            </div>

            {/* Progress Bar for Limited Subscriptions */}
            {progress !== null && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>
                    {subscription.completed_deliveries || 0} / {subscription.total_deliveries || 0} deliveries
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              {subscription.status === 'active' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPauseModal(true)}
                    icon={<Pause className="w-4 h-4" />}
                  >
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUpdateModal(true)}
                    icon={<Edit className="w-4 h-4" />}
                  >
                    Update Quantity
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowCancelModal(true)}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {subscription.status === 'paused' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resumeMutation.mutate()}
                    loading={resumeMutation.isPending}
                    icon={<Play className="w-4 h-4" />}
                  >
                    Resume
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUpdateModal(true)}
                    icon={<Edit className="w-4 h-4" />}
                  >
                    Update Quantity
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowCancelModal(true)}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PauseSubscriptionModal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        subscription={subscription}
        onSuccess={onRefresh}
      />
      <UpdateQuantityModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        subscription={subscription}
        onSuccess={onRefresh}
      />
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        subscription={subscription}
        onSuccess={onRefresh}
      />
    </>
  )
}

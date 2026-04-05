'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Subscription } from '@/types'
import { subscriptionApi } from '@/lib/api'
import { AlertTriangle } from 'lucide-react'

interface CancelSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: Subscription
  onSuccess: () => void
}

export function CancelSubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onSuccess,
}: CancelSubscriptionModalProps) {
  const [error, setError] = useState('')

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await subscriptionApi.cancel(subscription.id)
      return response.data
    },
    onSuccess: () => {
      onSuccess()
      onClose()
      setError('')
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to cancel subscription')
    },
  })

  const handleConfirm = () => {
    setError('')
    cancelMutation.mutate()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancel Subscription">
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <div className="font-medium mb-1">Are you sure you want to cancel this subscription?</div>
            <div>This action cannot be undone. You will no longer receive deliveries for this subscription.</div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="font-medium mb-2">Subscription Details</div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Product: {subscription.product?.name || 'Unknown Product'}</div>
            <div>Variant: {subscription.variant?.name || 'Unknown Variant'}</div>
            <div>Quantity: {subscription.quantity}</div>
            <div>Frequency: {subscription.frequency}</div>
            {subscription.total_deliveries && (
              <div>
                Progress: {subscription.completed_deliveries} / {subscription.total_deliveries} deliveries
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Keep Subscription
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={cancelMutation.isPending}
            className="flex-1"
          >
            Cancel Subscription
          </Button>
        </div>
      </div>
    </Modal>
  )
}

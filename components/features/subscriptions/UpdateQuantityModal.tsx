'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Subscription } from '@/types'
import { subscriptionApi } from '@/lib/api'

interface UpdateQuantityModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: Subscription
  onSuccess: () => void
}

export function UpdateQuantityModal({
  isOpen,
  onClose,
  subscription,
  onSuccess,
}: UpdateQuantityModalProps) {
  const [quantity, setQuantity] = useState(subscription.quantity)
  const [error, setError] = useState('')

  const updateMutation = useMutation({
    mutationFn: async () => {
      const response = await subscriptionApi.updateQuantity(subscription.id, quantity)
      return response.data
    },
    onSuccess: () => {
      onSuccess()
      onClose()
      setError('')
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to update quantity')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (quantity < 1) {
      setError('Quantity must be at least 1')
      return
    }

    if (quantity === subscription.quantity) {
      setError('Please enter a different quantity')
      return
    }

    updateMutation.mutate()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Quantity">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Update quantity for {subscription.product?.name || 'Unknown Product'} - {subscription.variant?.name || 'Unknown Variant'}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          Changes will apply from the next delivery cycle
        </div>

        <Input
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          min={1}
          required
        />

        <div className="text-sm text-gray-600">
          Current quantity: {subscription.quantity}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={updateMutation.isPending} className="flex-1">
            Update Quantity
          </Button>
        </div>
      </form>
    </Modal>
  )
}

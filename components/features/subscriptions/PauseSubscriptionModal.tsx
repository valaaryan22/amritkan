'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Subscription } from '@/types'
import { subscriptionApi } from '@/lib/api'

interface PauseSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: Subscription
  onSuccess: () => void
}

export function PauseSubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onSuccess,
}: PauseSubscriptionModalProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')

  const pauseMutation = useMutation({
    mutationFn: async () => {
      const response = await subscriptionApi.pause(subscription.id, startDate, endDate)
      return response.data
    },
    onSuccess: () => {
      onSuccess()
      onClose()
      setStartDate('')
      setEndDate('')
      setError('')
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to pause subscription')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date')
      return
    }

    pauseMutation.mutate()
  }

  const minStartDate = new Date().toISOString().split('T')[0]
  const minEndDate = startDate || minStartDate

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pause Subscription">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Pause your subscription for {subscription.product?.name || 'Unknown Product'} - {subscription.variant?.name || 'Unknown Variant'}
        </div>

        <Input
          label="Pause Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={minStartDate}
          required
        />

        <Input
          label="Pause End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={minEndDate}
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={pauseMutation.isPending} className="flex-1">
            Pause Subscription
          </Button>
        </div>
      </form>
    </Modal>
  )
}

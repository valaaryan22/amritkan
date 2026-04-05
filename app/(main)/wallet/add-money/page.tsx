'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Wallet as WalletIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { walletApi } from '@/lib/api'
import { useRazorpay } from '@/hooks/useRazorpay'

export default function AddMoneyPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isLoaded: isRazorpayLoaded } = useRazorpay()
  
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  // Predefined amounts
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000]

  const initiatePaymentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await walletApi.initiateAddMoney(amount)
      return response.data?.data || response.data
    },
    onSuccess: async (data) => {
      // keyId comes directly from the addMoney response
      const razorpayKey = data.keyId || data.key_id
      const razorpayOrderId = data.razorpayOrderId || data.razorpay_order_id
      const amountInPaise = data.amount

      if (!razorpayKey || razorpayKey === 'test_key') {
        setError('Payment gateway not configured. Please contact support.')
        return
      }

      if (!razorpayOrderId) {
        setError('Failed to create payment order. Please try again.')
        return
      }

      // Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: amountInPaise,
        currency: data.currency || 'INR',
        name: 'Milk Subscription',
        description: 'Add money to wallet',
        order_id: razorpayOrderId,
        prefill: {
          name: data.customerName || '',
          email: data.customerEmail || '',
          contact: data.customerPhone || '',
        },
        handler: async (response: any) => {
          // Payment successful, verify with backend
          try {
            await verifyPaymentMutation.mutateAsync({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              amount: amountInPaise / 100,
            })
          } catch (error) {
            console.error('Payment verification failed:', error)
            setError('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled. Please try again.')
          },
        },
        theme: {
          color: '#3B82F6',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    },
    onError: (error: any) => {
      console.error('Failed to initiate payment:', error)
      setError(error.response?.data?.message || 'Failed to initiate payment. Please try again.')
    },
  })

  const verifyPaymentMutation = useMutation({
    mutationFn: async (data: {
      razorpayOrderId: string
      razorpayPaymentId: string
      razorpaySignature: string
      amount: number
    }) => {
      const response = await walletApi.verifyPayment(data)
      return response.data
    },
    onSuccess: () => {
      // Invalidate wallet queries to refresh balance
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      // Redirect to wallet page with success message
      router.push('/wallet?success=true')
    },
    onError: (error: any) => {
      console.error('Payment verification failed:', error)
      setError(error.response?.data?.message || 'Payment verification failed. Please contact support.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const amountNum = parseFloat(amount)

    // Validation
    if (!amount || isNaN(amountNum)) {
      setError('Please enter a valid amount')
      return
    }

    if (amountNum < 10) {
      setError('Minimum amount is ₹10')
      return
    }

    if (amountNum > 50000) {
      setError('Maximum amount is ₹50,000')
      return
    }

    if (!isRazorpayLoaded) {
      setError('Payment gateway is loading. Please wait...')
      return
    }

    initiatePaymentMutation.mutate(amountNum)
  }

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString())
    setError('')
  }

  const isLoading = initiatePaymentMutation.isPending || verifyPaymentMutation.isPending

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <WalletIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Add Money to Wallet</h1>
            <p className="text-gray-600">Enter amount to add to your wallet</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div>
            <Input
              label="Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError('')
              }}
              placeholder="Enter amount"
              min="10"
              max="50000"
              step="1"
              error={error}
            />
            <p className="text-sm text-gray-500 mt-2">
              Minimum: ₹10 | Maximum: ₹50,000
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                    amount === quickAmount.toString()
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Payment Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Secure payment via Razorpay</li>
              <li>• Instant wallet credit after successful payment</li>
              <li>• All major payment methods accepted</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading || !isRazorpayLoaded}
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </Button>

          {!isRazorpayLoaded && (
            <p className="text-sm text-gray-500 text-center">
              Loading payment gateway...
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

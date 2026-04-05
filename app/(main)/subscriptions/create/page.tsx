'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { productApi, subscriptionApi, walletApi } from '@/lib/api'
import { Product, Variant, SubscriptionFrequency } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft } from 'lucide-react'
import { getImageUrl } from '@/lib/api'
import { Wallet as WalletIcon, AlertCircle } from 'lucide-react'

export default function CreateSubscriptionPage() {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('DAILY')
  const [startDate, setStartDate] = useState('')
  const [isUnlimited, setIsUnlimited] = useState(true)
  const [totalDeliveries, setTotalDeliveries] = useState<number | ''>('')
  const [error, setError] = useState('')

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productApi.getAll()
      return response.data.data as Product[]
    },
  })

  // Wallet balance query
  const { data: walletData, isLoading: loadingWallet } = useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: async () => {
      try {
        const response = await walletApi.getBalance()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data.data as any
        return {
          balance: data.available ?? data.balance ?? 0,
        }
      } catch (error) {
        return { balance: 0 }
      }
    },
  })

  const walletBalance = walletData?.balance ?? 0
  const isWalletSufficient = walletBalance > 0

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await subscriptionApi.create(data)
      return response.data
    },
    onSuccess: () => {
      router.push('/subscriptions')
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to create subscription')
    },
  })

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    if (product.variants.length === 1) {
      setSelectedVariant(product.variants[0])
    } else {
      setSelectedVariant(null)
    }
  }

  const calculateEndDate = () => {
    if (isUnlimited || !totalDeliveries || !startDate) return null

    const start = new Date(startDate)
    let daysToAdd = 0

    switch (frequency) {
      case 'DAILY':
        daysToAdd = Number(totalDeliveries) - 1
        break
      case 'ALTERNATE':
        daysToAdd = (Number(totalDeliveries) - 1) * 2
        break
      case 'WEEKLY':
        daysToAdd = (Number(totalDeliveries) - 1) * 7
        break
    }

    const endDate = new Date(start)
    endDate.setDate(endDate.getDate() + daysToAdd)
    return endDate
  }

  const estimatedEndDate = calculateEndDate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedProduct || !selectedVariant) {
      setError('Please select a product and variant')
      return
    }

    if (!isWalletSufficient) {
      setError('Please add money to your wallet to create a subscription')
      return
    }

    if (!startDate) {
      setError('Please select a start date')
      return
    }

    if (!isUnlimited && (!totalDeliveries || totalDeliveries < 1)) {
      setError('Please enter a valid number of deliveries')
      return
    }

    const data = {
      products: [
        {
          productId: selectedProduct.id,
          quantity,
        }
      ],
      frequency: frequency.toLowerCase(),
      startDate,
      totalDeliveries: isUnlimited ? null : totalDeliveries,
    }

    createMutation.mutate(data)
  }

  const minDate = new Date().toISOString().split('T')[0]

  if (loadingProducts || loadingWallet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        icon={<ArrowLeft className="w-4 h-4" />}
        className="mb-4"
      >
        Back
      </Button>

      <h1 className="text-2xl font-bold mb-6">Create Subscription</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product
          </label>
          <div className="grid grid-cols-1 gap-3">
            {products?.map((product) => (
              <div
                key={product.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProduct?.id === product.id
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleProductSelect(product)}
              >
                <div className="flex gap-3">
                  <img
                    src={getImageUrl(product.image) || '/placeholder.png'}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">{product.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variant Selection */}
        {selectedProduct && selectedProduct.variants.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Variant
            </label>
            <div className="grid grid-cols-2 gap-3">
              {selectedProduct.variants.map((variant) => (
                <div
                  key={variant.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedVariant?.id === variant.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  <div className="font-medium">{variant.name}</div>
                  <div className="text-sm text-gray-600">₹{variant.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Frequency Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Frequency
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['DAILY', 'ALTERNATE', 'WEEKLY'] as SubscriptionFrequency[]).map((freq) => (
              <div
                key={freq}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  frequency === freq
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setFrequency(freq)}
              >
                <div className="font-medium">
                  {freq === 'ALTERNATE' ? 'Alternate Days' : freq.charAt(0) + freq.slice(1).toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={minDate}
          required
        />

        {/* Quantity */}
        <Input
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          min={1}
          required
        />

        {/* Total Deliveries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subscription Duration
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                checked={isUnlimited}
                onChange={() => setIsUnlimited(true)}
                className="mr-2"
              />
              <span>Unlimited (until cancelled)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!isUnlimited}
                onChange={() => setIsUnlimited(false)}
                className="mr-2"
              />
              <span>Limited deliveries</span>
            </label>
          </div>
          {!isUnlimited && (
            <div className="mt-3">
              <Input
                label="Number of Deliveries"
                type="number"
                value={totalDeliveries}
                onChange={(e) => setTotalDeliveries(e.target.value ? parseInt(e.target.value) : '')}
                min={1}
                required={!isUnlimited}
              />
            </div>
          )}
        </div>

        {/* Estimated End Date */}
        {estimatedEndDate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-900">Estimated End Date</div>
            <div className="text-blue-700">
              {estimatedEndDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Wallet Balance Section */}
        <div className={`border rounded-lg p-4 ${!isWalletSufficient ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <WalletIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Wallet Balance</span>
              </div>
              <div className={`text-2xl font-bold ${!isWalletSufficient ? 'text-red-600' : 'text-green-600'}`}>
                ₹{walletBalance.toFixed(2)}
              </div>
            </div>
            
            {!isWalletSufficient && (
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/wallet/add-money')}
                className="bg-white"
              >
                Add Money
              </Button>
            )}
          </div>
          
          {!isWalletSufficient && (
            <div className="mt-3 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Please add money to your wallet to create a subscription. Your balance must be greater than ₹0.</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createMutation.isPending}
            disabled={!selectedProduct || !selectedVariant || !isWalletSufficient}
            className="flex-1"
          >
            Create Subscription
          </Button>
        </div>
      </form>
    </div>
  )
}

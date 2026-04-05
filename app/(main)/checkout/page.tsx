'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Wallet, CreditCard, Banknote } from 'lucide-react'
import { customerApi, walletApi } from '@/lib/api'
import { Address, PaymentMethod } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useCities } from '@/hooks/useCities'
import { Button } from '@/components/ui/Button'
import { AddressSelector } from '@/components/features/AddressSelector'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getDiscount, getTotal } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay')
  const [deliveryCharge, setDeliveryCharge] = useState(30)

  const { data: addresses, isLoading: isAddressesLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await customerApi.getAddresses()
      return response.data.data as Address[]
    },
    enabled: isAuthenticated,
  })

  const { data: walletBalance } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      const response = await walletApi.getBalance()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response.data?.data as any
      return (data?.available ?? data?.balance ?? 0) as number
    },
    enabled: isAuthenticated,
  })

  const { data: cities = [] } = useCities()

  // Set default address on load
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.isDefault)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id)
      } else {
        setSelectedAddressId(addresses[0].id)
      }
    }
  }, [addresses, selectedAddressId])

  // Update delivery charge when address changes
  useEffect(() => {
    if (selectedAddressId && addresses && cities.length > 0) {
      const address = addresses.find((addr) => addr.id === selectedAddressId)
      if (address) {
        let city
        if (address.cityId) {
          city = cities.find((c) => c.id === address.cityId)
        }
        if (!city) {
          city = cities.find((c) => c.name.toLowerCase() === address.city.toLowerCase())
        }
        
        if (city) {
          const charge = parseFloat(city.deliveryCharge.toString())
          setDeliveryCharge(isNaN(charge) ? 30 : charge)
        }
      }
    }
  }, [selectedAddressId, addresses, cities])

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const total = getTotal(deliveryCharge)

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address')
      return
    }

    // Check wallet balance if wallet payment is selected
    if (paymentMethod === 'wallet' && (walletBalance || 0) < total) {
      alert('Insufficient wallet balance. Please add money to your wallet or choose another payment method.')
      return
    }

    // Store checkout data in session storage
    sessionStorage.setItem('checkout', JSON.stringify({
      selectedAddressId,
      paymentMethod,
      deliveryCharge,
    }))

    // Navigate to payment page
    router.push('/payment')
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">Add items to your cart before checking out</p>
        <Button onClick={() => router.push('/home')}>Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Address Selection */}
          <div className="bg-white rounded-lg border p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <h2 className="text-base sm:text-lg font-semibold">Delivery Address</h2>
            </div>
            
            {isAddressesLoading ? (
              <div className="flex justify-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : !addresses || addresses.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base text-gray-600 mb-4">No addresses found</p>
                <Button onClick={() => router.push('/addresses')}>Add Address</Button>
              </div>
            ) : (
              <AddressSelector
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
              />
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg border p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Payment Method</h2>
            
            <div className="space-y-2 sm:space-y-3">
              <label className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 touch-manipulation">
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-4 h-4"
                />
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-medium">Wallet</div>
                  {walletBalance !== undefined && (
                    <div className="text-xs sm:text-sm text-gray-600">
                      Balance: ₹{Number(walletBalance || 0).toFixed(2)}
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 touch-manipulation">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-4 h-4"
                />
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-medium">Online Payment</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Credit/Debit Card, UPI, Net Banking
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 touch-manipulation">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-4 h-4"
                />
                <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-medium">Cash on Delivery</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Pay when you receive
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-4 sm:p-6 sticky top-4">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 sm:space-y-3 mb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span>₹{Number(subtotal || 0).toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-xs sm:text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{Number(discount || 0).toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                <span>₹{Number(deliveryCharge || 0).toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-2 sm:pt-3 flex justify-between font-semibold text-base sm:text-lg">
                <span>Total</span>
                <span>₹{Number(total || 0).toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleProceedToPayment}
              className="w-full"
              disabled={!selectedAddressId}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

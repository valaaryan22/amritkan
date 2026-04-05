'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { orderApi, paymentApi, customerApi } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useRazorpay } from '@/hooks/useRazorpay'
import { PaymentMethod } from '@/types'

interface CheckoutData {
  selectedAddressId: string
  paymentMethod: PaymentMethod
  deliveryCharge: number
}

export default function PaymentPage() {
  const router = useRouter()
  const { items, coupon, getTotal, clear: clearCart } = useCartStore()
  const { user } = useAuthStore()
  const { isLoaded: isRazorpayLoaded } = useRazorpay()
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)

  // Load checkout data from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem('checkout')
    if (stored) {
      setCheckoutData(JSON.parse(stored))
    } else {
      // No checkout data, redirect back to checkout
      router.push('/checkout')
    }
  }, [router])

  const { data: address } = useQuery({
    queryKey: ['address', checkoutData?.selectedAddressId],
    queryFn: async () => {
      if (!checkoutData?.selectedAddressId) return null
      const response = await customerApi.getAddresses()
      const addresses = response.data.data
      return addresses.find((addr: any) => addr.id === checkoutData.selectedAddressId)
    },
    enabled: !!checkoutData?.selectedAddressId,
  })

  // Map frontend payment method names to backend expected values
  const mapPaymentMethod = (method: string) => {
    if (method === 'razorpay') return 'online'
    return method // 'wallet', 'cod' are same
  }

  // Get next delivery date (tomorrow)
  const getDeliveryDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0] // YYYY-MM-DD
  }

  const createOrderMutation = useMutation({
    mutationFn: async (paymentData?: any) => {
      if (!checkoutData) throw new Error('No checkout data')

      // Map payment method for overrides too
      const finalPaymentMethod = paymentData?.payment_method
        ? mapPaymentMethod(paymentData.payment_method)
        : mapPaymentMethod(checkoutData.paymentMethod)

      const orderData = {
        address_id: checkoutData.selectedAddressId,
        payment_method: finalPaymentMethod,
        delivery_date: getDeliveryDate(),
        items: items.map((item) => ({
          productId: item.product_id,
          variantId: item.variant_id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.variant.price,
        })),
        coupon_code: coupon?.code,
      }

      const response = await orderApi.create(orderData)
      const resData = response.data?.data || response.data
      // Backend returns { order: {...}, message: '...' }
      return resData?.order || resData
    },
    onSuccess: (order) => {
      clearCart()
      sessionStorage.removeItem('checkout')
      router.push(`/order-success?orderId=${order.id}`)
    },
    onError: (error: unknown) => {
      const errData = (error as any)?.response?.data
      console.error('[Payment] Order creation failed:', JSON.stringify(errData, null, 2))
      const message = errData?.error?.message || errData?.message || 
        (errData?.errors ? Object.values(errData.errors).flat().join(', ') : 'Failed to create order')
      alert(message)
    },
  })

  const handleRazorpayPayment = async () => {
    if (!isRazorpayLoaded) {
      alert('Payment gateway is loading. Please wait...')
      return
    }

    try {
      // First create the order to get order ID
      const orderResponse = await orderApi.create({
        address_id: checkoutData!.selectedAddressId,
        payment_method: 'online',
        delivery_date: getDeliveryDate(),
        items: items.map((item) => ({
          productId: item.product_id,
          variantId: item.variant_id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.variant.price,
        })),
        coupon_code: coupon?.code,
      })

      const resData = orderResponse.data?.data || orderResponse.data
      const order = resData?.order || resData
      const total = getTotal(checkoutData!.deliveryCharge)

      // Create Razorpay order
      const paymentOrderResponse = await paymentApi.createOrder(order.id, total)
      const razorpayOrder = paymentOrderResponse.data.data

      // Open Razorpay checkout
      const options = {
        key: razorpayOrder.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'Milk Subscription',
        description: 'Order Payment',
        order_id: razorpayOrder.razorpay_order_id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#22c55e',
        },
        handler: async (response: any) => {
          try {
            // Verify payment with backend
            await paymentApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            // Payment verified, redirect to success
            clearCart()
            sessionStorage.removeItem('checkout')
            router.push(`/order-success?orderId=${order.id}`)
          } catch (error: unknown) {
            alert('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: () => {
            alert('Payment cancelled. Your order is saved, you can complete payment later.')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.message || 'Failed to initiate payment'
      alert(message)
    }
  }

  const handleWalletPayment = async () => {
    try {
      // 1. Create the order
      const orderResponse = await orderApi.create({
        address_id: checkoutData!.selectedAddressId,
        payment_method: 'wallet',
        delivery_date: getDeliveryDate(),
        items: items.map((item) => ({
          productId: item.product_id,
          variantId: item.variant_id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.variant.price,
        })),
        coupon_code: coupon?.code,
      })

      const resData = orderResponse.data?.data || orderResponse.data
      const order = resData?.order || resData

      // 2. Process wallet payment against the order
      await paymentApi.payWithWallet(order.id)

      // 3. Success
      clearCart()
      sessionStorage.removeItem('checkout')
      router.push(`/order-success?orderId=${order.id}`)
    } catch (error: unknown) {
      const errData = (error as any)?.response?.data
      console.error('[Payment] Wallet payment failed:', JSON.stringify(errData, null, 2))
      const message = errData?.error?.message || errData?.message || 
        (errData?.errors ? Object.values(errData.errors).flat().join(', ') : 'Failed to process wallet payment')
      alert(message)
    }
  }

  const handleCODPayment = async () => {
    createOrderMutation.mutate({ payment_method: 'cod' })
  }

  useEffect(() => {
    if (!checkoutData || !address) return

    // Auto-initiate payment based on method
    if (checkoutData.paymentMethod === 'razorpay') {
      handleRazorpayPayment()
    } else if (checkoutData.paymentMethod === 'wallet') {
      handleWalletPayment()
    } else if (checkoutData.paymentMethod === 'cod') {
      handleCODPayment()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutData, address])

  if (!checkoutData) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-600" />
        <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
        <p className="text-gray-600">
          {checkoutData.paymentMethod === 'razorpay' && 'Opening payment gateway...'}
          {checkoutData.paymentMethod === 'wallet' && 'Processing wallet payment...'}
          {checkoutData.paymentMethod === 'cod' && 'Placing your order...'}
        </p>
      </div>
    </div>
  )
}

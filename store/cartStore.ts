import { create } from 'zustand'
import { CartItem, Product, Variant, AppliedCoupon } from '@/types'

interface CartState {
  items: CartItem[]
  coupon: AppliedCoupon | null
  addItem: (product: Product, variant: Variant, quantity: number) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clear: () => void
  getSubtotal: () => number
  getItemCount: () => number
  loadFromStorage: () => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  getDiscount: () => number
  getTotal: (deliveryCharge: number) => number
}

const CART_STORAGE_KEY = 'cart'

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  coupon: null,

  addItem: (product: Product, variant: Variant, quantity: number) => {
    const items = get().items
    const existingItem = items.find(
      (item) => item.product_id === product.id && item.variant_id === variant.id
    )

    let newItems: CartItem[]
    if (existingItem) {
      // Update quantity of existing item
      newItems = items.map((item) =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${product.id}-${variant.id}-${Date.now()}`,
        product_id: product.id,
        variant_id: variant.id,
        quantity,
        product,
        variant,
        added_at: new Date().toISOString(),
      }
      newItems = [...items, newItem]
    }

    set({ items: newItems })
    saveToStorage(newItems, get().coupon)
  },

  updateQuantity: (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId)
      return
    }

    const newItems = get().items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    )
    set({ items: newItems })
    saveToStorage(newItems, get().coupon)
  },

  removeItem: (itemId: string) => {
    const newItems = get().items.filter((item) => item.id !== itemId)
    set({ items: newItems })
    saveToStorage(newItems, get().coupon)
  },

  clear: () => {
    set({ items: [], coupon: null })
    saveToStorage([], null)
  },

  getSubtotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    )
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },

  applyCoupon: (coupon: AppliedCoupon) => {
    set({ coupon })
    saveToStorage(get().items, coupon)
  },

  removeCoupon: () => {
    set({ coupon: null })
    saveToStorage(get().items, null)
  },

  getDiscount: () => {
    const coupon = get().coupon
    if (!coupon) return 0

    const subtotal = get().getSubtotal()
    if (coupon.discount_type === 'fixed') {
      return Math.min(coupon.discount_amount, subtotal)
    } else {
      // percentage
      return (subtotal * coupon.discount_amount) / 100
    }
  },

  getTotal: (deliveryCharge: number) => {
    const subtotal = get().getSubtotal()
    const discount = get().getDiscount()
    return Math.max(0, subtotal - discount + deliveryCharge)
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        set({ 
          items: data.items || [],
          coupon: data.coupon || null
        })
      }
    } catch (error) {
      console.error('[Cart] Error loading from storage:', error)
    }
  },
}))

function saveToStorage(items: CartItem[], coupon: AppliedCoupon | null) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, coupon }))
  } catch (error) {
    console.error('[Cart] Error saving to storage:', error)
  }
}

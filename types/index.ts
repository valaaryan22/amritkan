// User types
export interface User {
  id: string
  phone: string
  name?: string
  email?: string
  created_at: string
  updated_at: string
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  image: string
  category_id: string
  category?: Category
  rating: number
  review_count: number
  variants: Variant[]
  created_at: string
  updated_at: string
}

export interface Variant {
  id: string
  product_id: string
  name: string
  price: number
  unit: string
  stock: number
  is_available: boolean
}

export interface Category {
  id: string
  name: string
  icon?: string
  order: number
}

// Cart types
export interface CartItem {
  id: string
  product_id: string
  variant_id: string
  quantity: number
  product: Product
  variant: Variant
  added_at: string
}

export interface CartState {
  items: CartItem[]
  coupon?: AppliedCoupon
  lastUpdated: string
}

export interface AppliedCoupon {
  code: string
  discount_amount: number
  discount_type: 'fixed' | 'percentage'
}

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled'
export type PaymentMethod = 'wallet' | 'razorpay' | 'cod'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  orderStatus: OrderStatus
  items: OrderItem[]
  subtotal: number
  discount: number
  deliveryCharge: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  address: Address
  deliveryDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productVariantId: string
  productName: string
  variantLabel: string
  quantity: number
  price: number
  total: number
}

// Subscription types
export type SubscriptionFrequency = 'DAILY' | 'ALTERNATE' | 'WEEKLY' | 'MONTHLY'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'completed'

export interface Subscription {
  id: string
  customer_id: string
  product_id: string
  variant_id: string
  quantity: number
  frequency: SubscriptionFrequency
  start_date: string
  next_delivery_date: string
  end_date?: string
  total_deliveries?: number
  completed_deliveries: number
  status: SubscriptionStatus
  pause_start_date?: string
  pause_end_date?: string
  product: Product
  variant: Variant
  created_at: string
  updated_at: string
}

// Wallet types
export type TransactionType = 'credit' | 'debit'

export interface Wallet {
  customer_id: string
  balance: number
  low_balance_threshold: number
  updated_at: string
}

export interface Transaction {
  id: string
  wallet_id: string
  type: TransactionType
  amount: number
  description: string
  reference_type?: string
  reference_id?: string
  balance_after: number
  created_at: string
}

// Address types
export interface Address {
  id: string
  customer_id?: string
  line1: string
  line2?: string
  cityId?: string
  city: string
  state: string
  pincode: string
  landmark?: string
  latitude?: number
  longitude?: number
  isDefault: boolean
  created_at?: string
  updated_at?: string
}

// Banner types
export interface Banner {
  id: string
  title: string
  image: string
  target_type?: 'product' | 'category' | 'url'
  target_id?: string
  target_url?: string
  order: number
  is_active: boolean
}

// City types
export interface City {
  id: string
  name: string
  state: string
  deliveryCharge: number
  isActive: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

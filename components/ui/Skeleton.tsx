interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

/**
 * Base skeleton component for loading states
 */
export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`animate-pulse bg-gray-200 ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

/**
 * Skeleton for product card
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
      <Skeleton variant="rectangular" className="w-full aspect-square" />
      <Skeleton variant="text" className="h-5 w-3/4" />
      <Skeleton variant="text" className="h-4 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton variant="text" className="h-6 w-20" />
        <Skeleton variant="rectangular" className="h-9 w-24" />
      </div>
    </div>
  )
}

/**
 * Skeleton for product grid
 */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Skeleton for cart item
 */
export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Skeleton variant="rectangular" className="w-20 h-20 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="rectangular" className="h-8 w-24" />
          <Skeleton variant="text" className="h-5 w-16" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for cart page
 */
export function CartSkeleton() {
  return (
    <div className="space-y-4">
      <CartItemSkeleton />
      <CartItemSkeleton />
      <CartItemSkeleton />
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <Skeleton variant="text" className="h-5 w-32" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="text" className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="text" className="h-4 w-16" />
          </div>
          <div className="flex justify-between pt-2 border-t">
            <Skeleton variant="text" className="h-6 w-24" />
            <Skeleton variant="text" className="h-6 w-20" />
          </div>
        </div>
        <Skeleton variant="rectangular" className="h-12 w-full" />
      </div>
    </div>
  )
}

/**
 * Skeleton for order card
 */
export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="text" className="h-4 w-24" />
        </div>
        <Skeleton variant="rectangular" className="h-6 w-20" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rectangular" className="w-16 h-16" />
        <Skeleton variant="rectangular" className="w-16 h-16" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t">
        <Skeleton variant="text" className="h-4 w-24" />
        <Skeleton variant="text" className="h-5 w-20" />
      </div>
    </div>
  )
}

/**
 * Skeleton for orders list
 */
export function OrdersListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Skeleton for subscription card
 */
export function SubscriptionCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
      <div className="flex gap-3">
        <Skeleton variant="rectangular" className="w-16 h-16 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-5 w-3/4" />
          <Skeleton variant="text" className="h-4 w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rectangular" className="h-6 w-20" />
        <Skeleton variant="rectangular" className="h-6 w-24" />
      </div>
      <div className="flex gap-2 pt-2 border-t">
        <Skeleton variant="rectangular" className="h-9 flex-1" />
        <Skeleton variant="rectangular" className="h-9 flex-1" />
      </div>
    </div>
  )
}

/**
 * Skeleton for subscriptions list
 */
export function SubscriptionsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SubscriptionCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Skeleton for wallet balance card
 */
export function WalletBalanceSkeleton() {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <Skeleton variant="text" className="h-4 w-32 bg-blue-400 mb-2" />
      <Skeleton variant="text" className="h-10 w-40 bg-blue-400 mb-4" />
      <Skeleton variant="rectangular" className="h-10 w-full bg-blue-400" />
    </div>
  )
}

/**
 * Skeleton for transaction item
 */
export function TransactionItemSkeleton() {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" className="h-5 w-48" />
        <Skeleton variant="text" className="h-4 w-32" />
      </div>
      <Skeleton variant="text" className="h-6 w-20" />
    </div>
  )
}

/**
 * Skeleton for wallet transactions list
 */
export function WalletTransactionsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <TransactionItemSkeleton key={index} />
      ))}
    </div>
  )
}

import { 
  ShoppingCart, 
  Package, 
  Calendar, 
  Wallet, 
  MapPin, 
  Search,
  LucideIcon 
} from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

/**
 * Generic empty state component
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

/**
 * Empty cart state
 */
export function EmptyCart({ onStartShopping }: { onStartShopping?: () => void }) {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Your cart is empty"
      description="Add some products to your cart to get started with your order."
      actionLabel="Start Shopping"
      onAction={onStartShopping}
    />
  )
}

/**
 * Empty orders state
 */
export function EmptyOrders({ onBrowseProducts }: { onBrowseProducts?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="No orders yet"
      description="You haven't placed any orders yet. Start shopping to place your first order."
      actionLabel="Browse Products"
      onAction={onBrowseProducts}
    />
  )
}

/**
 * Empty subscriptions state
 */
export function EmptySubscriptions({ onCreateSubscription }: { onCreateSubscription?: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="No active subscriptions"
      description="Create a subscription to get regular deliveries of your favorite products."
      actionLabel="Create Subscription"
      onAction={onCreateSubscription}
    />
  )
}

/**
 * Empty wallet transactions state
 */
export function EmptyWalletTransactions({ onAddMoney }: { onAddMoney?: () => void }) {
  return (
    <EmptyState
      icon={Wallet}
      title="No transactions yet"
      description="Your wallet transaction history will appear here once you add money or make purchases."
      actionLabel="Add Money"
      onAction={onAddMoney}
    />
  )
}

/**
 * Empty addresses state
 */
export function EmptyAddresses({ onAddAddress }: { onAddAddress?: () => void }) {
  return (
    <EmptyState
      icon={MapPin}
      title="No saved addresses"
      description="Add a delivery address to place orders and receive your products."
      actionLabel="Add Address"
      onAction={onAddAddress}
    />
  )
}

/**
 * Empty search results state
 */
export function EmptySearchResults({ 
  query, 
  onClearSearch 
}: { 
  query: string
  onClearSearch?: () => void 
}) {
  return (
    <EmptyState
      icon={Search}
      title="No products found"
      description={`We couldn't find any products matching "${query}". Try different keywords or browse all products.`}
      actionLabel="Clear Search"
      onAction={onClearSearch}
    />
  )
}

/**
 * Generic no results state
 */
export function NoResults({ 
  message = "No results found",
  description = "Try adjusting your filters or search criteria."
}: { 
  message?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      <p className="text-gray-600 max-w-sm">
        {description}
      </p>
    </div>
  )
}

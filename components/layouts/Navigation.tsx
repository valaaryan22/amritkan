'use client'

import { Home, ShoppingCart, Calendar, Package, Wallet } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()
  const itemCount = useCartStore((state) => state.getItemCount())

  const isActive = (path: string) => pathname.startsWith(path)

  const navItems = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: Package, label: 'Orders', href: '/orders' },
    { icon: Calendar, label: 'Subscriptions', href: '/subscriptions' },
    { icon: Wallet, label: 'Wallet', href: '/wallet' },
    { icon: ShoppingCart, label: 'Cart', href: '/cart', badge: itemCount },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white md:hidden safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors touch-manipulation min-h-[3rem]',
                  active ? 'text-blue-600' : 'text-gray-600'
                )}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="font-medium text-[10px] sm:text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:block md:w-64 md:flex-shrink-0">
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5" />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}

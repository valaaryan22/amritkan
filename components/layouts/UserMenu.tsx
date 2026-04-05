'use client'

import { useState, useRef, useEffect } from 'react'
import { User, LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const menuItems = [
    { icon: User, label: 'Profile', href: '/profile' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
          <User className="h-5 w-5" />
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User info */}
          {user && (
            <div className="border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user.phone}</p>
            </div>
          )}

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

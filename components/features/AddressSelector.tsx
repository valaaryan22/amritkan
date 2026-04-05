'use client'

import { Check, MapPin } from 'lucide-react'
import { Address } from '@/types'
import { useAuthStore } from '@/store/authStore'

interface AddressSelectorProps {
  addresses: Address[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function AddressSelector({ addresses, selectedId, onSelect }: AddressSelectorProps) {
  const { user } = useAuthStore()
  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <label
          key={address.id}
          className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedId === address.id
              ? 'border-blue-500 bg-blue-50'
              : 'hover:bg-gray-50'
          }`}
        >
          <input
            type="radio"
            name="address"
            value={address.id}
            checked={selectedId === address.id}
            onChange={() => onSelect(address.id)}
            className="mt-1 w-4 h-4"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="font-semibold">{user?.name || 'Customer'}</span>
              {address.isDefault && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Default
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-600 space-y-0.5">
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              {address.landmark && <p>Near: {address.landmark}</p>}
              <p>{address.city}, {address.state} - {address.pincode}</p>
              <p>{user?.phone}</p>
            </div>
          </div>
        </label>
      ))}
    </div>
  )
}

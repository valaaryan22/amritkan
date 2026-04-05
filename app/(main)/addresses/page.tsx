'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, MapPin, Trash2, Edit, Check } from 'lucide-react'
import { customerApi } from '@/lib/api'
import { Address } from '@/types'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { AddressForm } from '@/components/features/AddressForm'
import { useAuthStore } from '@/store/authStore'

export default function AddressesPage() {
  const { user } = useAuthStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const queryClient = useQueryClient()

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await customerApi.getAddresses()
      return response.data.data as Address[]
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (addressId: string) => customerApi.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })

  const setDefaultMutation = useMutation({
    mutationFn: (addressId: string) => 
      customerApi.updateAddress(addressId, { isDefault: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setIsFormOpen(true)
  }

  const handleDelete = (address: Address) => {
    if (window.confirm(`Are you sure you want to delete this address?\n\n${address.line1}, ${address.city}`)) {
      deleteMutation.mutate(address.id)
    }
  }

  const handleSetDefault = (address: Address) => {
    setDefaultMutation.mutate(address.id)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingAddress(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    queryClient.invalidateQueries({ queryKey: ['addresses'] })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Button
          onClick={() => setIsFormOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Address
        </Button>
      </div>

      {!addresses || addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Addresses Yet</h2>
          <p className="text-gray-500 mb-6">Add your first delivery address to get started</p>
          <Button onClick={() => setIsFormOpen(true)}>Add Address</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold">{user?.name || 'Customer'}</span>
                </div>
                {address.isDefault && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Default
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                {address.landmark && <p>Near: {address.landmark}</p>}
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p>{user?.phone}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(address)}
                  icon={<Edit className="w-4 h-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(address)}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Delete
                </Button>
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(address)}
                    loading={setDefaultMutation.isPending}
                  >
                    Set Default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={editingAddress ? 'Edit Address' : 'Add Address'}
        size="lg"
      >
        <AddressForm
          address={editingAddress || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleFormClose}
        />
      </Modal>
    </div>
  )
}

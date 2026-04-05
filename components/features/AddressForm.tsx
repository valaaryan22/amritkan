'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { customerApi } from '@/lib/api'
import { Address } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCities } from '@/hooks/useCities'

interface AddressFormProps {
  address?: Address
  onSuccess: () => void
  onCancel: () => void
}

interface AddressFormData {
  line1: string
  line2: string
  cityId: string
  city: string
  state: string
  pincode: string
  landmark: string
}

export function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
  const { data: cities = [] } = useCities()
  
  const [formData, setFormData] = useState<AddressFormData>({
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    cityId: address?.cityId || '',
    city: address?.city || '',
    state: address?.state || '',
    pincode: address?.pincode || '',
    landmark: address?.landmark || '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({})

  const mutation = useMutation({
    mutationFn: async (data: AddressFormData) => {
      // Backend expects either city_id or cityId. The payload will include cityId.
      if (address) {
        return customerApi.updateAddress(address.id, data)
      }
      return customerApi.addAddress(data)
    },
    onSuccess: () => {
      onSuccess()
    },
    onError: (error: any) => {
      const apiErrors = error.response?.data?.error?.details || error.response?.data?.errors
      if (apiErrors) {
        setErrors(apiErrors)
      } else {
        alert(error.response?.data?.error?.message || 'Failed to add address')
      }
    },
  })

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {}

    if (!formData.line1.trim()) {
      newErrors.line1 = 'Address line 1 is required'
    }

    if (!formData.cityId) {
      newErrors.cityId = 'City is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Pincode must be 6 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      mutation.mutate(formData)
    }
  }

  const handleChange = (field: keyof AddressFormData, value: string) => {
    if (field === 'cityId') {
      const selectedCity = cities.find(c => c.id === value)
      setFormData(prev => ({
        ...prev,
        cityId: value,
        city: selectedCity?.name || '',
        state: selectedCity?.state || prev.state,
      }))
      
      // Clear city, cityId, state errors
      setErrors(prev => ({ ...prev, cityId: undefined, city: undefined, state: undefined }))
      return
    }

    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Address Line 1"
        value={formData.line1}
        onChange={(e) => handleChange('line1', e.target.value)}
        error={errors.line1}
        placeholder="House no., Building name, Street"
        required
      />

      <Input
        label="Address Line 2 (Optional)"
        value={formData.line2}
        onChange={(e) => handleChange('line2', e.target.value)}
        error={errors.line2}
        placeholder="Locality, Area"
      />

      <Input
        label="Landmark (Optional)"
        value={formData.landmark}
        onChange={(e) => handleChange('landmark', e.target.value)}
        error={errors.landmark}
        placeholder="Nearby landmark"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">City</label>
          <select
            value={formData.cityId}
            onChange={(e) => handleChange('cityId', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${
              errors.cityId ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
            required
          >
            <option value="" disabled>Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.cityId && <p className="text-sm text-red-500">{errors.cityId}</p>}
        </div>

        <Input
          label="State"
          value={formData.state}
          onChange={(e) => handleChange('state', e.target.value)}
          error={errors.state}
          placeholder="State"
          required
        />
      </div>

      <Input
        label="Pincode"
        type="text"
        value={formData.pincode}
        onChange={(e) => handleChange('pincode', e.target.value)}
        error={errors.pincode}
        placeholder="6-digit pincode"
        required
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={mutation.isPending}
          className="flex-1"
        >
          {address ? 'Update Address' : 'Add Address'}
        </Button>
      </div>
    </form>
  )
}

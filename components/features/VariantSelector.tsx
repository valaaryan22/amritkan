import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Product, Variant } from '@/types'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VariantSelectorProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onSelect: (variant: Variant) => void
}

export function VariantSelector({ product, isOpen, onClose, onSelect }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)

  const handleSelect = () => {
    if (selectedVariant) {
      onSelect(selectedVariant)
      onClose()
      setSelectedVariant(null)
    }
  }

  const handleClose = () => {
    setSelectedVariant(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Select Variant" size="md">
      <div className="space-y-4">
        {/* Product info */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
          <img
            src={product.image}
            alt={product.name}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
          </div>
        </div>

        {/* Variant options */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Choose size:</p>
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              disabled={!variant.is_available}
              className={cn(
                'w-full flex items-center justify-between rounded-lg border-2 p-4 text-left transition-all',
                'hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
                selectedVariant?.id === variant.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white',
                !variant.is_available && 'cursor-not-allowed opacity-50'
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{variant.name}</span>
                  {!variant.is_available && (
                    <span className="text-xs text-red-600">(Out of stock)</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{variant.unit}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">
                  ₹{variant.price}
                </span>
                {selectedVariant?.id === variant.id && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSelect}
            disabled={!selectedVariant}
            className="flex-1"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Modal>
  )
}

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ShoppingCart, Star, Plus, Minus, Loader2, Package } from 'lucide-react'
import { productApi, getImageUrl } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { Product, Variant } from '@/types'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const addItem = useCartStore((state) => state.addItem)

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await productApi.getById(id)
      return response.data?.data || response.data
    },
    enabled: !!id,
  })

  const activeVariant = selectedVariant || product?.variants?.[0]
  const totalPrice = (activeVariant?.price || 0) * quantity

  const handleAddToCart = () => {
    if (!product || !activeVariant) return
    addItem(product, activeVariant, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#22c55e' }} />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#cbd5e1' }} />
          <p style={{ fontSize: '16px', color: '#ef4444' }}>Product not found</p>
          <button onClick={() => router.back()} style={{ marginTop: '12px', color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(product.image)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={() => router.back()} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft className="w-6 h-6" style={{ color: '#1e293b' }} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Product Details</h1>
        <div style={{ width: '40px' }} />
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Product Image */}
        {imageUrl ? (
          <div style={{ width: '100%', height: '300px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{ width: '100%', height: '300px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package className="w-20 h-20" style={{ color: '#cbd5e1' }} />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>{product.name}</h2>
          <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '22px', margin: '0 0 16px 0' }}>{product.description}</p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
            <Star className="w-5 h-5" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>{product.rating?.toFixed(1) || '0.0'}</span>
            <span style={{ fontSize: '14px', color: '#64748b' }}>({product.review_count || 0} reviews)</span>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>Select Variant</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {product.variants.map((variant) => {
                  const isSelected = activeVariant?.id === variant.id
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      style={{
                        padding: '12px',
                        minWidth: '100px',
                        textAlign: 'center',
                        borderRadius: '10px',
                        border: `1px solid ${isSelected ? '#22c55e' : '#e2e8f0'}`,
                        backgroundColor: isSelected ? '#f0fdf4' : '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '14px', color: isSelected ? '#22c55e' : '#64748b', fontWeight: isSelected ? '500' : '400' }}>
                        {variant.name}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: isSelected ? '#22c55e' : '#1e293b', marginTop: '4px' }}>
                        ₹{variant.price}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>Quantity</h3>
            <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Minus className="w-5 h-5" style={{ color: '#22c55e' }} />
              </button>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Plus className="w-5 h-5" style={{ color: '#22c55e' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Add to Cart */}
      <div style={{ position: 'sticky', bottom: 0, display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Total Price</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>₹{totalPrice.toFixed(2)}</div>
        </div>
        <button
          onClick={handleAddToCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: addedToCart ? '#16a34a' : '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          <ShoppingCart className="w-5 h-5" />
          {addedToCart ? 'Added! ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

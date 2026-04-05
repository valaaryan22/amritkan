'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Package, Loader2, MapPin, CreditCard, Calendar } from 'lucide-react'
import { orderApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await orderApi.getById(id)
      return response.data?.data || response.data
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#22c55e' }} />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#cbd5e1' }} />
          <p style={{ fontSize: '16px', color: '#ef4444', marginBottom: '12px' }}>Order not found</p>
          <Button onClick={() => router.push('/orders')}>View All Orders</Button>
        </div>
      </div>
    )
  }

  // Normalize camelCase from backend
  const orderNumber = order.orderNumber || order.order_number || ''
  const orderStatus = order.orderStatus || order.order_status || order.status || 'pending'
  const paymentMethod = order.paymentMethod || order.payment_method || ''
  const paymentStatus = order.paymentStatus || order.payment_status || ''
  const total = order.total || 0
  const subtotal = order.subtotal || 0
  const deliveryCharge = order.deliveryCharge ?? order.delivery_charge ?? 0
  const discount = order.discount || 0
  const deliveryDate = order.deliveryDate || order.delivery_date
  const createdAt = order.createdAt || order.created_at
  const items = order.items || []
  const address = order.address || null

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#fef3c7', text: '#92400e' },
    confirmed: { bg: '#dbeafe', text: '#1e40af' },
    out_for_delivery: { bg: '#e0e7ff', text: '#3730a3' },
    delivered: { bg: '#dcfce7', text: '#166534' },
    cancelled: { bg: '#fee2e2', text: '#991b1b' },
    failed: { bg: '#fee2e2', text: '#991b1b' },
  }

  const statusColor = statusColors[orderStatus] || statusColors.pending

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={() => router.back()} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft className="w-5 h-5" style={{ color: '#1e293b' }} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0 8px' }}>Order Details</h1>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '16px' }}>
        {/* Order Header Card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>Order #{orderNumber}</div>
              {createdAt && (
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
            <span style={{ backgroundColor: statusColor.bg, color: statusColor.text, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', textTransform: 'capitalize' }}>
              {orderStatus.replace(/_/g, ' ')}
            </span>
          </div>

          {deliveryDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
              <Calendar className="w-4 h-4" style={{ color: '#22c55e' }} />
              <span style={{ fontSize: '13px', color: '#166534' }}>
                Delivery: {new Date(deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>
            📦 Items ({items.length})
          </h2>
          {items.map((item: any, index: number) => (
            <div key={item.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: index < items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                  {item.productName || item.product_name || 'Product'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {item.variantLabel || item.variant_label || ''} × {item.quantity}
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                ₹{Number(item.total || item.price * item.quantity || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        {address && (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MapPin className="w-4 h-4" style={{ color: '#64748b' }} />
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Delivery Address</h2>
            </div>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '20px' }}>
              {[address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(', ')}
            </p>
          </div>
        )}

        {/* Payment Info */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CreditCard className="w-4 h-4" style={{ color: '#64748b' }} />
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Payment Summary</h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Subtotal</span>
            <span style={{ fontSize: '14px', color: '#1e293b' }}>₹{Number(subtotal).toFixed(2)}</span>
          </div>

          {Number(discount) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#22c55e' }}>Discount</span>
              <span style={{ fontSize: '14px', color: '#22c55e' }}>-₹{Number(discount).toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Delivery Charges</span>
            <span style={{ fontSize: '14px', color: '#1e293b' }}>₹{Number(deliveryCharge).toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>Total</span>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>₹{Number(total).toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Payment Method</span>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b', textTransform: 'capitalize' }}>{paymentMethod}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Payment Status</span>
            <span style={{ fontSize: '13px', fontWeight: '500', color: paymentStatus === 'paid' ? '#22c55e' : '#f59e0b', textTransform: 'capitalize' }}>{paymentStatus}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <Button variant="outline" onClick={() => router.push('/orders')} className="flex-1">
            All Orders
          </Button>
          <Button onClick={() => router.push('/home')} className="flex-1">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}

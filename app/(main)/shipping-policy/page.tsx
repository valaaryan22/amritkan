'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function ShippingPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={() => router.back()} style={{ marginRight: '16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft className="w-5 h-5" style={{ color: '#22c55e' }} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Shipping & Delivery Policy</h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginBottom: '16px' }}>Last Updated: January 2026</p>

        {/* Highlight Card */}
        <div style={{ backgroundColor: '#dcfce7', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🚚</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 4px 0' }}>Fresh Delivery, Every Day!</h2>
          <p style={{ fontSize: '14px', color: '#3b82f6', margin: 0 }}>We deliver fresh dairy products and fruits right to your doorstep</p>
        </div>

        {/* Delivery Areas */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>1. Delivery Areas</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0 }}>
            We currently deliver in select areas. You can check service availability by entering your pincode in the app. We are continuously expanding our delivery network.
          </p>
        </div>

        {/* Delivery Timings */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>2. Delivery Timings</h2>

          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>🌅 Morning Delivery</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#22c55e', margin: '2px 0' }}>6:00 AM - 9:00 AM</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Perfect for fresh milk and daily essentials</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>🌤️ Day Delivery</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#22c55e', margin: '2px 0' }}>10:00 AM - 1:00 PM</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>For on-demand orders and fresh fruits</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>🌆 Evening Delivery</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#22c55e', margin: '2px 0' }}>4:00 PM - 7:00 PM</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Evening slot for your convenience</div>
          </div>
        </div>

        {/* Order Cut-off */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>3. Order Cut-off Times</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`• For next morning delivery: Order before 8:00 PM\n• For same-day delivery: Order before 2:00 PM\n• Subscription orders are automatically scheduled\n• Orders placed after cut-off will be delivered next available slot`}
          </p>
        </div>

        {/* Delivery Charges */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>4. Delivery Charges</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`• Orders above ₹99: FREE delivery\n• Orders below ₹99: ₹20 delivery charge\n• Subscription orders: Always FREE delivery\n• Express delivery (if available): Additional ₹30`}
          </p>
        </div>

        {/* Minimum Order */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>5. Minimum Order Value</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`• Regular orders: No minimum order value\n• Cash on Delivery: Minimum ₹100\n• Some areas may have different minimums based on distance`}
          </p>
        </div>

        {/* Delivery Process */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>6. Delivery Process</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`1. You will receive an order confirmation via SMS/notification\n2. Delivery partner assigned - you'll get their details\n3. Real-time tracking available once out for delivery\n4. Delivery partner will call/ring bell upon arrival\n5. Please check products at the time of delivery`}
          </p>
        </div>

        {/* Contactless Delivery */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>7. Contactless Delivery</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`We offer contactless delivery option:\n\n• Select "Leave at door" during checkout\n• Delivery partner will place order at your doorstep\n• You'll receive a photo confirmation\n• Ideal for early morning deliveries`}
          </p>
        </div>

        {/* Failed Delivery */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>8. Failed Delivery</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`If delivery fails due to:\n\n• Customer unavailable: We'll attempt redelivery or refund\n• Wrong address: Please update address for redelivery\n• Restricted access: Contact us to arrange alternative\n\nFor perishable items, we cannot reattempt delivery. Refund will be processed.`}
          </p>
        </div>

        {/* Product Handling */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>9. Product Handling</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`• All dairy products are transported in insulated bags\n• Cold chain maintained throughout delivery\n• Fresh fruits are packed carefully to prevent damage\n• Products are checked before dispatch`}
          </p>
        </div>

        {/* Contact */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>10. Contact for Delivery Issues</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`For any delivery-related concerns:\n\n📧 Email: abhaybarad13@gmail.com\n📞 Phone: +91 98981 46462\n💬 WhatsApp: +91 98981 46462\n\nPlease contact within 2 hours of scheduled delivery time.`}
          </p>
        </div>

        <div style={{ padding: '16px', marginBottom: '32px' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic', margin: 0 }}>
            Delivery times may vary during festivals, bad weather, or unforeseen circumstances. We&apos;ll notify you of any delays.
          </p>
        </div>
      </div>
    </div>
  )
}

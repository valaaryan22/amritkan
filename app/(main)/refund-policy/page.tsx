'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function RefundPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={() => router.back()} style={{ marginRight: '16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft className="w-5 h-5" style={{ color: '#22c55e' }} />
        </button>
        <h1 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Cancellation & Refund Policy</h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginBottom: '16px' }}>Last Updated: January 2026</p>

        {/* Highlight Card */}
        <div style={{ backgroundColor: '#dcfce7', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#166534', margin: '0 0 4px 0' }}>100% Refund Guarantee</h2>
          <p style={{ fontSize: '14px', color: '#15803d', margin: 0 }}>Not satisfied? We&apos;ll make it right with a full refund or replacement</p>
        </div>

        {/* Order Cancellation */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>1. Order Cancellation</h2>

          <div style={{ display: 'flex', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>⏰</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>Before 8:00 PM (Previous Day)</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Full cancellation allowed. Amount refunded to original payment method.</div>
            </div>
          </div>

          <div style={{ display: 'flex', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>🚫</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>After 8:00 PM / Out for Delivery</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Cancellation not possible as order is already being prepared/dispatched.</div>
            </div>
          </div>
        </div>

        {/* Subscription Cancellation */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>2. Subscription Cancellation</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`• You can pause or cancel subscription anytime\n• Pause request before 6 PM for next day\n• Cancel subscription from app settings\n• Remaining wallet balance can be refunded\n• No cancellation charges apply`}
          </p>
        </div>

        {/* Refund Eligibility */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>3. Refund Eligibility</h2>
          <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>You are eligible for a refund if:</p>
          {['Product quality is not up to standard', 'Wrong product delivered', 'Product damaged during delivery', 'Product expired or near expiry', 'Missing items from order', 'Order not delivered'].map((item) => (
            <p key={item} style={{ fontSize: '14px', color: '#475569', margin: '6px 0 0 8px' }}>✓ {item}</p>
          ))}
        </div>

        {/* How to Request Refund */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>4. How to Request Refund</h2>
          {[
            'Report issue within 2 hours of delivery',
            'Share photos of the product (if quality issue)',
            'Contact us via WhatsApp or call',
            'Refund processed within 24-48 hours',
          ].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '14px', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', marginRight: '12px', flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: '14px', color: '#475569' }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Refund Methods */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>5. Refund Methods</h2>

          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>💳 Original Payment Method</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>UPI/Card/Net Banking: 5-7 business days</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>👛 App Wallet</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Instant credit - use for future orders</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>💵 Cash on Delivery</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Credited to app wallet or bank transfer</div>
          </div>
        </div>

        {/* Non-Refundable */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>6. Non-Refundable Cases</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`Refund may not be applicable if:\n\n• Issue reported after 2 hours of delivery\n• Product consumed or opened (except quality issues)\n• Incorrect address provided by customer\n• Customer unavailable for delivery\n• Change of mind after delivery`}
          </p>
        </div>

        {/* Replacement */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>7. Replacement Policy</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`Instead of refund, you can opt for:\n\n• Same product replacement (next delivery)\n• Different product of same value\n• Store credit for future use\n\nReplacements are subject to product availability.`}
          </p>
        </div>

        {/* Wallet Refunds */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>8. Wallet Refunds</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`For wallet balance refunds:\n\n• Minimum refund amount: ₹100\n• Refund to bank account: 3-5 business days\n• Promotional credits are non-refundable\n• Request via app or contact support`}
          </p>
        </div>

        {/* Contact */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>9. Contact for Refunds</h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>
            {`For refund requests or queries:\n\n📧 Email: abhaybarad13@gmail.com\n📞 Phone: +91 98981 46462\n💬 WhatsApp: +91 98981 46462\n\nSupport Hours: 7 AM - 9 PM (Mon-Sat)`}
          </p>
        </div>

        <div style={{ padding: '16px', marginBottom: '32px' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic', margin: 0, lineHeight: '18px' }}>
            We value your trust. Our goal is to ensure you receive fresh, quality products every time. If something goes wrong, we&apos;re here to help!
          </p>
        </div>
      </div>
    </div>
  )
}

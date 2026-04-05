'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  const router = useRouter()

  const sections = [
    {
      title: '1. About Our Products',
      content: 'We specialize in delivering fresh dairy products and fresh fruits directly to your doorstep. Our product range includes:',
      bullets: ['Fresh Milk (Full Cream, Toned, Double Toned)', 'Curd & Yogurt', 'Paneer & Cheese', 'Butter & Ghee', 'Fresh Seasonal Fruits', 'Fruit Baskets & Combos'],
    },
    {
      title: '2. Product Quality',
      content: 'All our dairy products are sourced from certified farms and dairies. Fresh fruits are handpicked to ensure premium quality. We maintain strict cold chain management to preserve freshness during delivery.',
    },
    {
      title: '3. Ordering & Delivery',
      content: '• Orders placed before 8 PM will be delivered next morning (6 AM - 9 AM)\n• Subscription orders are delivered daily at your preferred time slot\n• Delivery is available within our serviceable areas only\n• Minimum order value may apply for certain areas',
    },
    {
      title: '4. Freshness Guarantee',
      content: 'We guarantee the freshness of all our products. Dairy products are delivered within 24 hours of production. Fresh fruits are sourced daily from local markets and farms. If you receive any product that doesn\'t meet our quality standards, please contact us within 2 hours of delivery for a replacement or refund.',
    },
    {
      title: '5. Storage Instructions',
      content: '• Dairy products must be refrigerated immediately upon delivery\n• Milk should be consumed within 2-3 days of delivery\n• Fresh fruits should be stored as per their individual requirements\n• Do not freeze dairy products unless specified',
    },
    {
      title: '6. Subscription Terms',
      content: '• Subscriptions can be paused or cancelled anytime\n• Pause requests must be made before 6 PM for next day\n• Subscription prices are locked for the subscription period\n• Wallet balance can be used for subscription payments',
    },
    {
      title: '7. Payment & Refunds',
      content: '• We accept UPI, cards, net banking, and wallet payments\n• Cash on Delivery (COD) is available for orders above ₹100\n• Refunds for quality issues are processed within 24-48 hours\n• Wallet refunds are instant, bank refunds may take 5-7 business days',
    },
    {
      title: '8. Cancellation Policy',
      content: '• Orders can be cancelled before 8 PM for next day delivery\n• Once out for delivery, orders cannot be cancelled\n• Subscription deliveries can be skipped with advance notice\n• Refund will be credited to original payment method',
    },
    {
      title: '9. Contact Us',
      content: 'For any queries or concerns regarding these terms, please contact us at:\n\n📧 Email: abhaybarad13@gmail.com\n📞 Phone: +91 98981 46462\n\nOur support team is available Monday to Saturday, 7 AM to 9 PM.',
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={() => router.back()} style={{ marginRight: '16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft className="w-5 h-5" style={{ color: '#22c55e' }} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Terms & Conditions</h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginBottom: '16px' }}>Last Updated: January 2026</p>

        {sections.map((section) => (
          <div key={section.title} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>{section.title}</h2>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>{section.content}</p>
            {section.bullets && (
              <div style={{ marginTop: '8px' }}>
                {section.bullets.map((bullet) => (
                  <p key={bullet} style={{ fontSize: '14px', color: '#475569', margin: '4px 0 0 8px' }}>• {bullet}</p>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ padding: '16px', marginBottom: '32px' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic', margin: 0 }}>
            By using our app, you agree to these terms and conditions. We reserve the right to modify these terms at any time.
          </p>
        </div>
      </div>
    </div>
  )
}

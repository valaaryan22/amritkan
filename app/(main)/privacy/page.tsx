'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  const router = useRouter()

  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect the following information to provide you with our dairy and fresh fruits delivery services:',
      bullets: ['Name and contact details (phone number, email)', 'Delivery address and location data', 'Order history and preferences', 'Payment information (processed securely via Razorpay)', 'Device information for app functionality'],
    },
    {
      title: '2. How We Use Your Information',
      content: 'Your information is used for:',
      bullets: ['Processing and delivering your orders', 'Managing your subscriptions', 'Sending order updates and delivery notifications', 'Providing customer support', 'Improving our services and app experience', 'Sending promotional offers (with your consent)'],
    },
    {
      title: '3. Data Security',
      content: 'We take data security seriously:\n\n• All payment transactions are processed through Razorpay\'s secure payment gateway\n• We do not store your card details on our servers\n• Your personal data is encrypted and stored securely\n• Access to your data is restricted to authorized personnel only',
    },
    {
      title: '4. Information Sharing',
      content: 'We share your information only with:\n\n• Delivery partners (name, address, phone for delivery)\n• Payment processors (Razorpay) for transactions\n• Service providers who assist our operations\n\nWe never sell your personal information to third parties.',
    },
    {
      title: '5. Location Data',
      content: 'We collect location data to:\n\n• Verify delivery address accuracy\n• Provide real-time delivery tracking\n• Check service availability in your area\n\nYou can disable location access in your device settings, but this may affect delivery services.',
    },
    {
      title: '6. Push Notifications',
      content: 'We send push notifications for:\n\n• Order confirmations and updates\n• Delivery status and arrival alerts\n• Subscription reminders\n• Special offers and promotions\n\nYou can manage notification preferences in app settings.',
    },
    {
      title: '7. Your Rights',
      content: 'You have the right to:\n\n• Access your personal data\n• Update or correct your information\n• Delete your account and data\n• Opt-out of marketing communications\n• Request data portability\n\nContact us to exercise these rights.',
    },
    {
      title: '8. Data Retention',
      content: 'We retain your data for as long as your account is active or as needed to provide services. Order history is kept for 2 years for reference. You can request account deletion at any time.',
    },
    {
      title: '9. Children\'s Privacy',
      content: 'Our services are not intended for children under 18. We do not knowingly collect information from minors. If you believe a child has provided us with personal information, please contact us.',
    },
    {
      title: '10. Account Deletion',
      content: 'You can delete your account at any time from the Profile section. When you delete your account:\n\n• All personal data will be permanently removed\n• Order history will be anonymized for record-keeping\n• Active subscriptions must be cancelled first\n• Wallet balance must be used or withdrawn\n• This action cannot be undone\n\nTo delete your account, go to Profile → Delete Account.',
    },
    {
      title: '11. Contact Us',
      content: 'For privacy-related queries or concerns:\n\n📧 Email: abhaybarad13@gmail.com\n📞 Phone: +91 98981 46462\n\nWe will respond to your request within 48 hours.',
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={() => router.back()} style={{ marginRight: '16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft className="w-5 h-5" style={{ color: '#22c55e' }} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Privacy Policy</h1>
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
            By using our app, you consent to this Privacy Policy. We may update this policy periodically, and changes will be notified through the app.
          </p>
        </div>
      </div>
    </div>
  )
}

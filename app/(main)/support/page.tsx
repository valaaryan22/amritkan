'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight } from 'lucide-react'

export default function SupportPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={() => router.back()} style={{ marginRight: '16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft className="w-5 h-5" style={{ color: '#22c55e' }} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Support</h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#fff', borderRadius: '16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤝</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>We&apos;re here to help!</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '20px' }}>
            Have questions about your order or our products? Reach out to us anytime.
          </p>
        </div>

        {/* Contact Us */}
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>Contact Us</h3>

        {/* Call */}
        <a href="tel:+919898146462" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '24px' }}>📞</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Call Us</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>+91 98981 46462</div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#94a3b8' }} />
          </div>
        </a>

        {/* WhatsApp */}
        <a href="https://wa.me/919898146462?text=Hi, I need help with my order" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '24px' }}>💬</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', color: '#64748b' }}>WhatsApp</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>+91 98981 46462</div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#94a3b8' }} />
          </div>
        </a>

        {/* Email */}
        <a href="mailto:abhaybarad13@gmail.com?subject=Support Request" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '16px', cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '24px' }}>✉️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Email</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>abhaybarad13@gmail.com</div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#94a3b8' }} />
          </div>
        </a>

        {/* Support Hours */}
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>Support Hours</h3>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 4px 0' }}>🕐 Monday - Saturday: 7:00 AM - 9:00 PM</p>
          <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>🕐 Sunday: 8:00 AM - 6:00 PM</p>
        </div>

        {/* Quick Help */}
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>Quick Help</h3>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '32px', fontSize: '14px', color: '#475569', lineHeight: '22px' }}>
          • For order related queries, please have your order ID ready<br />
          • For delivery issues, contact us within 2 hours of delivery<br />
          • For product quality concerns, share photos via WhatsApp
        </div>
      </div>
    </div>
  )
}

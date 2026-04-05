'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import axios from 'axios'

export default function DeleteAccountPage() {
  const router = useRouter()
  const { logout, token } = useAuthStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showFinalConfirm, setShowFinalConfirm] = useState(false)

  const deleteAccount = async () => {
    try {
      setIsDeleting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      await axios.delete(`${apiUrl}/customers/account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      logout()
      router.push('/login')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to delete account. Please try again or contact support.'
      alert(message)
    } finally {
      setIsDeleting(false)
      setShowFinalConfirm(false)
    }
  }

  const infoItems = [
    { icon: '🗑️', title: 'All Data Deleted', text: 'Your profile, order history, addresses, and preferences will be permanently removed.' },
    { icon: '💳', title: 'Wallet Balance Lost', text: 'Any remaining wallet balance will be forfeited. Please use or withdraw it before deletion.' },
    { icon: '📦', title: 'Subscriptions Cancelled', text: 'All active subscriptions will be cancelled. You must cancel them manually before account deletion.' },
    { icon: '🔒', title: 'No Recovery', text: 'You cannot recover your account or data after deletion. You\'ll need to create a new account.' },
  ]

  const checklist = [
    'Cancel all active subscriptions',
    'Wait for pending orders to complete',
    'Use or withdraw wallet balance',
    'Download any important order receipts',
    'Save any addresses you might need',
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={() => router.back()} style={{ marginRight: '16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft className="w-5 h-5" style={{ color: '#22c55e' }} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Delete Account</h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        {/* Warning Card */}
        <div style={{ backgroundColor: '#fef2f2', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '20px', border: '2px solid #fecaca' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626', margin: '0 0 8px 0' }}>Warning: This Action is Permanent</h2>
          <p style={{ fontSize: '14px', color: '#991b1b', margin: 0, lineHeight: '20px' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>

        {/* What happens */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>What happens when you delete your account?</h2>
          {infoItems.map((item) => (
            <div key={item.title} style={{ display: 'flex', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '18px' }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>Before you delete:</h2>
          {checklist.map((item) => (
            <p key={item} style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 8px' }}>✓ {item}</p>
          ))}
        </div>

        {/* Alternative */}
        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #bfdbfe' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', margin: '0 0 8px 0' }}>Not sure about deleting?</h3>
          <p style={{ fontSize: '14px', color: '#1e40af', lineHeight: '20px', margin: '0 0 12px 0' }}>
            If you&apos;re having issues with our service, please contact our support team. We&apos;re here to help!
          </p>
          <button
            onClick={() => router.push('/support')}
            style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', width: '100%', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
          >
            Contact Support
          </button>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: isDeleting ? '#fca5a5' : '#dc2626',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isDeleting ? 'Deleting...' : 'Delete My Account Permanently'}
        </button>

        <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', lineHeight: '16px', marginBottom: '32px' }}>
          By deleting your account, you agree that all your data will be permanently removed from our systems in accordance with our Privacy Policy.
        </p>
      </div>

      {/* First Confirmation */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="⚠️ Delete Account">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: '#475569', margin: 0, lineHeight: '22px' }}>
            Are you absolutely sure you want to delete your account? This action cannot be undone.<br /><br />
            All your data including:<br />
            • Profile information<br />
            • Order history<br />
            • Saved addresses<br />
            • Wallet balance<br />
            • Subscriptions<br /><br />
            will be permanently deleted.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={() => { setShowConfirm(false); setShowFinalConfirm(true) }} className="flex-1">
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Final Confirmation */}
      <Modal isOpen={showFinalConfirm} onClose={() => setShowFinalConfirm(false)} title="Final Confirmation">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: '#475569', margin: 0 }}>
            This is your last chance. After this, your account and all data will be permanently deleted.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" onClick={() => setShowFinalConfirm(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteAccount} loading={isDeleting} disabled={isDeleting} className="flex-1">
              I Understand, Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

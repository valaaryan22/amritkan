'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { customerApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useRouter } from 'next/navigation'
import { LogOut, Trash2, ChevronRight, Save, X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name?: string; email?: string }) => {
      const response = await customerApi.updateProfile(data)
      return response.data
    },
    onSuccess: (data) => {
      if (user) {
        useAuthStore.getState().login({ ...user, ...data.data }, useAuthStore.getState().token!)
      }
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSuccess(''), 3000)
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to update profile')
      setTimeout(() => setError(''), 3000)
    },
  })

  const handleSaveProfile = () => {
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    updateProfileMutation.mutate({ name: name.trim(), email: email.trim() || undefined })
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false)
    handleLogout()
  }

  const menuItems = [
    { emoji: '✏️', label: 'Edit Profile', action: () => setIsEditing(true) },
    { emoji: '📍', label: 'Manage Addresses', action: () => router.push('/addresses') },
    { emoji: '🔔', label: 'Notifications', action: () => router.push('/notifications') },
    { emoji: '📞', label: 'Support', action: () => router.push('/support') },
    { emoji: '📄', label: 'Terms & Conditions', action: () => router.push('/terms') },
    { emoji: '🔒', label: 'Privacy Policy', action: () => router.push('/privacy') },
    { emoji: '🚚', label: 'Shipping & Delivery Policy', action: () => router.push('/shipping-policy') },
    { emoji: '💰', label: 'Cancellation & Refund Policy', action: () => router.push('/refund-policy') },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div
        style={{
          padding: '24px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
          Profile
        </h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Profile Card */}
        <div
          style={{
            backgroundColor: '#fff',
            padding: '32px 24px',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
            }}
          >
            <span style={{ fontSize: '32px', color: '#fff', fontWeight: 'bold' }}>
              {user?.name?.[0]?.toUpperCase() || '👤'}
            </span>
          </div>

          {/* User Info */}
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}>
            {user?.name || 'User'}
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 2px 0' }}>
            {user?.phone || 'No phone number'}
          </p>
          {user?.email && (
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              {user.email}
            </p>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div
            style={{
              margin: '0 16px 16px 16px',
              padding: '12px 16px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              color: '#166534',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ✅ {success}
          </div>
        )}

        {/* Edit Profile Modal */}
        <Modal
          isOpen={isEditing}
          onClose={() => {
            setIsEditing(false)
            setName(user?.name || '')
            setEmail(user?.email || '')
            setError('')
          }}
          title="Edit Profile"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={updateProfileMutation.isPending}
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email (optional)"
              disabled={updateProfileMutation.isPending}
            />

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>
                Phone
              </label>
              <div
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#64748b',
                }}
              >
                {user?.phone || 'Not set'}
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Phone number cannot be changed
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  color: '#dc2626',
                  fontSize: '14px',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
              <Button
                onClick={handleSaveProfile}
                loading={updateProfileMutation.isPending}
                disabled={updateProfileMutation.isPending}
                icon={<Save className="w-4 h-4" />}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setName(user?.name || '')
                  setEmail(user?.email || '')
                  setError('')
                }}
                disabled={updateProfileMutation.isPending}
                icon={<X className="w-4 h-4" />}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Menu Section */}
        <div style={{ backgroundColor: '#fff', marginBottom: '16px' }}>
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: 'none',
                borderBottom: index < menuItems.length - 1 ? '1px solid #f1f5f9' : 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{ fontSize: '20px', marginRight: '12px' }}>{item.emoji}</span>
              <span style={{ flex: 1, fontSize: '16px', color: '#1e293b' }}>{item.label}</span>
              <ChevronRight className="w-5 h-5" style={{ color: '#94a3b8' }} />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            width: 'calc(100% - 32px)',
            margin: '0 16px 8px 16px',
            padding: '16px',
            backgroundColor: '#fee2e2',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
        >
          <LogOut className="w-5 h-5" style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#ef4444' }}>Logout</span>
        </button>

        {/* Delete Account Button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            width: 'calc(100% - 32px)',
            margin: '0 16px 16px 16px',
            padding: '16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
        >
          <Trash2 className="w-4 h-4" style={{ color: '#dc2626' }} />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>Delete Account</span>
        </button>

        {/* Version */}
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', marginBottom: '24px', marginTop: '8px' }}>
          Version 1.0.0
        </p>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Logout"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: '#475569', margin: 0 }}>
            Are you sure you want to logout?
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleLogout}
              icon={<LogOut className="w-4 h-4" />}
              className="flex-1"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Account"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: '#475569', margin: 0 }}>
            Are you sure you want to delete your account? This action cannot be undone.
            All your data including orders, subscriptions, and wallet balance will be permanently deleted.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1"
            >
              Keep Account
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              icon={<Trash2 className="w-4 h-4" />}
              className="flex-1"
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

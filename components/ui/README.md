# UI Components

This directory contains reusable UI components for the customer web application.

## Components

### Button

A versatile button component with multiple variants and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean - Shows loading spinner
- `icon`: ReactNode - Optional icon to display

**Example:**
```tsx
import { Button } from '@/components/ui/Button'

<Button variant="primary" size="md" loading={isLoading}>
  Submit
</Button>
```

### Input

An accessible input component with label, error state, and helper text.

**Props:**
- `label`: string - Optional label text
- `error`: string - Error message to display
- `helperText`: string - Helper text below input

**Example:**
```tsx
import { Input } from '@/components/ui/Input'

<Input
  label="Email"
  type="email"
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### Modal

An accessible modal dialog with focus trap and keyboard navigation.

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Callback when modal closes
- `title`: string - Optional modal title
- `size`: 'sm' | 'md' | 'lg' | 'full'

**Features:**
- Focus trap (keeps focus within modal)
- Escape key to close
- Backdrop click to close
- Restores focus on close

**Example:**
```tsx
import { Modal } from '@/components/ui/Modal'

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action">
  <p>Are you sure you want to proceed?</p>
  <div className="mt-4 flex gap-2">
    <Button onClick={handleConfirm}>Confirm</Button>
    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
  </div>
</Modal>
```

### Toast

A toast notification system with auto-dismiss and queue management.

**Usage:**
```tsx
import { toast } from '@/store/toastStore'

// Success toast
toast.success('Order placed successfully!')

// Error toast
toast.error('Failed to process payment')

// Info toast
toast.info('Your session will expire in 5 minutes')

// Warning toast
toast.warning('Low wallet balance')

// Custom duration (default is 5000ms)
toast.success('Saved!', 3000)
```

**Features:**
- Auto-dismiss after specified duration
- Queue management (multiple toasts stack)
- Manual close button
- Color-coded by type
- Accessible (ARIA live regions)

**Setup:**
The ToastProvider is already included in the main layout, so you can use the toast helper anywhere in your app.

## Accessibility

All components follow WCAG 2.1 Level AA guidelines:
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Color contrast ratios
- Screen reader compatibility

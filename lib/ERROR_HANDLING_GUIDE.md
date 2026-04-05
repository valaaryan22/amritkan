# Error Handling Guide

This guide explains how to use the error handling utilities in the customer web app.

## Overview

The error handling system provides:
- Global error handlers for unhandled promise rejections
- Error boundary components for React errors
- Network error handling with retry logic
- Validation error display
- Business logic error handling
- Loading and empty state components

## Global Error Handler

Initialize the global error handler in your app initialization:

```typescript
import { initGlobalErrorHandlers } from '@/lib/globalErrorHandler'

// In your root layout or app initialization
useEffect(() => {
  initGlobalErrorHandlers()
}, [])
```

## Error Boundaries

### Page-Level Error Boundary

Wrap entire pages to catch and display page-level errors:

```tsx
import { ErrorBoundary } from '@/components/ui'

export default function ProductsPage() {
  return (
    <ErrorBoundary level="page">
      <ProductsContent />
    </ErrorBoundary>
  )
}
```

### Component-Level Error Boundary

Wrap individual components to isolate errors:

```tsx
import { ErrorBoundary } from '@/components/ui'

function Dashboard() {
  return (
    <div>
      <ErrorBoundary level="component">
        <ProductGrid />
      </ErrorBoundary>
      
      <ErrorBoundary level="component">
        <RecentOrders />
      </ErrorBoundary>
    </div>
  )
}
```

### Custom Error Fallback

Provide a custom fallback UI:

```tsx
<ErrorBoundary 
  fallback={
    <div>Custom error message</div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

## API Error Handling

### Basic Error Handling

```typescript
import { handleError } from '@/lib/errorHandler'

async function fetchProducts() {
  try {
    const response = await productApi.getAll()
    return response.data
  } catch (error) {
    handleError(error) // Automatically displays toast
    throw error
  }
}
```

### Custom Error Messages

```typescript
try {
  await orderApi.create(orderData)
} catch (error) {
  handleError(error, 'Failed to place order. Please try again.')
}
```

### Validation Errors

```typescript
import { handleValidationError } from '@/lib/errorHandler'

async function submitForm(data: FormData) {
  try {
    await api.post('/endpoint', data)
  } catch (error) {
    const fieldErrors = handleValidationError(error)
    setErrors(fieldErrors) // Set form field errors
  }
}
```

## Network Error Handling with Retry

### Automatic Retry

The API client automatically retries failed requests (network errors and 5xx errors) up to 3 times with exponential backoff.

### Manual Retry

```typescript
import { retryWithBackoff } from '@/lib/retryHandler'

const data = await retryWithBackoff(
  () => productApi.getAll(),
  {
    maxRetries: 3,
    retryDelay: 1000,
    onRetry: (attempt) => {
      console.log(`Retry attempt ${attempt}`)
    }
  }
)
```

### Display Network Error with Retry Button

```tsx
import { NetworkError } from '@/components/ui'

function ProductList() {
  const [error, setError] = useState(false)
  
  const fetchProducts = async () => {
    try {
      setError(false)
      const data = await productApi.getAll()
      setProducts(data)
    } catch (err) {
      setError(true)
    }
  }
  
  if (error) {
    return <NetworkError onRetry={fetchProducts} />
  }
  
  return <ProductGrid products={products} />
}
```

## Validation Error Display

### Inline Field Errors

```tsx
import { ValidationError } from '@/components/ui'

function FormField() {
  const [error, setError] = useState('')
  
  return (
    <div>
      <Input 
        value={value}
        onChange={onChange}
        error={error}
      />
      <ValidationError message={error} />
    </div>
  )
}
```

### Validation Summary

```tsx
import { ValidationSummary } from '@/components/ui'

function Form() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  return (
    <form>
      <ValidationSummary errors={errors} className="mb-4" />
      {/* Form fields */}
    </form>
  )
}
```

## Loading States

### Skeleton Screens

```tsx
import { ProductGridSkeleton } from '@/components/ui'

function ProductList() {
  const { data, isLoading } = useProducts()
  
  if (isLoading) {
    return <ProductGridSkeleton count={6} />
  }
  
  return <ProductGrid products={data} />
}
```

### Page Spinner

```tsx
import { PageSpinner } from '@/components/ui'

function CheckoutPage() {
  const [processing, setProcessing] = useState(false)
  
  if (processing) {
    return <PageSpinner message="Processing your order..." />
  }
  
  return <CheckoutForm />
}
```

### Inline Spinner

```tsx
import { InlineSpinner } from '@/components/ui'

function DataSection() {
  const { data, isLoading } = useData()
  
  if (isLoading) {
    return <InlineSpinner message="Loading data..." />
  }
  
  return <DataDisplay data={data} />
}
```

### Button Loading State

```tsx
import { Button } from '@/components/ui'

function SubmitButton() {
  const [loading, setLoading] = useState(false)
  
  return (
    <Button 
      loading={loading}
      onClick={handleSubmit}
    >
      Submit
    </Button>
  )
}
```

## Empty States

### Empty Cart

```tsx
import { EmptyCart } from '@/components/ui'
import { useRouter } from 'next/navigation'

function CartPage() {
  const router = useRouter()
  const { items } = useCart()
  
  if (items.length === 0) {
    return (
      <EmptyCart 
        onStartShopping={() => router.push('/')}
      />
    )
  }
  
  return <CartItems items={items} />
}
```

### Empty Orders

```tsx
import { EmptyOrders } from '@/components/ui'

function OrdersPage() {
  const { orders } = useOrders()
  
  if (orders.length === 0) {
    return (
      <EmptyOrders 
        onBrowseProducts={() => router.push('/')}
      />
    )
  }
  
  return <OrdersList orders={orders} />
}
```

### Empty Search Results

```tsx
import { EmptySearchResults } from '@/components/ui'

function SearchResults() {
  const [query, setQuery] = useState('')
  const results = useSearch(query)
  
  if (results.length === 0 && query) {
    return (
      <EmptySearchResults 
        query={query}
        onClearSearch={() => setQuery('')}
      />
    )
  }
  
  return <ResultsList results={results} />
}
```

## Error Type Checking

```typescript
import { isNetworkError, isAuthError } from '@/lib/errorHandler'

try {
  await api.call()
} catch (error) {
  if (isNetworkError(error)) {
    // Handle network error
    showRetryButton()
  } else if (isAuthError(error)) {
    // Handle auth error (already redirects to login)
    // Additional cleanup if needed
  } else {
    // Handle other errors
    handleError(error)
  }
}
```

## Success Confirmations

Use the toast system for success messages:

```typescript
import { toast } from '@/store/toastStore'

async function placeOrder() {
  try {
    await orderApi.create(orderData)
    toast.success('Order placed successfully!')
    router.push('/orders')
  } catch (error) {
    handleError(error)
  }
}
```

## Best Practices

1. **Always wrap pages in ErrorBoundary**: Prevents entire app crashes
2. **Use specific error messages**: Help users understand what went wrong
3. **Provide retry options**: For network errors and transient failures
4. **Show loading states**: Keep users informed during async operations
5. **Display empty states**: Guide users when there's no data
6. **Log errors**: Use console.error for debugging
7. **Don't expose technical details**: Show user-friendly messages
8. **Handle validation errors inline**: Show errors next to form fields
9. **Use skeleton screens**: Better UX than spinners for initial loads
10. **Test error scenarios**: Ensure error handling works correctly

## Session Expiry Handling

Session expiry (401 errors) is handled automatically:
- Auth token is cleared from localStorage
- User is redirected to login page
- No additional code needed in components

The API interceptor handles this globally, so you don't need to check for 401 errors in your components.

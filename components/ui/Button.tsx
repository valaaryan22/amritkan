import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation'
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 active:bg-blue-800',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 active:bg-gray-400',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 active:bg-gray-100',
      ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 active:bg-gray-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 active:bg-red-800',
    }
    
    const sizes = {
      sm: 'h-9 px-3 text-sm min-h-[2.25rem]',
      md: 'h-10 px-4 text-base min-h-[2.5rem]',
      lg: 'h-12 px-6 text-lg min-h-[3rem]',
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }

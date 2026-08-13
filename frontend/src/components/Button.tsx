import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variantStyles = {
  primary: `
    bg-accent
    text-white
    hover:bg-accent-hover
    active:scale-[0.98]
    shadow-sm
  `,

  secondary: `
    bg-card
    text-text-primary
    border
    border-border-default
    hover:bg-card-hover
  `,

  outline: `
    bg-transparent
    border
    border-border-default
    text-text-secondary
    hover:border-accent-light/50
    hover:text-text-primary
    hover:bg-card-hover/40
  `,

  danger: `
    bg-critical
    text-white
    hover:opacity-90
    active:scale-[0.98]
  `,
}

const sizeStyles = {
  sm: `
    px-3
    py-1.5
    text-xs
    rounded-lg
  `,

  md: `
    px-4
    py-2
    text-sm
    rounded-lg
  `,

  lg: `
    px-6
    py-3
    text-base
    rounded-lg
  `,
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2

        font-sans
        font-medium

        transition-all
        duration-150

        outline-none

        focus-visible:ring-2
        focus-visible:ring-accent/30
        focus-visible:ring-offset-0

        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:pointer-events-none

        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
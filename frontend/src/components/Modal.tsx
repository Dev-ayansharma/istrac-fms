import type  { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'lg'
  children: ReactNode
}

const sizeStyles = {
  sm: 'max-w-md',
  lg: 'max-w-2xl',
}

export function Modal({ isOpen, onClose, title, size = 'sm', children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className={`w-full ${sizeStyles[size]} bg-card border border-border-default rounded-lg shadow-xl p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="text-lg font-semibold text-text-primary mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
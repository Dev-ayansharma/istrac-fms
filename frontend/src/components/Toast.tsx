import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react'
import { useToastStore, type  ToastVariant } from '../store/toastStore'

interface ToastProps {
  id: string
  message: string
  title?: string
  variant: ToastVariant
  duration: number
  isPaused: boolean
}

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  success: { icon: CheckCircle2, color: 'text-nominal', bg: 'border-nominal/30' },
  info: { icon: Info, color: 'text-accent-light', bg: 'border-border-default' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'border-warning/30' },
  error: { icon: XCircle, color: 'text-critical', bg: 'border-critical/30' },
}

export function Toast({ id, message, title, variant, duration, isPaused }: ToastProps) {
  const removeToast = useToastStore((s) => s.removeToast)
  const pauseToast = useToastStore((s) => s.pauseToast)
  const resumeToast = useToastStore((s) => s.resumeToast)
  const [progress, setProgress] = useState(100)
  const startRef = useRef(Date.now())
  const rafRef = useRef<number>(0)

  const { icon: Icon, color, bg } = variantConfig[variant]

  useEffect(() => {
    if (isPaused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    startRef.current = Date.now()
    function tick() {
      const elapsed = Date.now() - startRef.current
      const pct = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(pct)
      if (pct <= 0) {
        removeToast(id)
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPaused, duration, id, removeToast])

  return (
    <div
      onMouseEnter={() => pauseToast(id)}
      onMouseLeave={() => resumeToast(id)}
      className={`relative w-80 bg-card border ${bg} rounded-md shadow-xl overflow-hidden`}
    >
      <div className="flex items-start gap-3 p-3">
        <Icon size={18} className={`${color} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {title && <p className="text-text-primary text-sm font-medium">{title}</p>}
          <p className="text-text-secondary text-sm">{message}</p>
        </div>
        <button onClick={() => removeToast(id)} className="text-text-muted hover:text-text-primary shrink-0">
          <X size={14} />
        </button>
      </div>
      <div className="h-0.5 bg-border-subtle">
        <div className={`h-full ${color.replace('text-', 'bg-')} transition-none`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
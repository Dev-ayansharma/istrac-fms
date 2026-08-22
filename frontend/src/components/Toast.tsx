import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react'
import { useToastStore, type ToastVariant } from '../store/toastStore'

interface ToastProps {
  id: string
  message: string
  title?: string
  variant: ToastVariant
  duration: number
  isPaused: boolean
}

const variantConfig: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; color: string; edge: string; bar: string }
> = {
  success: { icon: CheckCircle2, color: 'text-nominal', edge: 'border-l-nominal', bar: 'bg-nominal' },
  info: { icon: Info, color: 'text-accent-light', edge: 'border-l-accent', bar: 'bg-accent' },
  warning: { icon: AlertTriangle, color: 'text-warning', edge: 'border-l-warning', bar: 'bg-warning' },
  error: { icon: XCircle, color: 'text-critical', edge: 'border-l-critical', bar: 'bg-critical' },
}

export function Toast({ id, message, title, variant, duration, isPaused }: ToastProps) {
  const removeToast = useToastStore((s) => s.removeToast)
  const pauseToast = useToastStore((s) => s.pauseToast)
  const resumeToast = useToastStore((s) => s.resumeToast)
  const [progress, setProgress] = useState(100)
  const startRef = useRef(Date.now())
  const rafRef = useRef<number>(0)

  const { icon: Icon, color, edge, bar } = variantConfig[variant]

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
      role="status"
      onMouseEnter={() => pauseToast(id)}
      onMouseLeave={() => resumeToast(id)}
      className={`animate-rise pointer-events-auto relative w-80 overflow-hidden rounded-lg border border-l-2 border-border-default bg-card shadow-card-lg ${edge}`}
    >
      <div className="flex items-start gap-2.5 p-3">
        <Icon size={16} strokeWidth={1.8} className={`${color} mt-px shrink-0`} />

        <div className="min-w-0 flex-1">
          {title && <p className="text-[13px] font-bold text-text-primary">{title}</p>}
          <p className="text-[13px] leading-5 text-text-secondary">{message}</p>
        </div>

        <button
          type="button"
          onClick={() => removeToast(id)}
          aria-label="Dismiss"
          className="-m-1 shrink-0 rounded-md p-1 text-text-dim transition-colors duration-150 hover:bg-card-hover hover:text-text-primary"
        >
          <X size={13} />
        </button>
      </div>

      {/* Time remaining, as a hairline rather than a progress bar. */}
      <div className="h-px bg-border-subtle">
        <div className={`h-full ${bar}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

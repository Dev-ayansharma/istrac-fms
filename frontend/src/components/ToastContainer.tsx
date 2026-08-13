
import { useToastStore } from '../store/toastStore'

const variantStyles = {
  success: 'bg-nominal-bg text-nominal border-nominal/30',
  error: 'bg-critical-bg text-critical border-critical/30',
  info: 'bg-card text-text-primary border-border-default',
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className={`px-4 py-3 rounded-md border shadow-lg text-sm ${variantStyles[toast.variant]}`}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
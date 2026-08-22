import { useToastStore } from '../store/toastStore'
import { Toast } from './Toast'

/**
 * Toasts sit top-right so they never collide with the bulk-action bar that
 * floats along the bottom edge. The stack itself is click-through; each toast
 * re-enables pointer events for its own hover-to-pause and dismiss.
 */
export function ToastContainer() {
  const visible = useToastStore((s) => s.visible)

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2">
      {visible.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          title={toast.title}
          variant={toast.variant}
          duration={toast.duration}
          isPaused={toast.isPaused}
        />
      ))}
    </div>
  )
}

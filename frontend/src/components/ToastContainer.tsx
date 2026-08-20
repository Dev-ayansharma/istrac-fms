import { useToastStore } from '../store/toastStore'
import { Toast } from './Toast'

export function ToastContainer() {
  const visible = useToastStore((s) => s.visible)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
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
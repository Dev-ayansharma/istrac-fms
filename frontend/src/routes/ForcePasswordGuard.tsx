import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function ForcePasswordGuard() {
  const user = useAuthStore((s) => s.user)
  if (user?.tempPass) return <Navigate to="/force-password-change" replace />
  return <Outlet />
}
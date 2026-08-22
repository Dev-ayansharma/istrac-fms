import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-page text-text-primary antialiased">
      <Outlet />
    </div>
  )
}

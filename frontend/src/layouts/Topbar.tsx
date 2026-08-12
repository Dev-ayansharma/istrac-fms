import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { Avatar } from '../components'

export function Topbar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const [menuOpen, setMenuOpen] = useState(false)
  const [utcTime, setUtcTime] = useState('')

  useEffect(() => {
    const tick = () => setUtcTime(new Date().toUTCString().slice(17, 25))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <header className="h-14 bg-surface border-b border-border-subtle flex items-center justify-between px-6">
      <div className="text-xs text-text-muted font-mono">{utcTime} UTC</div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/notifications')}
          className="relative text-text-secondary hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-critical text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2">
            <Avatar name={user?.name ?? '?'} size="sm" />
            <div className="text-left hidden sm:block">
              <div className="text-sm text-text-primary leading-tight">{user?.name}</div>
              <div className="text-xs text-text-muted leading-tight">{user?.role}</div>
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-44 bg-card border border-border-default rounded-md shadow-xl z-20 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-card-hover hover:text-critical"
                >
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
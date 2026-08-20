import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { Avatar } from '../components'
import { useNotifications } from '../hooks/useNotifications'
export function Topbar() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const unreadCount = useNotificationStore(
    (state) => state.unreadCount,
  )

  const [menuOpen, setMenuOpen] = useState(false)
  const [utcTime, setUtcTime] = useState('')
const [bellMenuOpen, setBellMenuOpen] = useState(false)
const { data } = useNotifications()
const recentFive = data?.pages[0]?.data.slice(0, 5) ?? []
  useEffect(() => {
    function updateTime() {
      setUtcTime(
        new Date().toUTCString().slice(17, 25),
      )
    }

    updateTime()

    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  function handleLogout() {
    clearAuth()
    setMenuOpen(false)
    navigate('/login')
  }

  function handleNotifications() {
    navigate('/notifications')
  }

  function toggleMenu() {
    setMenuOpen((current) => !current)
  }

  return (
    <header className="h-14 bg-surface border-b border-border-subtle flex items-center justify-between px-6">
      {/* UTC Clock */}
      <div className="text-xs text-text-muted font-mono">
        {utcTime} UTC
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          type="button"
          onClick={handleNotifications}
          className="relative text-text-secondary hover:text-text-primary transition-colors"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : 'Notifications'
          }
        >
          <div className="relative">
  <button onClick={() => setBellMenuOpen((v) => !v)} className="relative text-text-secondary hover:text-text-primary">
    <Bell size={20} />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-critical text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </button>
  {bellMenuOpen && (
    <>
      <div className="fixed inset-0 z-10" onClick={() => setBellMenuOpen(false)} />
      <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border-default rounded-md shadow-xl z-20">
        <div className="px-3 py-2 border-b border-border-subtle text-xs text-text-muted">Notifications</div>
        {recentFive.length === 0 && <p className="text-text-muted text-sm px-3 py-4">No notifications yet.</p>}
        {recentFive.map((n) => (
          <div key={n.id} className="px-3 py-2 text-sm text-text-secondary border-b border-border-subtle last:border-0">
            {n.message}
          </div>
        ))}
        <button
          onClick={() => { setBellMenuOpen(false); navigate('/notifications') }}
          className="w-full text-center py-2 text-xs text-accent-light hover:underline"
        >
          View all →
        </button>
      </div>
    </>
  )}
</div>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-critical text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleMenu}
            className="flex items-center gap-2"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <Avatar
              name={user?.name ?? '?'}
              size="sm"
            />

            <div className="text-left hidden sm:block">
              <div className="text-sm text-text-primary leading-tight">
                {user?.name}
              </div>

              <div className="text-xs text-text-muted leading-tight">
                {user?.role}
              </div>
            </div>
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <button
                type="button"
                aria-label="Close user menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuOpen(false)}
              />

              {/* Menu */}
              <div
                className="absolute right-0 top-full mt-2 w-44 bg-card border border-border-default rounded-md shadow-xl z-20 py-1"
                role="menu"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-card-hover hover:text-critical transition-colors"
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
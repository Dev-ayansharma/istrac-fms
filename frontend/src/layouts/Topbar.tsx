import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { Avatar } from '../components'

export function Topbar() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const unreadCount = useNotificationStore(
    (state) => state.unreadCount,
  )

  const [menuOpen, setMenuOpen] = useState(false)
  const [utcTime, setUtcTime] = useState('')

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
          <Bell size={20} />

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
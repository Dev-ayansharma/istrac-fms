import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { navItems } from '../config/navigation'

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  const isAdmin =
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'DEPT_ADMIN'

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  )

  return (
    <aside
      className={`bg-surface border-r border-border-subtle flex flex-col transition-all duration-200 ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        {!sidebarCollapsed && (
          <span className="font-semibold text-text-primary text-sm">
            ISTRAC-FMS
          </span>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          className="text-text-secondary hover:text-text-primary"
          aria-label={
            sidebarCollapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
        >
          {sidebarCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={sidebarCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent-light'
                  : 'text-text-secondary hover:bg-card hover:text-text-primary'
              }`
            }
          >
            <item.icon size={18} />

            {!sidebarCollapsed && (
              <span>{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
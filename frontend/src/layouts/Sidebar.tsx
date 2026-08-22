import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { navItems, type NavItem } from '../config/navigation'

/** The crosshair mark, drawn from hairlines rather than shipped as an asset. */
function StationMark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-accent/30 bg-accent/10 text-accent-light"
    >
      <span className="relative block h-3.5 w-3.5">
        <span className="absolute top-[6px] left-0 h-px w-3.5 rotate-45 bg-current" />
        <span className="absolute top-[6px] left-0 h-px w-3.5 -rotate-45 bg-current" />
        <span className="absolute top-[3px] left-[3px] h-2 w-2 rounded-full border border-current" />
      </span>
    </span>
  )
}

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'DEPT_ADMIN'

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  /* The privilege boundary is real information, so the rail shows it as a
     break in the list rather than mixing both kinds of destination together. */
  const workspaceItems = visibleItems.filter((item) => !item.adminOnly)
  const adminItems = visibleItems.filter((item) => item.adminOnly)

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-border-subtle bg-surface transition-[width] duration-200 ${
        sidebarCollapsed ? 'w-14' : 'w-60'
      }`}
    >
      {/* Identity */}
      <div
        className={`flex h-14 shrink-0 items-center border-b border-border-subtle ${
          sidebarCollapsed ? 'justify-center px-2' : 'justify-between pr-2 pl-3'
        }`}
      >
        {!sidebarCollapsed && (
          <div className="flex min-w-0 items-center gap-2.5">
            <StationMark />

            <span className="truncate text-[13px] tracking-[0.06em] text-text-primary">
              ISTRAC<span className="text-accent-light">-FMS</span>
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          className="shrink-0 rounded-md p-1.5 text-text-dim transition-colors duration-150 hover:bg-card-hover hover:text-text-primary"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen size={16} strokeWidth={1.8} />
          ) : (
            <PanelLeftClose size={16} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Destinations */}
      <nav className="flex-1 overflow-y-auto py-3">
        <RailGroup
          label="Workspace"
          items={workspaceItems}
          collapsed={sidebarCollapsed}
        />

        {adminItems.length > 0 && (
          <RailGroup
            label="Administration"
            items={adminItems}
            collapsed={sidebarCollapsed}
            className="mt-5 border-t border-border-subtle pt-4"
          />
        )}
      </nav>

      {/* Station footer. Bengaluru ground station, where ISTRAC operates from. */}
      {!sidebarCollapsed && (
        <div className="shrink-0 border-t border-border-subtle px-3 py-3">
          <p className="eyebrow text-text-dim">Ground station</p>
          <p className="num mt-1.5 text-[10px] leading-4 text-text-dim">
            BLR · 13.03°N 77.51°E
          </p>
        </div>
      )}
    </aside>
  )
}

interface RailGroupProps {
  label: string
  items: NavItem[]
  collapsed: boolean
  className?: string
}

function RailGroup({ label, items, collapsed, className = '' }: RailGroupProps) {
  return (
    <div className={className}>
      {!collapsed && <p className="eyebrow px-3 pb-2 text-text-dim">{label}</p>}

      <ul className="space-y-px">
        {items.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 border-l-2 py-2 text-[13px] transition-colors duration-150 ${
                  collapsed ? 'justify-center px-0' : 'px-3'
                } ${
                  isActive
                    ? 'border-l-accent bg-accent/[0.07] text-text-primary'
                    : 'border-l-transparent text-text-muted hover:bg-card-hover hover:text-text-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={16}
                    strokeWidth={1.8}
                    className={`shrink-0 ${isActive ? 'text-accent-light' : ''}`}
                  />

                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

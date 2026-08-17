import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const TEST_USERS = {
  superAdmin: { id: '1', name: 'Test Admin', email: 'admin@istrac.local', role: 'SUPER_ADMIN' as const, tempPass: false },
  member: { id: '2', name: 'Test Member', email: 'member@istrac.local', role: 'MEMBER' as const, tempPass: false },
}

const PUBLIC_PAGES = [
  { path: '/', label: 'Landing (Hero, Announcement)' },
  { path: '/login', label: 'Login' },
  { path: '/register', label: 'Register' },
  { path: '/forgot-password', label: 'Forgot Password (3-step)' },
]

const USER_PAGES = [
  { path: '/dashboard', label: 'Dashboard (placeholder)' },
  { path: '/dashboard/files', label: 'Files (grid/list, upload, versions)' },
]

const ADMIN_PAGES = [
  { path: '/admin', label: 'Admin Home (stats, activity feed)' },
  { path: '/admin/approvals', label: 'Approval Queue' },
  { path: '/admin/users', label: 'User Management' },
  { path: '/admin/departments', label: 'Department Manager' },
  { path: '/admin/audit-logs', label: 'Audit Log Viewer' },
  { path: '/admin/broadcast', label: 'Broadcast Notification' },
  { path: '/admin/cms', label: 'CMS Editor (5 tabs)' },
  
]

export function DevIndex() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const user = useAuthStore((s) => s.user)

  if (import.meta.env.PROD) return null

  function Section({ title, pages }: { title: string; pages: { path: string; label: string }[] }) {
    return (
      <div>
        <h2 className="text-text-secondary text-sm font-medium mb-2">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pages.map((p) => (
            <Link
              key={p.path}
              to={p.path}
              className="block bg-card border border-border-subtle rounded-md px-3 py-2 text-sm text-text-primary hover:border-accent hover:text-accent-light"
            >
              {p.label}
              <span className="block text-xs text-text-muted font-mono mt-0.5">{p.path}</span>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page p-8 space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Dev Page Index</h1>
        <p className="text-text-muted text-sm">
          Current user: {user ? `${user.name} (${user.role})` : 'not logged in'}
        </p>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setAuth(TEST_USERS.superAdmin, 'fake-dev-token')} className="px-3 py-1.5 bg-accent text-white rounded-md text-sm">
            Set as Admin
          </button>
          <button onClick={() => setAuth(TEST_USERS.member, 'fake-dev-token')} className="px-3 py-1.5 bg-card border border-border-default text-text-primary rounded-md text-sm">
            Set as Member
          </button>
          <button onClick={clearAuth} className="px-3 py-1.5 text-critical text-sm">
            Clear (logout)
          </button>
        </div>
      </div>

      <Section title="Public" pages={PUBLIC_PAGES} />
      <Section title="User (requires login)" pages={USER_PAGES} />
      <Section title="Admin (requires SUPER_ADMIN/DEPT_ADMIN)" pages={ADMIN_PAGES} />
    </div>
  )
}
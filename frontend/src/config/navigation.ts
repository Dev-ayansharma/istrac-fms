import { LayoutDashboard, FileText, Bell, Users, ClipboardList, Settings,Building2,Megaphone, Layout } from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: typeof LayoutDashboard
  adminOnly?: boolean
}

export const navItems: NavItem[] = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Reports', path: '/dashboard/files', icon: FileText },
  { label: 'Alerts', path: '/notifications', icon: Bell },

  { label: 'Users', path: '/admin/users', icon: Users, adminOnly: true },
  { label: 'Approvals', path: '/admin/approvals', icon: ClipboardList, adminOnly: true },
  { label: 'Settings', path: '/admin/settings', icon: Settings, adminOnly: true },
  { label: 'Departments', path: '/admin/departments', icon: Building2, adminOnly: true },
  { label: 'Audit Log', path: '/admin/audit-logs', icon: ClipboardList, adminOnly: true },
  { label: 'Broadcast', path: '/admin/broadcast', icon: Megaphone, adminOnly: true },
  { label: 'CMS', path: '/admin/cms', icon: Layout, adminOnly: true },
]
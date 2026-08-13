import { LayoutDashboard, FileText, Bell, Upload, Users, ClipboardList, Settings,Building2 } from 'lucide-react'

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
  { label: 'Upload', path: '/dashboard/upload', icon: Upload },
  { label: 'Users', path: '/admin/users', icon: Users, adminOnly: true },
  { label: 'Approvals', path: '/admin/approvals', icon: ClipboardList, adminOnly: true },
  { label: 'Settings', path: '/admin/settings', icon: Settings, adminOnly: true },
  { label: 'Departments', path: '/admin/departments', icon: Building2, adminOnly: true },
  
]
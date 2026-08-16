export interface PermissionCategory {
  label: string
  keys: { key: string; description: string }[]
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    label: 'File Operations',
    keys: [
      { key: 'FILE_VIEW', description: 'View file metadata within the department' },
      { key: 'FILE_DOWNLOAD', description: 'Download file bytes' },
      { key: 'FILE_UPLOAD', description: 'Upload new files' },
      { key: 'FILE_DELETE', description: 'Soft-delete files (move to trash)' },
      { key: 'FILE_RESTORE', description: 'Restore files from trash' },
      { key: 'FILE_VERSION', description: 'Access and download version history' },
      { key: 'FILE_SHARE', description: 'Generate intranet share links' },
      { key: 'FILE_TAG', description: 'Add or remove tags on files' },
      { key: 'FILE_BULK', description: 'Perform bulk operations (delete, tag, move)' },
    ],
  },
  {
    label: 'Folder Operations',
    keys: [
      { key: 'FOLDER_CREATE', description: 'Create subfolders' },
      { key: 'FOLDER_RENAME', description: 'Rename folders' },
      { key: 'FOLDER_DELETE', description: 'Delete folders (soft-delete all contents)' },
    ],
  },
  {
    label: 'User Management',
    keys: [
      { key: 'USER_APPROVE', description: 'Approve or reject pending user registrations' },
      { key: 'USER_SUSPEND', description: 'Suspend or reinstate user accounts' },
    ],
  },
  {
    label: 'Audit & Export',
    keys: [
      { key: 'AUDIT_VIEW', description: 'View the department audit log' },
      { key: 'AUDIT_EXPORT', description: 'Export audit log as CSV' },
    ],
  },
  {
    label: 'System',
    keys: [
      { key: 'CMS_EDIT', description: 'Edit CMS landing page content' },
      { key: 'MANAGE_ROLES', description: 'Create, edit, and assign custom roles within own department' },
      { key: 'DEPT_SETTINGS', description: 'Edit department name, HDD path, and configuration' },
      { key: 'SEARCH_CROSS_DEPT', description: 'Search across departments (Super Admin only by default)' },
    ],
  },
]

export const ALL_PERMISSION_KEYS = PERMISSION_CATEGORIES.flatMap((c) => c.keys.map((k) => k.key))
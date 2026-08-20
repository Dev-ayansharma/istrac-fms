import { type UsersResponse } from '../hooks/useUsers'
export const departmentsFixture = [
  { id: 'd1a1a1a1-0000-0000-0000-000000000001', name: 'Engineering', hddPath: '/mnt/istrac-data/engineering', archived: false, fileCount: 128, lastUpdated: '2026-08-14T09:12:00Z' },
  { id: 'd1a1a1a1-0000-0000-0000-000000000002', name: 'HR', hddPath: '/mnt/istrac-data/hr', archived: false, fileCount: 42, lastUpdated: '2026-08-15T11:30:00Z' },
  { id: 'd1a1a1a1-0000-0000-0000-000000000003', name: 'Finance', hddPath: '/mnt/istrac-data/finance', archived: false, fileCount: 76, lastUpdated: '2026-08-13T16:45:00Z' },
  { id: 'd1a1a1a1-0000-0000-0000-000000000004', name: 'Legacy Ops', hddPath: '/mnt/istrac-data/legacy-ops', archived: true, fileCount: 9, lastUpdated: '2025-11-02T10:00:00Z' },
]

export const adminStatsFixture = {
  users: 47,
  files: 1284,
  departments: 4,
  storageUsedBytes: 18253611008,
}

export const usersFixture : UsersResponse = {
  data: [
    { id: 'u1', name: 'Ayan Sharma', email: 'ayan.sharma@istrac.local', employeeId: 'EMP-0001', role: 'SUPER_ADMIN', status: 'ACTIVE', createdAt: '2026-01-10T08:00:00Z' },
    { id: 'u2', name: 'Priya Nair', email: 'priya.nair@istrac.local', employeeId: 'EMP-0014', role: 'DEPT_ADMIN', status: 'ACTIVE',  createdAt: '2026-02-03T08:00:00Z' },
    { id: 'u3', name: 'Rohan Verma', email: 'rohan.verma@istrac.local', employeeId: 'EMP-0022', role: 'MEMBER', status: 'ACTIVE', createdAt: '2026-03-11T08:00:00Z' },
    { id: 'u4', name: 'Sneha Iyer', email: 'sneha.iyer@istrac.local', employeeId: 'EMP-0031', role: 'MEMBER', status: 'SUSPENDED',  createdAt: '2026-04-05T08:00:00Z' },
    { id: 'u5', name: 'Karan Mehta', email: 'karan.mehta@istrac.local', employeeId: 'EMP-0040', role: 'GUEST', status: 'ACTIVE',  createdAt: '2026-06-20T08:00:00Z' },
  ],
  pagination: { total: 47, page: 1, pageSize: 20, totalPages: 3, },
}

export const pendingUsersFixture = [
  {
    id: 'p1',
    name: 'Vikram Rao',
    email: 'vikram.rao@istrac.local',
    employeeId: 'EMP-0055',
    departmentPreference: 'Engineering',
    reasonForAccess: 'Joining the flight dynamics team, need access to orbit maintenance reports.',
    createdAt: '2026-08-15T14:22:00Z',
  },
  {
    id: 'p2',
    name: 'Anjali Desai',
    email: 'anjali.desai@istrac.local',
    employeeId: 'EMP-0056',
    departmentPreference: 'HR',
    reasonForAccess: 'New HR coordinator, need access to onboarding documents.',
    createdAt: '2026-08-16T09:05:00Z',
  },
]

export const filesFixture = [
  { id: 'f1', name: 'Mission Reports', nodeType: 'FOLDER' as const, departmentId: departmentsFixture[0].id, parentId: null, sizeBytes: null, mimeType: null, status: 'ACTIVE' as const, createdAt: '2026-05-01T10:00:00Z' },
  { id: 'f2', name: 'Anomaly Logs', nodeType: 'FOLDER' as const, departmentId: departmentsFixture[0].id, parentId: null, sizeBytes: null, mimeType: null, status: 'ACTIVE' as const, createdAt: '2026-05-02T10:00:00Z' },
  { id: 'f3', name: 'design-doc.pdf', nodeType: 'FILE' as const, departmentId: departmentsFixture[0].id, parentId: null, sizeBytes: 2456000, mimeType: 'application/pdf', status: 'ACTIVE' as const, createdAt: '2026-08-10T13:20:00Z' },
  { id: 'f4', name: 'orbit-summary-q3.xlsx', nodeType: 'FILE' as const, departmentId: departmentsFixture[0].id, parentId: null, sizeBytes: 845000, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', status: 'ACTIVE' as const, createdAt: '2026-08-12T09:40:00Z' },
  { id: 'f5', name: 'payload-photo.jpg', nodeType: 'FILE' as const, departmentId: departmentsFixture[0].id, parentId: null, sizeBytes: 3120000, mimeType: 'image/jpeg', status: 'ACTIVE' as const, createdAt: '2026-08-14T15:00:00Z' },
]

export const recentFilesFixture = [
  { id: 'f5', name: 'payload-photo.jpg', departmentName: 'Engineering', uploadedAt: '2026-08-14T15:00:00Z', mimeType: 'image/jpeg', size: 3120000 },
  { id: 'f4', name: 'orbit-summary-q3.xlsx', departmentName: 'Engineering', uploadedAt: '2026-08-12T09:40:00Z', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 845000 },
  { id: 'f3', name: 'design-doc.pdf', departmentName: 'Engineering', uploadedAt: '2026-08-10T13:20:00Z', mimeType: 'application/pdf', size: 2456000 },
  { id: 'f6', name: 'onboarding-checklist.docx', departmentName: 'HR', uploadedAt: '2026-08-09T11:00:00Z', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: null },
  { id: 'f7', name: 'q3-budget.xlsx', departmentName: 'Finance', uploadedAt: '2026-08-08T08:30:00Z', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: null },
]

export const auditLogFixture = {
  data: [
    { id: 1001, userId: 'u1', userName: 'Ayan Sharma', action: 'FILE_UPLOAD', resourceType: 'file', resourceId: 'f3', oldValue: null, newValue: { name: 'design-doc.pdf' }, createdAt: '2026-08-16T10:15:00Z' },
    { id: 1000, userId: 'u2', userName: 'Priya Nair', action: 'USER_APPROVED', resourceType: 'user', resourceId: 'u9', oldValue: { status: 'PENDING' }, newValue: { status: 'ACTIVE' }, createdAt: '2026-08-16T09:50:00Z' },
    { id: 999, userId: 'u1', userName: 'Ayan Sharma', action: 'FILE_DOWNLOAD', resourceType: 'file', resourceId: 'f4', oldValue: null, newValue: null, createdAt: '2026-08-15T17:22:00Z' },
  ],
  nextCursor: null as string | null,
}

export const cmsBlocksFixture: Record<string, Record<string, unknown>> = {
  hero: {
    title: 'ISTRAC-FMS',
    subtitle: 'Centralized, permission-controlled file management for ISTRAC departments.',
    ctaText: 'Request Access',
  },
  announcements: {
    visible: true,
    text: 'Scheduled maintenance tonight from 11 PM to 1 AM IST.',
    backgroundColor: 'orange',
  },
  banner: { visible: false, title: '', subtitle: '', ctaText: '' },
  gallery: { items: [] },
  contact_info: { email: 'support@istrac.local', phone: '+91-80-2508-0000' },
  org_overview: {
    text: 'ISTRAC (ISRO Telemetry, Tracking and Command Network) manages satellite operations and mission support.',
  },
}

export const notificationsFixture = [
  { id: 501, type: 'FILE_UPLOAD', message: 'New file uploaded to Engineering: design-doc.pdf', category: 'Files' as const, readAt: null, createdAt: '2026-08-16T10:15:00Z' },
  { id: 500, type: 'APPROVAL_PENDING', message: 'Vikram Rao is requesting access to Engineering', category: 'Approvals' as const, readAt: null, createdAt: '2026-08-15T14:22:00Z' },
  { id: 499, type: 'HDD_SYNC_COMPLETE', message: 'HDD sync completed — 3 new files registered', category: 'System' as const, readAt: '2026-08-15T09:00:00Z', createdAt: '2026-08-15T08:45:00Z' },
]

export const systemConfigFixture = {
  maxUploadSizeBytes: 524288000,
  allowedExtensions: ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'csv'],
  virusScanEnabled: true,
  guestAccessExpiryDays: 30,
  hddSyncIntervalMinutes: 15,
  downloadRateLimitPerHour: 100,
}

export const customRolesFixture = [
  {
    id: 'r1',
    departmentId: departmentsFixture[0].id,
    name: 'Senior Archivist',
    description: 'Can tag, version, and share files but not delete',
    permissions: ['FILE_VIEW', 'FILE_DOWNLOAD', 'FILE_UPLOAD', 'FILE_VERSION', 'FILE_TAG', 'FILE_SHARE'],
    memberCount: 3,
  },
  {
    id: 'r2',
    departmentId: departmentsFixture[0].id,
    name: 'Auditor',
    description: 'Read-only access plus audit log export',
    permissions: ['FILE_VIEW', 'AUDIT_VIEW', 'AUDIT_EXPORT'],
    memberCount: 1,
  },
]
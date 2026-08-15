import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

interface AuditLogEntry {
  id: number
  userId: string | null
  userName?: string
  action: string
  resourceType: string | null
  resourceId: string | null
  oldValue: Record<string, unknown> | null
  newValue: Record<string, unknown> | null
  ipAddress: string | null
  createdAt: string
}

interface AuditLogPage {
  data: AuditLogEntry[]
  nextCursor: string | null
}

interface UseAuditLogParams {
  action?: string
  userId?: string
  dateFrom?: string
  dateTo?: string
}

export function useAuditLog(filters: UseAuditLogParams) {
  return useInfiniteQuery({
    queryKey: ['audit-log', filters],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<AuditLogPage>('/admin/audit-logs', {
        params: { ...filters, cursor: pageParam, pageSize: 30 },
      })
      return data
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}
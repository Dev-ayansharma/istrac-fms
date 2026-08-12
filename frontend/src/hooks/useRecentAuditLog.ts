import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

interface AuditEntry {
  id: number
  action: string
  userId: string | null
  createdAt: string
  metadata?: Record<string, unknown>
}

export function useRecentAuditLog() {
  return useQuery({
    queryKey: ['audit-log-recent'],
    queryFn: async () => {
      const { data } = await api.get<{ data: AuditEntry[] }>('/admin/audit-logs', {
        params: { pageSize: 10 },
      })
      return data.data
    },
  })
}
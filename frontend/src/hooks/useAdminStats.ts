import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

interface AdminStats {
  users: number
  files: number
  departments: number
  storageUsedBytes: number
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get<AdminStats>('/admin/stats')
      return data
    },
    refetchInterval: 30_000, // keeps the dashboard reasonably fresh without a WS channel dedicated to this
  })
}
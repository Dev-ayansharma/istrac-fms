import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

interface UserDeptCard {
  id: string
  name: string
  fileCount: number
  lastUpdated: string
}

interface RecentFile {
  id: string
  name: string
  departmentName: string
  uploadedAt: string
  mimeType: string | null
  size: number
}

export function useUserDepartments() {
  return useQuery({
    queryKey: ['user-departments'],
    queryFn: async () => {
      const { data } = await api.get<UserDeptCard[]>('/departments', { params: { scope: 'assigned', withCounts: true } })
      return data
    },
  })
}

export function useRecentFiles() {
  return useQuery({
    queryKey: ['recent-files'],
    queryFn: async () => {
      const { data } = await api.get<RecentFile[]>('/files/recent', { params: { limit: 5 } })
      return data
    },
  })
}
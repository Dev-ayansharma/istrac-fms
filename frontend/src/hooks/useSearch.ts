import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { FileNode } from '../types/file'

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const { data } = await api.get<{ data: FileNode[]; pagination: unknown }>('/search', {
        params: { q: query },
      })
      return data.data
    },
    enabled: query.trim().length > 0,
  })
}
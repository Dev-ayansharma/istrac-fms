import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/axios'

interface BroadcastPayload {
  message: string
  target: 'all' | 'departments'
  departmentIds?: string[]
}

export function useBroadcast() {
  return useMutation({
    mutationFn: (payload: BroadcastPayload) => api.post('/admin/broadcast', payload),
  })
}
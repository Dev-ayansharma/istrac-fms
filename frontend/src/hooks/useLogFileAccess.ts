import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/axios'

export function useLogFileAccess() {
  return useMutation({
    mutationFn: (fileId: string) => api.post(`/files/${fileId}/log-access`, { action: 'PREVIEW' }),
  })
}
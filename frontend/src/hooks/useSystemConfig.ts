import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'

interface SystemConfig {
  maxUploadSizeBytes: number
  allowedExtensions: string[]
  virusScanEnabled: boolean
  guestAccessExpiryDays: number
  hddSyncIntervalMinutes: number
  downloadRateLimitPerHour: number
}

export function useSystemConfig() {
  return useQuery({
    queryKey: ['system-config'],
    queryFn: async () => {
      const { data } = await api.get<SystemConfig>('/admin/settings')
      return data
    },
  })
}

export function useUpdateSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      api.put(`/admin/settings/${key}`, { value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system-config'] }),
  })
}
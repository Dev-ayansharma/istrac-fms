import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

interface FileVersion {
  id: string
  versionNum: number
  sizeBytes: number | null
  uploadedBy: string
  uploaderName?: string
  createdAt: string
}

export function useFileVersions(fileId: string | null) {
  return useQuery({
    queryKey: ['file-versions', fileId],
    queryFn: async () => {
      const { data } = await api.get<FileVersion[]>(`/files/${fileId}/versions`)
      return data
    },
    enabled: !!fileId,
  })
}
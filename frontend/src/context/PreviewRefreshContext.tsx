import { createContext, useContext, useState, type ReactNode, } from 'react'

interface PreviewRefreshContextValue {
  refreshKey: number
  triggerRefresh: () => void
}

const PreviewRefreshContext = createContext<PreviewRefreshContextValue>({
  refreshKey: 0,
  triggerRefresh: () => {},
})

export function PreviewRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey((k) => k + 1)
  return (
    <PreviewRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </PreviewRefreshContext.Provider>
  )
}

export function usePreviewRefresh() {
  return useContext(PreviewRefreshContext)
}
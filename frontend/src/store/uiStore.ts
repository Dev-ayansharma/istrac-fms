import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware/persist'

interface UIState {
  sidebarCollapsed: boolean
  sidebarManuallySet: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  fileViewMode: string
  setFileViewMode: (mode: string) => void
}
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarManuallySet: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed, sidebarManuallySet: true })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      fileViewMode: 'grid',
      setFileViewMode: (mode) => set({ fileViewMode: mode }),
    }),
    { name: 'istrac-ui', storage: createJSONStorage(() => localStorage) }
  )
)
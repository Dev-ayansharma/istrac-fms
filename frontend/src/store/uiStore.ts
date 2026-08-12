import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  sidebarManuallySet: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  fileViewMode: string
  setFileViewMode: (mode: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  sidebarManuallySet: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed, sidebarManuallySet: true })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  fileViewMode: 'grid',
  setFileViewMode: (mode) => set({ fileViewMode: mode }),
}))
import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  fileViewMode: 'grid' | 'list'
  setFileViewMode: (mode: 'grid' | 'list') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  fileViewMode: 'grid',
  setFileViewMode: (mode) => set({ fileViewMode: mode }),
}))
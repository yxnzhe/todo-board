import { create } from 'zustand';
import type { SidebarView } from '@/lib/constants';

interface AppState {
  sidebarView: SidebarView | string;
  selectedTaskId: string | null;
  selectedProjectId: string | null;
  selectedContextId: string | null;
  searchOpen: boolean;
  newTaskOpen: boolean;
  sidebarCollapsed: boolean;
  detailPanelOpen: boolean;
  setSidebarView: (view: SidebarView | string) => void;
  setSelectedTaskId: (id: string | null) => void;
  setSelectedProjectId: (id: string | null) => void;
  setSelectedContextId: (id: string | null) => void;
  setSearchOpen: (open: boolean) => void;
  setNewTaskOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDetailPanelOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarView: 'inbox',
  selectedTaskId: null,
  selectedProjectId: null,
  selectedContextId: null,
  searchOpen: false,
  newTaskOpen: false,
  sidebarCollapsed: false,
  detailPanelOpen: false,
  setSidebarView: (view) => set({ sidebarView: view, selectedProjectId: null, selectedContextId: null }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id, detailPanelOpen: !!id }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id, sidebarView: `project-${id}` }),
  setSelectedContextId: (id) => set({ selectedContextId: id, sidebarView: `context-${id}` }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setNewTaskOpen: (open) => set({ newTaskOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
}));

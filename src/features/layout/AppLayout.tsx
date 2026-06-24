import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/stores/app.store';
import { useKeyboardShortcuts } from '@/hooks/useKeyboard';
import { SearchDialog } from '@/features/search/SearchDialog';
import { NewTaskDialog } from '@/features/kanban/NewTaskDialog';

interface AppLayoutProps {
  children: ReactNode;
  detailPanel?: ReactNode;
}

export function AppLayout({ children, detailPanel }: AppLayoutProps) {
  useKeyboardShortcuts();
  const { detailPanelOpen, searchOpen, newTaskOpen, setSearchOpen, setNewTaskOpen } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
      {detailPanelOpen && detailPanel && (
        <aside className="w-[420px] min-w-[420px] border-l border-border bg-bg-secondary overflow-y-auto">
          {detailPanel}
        </aside>
      )}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NewTaskDialog open={newTaskOpen} onClose={() => setNewTaskOpen(false)} />
    </div>
  );
}

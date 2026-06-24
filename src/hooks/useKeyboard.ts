import { useEffect } from 'react';
import { useAppStore } from '@/stores/app.store';

export function useKeyboardShortcuts() {
  const { setNewTaskOpen, setSearchOpen, setSelectedTaskId } = useAppStore();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (isInput) return;

      switch (e.key) {
        case 'n':
        case 'N':
          e.preventDefault();
          setNewTaskOpen(true);
          break;
        case '/':
          e.preventDefault();
          setSearchOpen(true);
          break;
        case 'Escape':
          setSearchOpen(false);
          setNewTaskOpen(false);
          setSelectedTaskId(null);
          break;
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setNewTaskOpen, setSearchOpen, setSelectedTaskId]);
}
